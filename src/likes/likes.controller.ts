import { Controller, Post, Param, UseGuards, Req } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}
  @UseGuards(JwtAuthGuard)
  @Post(':eventId')
  async toggleLike(@Param('eventId') eventId: string, @Req() req: any) {
    // req.user is populated by the JwtAuthGuard
    return this.likesService.toggleLike(req.user.id, eventId);
  }
}
