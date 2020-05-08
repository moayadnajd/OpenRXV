import { Test, TestingModule } from '@nestjs/testing';
import { HarvesterController } from './harvester.controller';

describe('Harvester Controller', () => {
  let controller: HarvesterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HarvesterController],
    }).compile();

    controller = module.get<HarvesterController>(HarvesterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
