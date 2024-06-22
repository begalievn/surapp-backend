import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const PORT = configService.get('PORT', 9000);
  await app.listen(PORT, () => {
    console.info(`Server is running on port ${PORT}`);
  });
}

bootstrap();
