import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarksService {
  constructor(private prisma: PrismaService) {}

  async toggleBookmark(userId: string, eventId: string) {
    // Check if event exists first
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) throw new NotFoundException('Event not found');

    // Look for existing bookmark
    const existingBookmark = await this.prisma.bookmark.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    });

    if (existingBookmark) {
      await this.prisma.bookmark.delete({
        where: { userId_eventId: { userId, eventId } },
      });
      return { message: 'Bookmark removed' };
    }

    await this.prisma.bookmark.create({
      data: { userId, eventId },
    });
    return { message: 'Bookmark added' };
  }
}
