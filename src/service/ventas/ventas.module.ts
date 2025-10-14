import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasController } from '../../controllers/ventas/ventas.controller';
import { ventas } from '../../entities/ventas.entity';
import { QueuesModule } from '../../queues/queues.module';
import { VentasService } from './ventas.service';

@Module({
    imports: [TypeOrmModule.forFeature([ventas]), QueuesModule],
    providers: [VentasService],
    controllers: [VentasController],
    exports: [VentasService],
})
export class VentasModule { }
