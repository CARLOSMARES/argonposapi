import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { getQueueToken } from '@nestjs/bullmq';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Queue } from 'bullmq';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

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
  // createBullBoard expects runtime values; adapter constructors are typed loosely
  createBullBoard({
    queues: [new BullMQAdapter(invoicesQueue as unknown as any)],
    serverAdapter,
  });
  const expressApp = app.getHttpAdapter().getInstance() as express.Application;
  expressApp.use('/queues', serverAdapter.getRouter());

  // Servir archivos estáticos de fotos
  expressApp.use('/fotos', express.static(join(__dirname, '..', 'fotos')));

  // start server (lint: ensure promise is awaited)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
