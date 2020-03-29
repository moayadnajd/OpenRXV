import { Module } from '@nestjs/common';
import { MetadataController } from './metadata/metadata.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  controllers: [MetadataController],
  imports:[SharedModule]
})
export class AdminModule {}
