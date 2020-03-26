import { Module } from '@nestjs/common';
import { SearchController } from './search/search.controller';

import { SharedModule } from 'src/shared/shared.module';

@Module({
  controllers: [SearchController],
  imports: [SharedModule],
  providers: []
})
export class ExplorerModule { }
