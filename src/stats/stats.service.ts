import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async updateEventStats(eventId: string) {
    const aggregations = await this.prisma.rating.aggregate({
      where: { eventId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const avgRating = aggregations._avg.rating || 0;
    const totalRatings = aggregations._count.rating || 0;

    await this.prisma.event.update({
      where: { id: eventId },
      data: {
        avgRating,
        totalRatings,
      },
    });

    return { avgRating, totalRatings };
  }

  async getPlatformStats() {
    // Example analytics aggregation
    const totalEvents = await this.prisma.event.count();
    const totalComments = await this.prisma.comment.count();
    const totalLikes = await this.prisma.like.count();

    return {
      totalEvents,
      totalComments,
      totalLikes,
    };
  }
}
