export type ForkLiftType = 'PE' | 'RC' | 'RM' | undefined;

export const Models: { value: ForkLiftType; label: string }[] = [
    { value: 'PE', label: 'PE' },
    { value: 'RC', label: 'RC' },
    { value: 'RM', label: 'RM' },
];

export interface Question {
    id: string;
    text: string;
    description?: string;
}

export interface FormDState {
    date: string;
    name: string;
    ID: number;
    mod: ForkLiftType;
    shortID: number | undefined;
    hours: number | undefined;
    answers: Record<string, number>;
}
