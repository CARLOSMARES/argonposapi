import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateProductsDto, UpdateProductsDto } from '../../dto/products.dto';
import { ProductsService } from '../../service/products/products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    @Inject()
    private readonly productsService: ProductsService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear producto' })
  @ApiOkResponse({ description: 'Producto creado' })
  async create(@Body() payload: CreateProductsDto) {
    return this.productsService.create(payload);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar productos' })
  async findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener producto por id' })
  @ApiParam({ name: 'id', type: Number })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar producto' })
  @ApiParam({ name: 'id', type: Number })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateProductsDto,
  ) {
    return this.productsService.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar producto' })
  @ApiParam({ name: 'id', type: Number })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productsService.remove(id);
    return { success: true };
  }

  @Post('upload-photo/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subir foto de producto' })
  @ApiParam({ name: 'id', type: Number })
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './fotos',
        filename: (req, file, callback) => {
          const productId = req.params.id;
          const fileExtName = extname(file.originalname);
          const fileName = `product_${productId}_${Date.now()}${fileExtName}`;
          callback(null, fileName);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(
            new BadRequestException(
              'Solo se permiten archivos de imagen (JPG, JPEG, PNG, GIF, WEBP)',
            ),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        photo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadPhoto(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }

    const photoUrl = `/fotos/${file.filename}`;
    const updatedProduct = await this.productsService.update(id, {
      photo_url: photoUrl,
    });

    return {
      success: true,
      message: 'Foto subida exitosamente',
      photo_url: photoUrl,
      product: updatedProduct,
    };
  }
}

// Helpers exportados para facilitar testing del interceptor
export function buildProductPhotoFilename(
  productId: string | number,
  originalname: string,
) {
  const fileExtName = extname(originalname);
  const fileName = `product_${productId}_${Date.now()}${fileExtName}`;
  return fileName;
}

export function isAllowedImage(file: Express.Multer.File) {
  return !!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/);
}
