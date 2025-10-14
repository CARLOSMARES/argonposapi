import { CreateLoginDto } from './login.dto';

describe('CreateLoginDto', () => {
    it('se puede instanciar y asignar campos opcionales', () => {
        const dto = new CreateLoginDto();
        dto.userId = 42 as any;
        dto.ip = '127.0.0.1';
        expect(dto.userId).toBe(42 as any);
        expect(dto.ip).toBe('127.0.0.1');
    });
});
