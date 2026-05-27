/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import AddBillModal from './add-bill-modal';

vi.mock('@/actions', () => ({
    addBillAction: vi.fn(),
}));

vi.mock('./modal', () => ({
    default: ({ children, show }: any) => show ? <div data-testid="mock-modal">{children}</div> : null
}));

describe('AddBillModal', () => {
    it('deve aplicar máscara de moeda enquanto o usuário digita', () => {
        render(<AddBillModal showBillModal={true} setShowBillModal={() => { }} userId="1" />);

        const input = screen.getByPlaceholderText('R$ 200,00') as HTMLInputElement;

        fireEvent.change(input, { target: { value: '1000' } });
        const normalizedValue = input.value.replace(/\s/g, ' ');

        expect(normalizedValue).toBe('R$ 10,00');
    });

    it('deve mostrar o campo de parcelas apenas quando "Parcelada" for selecionado', async () => {
        render(<AddBillModal showBillModal={true} setShowBillModal={() => { }} userId="1" />);

        expect(screen.queryByLabelText(/Parcelas/i)).not.toBeInTheDocument();

        const radioInstallment = screen.getByLabelText(/Parcelada/i);
        fireEvent.click(radioInstallment);

        expect(screen.getByLabelText(/Parcelas/i)).toBeVisible();
    });
});