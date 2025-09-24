import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CompanyController } from './controllers/company/company.controller';
import { FacturasController } from './controllers/facturas/facturas.controller';
import { ProductsController } from './controllers/products/products.controller';
import { ProvidersController } from './controllers/providers/providers.controller';
import { StockController } from './controllers/stock/stock.controller';
import { UserController } from './controllers/user/user.controller';
import { company } from './entities/company.entity';
import { facturas } from './entities/facturas.entity';
import { products } from './entities/products.entity';
import { providers } from './entities/providers.entity';
import { stock } from './entities/stock.entity';
import { User } from './entities/user.entity';
import { CompanyService } from './service/company/company.service';
import { QueuesModule } from './queues/queues.module';
import { HealthController } from './controllers/health.controller';
import { MetricsController } from './controllers/metrics.controller';
import { AuthModule } from './auth/auth.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { PrometheusInterceptor } from './interceptors/prometheus.interceptor';
import { CustomThrottlerGuard } from './guards/custom-throttler.guard';
import { TypeORMMetricsService } from './metrics/typeorm-metrics.service';
import { FacturasService } from './service/facturas/facturas.service';
import { ProductsService } from './service/products/products.service';
import { ProvidersService } from './service/providers/providers.service';
import { StockService } from './service/stock/stock.service';
import { UserService } from './service/user/user.service';

@Module(
  {
    imports: [
      ConfigModule.forRoot(
        {
          isGlobal: true,
          envFilePath: [
            '.env',
            '.env.local'
          ],
        }
      ),
      ThrottlerModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => [
          {
            ttl: config.get<number>('THROTTLE_TTL') ?? 60000, // 1 minuto
            limit: config.get<number>('THROTTLE_LIMIT') ?? 100, // 100 requests por minuto
          },
        ],
        inject: [ConfigService],
      }),
      TypeOrmModule.forRootAsync(
        {
          imports: [
            ConfigModule
          ],
          useFactory: (
            configService: ConfigService
          ) => (
            {
              type: 'mysql',
              host: configService.get<string>('DATABASE_HOST'),
              port: configService.get<number>('DATABASE_PORT'),
              username: configService.get<string>('DATABASE_USER'),
              password: configService.get<string>('DATABASE_PASSWORD'),
              database: configService.get<string>('DATABASE_NAME'),
              entities: [__dirname + '/**/*.entity{.ts,.js}'],
              synchronize: true,
              logging: configService.get<string>('NODE_ENV') === 'development',
            }
          ),
          inject: [
            ConfigService
          ],
        }
      ),
      TypeOrmModule.forFeature([User, company, facturas, products, stock, providers]),
      AuthModule,
      QueuesModule,
    ],
    controllers: [
      UserController,
      CompanyController,
      FacturasController,
      ProductsController,
      StockController,
      ProvidersController,
      HealthController,
      MetricsController
    ],
    providers: [
      UserService,
      CompanyService,
      FacturasService,
      ProductsService,
      StockService,
      ProvidersService,
      TypeORMMetricsService,
      {
        provide: APP_INTERCEPTOR,
        useClass: LoggingInterceptor,
      },
      {
        provide: APP_INTERCEPTOR,
        useClass: PrometheusInterceptor,
      },
      {
        provide: APP_GUARD,
        useClass: CustomThrottlerGuard,
      },
    ],
  }
)
export class AppModule { }
