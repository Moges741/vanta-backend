import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { EventStepsService } from './event-steps.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { ReorderStepsDto } from './dto/reorder-steps.dto';

@Controller('events/:eventId/steps')
export class EventStepsController {
  constructor(private stepsService: EventStepsService) {}


  @UseGuards(JwtAuthGuard)
  @Post()
  createStep(
    @Param('eventId') eventId: string,
    @Body() dto: CreateStepDto,
    @Req() req,
  ) {
    return this.stepsService.createStep(eventId, req.user.id, dto);
  }

 
  @Get()
  getSteps(@Param('eventId') eventId: string) {
    return this.stepsService.getSteps(eventId);
  }

 
  @UseGuards(JwtAuthGuard)
  @Delete(':stepId')
  deleteStep(@Param('stepId') stepId: string, @Req() req) {
    return this.stepsService.deleteStep(stepId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('reorder')
  reorder(
    @Param('eventId') eventId: string,
    @Body() dto: ReorderStepsDto,
    @Req() req,
  ) {
    return this.stepsService.reorderSteps(eventId, req.user.id, dto);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':stepId')
  updateStep(
    @Param('stepId') stepId: string,
    @Body() dto: UpdateStepDto,
    @Req() req,
  ) {
    return this.stepsService.updateStep(stepId, req.user.id, dto);
  }
}
