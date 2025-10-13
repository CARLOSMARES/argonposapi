import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsDateString,
} from 'class-validator';

export class CreatePromotionsDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ['percentage', 'fixed_amount', 'buy_x_get_y'] })
  @IsEnum(['percentage', 'fixed_amount', 'buy_x_get_y'])
  type: 'percentage' | 'fixed_amount' | 'buy_x_get_y';

  @ApiProperty({ type: Number, format: 'float' })
  @IsNumber()
  discount_value: number;

  @ApiProperty({ required: false, type: Number, format: 'float' })
  @IsOptional()
  @IsNumber()
  minimum_amount?: number;

  @ApiProperty({ required: false, type: Number, format: 'float' })
  @IsOptional()
  @IsNumber()
  maximum_discount?: number;

  @ApiProperty()
  @IsDateString()
  start_date: string;

  @ApiProperty()
  @IsDateString()
  end_date: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  category_id?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  product_id?: number;
}

export class UpdatePromotionsDto extends PartialType(CreatePromotionsDto) {}
