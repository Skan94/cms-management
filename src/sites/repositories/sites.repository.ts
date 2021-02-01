import { Repository, EntityRepository } from 'typeorm';
import { Site } from '../entities/sites.entity';
import { CreateSiteDto } from '../dtos/create-site.dto';
import { User } from 'src/auth/user.entity';
import {
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateSiteDto } from '../dtos/update-site.dto';
import { Resource } from 'src/resources/entities/resource.entity';

@EntityRepository(Site)
export class SitesRepository extends Repository<Site> {
  private readonly logger = new Logger(SitesRepository.name);

  async createSite(createSiteDto: CreateSiteDto, user: User): Promise<Site> {
    const { name, slug } = createSiteDto;

    const site = new Site();
    site.name = name;
    site.slug = slug;
    site.userId = user.id;
    site.version = 0;
    try {
      await site.save();
    } catch (error) {
      this.logger.error(
        `Failed to create site for user "${
          user.username
        }",DTO: ${JSON.stringify(createSiteDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    delete site.user;
    return site;
  }

  async getSites(user: User): Promise<Site[]> {
    try {
      const sites = await this.find({ where: { userId: user.id } });
      return sites;
    } catch (error) {
      this.logger.error(
        `Failed to get sites for user ${user.username}
        )}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getSiteById(id: string, user: User): Promise<Site> {
    const found = await this.findOne({ where: { id, userId: user.id } });
    if (!found) {
      throw new NotFoundException(`Site with ID "${id}" not found`);
    }
    return found;
  }

  async updateSite(
    id: string,
    updateSiteDto: UpdateSiteDto,
    user: User,
    publish?: boolean,
  ): Promise<void> {
    const query = this.createQueryBuilder('site')
      .update(Site)
      .set(updateSiteDto);
    if (publish) {
      query.set({ version: () => 'version + 1' });
    }
    query
      .where('id = :id', { id: id })
      .andWhere('userId = :userId', { userId: user.id });
    try {
      await query.execute();
    } catch (error) {
      this.logger.error(
        `Failed to update site for user ${user.username}, DTO: ${JSON.stringify(
          updateSiteDto,
        )}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async deleteSiteById(id: string, user: User): Promise<void> {
    const result = await this.delete({ id: id, userId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException(`Site with ID "${id}" not found`);
    }
  }

  async simpleUpdate(
    id: string,
    site: Site,
    user: User,
    resources: Resource[],
  ): Promise<Site> {
    const found = await this.getSiteById(id, user);
    found.slug = site.slug ?? found.slug;
    found.name = site.slug ?? found.slug;
    found.version = site.version;
    try {
      await found.save();
      found.resources = resources;
      return found;
    } catch (error) {
      this.logger.error(
        `Failed to update site for user ${user.id}, DTO: ${JSON.stringify(
          site,
        )}`,
        error.stack,
      );
    }
  }
}
