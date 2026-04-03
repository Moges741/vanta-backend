import { Controller, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RateEventDto } from './dto/rate-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':eventId')
  async rateEvent(
    @Param('eventId') eventId: string,
    @Body() dto: RateEventDto,
    @Req() req: any,
  ) {
    return this.ratingsService.rateEvent(req.user.id, eventId, dto);
  }
}
