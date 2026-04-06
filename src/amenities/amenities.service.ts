import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAmenityDto } from './dto/create-amenity.dto';

@Injectable()
export class AmenitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const amenities = await this.prisma.amenity.findMany({
      orderBy: { name: 'asc' },
    });

    return {
      success: true,
      message: 'Amenities retrieved successfully',
      data: amenities,
    };
  }

  async create(createAmenityDto: CreateAmenityDto, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.role !== 'ADMIN') {
      throw new BadRequestException('Only admins can create amenities');
    }

    const existing = await this.prisma.amenity.findUnique({
      where: { name: createAmenityDto.name },
    });

    if (existing) {
      throw new ConflictException('Amenity with this name already exists');
    }

    const amenity = await this.prisma.amenity.create({
      data: createAmenityDto,
    });

    return {
      success: true,
      message: 'Amenity created successfully',
      data: amenity,
    };
  }
}