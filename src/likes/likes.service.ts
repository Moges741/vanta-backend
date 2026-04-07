import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  async toggleLike(userId: string, eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) throw new NotFoundException('Event not found');

    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    });

    if (existingLike) {
      await this.prisma.like.delete({
        where: { userId_eventId: { userId, eventId } },
      });
      return { message: 'Like removed' };
    }

    await this.prisma.like.create({
      data: { userId, eventId },
    });
    return { message: 'Like added' };
  }
}
