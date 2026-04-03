import { Controller, Get, Param } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('platform')
  getPlatformStats() {
    return this.statsService.getPlatformStats();
  }

  @Get('event/:eventId/refresh')
  refreshEventStats(@Param('eventId') eventId: string) {
    return this.statsService.updateEventStats(eventId);
  }
}
