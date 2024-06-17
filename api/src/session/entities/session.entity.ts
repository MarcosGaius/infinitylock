import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityHelper } from 'src/database/entity-helper';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Session extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @ManyToOne(() => User, (user) => user.session, { onDelete: 'CASCADE' })
  user: User;
}
