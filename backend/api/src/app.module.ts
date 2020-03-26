import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExplorerModule } from './explorer/explorer.module';
import { AdminModule } from './admin/admin.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SharedModule } from './shared/shared.module';
import { ExportModule } from './export/export.module';
@Module({
  imports: [ExplorerModule, AdminModule,
    SharedModule,
    ExportModule,
    ServeStaticModule.forRoot({
      serveRoot:'/export/downloads',
      rootPath: join(__dirname, 'public/downloads'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
