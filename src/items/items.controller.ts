// src/items.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ItemsService } from './items.service';
import { Item } from '../item.entity';
import { CreateItemDto } from '../create-item.dto';
import { Paginate } from 'nestjs-paginate';
import type { Paginated, PaginateQuery } from 'nestjs-paginate';
import { ProtobufService } from 'src/protobuf/protobuf.service';

@Controller('items')
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly protobufService: ProtobufService,
  ) {}

  @Post()
  async create(@Body() createItemDto: CreateItemDto): Promise<Item> {
    return this.itemsService.create(createItemDto);
  }

  @Post('random')
  async createRandomItems(@Body('count') count: number): Promise<Item[]> {
    if (!count || count <= 0) {
      count = 10;
    }
    return this.itemsService.createRandomItems(count);
  }

  @Get()
  async getItems(
    @Paginate() pagination: PaginateQuery,
  ): Promise<Paginated<Item>> {
    return this.itemsService.findAllPaginated(pagination);
  }

  @Get('items.protobuf')
  async getItemsProtobuf() {
    const items = await this.itemsService.findAll();
    const buffer = await this.protobufService.serializeItems(items);
    return {
      base64: buffer.toString('base64'),
      size: buffer.length,
      filename: 'items.pb',
    };
  }
}
