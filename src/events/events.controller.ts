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
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../../prismar/auth/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    console.log('Logged in user id:', req.user.id);
    return this.eventsService.findAll();
  }

   // Get events by specific user id
  @UseGuards(JwtAuthGuard)
  @Get('creator/:id')
  findByCreator(@Param('id') creatorId: string) {
    return this.eventsService.findByCreator(creatorId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req, @Body() dto: CreateEventDto) {
    const userId = req.user.id;
    return this.eventsService.create(userId, dto);
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
