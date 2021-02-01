import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateSiteDto } from './dtos/create-site.dto';
import { Site, SiteHistory } from './entities/sites.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SitesRepository } from './repositories/sites.repository';
import { User } from 'src/auth/user.entity';
import { UpdateSiteDto } from './dtos/update-site.dto';
import { SitesHistoryRepository } from './repositories/sites-history.repository';
import { ResourcesRepository } from 'src/resources/repositories/resources.repository';
import { Resource } from 'src/resources/entities/resource.entity';

@Injectable()
export class SitesService {
  constructor(
    @InjectRepository(SitesRepository)
    private readonly sitesRepository: SitesRepository,
    @InjectRepository(ResourcesRepository)
    private readonly resourcesRepository: ResourcesRepository,
    @InjectRepository(SitesHistoryRepository)
    private readonly sitesHistoryRepository: SitesHistoryRepository,
  ) {}

  async createSite(createSiteDto: CreateSiteDto, user: User): Promise<Site> {
    const site = await this.sitesRepository.createSite(createSiteDto, user);
    await this.sitesHistoryRepository.createSiteHistory(site, user);
    return site;
  }

  async getSites(user: User): Promise<Site[]> {
    return this.sitesRepository.getSites(user);
  }

  async getSiteById(id: string, user: User): Promise<Site> {
    return this.sitesRepository.getSiteById(id, user);
  }

  async updateSite(
    id: string,
    updateSiteDto: UpdateSiteDto,
    user: User,
  ): Promise<void> {
    return this.sitesRepository.updateSite(id, updateSiteDto, user);
  }

  async deleteSiteById(id: string, user: User): Promise<void> {
    return this.sitesRepository.deleteSiteById(id, user);
  }

  async getSiteResources(id: string, user: User): Promise<Resource[]> {
    return this.resourcesRepository.getSiteResources(id, user);
  }

  async getSitesHistory(id: string, user: User): Promise<SiteHistory[]> {
    return this.sitesHistoryRepository.getSitesHistory(id, user);
  }

  async publishSite(id: string, user: User) {
    const site = await this.sitesRepository.getSiteById(id, user);
    const resources = await this.getSiteResources(site.id, user);
    site.resources = resources;
    await this.sitesHistoryRepository.createSiteHistory(site, user, true);
    await this.sitesRepository.updateSite(id, site, user, true);
  }

  async patchVersion(id: string, version: number, user: User): Promise<Site> {
    const site = await this.sitesRepository.getSiteById(id, user);
    if (site.version === version) {
      throw new BadRequestException(
        { version: version },
        `Already on version ${version}`,
      );
    }

    const sitesHistory = await this.sitesHistoryRepository.getSitesHistory(
      id,
      user,
    );
    const siteHistory = sitesHistory.find(
      (siteHistory) => siteHistory.version === version,
    );
    return await this.sitesRepository.simpleUpdate(
      id,
      siteHistory,
      user,
      siteHistory.resources,
    );
  }
}
