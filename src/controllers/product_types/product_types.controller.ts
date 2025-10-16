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
import {
  CreateProductTypesDto,
  UpdateProductTypesDto,
} from '../../dto/product_types.dto';
import { ProductTypesService } from '../../service/product_types/product_types.service';

@ApiTags('product-types')
@Controller('product-types')
export class ProductTypesController {
  constructor(
    @Inject()
    private readonly productTypesService: ProductTypesService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear tipo de producto' })
  @ApiOkResponse({ description: 'Tipo de producto creado' })
  async create(@Body() payload: CreateProductTypesDto) {
    return this.productTypesService.create(payload);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar tipos de producto' })
  async findAll() {
    return this.productTypesService.findAll();
  }

  @Get('active')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar tipos de producto activos' })
  async findActive() {
    return this.productTypesService.findActive();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener tipo de producto por id' })
  @ApiParam({ name: 'id', type: Number })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productTypesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar tipo de producto' })
  @ApiParam({ name: 'id', type: Number })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateProductTypesDto,
  ) {
    return this.productTypesService.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar tipo de producto' })
  @ApiParam({ name: 'id', type: Number })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productTypesService.remove(id);
    return { success: true };
  }
}
