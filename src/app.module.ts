import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './v1/common/common.module';
import { SeedingModule } from './v1/seeding/seeding.module';
import { ProfilesModule } from './v1/profile/profile.module';
import { MatchmakingModule } from './v1/match_making/match_making.module';

@Module({
  imports: [ProfilesModule, MatchmakingModule, CommonModule, SeedingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
