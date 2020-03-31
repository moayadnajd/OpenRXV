import { Module } from '@nestjs/common';
import { MetadataController } from './metadata/metadata.controller';
import { SharedModule } from 'src/shared/shared.module';
import { ValuesController } from './values/values.controller';

@Module({
  controllers: [MetadataController, ValuesController],
  imports:[SharedModule]
})
export class AdminModule {}
