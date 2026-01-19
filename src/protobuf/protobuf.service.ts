import { Injectable } from '@nestjs/common';
import * as protobuf from 'protobufjs';
import path from 'path';
import { Item } from 'src/item.entity';

const PROTO_BUFFER_PATH_ITEMS = path.join(
  process.cwd(),
  process.env.NODE_ENV === 'production' ? 'dist' : 'src',
  'protobuf',
  'items.proto',
);

@Injectable()
export class ProtobufService {
  private root: protobuf.Root;

  constructor() {
    protobuf.load(PROTO_BUFFER_PATH_ITEMS).then((loadedRoot) => {
      this.root = loadedRoot;
    });
  }

  serializeItems(data: Item[]): Buffer {
    const ItemsResponse = this.root.lookupType('ItemsResponse');
    const payload = { items: data };
    const message = ItemsResponse.create(payload);
    return Buffer.from(ItemsResponse.encode(message).finish());
  }

  deserializeItems(buffer: Buffer): Item[] {
    const ItemsResponse = this.root.lookupType('ItemsResponse');
    const message = ItemsResponse.decode(buffer);
    return ItemsResponse.toObject(message).items;
  }
}
