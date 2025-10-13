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
  async create(@Body() payload: CreateFacturasDto) {
    return this.facturasService.create(payload);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.facturasService.findAll();
  }

  @Post('enqueue-test/:id')
  @UseGuards(JwtAuthGuard)
  async enqueueTest(@Param('id', ParseIntPipe) id: number) {
    return this.queuesService.enqueueInvoice('generate-pdf', { id });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.facturasService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateFacturasDto,
  ) {
    return this.facturasService.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.facturasService.remove(id);
    return { success: true };
  }
}
