import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProvidersDto, UpdateProvidersDto } from 'src/dto/providers.dto';
import { ProvidersService } from 'src/service/providers/providers.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('providers')
@Controller('providers')
export class ProvidersController {

  constructor(
    @Inject()
    private readonly providersService: ProvidersService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() payload: CreateProvidersDto) {
    return this.providersService.create(payload);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.providersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.providersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateProvidersDto,
  ) {
    return this.providersService.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.providersService.remove(id);
    return { success: true };
  }
}


