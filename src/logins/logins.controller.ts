import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginsService } from './logins.service';

@ApiTags('logins')
@Controller('logins')
export class LoginsController {
  constructor(private readonly service: LoginsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar accesos (login) paginados' })
  async findAll(@Query('page') page = '1', @Query('limit') limit = '50') {
    const p = parseInt(page, 10) || 1;
    const l = parseInt(limit, 10) || 50;
    return this.service.findAll(p, l);
  }
}
