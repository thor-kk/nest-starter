import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'role_permissions' })
export class RolePermission {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Column({ name: 'role_id', type: 'bigint', unsigned: true, comment: '角色ID' })
  roleId: string;

  @Column({ name: 'permission_id', type: 'bigint', unsigned: true, comment: '权限ID' })
  permissionId: string;
}
