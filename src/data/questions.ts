import type { Question } from '../types';

export const allQuestions: Question[] = [
    {
        id: '1',
        text: 'Fugas de aceite',
        description: 'Dirección, frenos, sistemas hidráulicos, transmisión',
        eval: 'visual',
    },
    {
        id: '2',
        text: 'Tanque de gas y medidor en buen estado',
        description: 'Solo CC y barredoras',
        eval: 'visual',
    },
    {
        id: '3',
        text: 'Connector de batería',
        description: 'Roto, quemado, bien conectado',
        eval: 'visual',
    },
    {
        id: '4',
        text: 'Cadenas cables y mangueras en torre',
        description: 'Sin daño y en su lugar',
        eval: 'visual',
    },
    {
        id: '5',
        text: 'Luces',
        description: 'Faros en buen estado',
        eval: 'visual',
    },
    {
        id: '6',
        text: 'Guardas',
        description: 'Respaldo de carga en uñas, guardas de batería',
        eval: 'visual',
    },
    {
        id: '7',
        text: 'Batería',
        description: 'Tapones en su lugar y cables (solo PE/TR)',
        eval: 'visual',
    },
    {
        id: '8',
        text: 'LLantas y ruedas',
        description: 'Sin cortadas, dibujo adecuado',
        eval: 'visual',
    },
    {
        id: '9',
        text: 'Daños o golpes',
        description: 'Partes golpeadas, abolladas o rotas',
        eval: 'visual',
    },
    {
        id: '10',
        text: 'Uñas',
        description: 'En posición y correctamente aseguradas',
        eval: 'visual',
    },
    {
        id: '11',
        text: 'Canastilla',
        description: 'En posición y correctamente asegurada (Solo SP)',
        eval: 'visual',
    },

    {
        id: '12',
        text: 'Equipo de seguridad',
        description: 'Torreta, luces indicadoras en el tablero',
        eval: 'field',
    },
    {
        id: '13',
        text: 'Claxon',
        description: 'Operación directa',
        eval: 'field',
    },
    {
        id: '14',
        text: 'Dirección',
        description: 'Operación suave sin ruidos o juego excesivo',
        eval: 'field',
    },
    {
        id: '15',
        text: 'Controles de desplazamiento',
        description:
            'Rangos de velocidad, adelante y reversa, ruidos inusuales',
        eval: 'field',
    },
    {
        id: '16',
        text: 'Controles hidráulicos',
        description: 'Elevación descenso, conejo, ruidos inusuales',
        eval: 'field',
    },
    {
        id: '17',
        text: 'Frenos',
        description: 'Se desconectan los sistemas de viajes',
        eval: 'field',
    },
    {
        id: '18',
        text: 'Freno de estacionamiento',
        description: 'Freno adecuado del montacargas, no permite movimiento',
        eval: 'field',
    },
    {
        id: '19',
        text: 'Desconección de emergencia',
        description: 'Operación de corte correcto',
        eval: 'field',
    },
    {
        id: '20',
        text: 'Indicadores de límites',
        description: 'Limites de levantes y cortes de levantes',
        eval: 'field',
    },
    {
        id: '21',
        text: 'Indicador de carga de la batería',
        description: 'Totalmente cargada o mínimo 75% de carga',
        eval: 'field',
    },
    {
        id: '22',
        text: 'Aditamentos o accesorios',
        description: 'Funcionamiento adecuado, ruidos inusuales',
        eval: 'field',
    },
    {
        id: '23',
        text: 'Interruptores de límite',
        description: 'Desplazamiento, elevación, inclinación',
        eval: 'field',
    },
];
