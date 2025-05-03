import { Controller, Get, Param, Query } from '@nestjs/common';
import { MatchmakingService } from './match_making.service';


@Controller('match')
export class MatchmakingController {
  constructor(private readonly matchmakingService: MatchmakingService) {}

  @Get(':id')
  findMatches(
    @Param('id') id: string,
    @Query('count') count: number = 5
  ) {
    return this.matchmakingService.findMatches(id, count);
  }
}