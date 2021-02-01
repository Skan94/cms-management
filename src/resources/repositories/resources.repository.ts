import { Repository, EntityRepository } from 'typeorm';
import {
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Resource } from '../entities/resource.entity';
import { CreateResourceDto } from '../dtos/create-resource.dto';
import { UpdateResourceDto } from '../dtos/update-resource.dto';
import { User } from 'src/auth/user.entity';

@EntityRepository(Resource)
export class ResourcesRepository extends Repository<Resource> {
  private readonly logger = new Logger(ResourcesRepository.name);

  async createResource(
    createResourceDto: CreateResourceDto,
    user: User,
  ): Promise<Resource> {
    const { title, subtitle, content, siteId } = createResourceDto;

    const resource = new Resource();
    resource.title = title;
    resource.subtitle = subtitle;
    resource.content = content;
    resource.image_url = 'test';
    resource.siteId = siteId;
    resource.userId = siteId; // je sais pas pourquoi il me fait ça
    resource.authorId = user.id;
    resource.author = user;
    try {
      await resource.save();
    } catch (error) {
      this.logger.error(
        `Failed to create resource for site "${siteId}",Data: ${JSON.stringify(
          createResourceDto,
        )}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    delete resource.site;
    delete resource.author;
    return resource;
  }

  async getResources(user: User): Promise<Resource[]> {
    try {
      const resources = await this.find({ where: { authorId: user.id } });
      return resources;
    } catch (error) {
      this.logger.error(
        `Failed to get resources for user ${user.username}
        )}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getResourceById(id: string, user: User): Promise<Resource> {
    const found = await this.findOne({
      where: { id, authorId: user.id },
    });
    if (!found) {
      throw new NotFoundException(`Ressource with ID "${id}" not found`);
    }
    return found;
  }

  async updateResource(
    id: string,
    updateResourceDto: UpdateResourceDto,
    user: User,
  ): Promise<Resource> {
    // je prefere comme ça mais ça marche pas
    // const query = this.createQueryBuilder('resource')
    //   .update(Resource)
    //   .set(updateResourceDto)
    //   .set({ version: () => 'version + 1' })
    //   .where('id = :id', { id: id })
    //   .andWhere('authorId = :authorId', { authorId: user.id });
    // try {
    //   await query.execute();
    // } catch (error) {
    //   this.logger.error(
    //     `Failed to update resource for user ${
    //       user.username
    //     }, DTO: ${JSON.stringify(updateResourceDto)}`,
    //     error.stack,
    //   );
    //   throw new InternalServerErrorException();
    // }
    const found = await this.getResourceById(id, user);
    found.title = updateResourceDto.title ?? found.title;
    found.content = updateResourceDto.content ?? found.content;
    found.subtitle = updateResourceDto.subtitle ?? found.subtitle;
    found.version += 1;
    try {
      await found.save();
      return found;
    } catch (error) {
      this.logger.error(
        `Failed to update resource for user ${user.id}, DTO: ${JSON.stringify(
          updateResourceDto,
        )}`,
      );
    }
  }

  async deleteResourceById(id: string, user: User): Promise<void> {
    const result = await this.delete({ id: id, authorId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException(`Resource with ID "${id}" not found`);
    }
  }

  async getSiteResources(siteId: string, user: User) {
    const found = await this.find({
      where: { siteId: siteId, authorId: user.id },
    });
    if (!found) {
      throw new NotFoundException(
        `Ressources for site with ID "${siteId}" not found`,
      );
    }
    return found;
  }
}
