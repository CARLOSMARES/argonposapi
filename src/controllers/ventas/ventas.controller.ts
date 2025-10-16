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
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
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
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear venta' })
    @ApiOkResponse({ description: 'Venta creada' })
    async create(@Body() payload: CreateVentasDto) {
        return this.ventasService.create(payload);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Listar ventas' })
    async findAll() {
        return this.ventasService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener venta por id' })
    @ApiParam({ name: 'id', type: Number })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.ventasService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualizar venta' })
    @ApiParam({ name: 'id', type: Number })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateVentasDto,
    ) {
        return this.ventasService.update(id, payload);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Eliminar venta' })
    @ApiParam({ name: 'id', type: Number })
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.ventasService.remove(id);
        return { success: true };
    }
}
