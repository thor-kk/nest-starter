import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_roles' })
export class UserRole {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true, comment: '用户ID' })
  userId: string;

  @Column({ name: 'role_id', type: 'bigint', unsigned: true, comment: '角色ID' })
  roleId: string;
}
