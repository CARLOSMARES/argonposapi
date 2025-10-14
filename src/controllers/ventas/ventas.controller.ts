import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateVentasDto, UpdateVentasDto } from '../../dto/ventas.dto';
import { QueuesService } from '../../queues/queues.service';
import { VentasService } from '../../service/ventas/ventas.service';

@ApiTags('ventas')
@Controller('ventas')
export class VentasController {
    constructor(
        @Inject()
        private readonly ventasService: VentasService,
        @Inject(QueuesService)
        private readonly queuesService: QueuesService,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() payload: CreateVentasDto) {
        return this.ventasService.create(payload);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll() {
        return this.ventasService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.ventasService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateVentasDto,
    ) {
        return this.ventasService.update(id, payload);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.ventasService.remove(id);
        return { success: true };
    }
}
