import { Module, forwardRef } from '@nestjs/common';
import { CommonModule } from 'src/v1/common/common.module';
import { ProfilesController } from './profile.controller';
import { ProfilesService } from './profile.service';
import { MatchmakingModule } from 'src/v1/match_making/match_making.module';

@Module({
  imports: [
    CommonModule,
    forwardRef(() => MatchmakingModule), // Handle circular dependency
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
