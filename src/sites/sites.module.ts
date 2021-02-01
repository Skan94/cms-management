import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SitesController } from './sites.controller';
import { SitesRepository } from './repositories/sites.repository';
import { SitesService } from './sites.service';
import { AuthModule } from 'src/auth/auth.module';
import { SitesHistoryRepository } from './repositories/sites-history.repository';
import { ResourcesRepository } from 'src/resources/repositories/resources.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SitesRepository,
      SitesHistoryRepository,
      ResourcesRepository,
    ]),
    AuthModule,
  ],
  controllers: [SitesController],
  providers: [SitesService],
})
export class SitesModule {}
