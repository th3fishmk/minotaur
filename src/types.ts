export type ForkLiftType = 'PE' | 'RC' | 'RM' | undefined;

export const Models: { value: ForkLiftType; label: string }[] = [
    { value: 'PE', label: 'PE pa' },
    { value: 'RC', label: 'RC' },
    { value: 'RM', label: 'RM' },
];

export interface Question {
    id: string;
    text: string;
    description?: string;
}

export interface FormDState {
    name: string;
    ID: number;
    mod: ForkLiftType;
    visualQ: Record<string, number>;
}
