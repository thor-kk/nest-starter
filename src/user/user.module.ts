import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';

import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { UserRole } from './entities/user-role.entity';
import { RolePermission } from './entities/role-permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission, UserRole, RolePermission])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
