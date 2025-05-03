import { Module } from '@nestjs/common';
import { SeedingService } from './seeding.service';
import { SeedingController } from './seeding.controller';
import { ProfilesModule } from 'src/v1/profile/profile.module';

@Module({
  imports: [ProfilesModule],
  controllers: [SeedingController],
  providers: [SeedingService],
})
export class SeedingModule {}
