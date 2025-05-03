import { Test, TestingModule } from '@nestjs/testing';
import { SeedingController } from './seeding.controller';

describe('SeedingController', () => {
  let controller: SeedingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeedingController],
    }).compile();

    controller = module.get<SeedingController>(SeedingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
