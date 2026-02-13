/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import AddBillModal from './add-bill-modal';
 // Garante que os matchers existam

// Mock da Server Action
vi.mock('@/actions', () => ({
    addBillAction: vi.fn(),
}));

vi.mock('./modal', () => ({
  default: ({ children, show }: any) => show ? <div data-testid="mock-modal">{children}</div> : null
}));

describe('AddBillModal', () => {
    it('deve aplicar máscara de moeda enquanto o usuário digita', () => {
        render(<AddBillModal showBillModal={true} setShowBillModal={() => {}} userId="1" />);

        const input = screen.getByPlaceholderText('R$ 200,00') as HTMLInputElement;
        
        // Simula o usuário digitando
        fireEvent.change(input, { target: { value: '1000' } });
        const normalizedValue = input.value.replace(/\s/g, ' ');

        // Verifique o valor conforme a lógica da sua remask
        expect(normalizedValue).toBe('R$ 10,00'); 
    });

    it('deve mostrar o campo de parcelas apenas quando "Parcelada" for selecionado', async () => {
        render(<AddBillModal showBillModal={true} setShowBillModal={() => {}} userId="1" />);

        // 1. Garante que o campo NÃO está lá inicialmente
        expect(screen.queryByLabelText(/Parcelas/i)).not.toBeInTheDocument();

        // 2. Seleciona o rádio "Parcelada"
        // Usamos o label para simular a interação do usuário
        const radioInstallment = screen.getByLabelText(/Parcelada/i);
        fireEvent.click(radioInstallment);

        // 3. Verifica se o campo apareceu
        // Usamos toBeVisible em vez de toBeInViewport
        expect(screen.getByLabelText(/Parcelas/i)).toBeVisible();
    });
});