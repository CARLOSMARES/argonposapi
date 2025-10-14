import { AuthModule } from '../auth/auth.module';
import { LoginsModule } from '../logins/logins.module';
import { QueuesModule } from '../queues/queues.module';

describe('Modules sanity', () => {
    it('AuthModule se puede importar', () => {
        expect(AuthModule).toBeDefined();
    });

    it('QueuesModule se puede importar', () => {
        expect(QueuesModule).toBeDefined();
    });

    it('LoginsModule se puede importar', () => {
        expect(LoginsModule).toBeDefined();
    });
});
