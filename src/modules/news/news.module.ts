import { Module } from '@nestjs/common';

import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { NewsScheduler } from './scheduler/news.scheduler';
import { RssCollector } from './collectors/rss.collector';
import { NewsRankingService } from './services/news-ranking.service';
import { KeywordTopicExtractor } from './extractors/keyword-topic.extractor';
import { ArticleContentExtractor } from './collectors/article-content.extractor';

@Module({
  controllers: [NewsController],
  providers: [
    NewsService,
    NewsRankingService,
    NewsScheduler,
    RssCollector,
    ArticleContentExtractor,
    KeywordTopicExtractor,
  ],
  exports: [NewsService],
})
export class NewsModule {}
