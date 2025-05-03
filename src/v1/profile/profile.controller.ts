import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ProfilesService } from './profile.service';
import { CreateProfileDto } from './dto/profile.dto';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(createProfileDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(id);
  }
}
