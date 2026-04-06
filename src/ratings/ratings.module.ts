import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StatsModule } from '../stats/stats.module';

@Module({
  imports: [PrismaModule, StatsModule], // Import StatsModule to recalculate stats on rating changes
  controllers: [RatingsController],
  providers: [RatingsService],
})
export class RatingsModule {}
