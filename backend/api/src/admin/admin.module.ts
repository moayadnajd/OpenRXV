import { Module } from '@nestjs/common';
import { MetadataController } from './metadata/metadata.controller';
import { SharedModule } from 'src/shared/shared.module';
import { ValuesController } from './values/values.controller';
import { SettingsController } from './settings/settings.controller';
import { JsonFilesService } from './json-files/json-files.service';

@Module({
  controllers: [MetadataController, ValuesController, SettingsController],
  imports:[SharedModule],
  providers: [JsonFilesService]
})
export class AdminModule {}
