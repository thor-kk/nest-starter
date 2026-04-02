import { Inject, Injectable } from '@nestjs/common';
import type { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  @Inject('EMAIL_TRANSPORTER')
  private readonly transporter: Transporter;

  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: { name: 'nest-starter_test', address: '1317290619@qq.com' },
      to,
      subject,
      html,
    });
  }
}
