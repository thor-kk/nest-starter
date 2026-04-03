import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'permissions' })
export class Permission {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Column({ length: 20, comment: '权限代码' })
  code: string;

  @Column({ length: 100, comment: '权限描述' })
  description: string;
}
