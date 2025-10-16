import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('settings')
export class settings {
  @ApiProperty({ description: 'Identificador único', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ required: false, description: 'Nombre de la empresa', example: 'Argon POS S.A. de C.V.' })
  @Column({ nullable: true })
  companyName: string;

  @ApiProperty({ required: false, description: 'URL del logo', example: 'https://cdn.example.com/logo.png' })
  @Column({ nullable: true })
  logoUrl: string;

  @ApiProperty({ required: false, description: 'Color primario HEX', example: '#0D6EFD' })
  @Column({ nullable: true })
  primaryColor: string;

  @ApiProperty({ required: false, description: 'Color secundario HEX', example: '#6C757D' })
  @Column({ nullable: true })
  secondaryColor: string;

  @ApiProperty({ required: false, description: 'Color de acento HEX', example: '#6610F2' })
  @Column({ nullable: true })
  accentColor: string;

  @ApiProperty({ required: false, description: 'Color de fondo HEX', example: '#FFFFFF' })
  @Column({ nullable: true })
  backgroundColor: string;

  @ApiProperty({ required: false, description: 'Color de texto HEX', example: '#212529' })
  @Column({ nullable: true })
  textColor: string;

  @ApiProperty({ required: false, description: 'Configuraciones específicas para web', example: { landingBanner: true, itemsPerPage: 20 } })
  @Column({ type: 'json', nullable: true })
  webConfig: Record<string, unknown> | null;

  @ApiProperty({ required: false, description: 'Configuraciones específicas para móvil', example: { enablePush: true } })
  @Column({ type: 'json', nullable: true })
  mobileConfig: Record<string, unknown> | null;

  @ApiProperty({
    required: false,
    description: 'Menú para la plataforma web',
    example: [
      { key: 'dashboard', label: 'Dashboard' },
      { key: 'ventas', label: 'Ventas', roles: ['admin', 'cashier'] },
      { key: 'config', label: 'Configuración', roles: ['admin'], enabled: true }
    ]
  })
  @Column({ type: 'json', nullable: true })
  menuWeb: Array<{ key: string; label: string; icon?: string; roles?: string[]; enabled?: boolean }> | null;

  @ApiProperty({
    required: false,
    description: 'Menú para la app móvil',
    example: [
      { key: 'home', label: 'Inicio' },
      { key: 'scan', label: 'Escanear', roles: ['user', 'admin'] }
    ]
  })
  @Column({ type: 'json', nullable: true })
  menuMobile: Array<{ key: string; label: string; icon?: string; roles?: string[]; enabled?: boolean }> | null;

  @ApiProperty({ description: 'Fecha de última actualización', example: '2025-10-15T12:34:56.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}


