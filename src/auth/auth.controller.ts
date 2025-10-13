import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthResponseDto, LoginDto, RefreshTokenDto } from '../dto/auth.dto';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario y retorna tokens de acceso y refresco',
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto, @Req() req?: Request) {
    const forwarded = req?.headers['x-forwarded-for'] as string | undefined;
    const ip =
      forwarded?.split(',')?.[0]?.trim() ||
      (req?.ip as string) ||
      req?.socket?.remoteAddress;
    return this.authService.login(loginDto.username, loginDto.password, ip);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({
    summary: 'Renovar token',
    description: 'Obtiene un nuevo access token usando el refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'Token renovado exitosamente',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido o expirado',
  })
  async refresh(@Body() refreshDto: RefreshTokenDto) {
    return this.authService.refresh(refreshDto.refresh_token);
  }
}
