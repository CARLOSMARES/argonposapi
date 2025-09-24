import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateFacturasDto, UpdateFacturasDto } from 'src/dto/facturas.dto';
import { FacturasService } from 'src/service/facturas/facturas.service';
import { QueuesService } from 'src/queues/queues.service';

@ApiTags('facturas')
@Controller('facturas')
export class FacturasController {

  constructor(
    @Inject()
    private readonly facturasService: FacturasService,
    @Inject(QueuesService)
    private readonly queuesService: QueuesService,
  ) {}

  @Post()
  async create(@Body() payload: CreateFacturasDto) {
    return this.facturasService.create(payload);
  }

  @Get()
  async findAll() {
    return this.facturasService.findAll();
  }

  @Post('enqueue-test/:id')
  async enqueueTest(@Param('id', ParseIntPipe) id: number) {
    return this.queuesService.enqueueInvoice('generate-pdf', { id });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.facturasService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateFacturasDto,
  ) {
    return this.facturasService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.facturasService.remove(id);
    return { success: true };
  }
}
