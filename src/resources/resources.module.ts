import { Module } from '@nestjs/common';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourcesRepository } from './repositories/resources.repository';
import { AuthModule } from 'src/auth/auth.module';
import { ResourcesHistoryRepository } from './repositories/resources-history.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResourcesRepository, ResourcesHistoryRepository]),
    AuthModule,
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService],
})
export class RessourcesModule {}
