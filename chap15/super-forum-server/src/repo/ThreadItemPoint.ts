import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import {User} from './User';
import {ThreadItem} from './ThreadItem';
import {Auditable} from './Auditable';

@Entity({name: "ThreadItemPoints"})
export class ThreadItemPoint extends Auditable {
  @PrimaryGeneratedColumn({name: "Id", type: "bigint"})
  id: string;

  @Column("boolean", {
    name: "IsDecrement",
    default: false,
    nullable: false,
  })
  isDecrement: boolean;

  @ManyToOne(() => User, (user: User) => user.threadItemPoints)
  user: User;

  @ManyToOne(() => ThreadItem, (threadItem) => threadItem.threadItemPoints)
  threadItem: ThreadItem;
}
