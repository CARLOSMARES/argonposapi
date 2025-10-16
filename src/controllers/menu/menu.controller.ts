import { Controller, Get, Inject, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { MenuService } from '../../service/menu/menu.service';
import { UserService } from '../../service/user/user.service';

@ApiTags('menu')
@Controller('menu')
export class MenuController {
    constructor(
        @Inject()
        private readonly menuService: MenuService,
        @Inject()
        private readonly userService: UserService,
    ) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiQuery({ name: 'platform', enum: ['web', 'mobile'], required: true })
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener menú filtrado por rol y plataforma' })
    @ApiOkResponse({ description: 'Lista de items de menú' })
    async getMenu(@Query('platform') platform: 'web' | 'mobile', @Req() req: any) {
        const userId: number | undefined = req.user?.userId;
        let role: string | undefined = undefined;
        if (typeof userId === 'number') {
            const user = await this.userService.findOne(userId);
            role = user?.role;
        }
        return this.menuService.getMenu(platform, role);
    }
}


