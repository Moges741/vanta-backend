import { Controller, Get, Post, Body, UseGuards, Req, Param, Put, Delete } from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
import { EventAmenitiesService } from './event-amenities.service';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { AddAmenitiesDto } from '../events/dto/add-amenities.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('amenities')
export class AmenitiesController {
  constructor(
    private readonly amenitiesService: AmenitiesService,
    private readonly eventAmenitiesService: EventAmenitiesService,
  ) {}

  @Public()
  @Get()
  async findAll() {
    return this.amenitiesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createAmenityDto: CreateAmenityDto, @Req() req: any) {
    const userId = req.user.id;
    return this.amenitiesService.create(createAmenityDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('events/:eventId')
  async addAmenities(
    @Param('eventId') eventId: string,
    @Req() req,
    @Body() dto: AddAmenitiesDto,
  ) {
    const userId = req.user.id;
    return this.eventAmenitiesService.addAmenities(eventId, userId, dto.amenityIds);
  }

  @UseGuards(JwtAuthGuard)
  @Put('events/:eventId')
  async updateAmenities(
    @Param('eventId') eventId: string,
    @Req() req,
    @Body() dto: AddAmenitiesDto,
  ) {
    const userId = req.user.id;
    return this.eventAmenitiesService.updateAmenities(eventId, userId, dto.amenityIds);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('events/:eventId/:amenityId')
  async removeAmenity(
    @Param('eventId') eventId: string,
    @Param('amenityId') amenityId: string,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.eventAmenitiesService.removeAmenity(eventId, userId, amenityId);
  }
}