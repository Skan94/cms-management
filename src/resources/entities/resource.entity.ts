import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Site } from 'src/sites/entities/sites.entity';
import { User } from 'src/auth/user.entity';

@Entity()
export class Resource extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  subtitle: string;

  @Column()
  content: string;

  @Column()
  image_url: string;

  @ManyToOne(() => Site, (site) => site.resources, { eager: false })
  site: Site;

  @ManyToOne(() => User, (user) => user.resources, { eager: false })
  author: User;

  @Column({ default: 1 })
  version: number;

  @Column()
  authorId: string;

  @Column()
  siteId: string;

  @Column()
  userId: string;

  @OneToMany(
    () => ResourceHistory,
    (resourceHistory) => resourceHistory.resource,
  )
  history: ResourceHistory[];
}

@Entity()
export class ResourceHistory extends Resource {
  @ManyToOne(() => Resource, (resource) => resource.history)
  resource: Resource;

  @Column()
  resourceId: string;
}
