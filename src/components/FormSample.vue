<script setup lang="ts">
/** biome-ignore-all lint/correctness/noUnusedImports: too many false positives */
/** biome-ignore-all lint/correctness/noUnusedVariables: <same thing> */
import { computed, ref } from 'vue';
import { visualTest } from '../data/questions';
import { type FormDState, Models } from '../types';

const form = ref<FormDState>({
    // personal
    date: '',
    name: '',
    ID: undefined,
    // equipment
    mod: undefined,
    shortID: undefined,
    hours: undefined,

    answers: {},
});
// const selectedModel = ref<ForkLiftType>(undefined);
const handleVisualQ = (questionId: string, value: number) => {
    form.value.answers[questionId] = value;
};

// Form validation
// const showErrors = ref(false);

const answersValidity = computed(() => {
    return visualTest.every(q => {
        const val = form.value.answers[q.id];
        return val !== undefined && val !== null;
    })
})

const handleDone = () => {
    if (answersValidity.value) {
        console.log('Valid');

    } else {
        console.log('Invalid');

    }
};

</script>

<template>
    <h1>
        Check list de equipo de carga
    </h1>
    <!-- Personal info -->
    <div class="form-container-centered">
        <div class="input-group">
            <label class="input-label">Ingresa tu nombre</label>
            <input type="text"
                v-model="form.name"
                placeholder="Eg John"
                class="styled-input">
        </div>

        <div class="input-group">
            <label class="input-label">Numero de asociado</label>
            <input type="number"
                v-model="form.ID"
                placeholder="Eg 7275379"
                class="styled-input"
                required>
        </div>
    </div>
    <!-- Equipment info -->
    <div class="form-container-centered">
        <span>Selecciona tu equipo de carga</span>
        <div class="input-group">
            <div class="option-group">
                <label class="option-item"
                    v-for="m in Models"
                    :key="m.value">
                    <input type="radio"
                        v-model="form.mod"
                        :value="m.value"
                        :name="m.value"
                        required>
                    <span class="btn">{{ m.label }}</span>
                </label>
            </div>
        </div>
    </div>
    <br>
    <div class="form-container-centered">
        <div class="input-group">
            <label>Número económico</label>
            <input type="number"
                v-model="form.shortID"
                placeholder="eg 1894"
                class="styled-input"
                required>
            <label>Horómetro</label>
            <input type="number"
                v-model="form.hours"
                placeholder="hours"
                class="styled-input"
                required>
        </div>
    </div>
    <br>
    <!-- Questions -->
    <h2>
        Check list visual
    </h2>
    <div v-for="q in visualTest"
        :key="q.id">
        <div class="question-group"
            v-if="q.eval == 'visual'">
            <div class="question-text">
                <b>
                    <!-- {{ q.id }}&rpar;  -->
                    {{ q.text }}
                </b>
                <small>
                    {{ q.description }}
                </small>
            </div>
            <div class="centered">
                <div class="three-state-toggle">
                    <label class="toggle-option">
                        <input type="radio"
                            :name="q.id"
                            value="yes"
                            @click="handleVisualQ(q.id, 0)">
                        <span class="btn check">✓</span>
                    </label>
                    <label class="toggle-option">
                        <input type="radio"
                            :name="q.id"
                            value="na"
                            @click="handleVisualQ(q.id, 1)">
                        <span class="btn na">N/A</span>
                    </label>
                    <label class="toggle-option">
                        <input type="radio"
                            :name="q.id"
                            value="no"
                            @click="handleVisualQ(q.id, 2)">
                        <span class="btn cross">✕</span>
                    </label>
                </div>
            </div>
        </div>
    </div>
    <h2>
        Check list operacional
    </h2>
    <div v-for="q in visualTest"
        :key="q.id">
        <div class="question-group"
            v-if="q.eval == 'field'">
            <div class="question-text">
                <b>
                    <!-- {{ q.id }}&rpar;  -->
                    {{ q.text }}
                </b>
                <small>
                    {{ q.description }}
                </small>
            </div>
            <div class="centered">
                <div class="three-state-toggle">
                    <label class="toggle-option">
                        <input type="radio"
                            :name="q.id"
                            value="yes"
                            @click="handleVisualQ(q.id, 0)">
                        <span class="btn check">✓</span>
                    </label>
                    <label class="toggle-option">
                        <input type="radio"
                            :name="q.id"
                            value="na"
                            @click="handleVisualQ(q.id, 1)">
                        <span class="btn na">N/A</span>
                    </label>
                    <label class="toggle-option">
                        <input type="radio"
                            :name="q.id"
                            value="no"
                            @click="handleVisualQ(q.id, 2)">
                        <span class="btn cross">✕</span>
                    </label>
                </div>
            </div>
        </div>
    </div>
    <div class="form-container-centered">
        <div class="input-group">
            <label>
                <button @click="handleDone"
                    class="done-btn">
                    Done!
                </button>
            </label>
        </div>
    </div>
    <br>
    <!-- {{ JSON.stringify(form) }} -->
    <div class="qr-placeholder-wrapper">
        <div class="qr-reserved-box"
            :class="{ 'has-qr': form }">

            <!-- State 1: Empty placeholder before clicking Done! -->
            <div v-if=form
                class="qr-empty-state">
                <span class="qr-icon">📷</span>
                <p>The QR code will go here</p>
            </div>

            <!-- State 2: Your actual QR code component once generated -->
            <div v-else
                class="qr-active-state">
                <!-- Replace this <p> with your QR library component (e.g. <qrcode-vue :value="qrPayloadString" :size="180" />) -->
                <p class="qr-debug-text">{{ form }}</p>
            </div>

        </div>
    </div>
