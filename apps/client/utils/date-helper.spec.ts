import { calculateFinalDate } from './date-helpers';

describe('calculateFinalDate', () => {
    it('deve calcular corretamente a data da última parcela', () => {
        const res = calculateFinalDate('2026-01-10', 'installment', 3);
        expect(res).toBe('2026-03-10');
    });

    it('deve retornar data longínqua para recorrente', () => {
        const res = calculateFinalDate('2026-01-10', 'recurrent', 0);
        expect(res).toBe('2099-12-31');
    });
});
