import { Module, forwardRef } from '@nestjs/common';
import { CommonModule } from 'src/v1/common/common.module';
import { ProfilesModule } from 'src/v1/profile/profile.module';
import { MatchmakingController } from './match_making.controller';
import { MatchmakingService } from './match_making.service';

@Module({
  imports: [
    CommonModule,
    forwardRef(() => ProfilesModule), // Handle circular dependency
  ],
  controllers: [MatchmakingController],
  providers: [MatchmakingService],
  exports: [MatchmakingService],
})
export class MatchmakingModule {}
