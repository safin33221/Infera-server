import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async existsByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    return !!user;
  }

  async findById(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        professionalProfile: true,
      },
    });
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken,
      },
    });
  }

  async findByRefreshToken(refreshToken: string) {
    return this.prisma.user.findFirst({
      where: {
        refreshToken,
      },
    });
  }

  async updateUser(userId: string, dto: UpdateUserDto) {
    const { professionalProfile, ...userData } = dto;

    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        ...userData,

        ...(professionalProfile && {
          professionalProfile: {
            upsert: {
              create: professionalProfile,
              update: professionalProfile,
            },
          },
        }),
      },

      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        bio: true,
        professionalProfile: {
          select: {
            id: true,
            jobTitle: true,
            company: true,
            industry: true,
            location: true,
            yearsOfExperience: true,
            linkedinUrl: true,
            updatedAt: true,
          },
        },
        updatedAt: true,
      },
    });

    return user;
  }
}
