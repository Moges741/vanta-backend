import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto'; 
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateEventDto } from './dto/update-event.dto'; 

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}
 async findAll() {
    return this.prisma.event.findMany({
      include: { creator: true, category: true, amenities: true, images: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCreator(creatorId: string) {
    return this.prisma.event.findMany({
      where: { creatorId },
      include: { category: true, amenities: true, images: true },
      orderBy: { createdAt: 'desc' },
    });
  }
async create(userId: string, dto: CreateEventDto) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });
 
  if (!user) {
    throw new Error('User does not exist');
  }
  return this.prisma.event.create({
    data: {
      title: dto.title,
      description: dto.description,
      duration: dto.duration,
      location: dto.location,
      isPaid: dto.isPaid,
      price: dto.price,
      categoryId: dto.categoryId,
      creatorId: userId,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    },
  });
}


async update(eventId: string, userId: string, dto: UpdateEventDto) {
  const event = await this.prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new NotFoundException('Event not found');
  }

  // 🔐 Ownership check
  if (event.creatorId !== userId) {
    throw new ForbiddenException('You are not allowed to edit this event');
  }

  return this.prisma.event.update({
    where: { id: eventId },
    data: {
      ...dto,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    },
  });
}

async remove(eventId: string, userId: string) {
  const event = await this.prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new NotFoundException('Event not found');
  }

  if (event.creatorId !== userId) {
    throw new ForbiddenException('You are not allowed to delete this event');
  }

  return this.prisma.event.delete({
    where: { id: eventId },
  });
}

  async count() {
    return this.prisma.event.count();
  }
}
