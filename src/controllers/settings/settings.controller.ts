import { Body, Controller, Get, Inject, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Public } from '../../auth/public.decorator';
import { PartialUpdateSettingsDto } from '../../dto/settings.dto';
import { settings } from '../../entities/settings.entity';
import { SettingsService } from '../../service/settings/settings.service';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
    constructor(
        @Inject()
        private readonly settingsService: SettingsService,
    ) { }

    @Get()
    @Public()
    @ApiOperation({ summary: 'Obtener configuración global (público)' })
    @ApiOkResponse({ description: 'Configuración actual', type: settings })
    async get() {
        return this.settingsService.get();
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualizar configuración global (requiere autenticación)' })
    @ApiOkResponse({ description: 'Configuración actualizada', type: settings })
    async update(@Body() payload: PartialUpdateSettingsDto) {
        return this.settingsService.update(payload);
    }
}


