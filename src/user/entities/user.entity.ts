import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Column({ length: 50, unique: true, comment: '用户名' })
  username: string;

  @Column({ length: 255, comment: '密码' })
  password: string;

  @Column({ nullable: true, comment: '年龄' })
  age: number;

  @Column({ length: 50, nullable: true, comment: '昵称' })
  nickname: string;

  @Column({ length: 50, nullable: true, comment: '邮箱' })
  email: string;

  @Column({ name: 'avatar_url', length: 255, nullable: true, comment: '头像' })
  avatarUrl: string;

  @Column({ length: 20, nullable: true, comment: '手机号' })
  phone: string;

  @Column({ name: 'is_enable', default: 1, comment: '是否启用' })
  isEnable: boolean;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;
}
