import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './controllers/company/company.controller';
import { FacturasController } from './controllers/facturas/facturas.controller';
import { ProductsController } from './controllers/products/products.controller';
import { StockController } from './controllers/stock/stock.controller';
import { UserController } from './controllers/user/user.controller';
import { company } from './entities/company.entity';
import { facturas } from './entities/facturas.entity';
import { products } from './entities/products.entity';
import { providers } from './entities/providers.entity';
import { stock } from './entities/stock.entity';
import { User } from './entities/user.entity';
import { CompanyService } from './service/company/company.service';
import { FacturasService } from './service/facturas/facturas.service';
import { ProductsService } from './service/products/products.service';
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
    ],
    controllers: [
      UserController,
      CompanyController,
      FacturasController,
      ProductsController,
      StockController
    ],
    providers: [
      UserService,
      CompanyService,
      FacturasService,
      ProductsService,
      StockService
    ],
  }
)
export class AppModule { }
