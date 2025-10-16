import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartialUpdateSettingsDto } from '../../dto/settings.dto';
import { settings } from '../../entities/settings.entity';

@Injectable()
export class SettingsService {
    constructor(
        @InjectRepository(settings)
        private readonly settingsRepository: Repository<settings>,
    ) { }

    async get(): Promise<settings> {
        let current = await this.settingsRepository.findOne({ where: {} });
        if (!current) {
            current = this.settingsRepository.create({});
            current = await this.settingsRepository.save(current);
        }
        return current;
    }

    async update(payload: PartialUpdateSettingsDto): Promise<settings> {
        const current = await this.get();
        Object.assign(current, payload);
        return this.settingsRepository.save(current);
    }
}


