import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { EmailService } from 'src/core/email.service';
import { RedisService } from 'src/core/redis.service';
import { UserService } from './user.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

import { LoginUserVo } from './vo/login-user.vo';

@ApiTags('用户模块')
@Controller('users')
export class UserController {
  @Inject()
  private readonly emailService: EmailService;

  @Inject()
  private readonly redisService: RedisService;

  @Inject()
  private readonly userService: UserService;

  @ApiOperation({ summary: '初始化数据' })
  @Get('init-data')
  async initData() {
    await this.userService.initData();
    return '初始化数据成功';
  }

  @ApiOperation({ summary: '注册验证码' })
  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(`captcha_${address}`, code, 5 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    });

    return '发送成功';
  }

  @ApiOperation({ summary: '注册' })
  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }

  @ApiOperation({ summary: '登录' })
  @ApiResponse({ status: 200, type: LoginUserVo })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @ApiOperation({ summary: '创建用户' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: '查询所有用户' })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: '查询单个用户' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @ApiOperation({ summary: '更新用户' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: '删除用户' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
