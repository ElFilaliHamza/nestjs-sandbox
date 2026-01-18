// src/items.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Item } from '../item.entity';
import { Owner } from '../owner.entity';
import { CreateItemDto, CreateItemsDto } from '../create-item.dto';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
    @InjectRepository(Owner)
    private ownersRepository: Repository<Owner>,
  ) {}

  async create(itemData: CreateItemDto): Promise<Item> {
    let owner: Owner | undefined;
    if (itemData.ownerId) {
      const found = await this.ownersRepository.findOne({
        where: { id: itemData.ownerId },
      });
      owner = found ?? undefined;
    }

    const item = this.itemsRepository.create({
      name: itemData.name,
      owner,
    });

    return this.itemsRepository.save(item);
  }

  async createMany(createItemsDto: CreateItemsDto): Promise<Item[]> {
    const ownerIds = Array.from(
      new Set(
        createItemsDto.items.map((i) => i.ownerId).filter(Boolean as any),
      ),
    ) as number[];

    const owners = ownerIds.length
      ? await this.ownersRepository.find({ where: { id: In(ownerIds) } })
      : [];
    const ownersMap = new Map(owners.map((o) => [o.id, o]));

    const items = createItemsDto.items.map((i) =>
      this.itemsRepository.create({
        name: i.name,
        owner: i.ownerId ? ownersMap.get(i.ownerId) : undefined,
      }),
    );

    return this.itemsRepository.save(items);
  }

  async createRandomItems(count: number): Promise<Item[]> {
    // Create a small pool of owners to assign to random items
    const ownerPoolSize = Math.max(1, Math.min(5, Math.floor(count / 5)));
    const owners: Owner[] = [];

    for (let i = 0; i < ownerPoolSize; i++) {
      owners.push(
        this.ownersRepository.create({
          name: `Owner ${Math.floor(Math.random() * 10000)}`,
        }),
      );
    }

    await this.ownersRepository.save(owners);

    const items: CreateItemDto[] = [];

    for (let i = 0; i < count; i++) {
      const owner = owners[Math.floor(Math.random() * owners.length)];
      items.push({
        name: `Random Item ${Math.floor(Math.random() * 10000)}`,
        ownerId: owner.id,
      });
    }

    return this.createMany({ items });
  }

  async findAll(): Promise<Item[]> {
    return this.itemsRepository.find();
  }

  public findAllPaginated(query: PaginateQuery): Promise<Paginated<Item>> {
    const qb = this.itemsRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.owner', 'item_owner_rel');

    return paginate(query, qb, {
      sortableColumns: ['id', 'name', 'owner.name'],
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['name', 'owner.name'],
    });
  }
}
