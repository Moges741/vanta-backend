import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('amenities')
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) {}

  @Public()
  @Get()
  async findAll() {
    return this.amenitiesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createAmenityDto: CreateAmenityDto, @Req() req: any) {
    const userId = req.user.sub;
    return this.amenitiesService.create(createAmenityDto, userId);
  }
}