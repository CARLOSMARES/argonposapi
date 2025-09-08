import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProvidersDto, UpdateProvidersDto } from 'src/dto/providers.dto';
import { ProvidersService } from 'src/service/providers/providers.service';

@ApiTags('providers')
@Controller('providers')
export class ProvidersController {

  constructor(
    @Inject()
    private readonly providersService: ProvidersService
  ) {}

  @Post()
  async create(@Body() payload: CreateProvidersDto) {
    return this.providersService.create(payload);
  }

  @Get()
  async findAll() {
    return this.providersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.providersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateProvidersDto,
  ) {
    return this.providersService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.providersService.remove(id);
    return { success: true };
  }
}


