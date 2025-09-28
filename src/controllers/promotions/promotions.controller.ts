import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { CreatePromotionsDto, UpdatePromotionsDto } from 'src/dto/promotions.dto';
import { PromotionsService } from 'src/service/promotions/promotions.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('promotions')
@Controller('promotions')
export class PromotionsController {

  constructor(
    @Inject()
    private readonly promotionsService: PromotionsService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() payload: CreatePromotionsDto) {
    return this.promotionsService.create(payload);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.promotionsService.findAll();
  }

  @Get('current')
  @UseGuards(JwtAuthGuard)
  async findCurrentPromotions() {
    return this.promotionsService.findCurrentPromotions();
  }

  @Get('by-category/:categoryId')
  @UseGuards(JwtAuthGuard)
  async findPromotionsByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.promotionsService.findPromotionsByCategory(categoryId);
  }

  @Get('by-product/:productId')
  @UseGuards(JwtAuthGuard)
  async findPromotionsByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.promotionsService.findPromotionsByProduct(productId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.promotionsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdatePromotionsDto,
  ) {
    return this.promotionsService.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.promotionsService.remove(id);
    return { success: true };
  }
}
