import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/auth/user.entity';
import { Resource } from 'src/resources/entities/resource.entity';

@Entity()
export class Site extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column()
  version: number;

  @ManyToOne(() => User, (user) => user.sites, { eager: false })
  user: User;

  @OneToMany(() => Resource, (ressource) => ressource.site, { eager: true })
  resources: Resource[];

  @Column()
  userId: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => SiteHistory, (siteHistory) => siteHistory.site)
  history: SiteHistory[];
}

@Entity()
export class SiteHistory extends Site {
  @ManyToOne(() => Site, (site) => site.history)
  site: Site;

  @Column()
  siteId: string;
}
