import {
  Body,
  Controller,
  Post,
  Req,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    console.log('Logged in user id:', req.user.id);
    return this.eventsService.findAll();
  }

  @Get('count')
  async count() {
    const count = await this.eventsService.count();
    return { total: count };
  }

   // Get events by specific user id
  @UseGuards(JwtAuthGuard)
  @Get('creator/:id')
  findByCreator(@Param('id') creatorId: string) {
    return this.eventsService.findByCreator(creatorId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user, @Body() dto: CreateEventDto) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can create events');
    }

    return this.eventsService.create(user.id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Req() req, @Body() dto: UpdateEventDto) {
    const userId = req.user.id;

    return this.eventsService.update(id, userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;

    return this.eventsService.remove(id, userId);
  }
}
