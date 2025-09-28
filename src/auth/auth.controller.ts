import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { LoginDto, RefreshTokenDto, AuthResponseDto } from '../dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ 
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario y retorna tokens de acceso y refresco'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login exitoso',
    type: AuthResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Credenciales inválidas' 
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.username, loginDto.password);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ 
    summary: 'Renovar token',
    description: 'Obtiene un nuevo access token usando el refresh token'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Token renovado exitosamente',
    type: AuthResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Refresh token inválido o expirado' 
  })
  async refresh(@Body() refreshDto: RefreshTokenDto) {
    return this.authService.refresh(refreshDto.refresh_token);
  }
}


