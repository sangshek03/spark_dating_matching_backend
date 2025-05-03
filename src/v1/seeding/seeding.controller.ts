import { Controller, Get, Query } from '@nestjs/common';
import { SeedingService } from './seeding.service';

@Controller('seed')
export class SeedingController {
  constructor(private readonly seedingService: SeedingService) {}

  @Get()
  seed(@Query('count') count: number = 50) {
    this.seedingService.seedUsers(count);
    return { message: `Seeded ${count} users successfully` };
  }
}