import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prismar/prisma.service';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { ReorderStepsDto } from './dto/reorder-steps.dto';
@Injectable()
export class EventStepsService {
  constructor(private prisma: PrismaService) {}

  // ownership check (reusing logic idea)
  async checkOwnership(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) throw new Error('Event not found');
    if (event.creatorId !== userId) {
      throw new Error('Unauthorized');
    }

    return event;
  }


  async createStep(eventId: string, userId: string, dto: CreateStepDto) {
    await this.checkOwnership(eventId, userId);

    return this.prisma.eventStep.create({
      data: {
        eventId,
        stepOrder: dto.stepOrder,
        content: dto.content,
      },
    });
  }


  async getSteps(eventId: string) {
    return this.prisma.eventStep.findMany({
      where: { eventId },
      orderBy: { stepOrder: 'asc' },
    });
  }

  async deleteStep(stepId: string, userId: string) {
    const step = await this.prisma.eventStep.findUnique({
      where: { id: stepId },
    });

    if (!step) throw new Error('Step not found');

    await this.checkOwnership(step.eventId, userId);

    return this.prisma.eventStep.delete({
      where: { id: stepId },
    });
  }

  async updateStep(stepId: string, userId: string, dto: UpdateStepDto) {
  const step = await this.prisma.eventStep.findUnique({
    where: { id: stepId },
  });

  if (!step) throw new Error('Step not found');

  await this.checkOwnership(step.eventId, userId);

  return this.prisma.eventStep.update({
    where: { id: stepId },
    data: {
      stepOrder: dto.stepOrder,
      content: dto.content,
    },
  });
}

async reorderSteps(eventId: string, userId: string, dto: ReorderStepsDto) {
  // we check ownership here
  await this.checkOwnership(eventId, userId);

  // update all steps in one transaction
  const updates = dto.steps.map((step) =>
    this.prisma.eventStep.update({
      where: { id: step.id },
      data: { stepOrder: step.stepOrder },
    }),
  );

  return this.prisma.$transaction(updates);
}
}