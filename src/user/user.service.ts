import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { RedisService } from 'src/core/redis.service';
import { BcryptService } from 'src/core/bcrypt.service';

import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { UserRole } from './entities/user-role.entity';
import { RolePermission } from './entities/role-permission.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

import { LoginUserVo } from './vo/login-user.vo';

@Injectable()
export class UserService {
  @Inject()
  private readonly redisService: RedisService;

  @Inject()
  private readonly bcryptService: BcryptService;

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  @InjectRepository(Role)
  private readonly roleRepository: Repository<Role>;

  @InjectRepository(Permission)
  private readonly permissionRepository: Repository<Permission>;

  @InjectRepository(UserRole)
  private readonly userRoleRepository: Repository<UserRole>;

  @InjectRepository(RolePermission)
  private readonly rolePermissionRepository: Repository<RolePermission>;

  // 初始化数据
  async initData() {
    // 清空 user、role、permission 表
    await this.userRepository.clear();
    await this.roleRepository.clear();
    await this.permissionRepository.clear();
    await this.roleRepository.clear();
    await this.permissionRepository.clear();

    const user1 = new User();
    user1.username = '张三';
    user1.password = await this.bcryptService.hash('123456');

    const user2 = new User();
    user2.username = '李四';
    user2.password = await this.bcryptService.hash('123456');

    const [savedUser1, savedUser2] = await this.userRepository.save([user1, user2]);

    const role1 = new Role();
    role1.name = '管理员';

    const role2 = new Role();
    role2.name = '普通用户';

    const [savedRole1, savedRole2] = await this.roleRepository.save([role1, role2]);

    const permission1 = new Permission();
    permission1.code = 'ccc';
    permission1.description = '访问 ccc 接口';

    const permission2 = new Permission();
    permission2.code = 'ddd';
    permission2.description = '访问 ddd 接口';

    const [savedPerm1, savedPerm2] = await this.permissionRepository.save([permission1, permission2]);

    // === 插入中间表数据 ===

    // 张三（user1）是 管理员（role1）
    const userRole1 = new UserRole();
    userRole1.userId = savedUser1.id;
    userRole1.roleId = savedRole1.id;

    // 李四（user2）是 普通用户（role2）
    const userRole2 = new UserRole();
    userRole2.userId = savedUser2.id;
    userRole2.roleId = savedRole2.id;

    await this.userRoleRepository.save([userRole1, userRole2]);

    // 管理员（role1）拥有 ccc 和 ddd 权限
    const rp1 = new RolePermission();
    rp1.roleId = savedRole1.id;
    rp1.permissionId = savedPerm1.id;

    const rp2 = new RolePermission();
    rp2.roleId = savedRole1.id;
    rp2.permissionId = savedPerm2.id;

    // 普通用户（role2）拥有 ccc 权限
    const rp3 = new RolePermission();
    rp3.roleId = savedRole2.id;
    rp3.permissionId = savedPerm1.id;

    await this.rolePermissionRepository.save([rp1, rp2, rp3]);
  }

  // 注册
  async register(registerUserDto: RegisterUserDto) {
    const captcha = await this.redisService.get(`captcha_${registerUserDto.email}`);

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (registerUserDto.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      username: registerUserDto.username,
    });

    if (foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    const user = new User();
    user.username = registerUserDto.username;
    user.password = await this.bcryptService.hash(registerUserDto.password);
    user.email = registerUserDto.email;

    try {
      await this.userRepository.save(user);
      return '注册成功';
    } catch (e) {
      return '注册失败';
    }
  }

  // 登录
  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: { username: loginUserDto.username },
    });

    if (!user) throw new HttpException('用户或密码错误', HttpStatus.BAD_REQUEST);

    const isPasswordValid = await this.bcryptService.compare(loginUserDto.password, user.password);
    if (!isPasswordValid) throw new HttpException('用户或密码错误', HttpStatus.BAD_REQUEST);

    // 获取用户角色
    const roles = await this.userRoleRepository
      .createQueryBuilder('userRole')
      .leftJoin(Role, 'role', 'role.id = userRole.roleId') // 手动 JOIN
      .select(['role.name AS roleName', 'role.id AS roleId']) // 只选 role.name，并起别名
      .where('userRole.userId = :userId', { userId: user.id })
      .getRawMany();

    // 获取用户权限
    const permissions = await this.rolePermissionRepository
      .createQueryBuilder('rolePermission')
      .leftJoin(Permission, 'permission', 'permission.id = rolePermission.permissionId')
      .select(['permission.code AS permissionCode', 'permission.description AS permissionDescription'])
      .where('rolePermission.roleId IN (:...roleIds)', { roleIds: roles.map((item) => item.roleId) })
      .getRawMany();

    return plainToInstance(
      LoginUserVo,
      {
        ...user,
        roles: roles.map((item) => item.roleName),
        permissions: [...new Set(permissions.map((item) => item.permissionCode))],
        accessToken: '222',
        refreshToken: '111',
      } as LoginUserVo,
      { excludeExtraneousValues: true },
    );
  }

  // 创建用户
  create(createUserDto: CreateUserDto) {
    const user = new User();
    user.username = 'admin';
    user.password = '123456';
    return this.userRepository.save(user);
  }

  // 查询所有用户
  async findAll() {
    return this.userRepository.find();
  }

  // 查询单个用户
  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // 更新用户
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  // 删除用户
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
