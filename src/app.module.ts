import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CategoriesController } from './controllers/categories/categories.controller';
import { CompanyController } from './controllers/company/company.controller';
import { FacturasController } from './controllers/facturas/facturas.controller';
import { HealthController } from './controllers/health.controller';
import { MenuController } from './controllers/menu/menu.controller';
import { MetricsController } from './controllers/metrics.controller';
import { ProductTypesController } from './controllers/product_types/product_types.controller';
import { ProductsController } from './controllers/products/products.controller';
import { PromotionsController } from './controllers/promotions/promotions.controller';
import { ProvidersController } from './controllers/providers/providers.controller';
import { SettingsController } from './controllers/settings/settings.controller';
import { StockController } from './controllers/stock/stock.controller';
import { UserController } from './controllers/user/user.controller';
import { categories } from './entities/categories.entity';
import { company } from './entities/company.entity';
import { facturas } from './entities/facturas.entity';
import { product_types } from './entities/product_types.entity';
import { products } from './entities/products.entity';
import { promotions } from './entities/promotions.entity';
import { providers } from './entities/providers.entity';
import { settings } from './entities/settings.entity';
import { stock } from './entities/stock.entity';
import { User } from './entities/user.entity';
import { ventas } from './entities/ventas.entity';
import { CustomThrottlerGuard } from './guards/custom-throttler.guard';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { PrometheusInterceptor } from './interceptors/prometheus.interceptor';
import { LoginsModule } from './logins/logins.module';
import { TypeORMMetricsService } from './metrics/typeorm-metrics.service';
import { QueuesModule } from './queues/queues.module';
import { CategoriesService } from './service/categories/categories.service';
import { CompanyService } from './service/company/company.service';
import { FacturasService } from './service/facturas/facturas.service';
import { MenuService } from './service/menu/menu.service';
import { ProductTypesService } from './service/product_types/product_types.service';
import { ProductsService } from './service/products/products.service';
import { PromotionsService } from './service/promotions/promotions.service';
import { ProvidersService } from './service/providers/providers.service';
import { SettingsService } from './service/settings/settings.service';
import { StockService } from './service/stock/stock.service';
import { UserService } from './service/user/user.service';
import { VentasModule } from './service/ventas/ventas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      company,
      facturas,
      ventas,
      products,
      stock,
      providers,
      categories,
      product_types,
      promotions,
      settings,
    ]),
    AuthModule,
    QueuesModule,
    // Ventas module
    // Módulo que maneja operaciones de ventas
    VentasModule,
    LoginsModule,
  ],
  controllers: [
    UserController,
    CompanyController,
    FacturasController,
    ProductsController,
    StockController,
    ProvidersController,
    CategoriesController,
    ProductTypesController,
    PromotionsController,
    SettingsController,
    MenuController,
    HealthController,
    MetricsController,
  ],
  providers: [
    UserService,
    CompanyService,
    FacturasService,
    ProductsService,
    StockService,
    ProvidersService,
    CategoriesService,
    ProductTypesService,
    PromotionsService,
    SettingsService,
    MenuService,
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
})
export class AppModule { }
