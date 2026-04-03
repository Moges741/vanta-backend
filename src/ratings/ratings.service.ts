import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatsService } from '../stats/stats.service';
import { RateEventDto } from './dto/rate-event.dto';

@Injectable()
export class RatingsService {
  constructor(
    private prisma: PrismaService,
    private statsService: StatsService,
  ) {}

  async rateEvent(userId: string, eventId: string, dto: RateEventDto) {
    // 1. Verify event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) throw new NotFoundException('Event not found');

    // 2. Upsert rating (if exists, update; else create)
    const upsertedRating = await this.prisma.rating.upsert({
      where: {
        userId_eventId: { userId, eventId },
      },
      update: {
        rating: dto.rating,
      },
      create: {
        userId,
        eventId,
        rating: dto.rating,
      },
    });

    // 3. Trigger Analytics/Stats update after rating change
    await this.statsService.updateEventStats(eventId);

    return upsertedRating;
  }
}
