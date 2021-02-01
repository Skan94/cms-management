import { EntityRepository, Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';
import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ResourceHistory, Resource } from '../entities/resource.entity';

@EntityRepository(ResourceHistory)
export class ResourcesHistoryRepository extends Repository<ResourceHistory> {
  private readonly logger = new Logger(ResourcesHistoryRepository.name);

  async createResourceHistory(resource: Resource, user: User): Promise<void> {
    const resourceHistory = new ResourceHistory();
    resourceHistory.title = resource.title;
    resourceHistory.subtitle = resource.subtitle;
    resourceHistory.content = resource.content;
    resourceHistory.image_url = resource.image_url;
    resourceHistory.siteId = resource.siteId;
    resourceHistory.version = resource.version;
    resourceHistory.userId = resource.siteId;
    resourceHistory.resourceId = resource.id;
    resourceHistory.authorId = user.id;
    try {
      await resourceHistory.save();
    } catch (error) {
      this.logger.error(
        `Failed to create resource history for resource "${
          resource.id
        }",Data: ${JSON.stringify(resource)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getResourceHistory(id: string, user: User) {
    const found = await this.find({
      where: { resourceId: id, authorId: user.id },
    });
    if (!found) {
      throw new NotFoundException(`Ressource with ID "${id}" not found`);
    }
    return found;
  }
}
