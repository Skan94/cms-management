import {
  Controller,
  Post,
  Logger,
  Get,
  UseGuards,
  Param,
  ParseUUIDPipe,
  Patch,
  Delete,
  Body,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateSiteDto } from './dtos/create-site.dto';
import { SitesService } from './sites.service';
import { Site } from './entities/sites.entity';
import { UpdateSiteDto } from './dtos/update-site.dto';

@Controller('sites')
@UseGuards(AuthGuard())
@ApiTags('sites')
@ApiBearerAuth('access-token')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  private readonly logger = new Logger(SitesController.name);

  @Post()
  @UsePipes(ValidationPipe)
  createSite(
    @Body() createSiteDto: CreateSiteDto,
    @GetUser() user: User,
  ): Promise<Site> {
    this.logger.verbose(
      `user "${user.username}" creating a site. Data: ${JSON.stringify(
        createSiteDto,
      )}`,
    );
    return this.sitesService.createSite(createSiteDto, user);
  }

  @Get()
  getSites(@GetUser() user: User): Promise<Site[] | Site> {
    this.logger.verbose(
      `user "${user.username}" retrieving all sites.
      )} `,
    );
    return this.sitesService.getSites(user);
  }

  @Get('/:id')
  getSiteById(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ): Promise<Site> {
    this.logger.verbose(
      `user "${user.username}" retrieving site with id: ${id}.
      )} `,
    );
    return this.sitesService.getSiteById(id, user);
  }

  @Get('/:id/resources')
  getSiteResources(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ) {
    this.logger.verbose(
      `user "${user.username}" retrieving ressources for site with id: ${id}.
      )} `,
    );
    return this.sitesService.getSiteResources(id, user);
  }

  @Get('/:id/history')
  getSitesHistory(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ) {
    this.logger.verbose(
      `user "${user.username}" retrieving history for site with id: ${id}.
    )} `,
    );
    return this.sitesService.getSitesHistory(id, user);
  }

  @Patch('/:id')
  updateSite(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSiteDto: UpdateSiteDto,
    @GetUser() user: User,
  ): Promise<void> {
    this.logger.verbose(
      `user "${user.username}" updating site with id: ${id}.
      )} `,
    );
    return this.sitesService.updateSite(id, updateSiteDto, user);
  }

  @Delete('/:id')
  deleteSiteById(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ): Promise<void> {
    this.logger.verbose(
      `user "${user.username}" deleting a site. Site Id: ${id}`,
    );
    return this.sitesService.deleteSiteById(id, user);
  }

  @Post('/:id/publish')
  publishSite(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    this.logger.verbose(
      `user "${user.username}" publishing a site. Site Id: ${id}`,
    );
    return this.sitesService.publishSite(id, user);
  }

  @Patch('/:id/version/:version/change')
  changeVersion(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('version', ParseIntPipe) version: number,
    @GetUser() user: User,
  ): Promise<Site> {
    this.logger.verbose(
      `user "${user.username}" patching a site version. Site Id: ${id}`,
    );
    return this.sitesService.patchVersion(id, version, user);
  }
}
