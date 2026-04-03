import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  if (configService.get('swagger_enable') === 'true') {
    const config = new DocumentBuilder()
      .setTitle(configService.get('swagger_title') ?? 'nest-starter')
      .setDescription(configService.get('swagger_description') ?? 'API 接口文档')
      .setVersion(configService.get('swagger_version') ?? '1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(configService.get('swagger_path') ?? 'api-docs', app, document);
  }

  process.env.TZ = configService.get('system_timezone');
  await app.listen(configService.get('system_port') ?? 3000);
}

bootstrap();
