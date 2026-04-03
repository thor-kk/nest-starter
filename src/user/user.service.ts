import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { RedisService } from 'src/core/redis.service';
import { BcryptService } from 'src/core/bcrypt.service';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UserService {
  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Inject(BcryptService)
  private readonly bcryptService: BcryptService;

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

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

  create(createUserDto: CreateUserDto) {
    const user = new User();
    user.username = 'admin';
    user.password = '123456';
    return this.userRepository.save(user);
  }

  async findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
