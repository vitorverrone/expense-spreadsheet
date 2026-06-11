import { currency } from "remask";

export const handleCurrencyChange = (value: string) => {
    const raw = currency.unmask({ locale: 'pt-BR', currency: 'BRL', value: value })
    const masked = currency.mask({ locale: 'pt-BR', currency: 'BRL', value: raw });

    return masked;
};