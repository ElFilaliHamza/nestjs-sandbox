import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/item.entity';
import { Repository } from 'typeorm';
import { format } from '@fast-csv/format';

@Injectable()
export class ExportService {
  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
  ) {}
  async exportData(filters: any): Promise<any> {
    const items = await this.itemsRepository.find(filters);

    Logger.debug(items);

    const csvStream = format({ headers: true });

    items.forEach((item) => {
      csvStream.write(item);
    });

    csvStream.pipe(process.stdout);

    csvStream.end();

    return csvStream;
  }
}
