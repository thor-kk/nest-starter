import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

@Global()
@Module({
  providers: [
    EmailService,
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
  ],
  exports: [EmailService],
})
export class EmailModule {}
