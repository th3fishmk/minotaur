export type color = 'PE' | 'RC' | 'RM' | 'CC' | 'BR' | 'SP' | undefined;

export const Models: { value: color; label: string }[] = [
    { value: 'PE', label: 'Patineta eléctrica (PE)' },
    { value: 'RC', label: 'Montacargas RC' },
    { value: 'RM', label: 'Montacargas RM' },
    { value: 'CC', label: 'CC' },
    { value: 'BR', label: 'Barredora' },
    { value: 'SP', label: 'Stock Picker' },
];

type Eval = 'visual' | 'field';

export interface Question {
    id: string;
    text: string;
    description?: string;
    eval: Eval;
}

export interface FormDState {
    // personal
    date: string;
    name: string;
    ID: number | undefined;
    // 
    mod: color;
    shortID: number | undefined;
    hours: number | undefined;
    answers: Record<string, number>;
}
