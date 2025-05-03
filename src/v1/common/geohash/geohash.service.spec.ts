import { Test, TestingModule } from '@nestjs/testing';
import { GeohashService } from './geohash.service';

describe('GeohashService', () => {
  let service: GeohashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeohashService],
    }).compile();

    service = module.get<GeohashService>(GeohashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
