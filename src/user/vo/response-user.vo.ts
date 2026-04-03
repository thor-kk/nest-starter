import { Expose } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class ResponseUserVo {
  @ApiProperty({ description: 'ID' })
  @Expose()
  id: string;

  @ApiProperty({ description: '用户名' })
  @Expose()
  username: string;

  @ApiHideProperty()
  password: string;

  @ApiProperty({ description: '年龄' })
  @Expose()
  age: number;

  @ApiProperty({ description: '昵称' })
  @Expose()
  nickname: string;

  @ApiProperty({ description: '邮箱' })
  @Expose()
  email: string;

  @ApiProperty({ description: '头像' })
  @Expose()
  avatarUrl: string;

  @ApiProperty({ description: '手机号' })
  @Expose()
  phone: string;

  @ApiProperty({ description: '是否启用' })
  @Expose()
  isEnable: boolean;

  @ApiProperty({ description: '创建时间' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @Expose()
  updatedAt: Date;
}
