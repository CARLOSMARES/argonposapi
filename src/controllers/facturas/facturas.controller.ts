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
import { CreateFacturasDto, UpdateFacturasDto } from '../../dto/facturas.dto';
import { QueuesService } from '../../queues/queues.service';
import { FacturasService } from '../../service/facturas/facturas.service';

@ApiTags('facturas')
@Controller('facturas')
export class FacturasController {
  constructor(
    @Inject()
    private readonly facturasService: FacturasService,
    @Inject(QueuesService)
    private readonly queuesService: QueuesService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear factura' })
  @ApiOkResponse({ description: 'Factura creada' })
  async create(@Body() payload: CreateFacturasDto) {
    return this.facturasService.create(payload);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar facturas' })
  async findAll() {
    return this.facturasService.findAll();
  }

  @Post('enqueue-test/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Encolar generación de PDF de factura (demo)' })
  @ApiParam({ name: 'id', type: Number })
  async enqueueTest(@Param('id', ParseIntPipe) id: number) {
    return this.queuesService.enqueueInvoice('generate-pdf', { id });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener factura por id' })
  @ApiParam({ name: 'id', type: Number })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.facturasService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar factura' })
  @ApiParam({ name: 'id', type: Number })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateFacturasDto,
  ) {
    return this.facturasService.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar factura' })
  @ApiParam({ name: 'id', type: Number })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.facturasService.remove(id);
    return { success: true };
  }
}
