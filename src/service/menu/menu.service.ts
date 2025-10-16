import { Injectable } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';

type MenuItem = { key: string; label: string; icon?: string; roles?: string[]; enabled?: boolean };

@Injectable()
export class MenuService {
    constructor(private readonly settingsService: SettingsService) { }

    async getMenu(platform: 'web' | 'mobile', role?: string): Promise<MenuItem[]> {
        const settings = await this.settingsService.get();
        const source: MenuItem[] | null = platform === 'web' ? (settings.menuWeb as any) : (settings.menuMobile as any);
        if (!Array.isArray(source)) return [];
        const normalizedRole = (role ?? 'user').toLowerCase();
        return source.filter(item => {
            const enabled = item.enabled !== false; // default enabled
            if (!enabled) return false;
            if (!item.roles || item.roles.length === 0) return true; // visible to all
            return item.roles.map(r => r.toLowerCase()).includes(normalizedRole);
        });
    }
}