</template>

<style scoped>
/* Centers the entire block of inputs */
.form-container-centered {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* Centers items horizontally */
    width: 100%;
}

/* Container for each input field */
.input-group {
    margin-bottom: 1.25rem;
    width: 100%;
    max-width: 320px;
    /* Keeps them from getting too wide */
}

/* Crisp, professional label styling */
.input-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.375rem;
    text-align: left;
    /* Keeps the label text left-aligned relative to the box */
}

/* Modernized input box */
.styled-input {
    width: 100%;
    padding: 0.625rem 0.875rem;
    font-size: 0.95rem;
    color: #1f2937;
    background-color: #f9fafb;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    outline: none;
    transition: all 0.2s ease;
    box-sizing: border-box;
}

.styled-input::placeholder {
    color: #9ca3af;
}

.styled-input:hover {
    border-color: #9ca3af;
}

.styled-input:focus {
    background-color: #ffffff;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

/* Kill arrows */
.styled-input::-webkit-outer-spin-button,
.styled-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.styled-input[type=number] {
    -moz-appearance: textfield;
}

h2 {
    margin: 2rem;
}

.question-group {
    display: flex;
    justify-content: space-between;
    margin: 0.5rem 1rem;
}

.question-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    text-align: left;
}

.centered {
    display: flex;
    justify-content: center;
    align-items: center;
}

.three-state-toggle {
    display: inline-flex;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    overflow: hidden;
    background-color: #ffffff;
}

.three-state-toggle .toggle-option {
    cursor: pointer;
    user-select: none;
}

/* Hide the actual radio input */
.three-state-toggle input[type="radio"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

/* The button look */
.three-state-toggle .btn {
    display: inline-block;
    padding: 0.25rem 0.6rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #4b5563;
    background-color: #ffffff;
    transition: background-color 0.15s ease, color 0.15s ease;
    border-right: 1px solid #d1d5db;
}

.three-state-toggle .toggle-option:last-child .btn {
    border-right: none;
}

/* Hover states */
.three-state-toggle .toggle-option:hover .btn {
    background-color: #f3f4f6;
}

/* Checked States */
.three-state-toggle input[value="yes"]:checked+.btn {
    background-color: #16a34a;
    /* green */
    color: #ffffff;
}

.three-state-toggle input[value="na"]:checked+.btn {
    background-color: #4b5563;
    /* gray */
    color: #ffffff;
}

.three-state-toggle input[value="no"]:checked+.btn {
    background-color: #dc2626;
    /* red */
    color: #ffffff;
}

.option-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    border-radius: 0.375rem;
    justify-content: center;
    /* align-content: center; */
    max-width: fit-content;
}

.option-item {
    /* position: relative; */
    flex: 1 1 auto;
    min-width: 80px;
}

/* Hide the raw radio input */
.option-item input[type="radio"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

/* The button look */
.option-item .btn {
    display: block;
    /* width: 100%; */
    /* max-width: 20%; */
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-align: center;
    color: #4b5563;
    background-color: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    cursor: pointer;
    user-select: none;
    transition: all 0.15s ease;
}

/* Hover state */
.option-item .btn:hover {
    background-color: #f3f4f6;
}

/* Active/Checked State */
.option-item input[type="radio"]:checked+.btn {
    background-color: #2563eb;
    /* Primary blue (or dynamic color) */
    color: #ffffff;
    border-color: #2563eb;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.done-btn {
    display: block;
    width: 100%;
    margin-top: 1.5rem;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    text-align: center;
    color: #ffffff;
    background-color: #2563eb;
    /* Matches your active toggle blue */
    border: 1rem solid transparent;
    border-radius: 0.375rem;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s ease, box-shadow 0.15s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Hover state */
.done-btn:hover {
    background-color: #1d4ed8;
    /* Slightly darker blue on hover */
}

/* Active/Clicked press down effect */
.done-btn:active {
    background-color: #1e40af;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Disabled state (optional if you decide to disable it when invalid) */
.done-btn:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
}

/* Centers the QR section below the Done button */
.qr-placeholder-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: 100%;
}

/* Reserved fixed square so the page height never jumps */
.qr-reserved-box {
    width: 220px;
    height: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 1rem;
    background-color: #f9fafb;
    border: 2px dashed #cbd5e1;
    border-radius: 0.75rem;
    color: #64748b;
    box-sizing: border-box;
    transition: all 0.25s ease;
}

/* Switches to a solid crisp card when the QR code is generated */
.qr-reserved-box.has-qr {
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.qr-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    user-select: none;
}

.qr-icon {
    font-size: 1.5rem;
    opacity: 0.7;
}

.qr-debug-text {
    font-size: 0.75rem;
    word-break: break-all;
    color: #1e293b;
}
</style>