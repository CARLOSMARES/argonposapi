import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Queue } from 'bullmq';
import { getQueueToken } from '@nestjs/bullmq';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Argon POS API')
    .setDescription('API documentation for Argon POS')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));

  // bull-board en /queues
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/queues');
  const invoicesQueue = app.get<Queue>(getQueueToken('invoices'));
  createBullBoard({
    queues: [new BullMQAdapter(invoicesQueue)],
    serverAdapter,
  });
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use('/queues', serverAdapter.getRouter());

  await app.listen(process.env.PORT ?? 3000);
  
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   {
  //     transport: Transport.TCP,
  //   },
  // );
  // await app.listen();

}
bootstrap();
