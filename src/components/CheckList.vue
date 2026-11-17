<script setup lang="ts">
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
const errorMessage = ref('');

const answersValidity = computed(() => {
    let missing = visualTest.filter((q) =>
        form.value.answers[q.id] === undefined || form.value.answers[q.id] === null
    );
    missing.forEach(x => {
        console.log(x);
    })
    return missing.length === 0;
})

const handleDone = () => {
    if (answersValidity.value) {
        console.log('Valid');
    } else {
        console.log('Invalid');
    }
    if (!answersValidity.value) {
        errorMessage.value = 'Please fill all the field and answer all the questions';
        return;
    }
    errorMessage.value = '';
};

</script>
<template>
    <div class="checklist-wrapper">
        <h1>
            Check list de equipo de carga
        </h1>

        <!-- Personal info -->
        <form @submit.prevent="handleDone"
            class="form-container">
            <div class="form-container-centered">
                <div class="input-group">
                    <label class="input-label">Ingresa tu nombre</label>
                    <input required
                        type="text"
                        v-model="form.name"
                        placeholder="E.g. Juan Pérez"
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
                <div>
                    <label class="input-label">Selecciona tu equipo de carga</label>
                    <div class="input-group">
                        <div class="option-group">
                            <label class="option-item"
                                v-for="m in Models"
                                :key="m.value">
                                <!-- Fixed name so radios group correctly -->
                                <input type="radio"
                                    v-model="form.mod"
                                    :value="m.value"
                                    name="equipment-model"
                                    required>
                                <span class="btn">{{ m.label }}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <br>

            <div class="form-container-centered">
                <div class="input-group">
                    <label class="input-label">Número económico</label>
                    <input type="number"
                        v-model="form.shortID"
                        placeholder="eg 1894"
                        class="styled-input"
                        required>
                </div>
                <div class="input-group">
                    <label class="input-label">Horómetro</label>
                    <input type="number"
                        v-model="form.hours"
                        placeholder="hours"
                        class="styled-input"
                        required>
                </div>
            </div>
            <br>

            <!-- Questions: Visual Test -->
            <h2>Check list visual</h2>
            <div v-for="q in visualTest"
                :key="'visual-' + q.id">
                <div class="question-group"
                    v-if="q.eval == 'visual'">
                    <div class="question-text">
                        <b>{{ q.text }}</b>
                        <small>{{ q.description }}</small>
                    </div>
                    <div class="centered">
                        <div class="three-state-toggle">
                            <label class="toggle-option">
                                <input type="radio"
                                    :name="'q-' + q.id"
                                    value="yes"
                                    @change="handleVisualQ(q.id, 0)">
                                <span class="btn check">✓</span>
                            </label>
                            <label class="toggle-option">
                                <input type="radio"
                                    :name="'q-' + q.id"
                                    value="na"
                                    @change="handleVisualQ(q.id, 1)">
                                <span class="btn na">N/A</span>
                            </label>
                            <label class="toggle-option">
                                <input type="radio"
                                    :name="'q-' + q.id"
                                    value="no"
                                    @change="handleVisualQ(q.id, 2)">
                                <span class="btn cross">✕</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Questions: Field / Operational Test -->
            <h2>Check list operacional</h2>
            <div v-for="q in visualTest"
                :key="'field-' + q.id">
                <div class="question-group"
                    v-if="q.eval == 'field'">
                    <div class="question-text">
                        <b>{{ q.text }}</b>
                        <small>{{ q.description }}</small>
                    </div>
                    <div class="centered">
                        <div class="three-state-toggle">
                            <label class="toggle-option">
                                <input type="radio"
                                    :name="'q-' + q.id"
                                    value="yes"
                                    @change="handleVisualQ(q.id, 0)">
                                <span class="btn check">✓</span>
                            </label>
                            <label class="toggle-option">
                                <input type="radio"
                                    :name="'q-' + q.id"
                                    value="na"
                                    @change="handleVisualQ(q.id, 1)">
                                <span class="btn na">N/A</span>
                            </label>
                            <label class="toggle-option">
                                <input type="radio"
                                    :name="'q-' + q.id"
                                    value="no"
                                    @change="handleVisualQ(q.id, 2)">
                                <span class="btn cross">✕</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Submit Button (Fixed invalid wrapping label) -->
            <div class="form-container-centered">
                <div class="input-group">
                    <button type="submit"
                        class="done-btn">
                        Done!
                    </button>
                </div>
            </div>
        </form>

        <br>

        <!-- QR Placeholder (Fixed v-if toggle logic) -->
        <!-- <div class="qr-placeholder-wrapper">
            <div class="qr-reserved-box">
                <div v-if="!isSubmitted"
                    class="qr-empty-state">
                    <span class="qr-icon">📷</span>
                    <p>The QR code will go here</p>
                </div>
                <div v-else
                    class="qr-active-state">
                    <p class="qr-debug-text">{{ JSON.stringify(form) }}</p>
                </div>
            </div>
        </div> -->
    </div>
