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
  CreatePromotionsDto,
  UpdatePromotionsDto,
} from '../../dto/promotions.dto';
import { PromotionsService } from '../../service/promotions/promotions.service';

@ApiTags('promotions')
@Controller('promotions')
export class PromotionsController {
  constructor(
    @Inject()
    private readonly promotionsService: PromotionsService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear promoción' })
  @ApiOkResponse({ description: 'Promoción creada' })
  async create(@Body() payload: CreatePromotionsDto) {
    return this.promotionsService.create(payload);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar promociones' })
  async findAll() {
    return this.promotionsService.findAll();
  }

  @Get('current')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar promociones vigentes' })
  async findCurrentPromotions() {
    return this.promotionsService.findCurrentPromotions();
  }

  @Get('by-category/:categoryId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar promociones por categoría' })
  @ApiParam({ name: 'categoryId', type: Number })
  async findPromotionsByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.promotionsService.findPromotionsByCategory(categoryId);
  }

  @Get('by-product/:productId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar promociones por producto' })
  @ApiParam({ name: 'productId', type: Number })
  async findPromotionsByProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.promotionsService.findPromotionsByProduct(productId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener promoción por id' })
  @ApiParam({ name: 'id', type: Number })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.promotionsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar promoción' })
  @ApiParam({ name: 'id', type: Number })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdatePromotionsDto,
  ) {
    return this.promotionsService.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar promoción' })
  @ApiParam({ name: 'id', type: Number })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.promotionsService.remove(id);
    return { success: true };
  }
}
