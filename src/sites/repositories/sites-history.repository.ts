import { EntityRepository, Repository } from 'typeorm';
import { SiteHistory, Site } from '../entities/sites.entity';
import { CreateSiteDto } from '../dtos/create-site.dto';
import { User } from 'src/auth/user.entity';
import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

@EntityRepository(SiteHistory)
export class SitesHistoryRepository extends Repository<SiteHistory> {
  private readonly logger = new Logger(SitesHistoryRepository.name);

  async createSiteHistory(
    site: Site,
    user: User,
    publish?: boolean,
  ): Promise<void> {
    const siteHistory = new SiteHistory();
    siteHistory.name = site.name;
    siteHistory.slug = site.slug;
    siteHistory.user = site.user;
    siteHistory.site = site;
    siteHistory.siteId = site.id;
    siteHistory.userId = user.id;
    siteHistory.version = site.version;
    try {
      await siteHistory.save();
    } catch (error) {
      this.logger.error(
        `Failed to save history for site "${site.name}",Data: ${JSON.stringify(
          site,
        )}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getSitesHistory(id: string, user: User): Promise<SiteHistory[]> {
    const found = await this.find({
      where: { siteId: id, userId: user.id },
    });
    if (!found) {
      throw new NotFoundException(
        `Sites history not found for site with ID "${id}"`,
      );
    }
    return found;
  }
}
