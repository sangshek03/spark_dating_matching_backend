import { Test, TestingModule } from '@nestjs/testing';
import { MatchmakingService } from './match_making.service';

describe('MatchMakingService', () => {
  let service: MatchmakingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchmakingService],
    }).compile();

    service = module.get<MatchmakingService>(MatchmakingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
