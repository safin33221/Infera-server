import { Injectable, Logger } from '@nestjs/common';

/** Fetches and extracts readable article text when an RSS item only has an excerpt. */
@Injectable()
export class ArticleContentExtractor {
  private readonly logger = new Logger(ArticleContentExtractor.name);
  private readonly timeoutMs = 12_000;
  private readonly maxHtmlBytes = 3 * 1024 * 1024;

  async extract(articleUrl: string): Promise<string | null> {
    let url: URL;
    try {
      url = new URL(articleUrl);
    } catch {
      return null;
    }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'PulseIQ News Reader/1.0',
          Accept: 'text/html,application/xhtml+xml',
        },
        redirect: 'follow',
      });
      if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) return null;

      const declaredLength = Number(response.headers.get('content-length'));
      if (declaredLength > this.maxHtmlBytes) return null;
      const html = await this.readLimitedBody(response);
      if (!html) return null;

      return this.extractReadableText(html);
    } catch (error: unknown) {
      this.logger.debug(
        `Could not extract article ${articleUrl}: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }

  private async readLimitedBody(response: Response): Promise<string | null> {
    if (!response.body) return null;
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > this.maxHtmlBytes) {
          await reader.cancel();
          return null;
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
    const body = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return new TextDecoder().decode(body);
  }

  private extractReadableText(html: string): string | null {
    const withoutNoise = html
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(
        /<(script|style|noscript|svg|nav|footer|header|aside)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,
        ' ',
      );
    const articleBlocks = [
      ...withoutNoise.matchAll(/<(article|main)\b[^>]*>([\s\S]*?)<\/\1\s*>/gi),
    ].map((match) => match[2]);
    const candidates = articleBlocks.length > 0 ? articleBlocks : [withoutNoise];

    const extracted = candidates
      .map((block) =>
        [...block.matchAll(/<(p|h[1-6]|blockquote|li)\b[^>]*>([\s\S]*?)<\/\1\s*>/gi)]
          .map((match) => this.decodeEntities(match[2].replace(/<[^>]+>/g, ' ')))
          .filter((text) => text.length > 35)
          .join('\n\n'),
      )
      .sort((left, right) => right.length - left.length)[0];

    const content = extracted?.trim();
    return content && content.length >= 120 ? content : null;
  }

  private decodeEntities(value: string): string {
    return value
      .replace(/&nbsp;|&#160;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;|&apos;/gi, "'")
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
      .replace(/&#x([\da-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
      .replace(/[\t\r\f ]+/g, ' ')
      .replace(/\n\s+/g, '\n')
      .trim();
  }
}
