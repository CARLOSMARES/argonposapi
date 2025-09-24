import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCompanyDto, UpdateCompanyDto } from 'src/dto/company.dto';
import { CompanyService } from 'src/service/company/company.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('company')
@Controller('company')
export class CompanyController {

  constructor(
    @Inject()
    private readonly companyService: CompanyService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() payload: CreateCompanyDto) {
    return this.companyService.create(payload);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateCompanyDto,
  ) {
    return this.companyService.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.companyService.remove(id);
    return { success: true };
  }
}
