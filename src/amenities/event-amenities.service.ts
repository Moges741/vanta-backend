import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventAmenitiesService {
  constructor(private prisma: PrismaService) {}

  private readonly eventDetailsInclude = {
    creator: true,
    category: true,
    images: true,
    amenities: {
      include: {
        amenity: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  };

  async addAmenities(eventId: string, userId: string, amenityIds: string[]) {
    // Check if event exists and user owns it
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.creatorId !== userId) {
      throw new ForbiddenException('You are not allowed to modify this event');
    }

    // Check if amenities exist
    const amenities = await this.prisma.amenity.findMany({
      where: {
        id: { in: amenityIds },
      },
    });

    if (amenities.length !== amenityIds.length) {
      throw new NotFoundException('One or more amenities not found');
    }

    // Create event-amenity links (using createMany with skipDuplicates to avoid conflicts)
    const eventAmenities = amenityIds.map(amenityId => ({
      eventId,
      amenityId,
    }));

    await this.prisma.eventAmenity.createMany({
      data: eventAmenities,
      skipDuplicates: true,
    });

    return this.prisma.event.findUnique({
      where: { id: eventId },
      include: this.eventDetailsInclude,
    });
  }

  async removeAmenity(eventId: string, userId: string, amenityId: string) {
    // Check if event exists and user owns it
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.creatorId !== userId) {
      throw new ForbiddenException('You are not allowed to modify this event');
    }

    // Remove the amenity link
    await this.prisma.eventAmenity.delete({
      where: {
        eventId_amenityId: {
          eventId,
          amenityId,
        },
      },
    });

    return this.prisma.event.findUnique({
      where: { id: eventId },
      include: this.eventDetailsInclude,
    });
  }

  async updateAmenities(eventId: string, userId: string, amenityIds: string[]) {
    // Check if event exists and user owns it
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.creatorId !== userId) {
      throw new ForbiddenException('You are not allowed to modify this event');
    }

    // Check if amenities exist
    const amenities = await this.prisma.amenity.findMany({
      where: {
        id: { in: amenityIds },
      },
    });

    if (amenities.length !== amenityIds.length) {
      throw new NotFoundException('One or more amenities not found');
    }

    // Remove all existing amenities for this event
    await this.prisma.eventAmenity.deleteMany({
      where: { eventId },
    });

    // Add new amenities
    if (amenityIds.length > 0) {
      const eventAmenities = amenityIds.map(amenityId => ({
        eventId,
        amenityId,
      }));

      await this.prisma.eventAmenity.createMany({
        data: eventAmenities,
      });
    }

    return this.prisma.event.findUnique({
      where: { id: eventId },
      include: this.eventDetailsInclude,
    });
  }
}