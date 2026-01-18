// src/items.controller.ts
import { Controller, Get, Post, Body, Header } from '@nestjs/common';
import { ItemsService } from './items.service';
import { Item } from '../item.entity';
import { CreateItemDto } from '../create-item.dto';
import { Paginate } from 'nestjs-paginate';
import type { Paginated, PaginateQuery } from 'nestjs-paginate';
import { ProtobufUtil } from 'src/protobuf/protobuf.util';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

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
  @Header('Content-Type', 'application/protobuf')
  async getItemsProtobuf() {
    const items = await this.itemsService.findAll();
    return await ProtobufUtil.encodeItems(items);
  }
}