</template>

<style scoped>
.form-container-centered {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

h1,
h2 {
    margin: 2rem;
}

.centered {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Standard Input Groups */
.input-group {
    margin-bottom: 1.25rem;
    width: 100%;
    max-width: 320px;
}

.input-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.375rem;
    text-align: left;
}

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

/* Hide spin arrows for number inputs */
.styled-input::-webkit-outer-spin-button,
.styled-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.styled-input[type=number] {
    -moz-appearance: textfield;
}

/* Question Row Layout */
.question-group {
    display: flex;
    justify-content: space-between;
    margin: 0.5rem 1rem;
    gap: 10px;
}

.question-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    text-align: left;
}

/* Three-State Toggle Component */
.three-state-toggle {
    display: inline-flex;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    overflow: hidden;
    background-color: #ffffff;
}

.three-state-toggle .toggle-option {
    position: relative;
    cursor: pointer;
    user-select: none;
}

.three-state-toggle input[type="radio"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
}

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

.three-state-toggle .toggle-option:hover .btn {
    background-color: #f3f4f6;
}

.three-state-toggle input[value="yes"]:checked+.btn {
    background-color: #16a34a;
    color: #ffffff;
}

.three-state-toggle input[value="na"]:checked+.btn {
    background-color: #4b5563;
    color: #ffffff;
}

.three-state-toggle input[value="no"]:checked+.btn {
    background-color: #dc2626;
    color: #ffffff;
}

.three-state-toggle input[type="radio"]:focus-visible+.btn {
    outline: 2px solid #2563eb;
    outline-offset: -2px;
    position: relative;
    z-index: 1;
}

/* Option Group Component (Buttons) */
.option-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    border-radius: 0.375rem;
    justify-content: center;
    max-width: fit-content;
}

.option-item {
    position: relative;
    flex: 1 1 auto;
    min-width: 80px;
}

.option-item input[type="radio"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
}

.option-item .btn {
    display: block;
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

.option-item input[type="radio"]:not(:checked)+.btn:hover {
    background-color: #dbeafe;
    /* Blue-150 */
    border-color: #3b82f6;
    /* Blue-500 */
    color: #1e3a8a;
}

.option-item input[type="radio"]:checked+.btn {
    background-color: #2563eb;
    color: #ffffff;
    border-color: #2563eb;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.option-item input[type="radio"]:checked+.btn:hover {
    background-color: #1d4ed8;
    border-color: #1d4ed8;
}

.option-item input[type="radio"]:focus-visible+.btn {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
    border-color: #2563eb;
}

/* Action Button */
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
    border: 1px solid transparent;
    border-radius: 0.375rem;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s ease, box-shadow 0.15s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.done-btn:hover {
    background-color: #1d4ed8;
}

.done-btn:active {
    background-color: #1e40af;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
}

.done-btn:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
}
</style>