import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module(
  {
    imports: [
      ConfigModule.forRoot(
        {
          isGlobal: true,
          envFilePath: ['.env', '.env.local'],
        }
      ),
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
      })
    ],
    controllers: [
    ],
    providers: [
    ],
  }
)
export class AppModule { }
