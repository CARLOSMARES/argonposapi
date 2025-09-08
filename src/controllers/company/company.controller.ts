import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCompanyDto, UpdateCompanyDto } from 'src/dto/company.dto';
import { CompanyService } from 'src/service/company/company.service';

@ApiTags('company')
@Controller('company')
export class CompanyController {

  constructor(
    @Inject()
    private readonly companyService: CompanyService
  ) {}

  @Post()
  async create(@Body() payload: CreateCompanyDto) {
    return this.companyService.create(payload);
  }

  @Get()
  async findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateCompanyDto,
  ) {
    return this.companyService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.companyService.remove(id);
    return { success: true };
  }
}
