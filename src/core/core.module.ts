import { join } from 'path';
import nodemailer from 'nodemailer';
import { createClient } from 'redis';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmailService } from './email.service';
import { RedisService } from './redis.service';
import { BcryptService } from './bcrypt.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('mysql_server_host'),
        port: configService.get('mysql_server_port'),
        username: configService.get('mysql_server_username'),
        password: configService.get('mysql_server_password'),
        database: configService.get('mysql_server_database'),
        synchronize: true,
        logging: true,
        entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
        poolSize: 10,
        connectorPackage: 'mysql2',
        timezone: configService.get('mysql_server_timezone'),
        extra: { authPlugin: 'sha256_password' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        const client = createClient({
          socket: { host: configService.get('redis_server_host'), port: configService.get('redis_server_port') },
          password: configService.get('redis_server_password'),
          database: configService.get('redis_server_database'),
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
    {
      provide: 'EMAIL_TRANSPORTER',
      useFactory: (configService: ConfigService) => {
        return nodemailer.createTransport({
          host: configService.get('email_server_host'),
          port: configService.get('email_server_port'),
          auth: {
            user: configService.get('email_server_user'),
            pass: configService.get('email_server_pass'),
          },
        });
      },
      inject: [ConfigService],
    },
    RedisService,
    EmailService,
    BcryptService,
  ],
  exports: [RedisService, EmailService, BcryptService],
})
export class CoreModule {}
