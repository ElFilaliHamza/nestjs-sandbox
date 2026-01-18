// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsController } from './items/items.controller';
import { ItemsService } from './items/items.service';
import { Item } from './item.entity';
import { Owner } from './owner.entity';
import { ExportModule } from './export/export.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'test.db',
      entities: [Item, Owner],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Item, Owner]),
    ExportModule,
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class AppModule {}
