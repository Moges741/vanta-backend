import { Controller, Post, Param, UseGuards, Req } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':eventId')
  async toggleBookmark(@Param('eventId') eventId: string, @Req() req: any) {
    return this.bookmarksService.toggleBookmark(req.user.id, eventId);
  }
}
