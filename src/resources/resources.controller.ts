import {
  Controller,
  UseGuards,
  Logger,
  Post,
  Param,
  ParseUUIDPipe,
  Get,
  Patch,
  Delete,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dtos/create-resource.dto';
import { Resource, ResourceHistory } from './entities/resource.entity';
import { UpdateResourceDto } from './dtos/update-resource.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('resources')
@UseGuards(AuthGuard())
@ApiTags('resources')
@ApiBearerAuth('access-token')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  private readonly logger = new Logger(ResourcesController.name);

  @Post()
  @UsePipes(ValidationPipe)
  createResource(
    @GetUser() user: User,
    @Body() createResourceDto: CreateResourceDto,
  ): Promise<Resource> {
    this.logger.verbose(
      `User ${user.username} creating a resource for site ${
        createResourceDto.siteId
      }. Data: ${JSON.stringify(createResourceDto)}`,
    );
    return this.resourcesService.createResource(createResourceDto, user);
  }

  @Get()
  getResources(@GetUser() user: User): Promise<Resource[]> {
    this.logger.verbose(`User ${user.username} retieving all his resrouces`);
    return this.resourcesService.getResources(user);
  }

  @Get('/:id')
  getResourceById(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Resource> {
    this.logger.verbose(
      `User ${user.username} retieving resource with id: ${id}`,
    );
    return this.resourcesService.getResourcesById(id, user);
  }

  @Get('/:id/history')
  getResourcesHistory(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResourceHistory[]> {
    this.logger.verbose(
      `User ${user.username} retieving resource ${id} history`,
    );
    return this.resourcesService.getResourceHistory(id, user);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  updateResourceById(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateResourceDto: UpdateResourceDto,
  ): Promise<Resource> {
    this.logger.verbose(
      `User ${user.username} updating resource with id: ${id}`,
    );
    return this.resourcesService.updateResource(id, updateResourceDto, user);
  }

  @Delete('/:id')
  deleteResourceById(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    this.logger.verbose(
      `User "${user.username}" deleting resource with id: ${id}`,
    );
    return this.resourcesService.deleteResourceById(id, user);
  }
}
