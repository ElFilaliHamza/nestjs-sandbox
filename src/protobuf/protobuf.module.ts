import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from '../item.entity';
import { ProtobufService } from './protobuf.service';

@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  providers: [ProtobufService],
  exports: [ProtobufService],
  controllers: [],
})
export class ProtoBufModule {}
