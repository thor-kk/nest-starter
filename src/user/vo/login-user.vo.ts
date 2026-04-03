import { Expose } from 'class-transformer';
import { ApiHideProperty, ApiProperty, OmitType } from '@nestjs/swagger';
import { ResponseUserVo } from './response-user.vo';

export class LoginUserVo extends OmitType(ResponseUserVo, ['isEnable']) {
  @ApiHideProperty()
  isEnable: boolean;

  @ApiProperty({ description: '角色' })
  @Expose()
  roles: string[];

  @ApiProperty({ description: '权限' })
  @Expose()
  permissions: string[];

  @ApiProperty({ description: '访问令牌' })
  @Expose()
  accessToken: string;

  @ApiProperty({ description: '刷新令牌' })
  @Expose()
  refreshToken: string;
}
