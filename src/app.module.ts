import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { SitesModule } from './sites/sites.module';
import { RessourcesModule } from './resources/resources.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    SitesModule,
    RessourcesModule,
  ],
  providers: [],
})
export class AppModule {}
