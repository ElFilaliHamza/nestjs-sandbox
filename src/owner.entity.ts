import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Item } from './item.entity';

@Entity()
export class Owner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Item, (item) => item.owner)
  items: Item[];
}
