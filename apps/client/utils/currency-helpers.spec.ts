import { describe, it, expect } from 'vitest';
import { handleCurrencyChange } from './currency-helpers';

describe('handleCurrencyChange', () => {
    it('deve formatar número como moeda BRL', () => {
        const result = handleCurrencyChange('200');
        expect(result).toMatch(/R\$/);
    });

    it('deve retornar zero formatado para string vazia', () => {
        const result = handleCurrencyChange('');
        expect(result).toMatch(/R\$/);
    });

    it('deve retornar string (não número)', () => {
        const result = handleCurrencyChange('1000');
        expect(typeof result).toBe('string');
    });
});
