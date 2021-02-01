import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourcesRepository } from './repositories/resources.repository';
import { CreateResourceDto } from './dtos/create-resource.dto';
import { Resource, ResourceHistory } from './entities/resource.entity';
import { UpdateResourceDto } from './dtos/update-resource.dto';
import { User } from 'src/auth/user.entity';
import { ResourcesHistoryRepository } from './repositories/resources-history.repository';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(ResourcesRepository)
    private readonly resourcesRepository: ResourcesRepository,
    @InjectRepository(ResourcesHistoryRepository)
    private readonly resourcesHistoryRepository: ResourcesHistoryRepository,
  ) {}

  async createResource(
    createResourceDto: CreateResourceDto,
    user: User,
  ): Promise<Resource> {
    const resource = await this.resourcesRepository.createResource(
      createResourceDto,
      user,
    );
    await this.resourcesHistoryRepository.createResourceHistory(resource, user);
    return resource;
  }

  async getResources(user: User): Promise<Resource[]> {
    return this.resourcesRepository.getResources(user);
  }

  async getResourcesById(id: string, user: User): Promise<Resource> {
    return this.resourcesRepository.getResourceById(id, user);
  }

  async getResourceHistory(id: string, user: User): Promise<ResourceHistory[]> {
    return this.resourcesHistoryRepository.getResourceHistory(id, user);
  }

  async updateResource(
    id: string,
    updateResourceDto: UpdateResourceDto,
    user: User,
  ): Promise<Resource> {
    const resource = await this.resourcesRepository.updateResource(
      id,
      updateResourceDto,
      user,
    );
    console.log(`resource: ${JSON.stringify(resource)}`);
    await this.resourcesHistoryRepository.createResourceHistory(resource, user);
    return resource;
  }

  async deleteResourceById(id: string, user: User): Promise<void> {
    return this.resourcesRepository.deleteResourceById(id, user);
  }
}
