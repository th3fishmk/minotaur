<script setup lang="ts">
/** biome-ignore-all lint/correctness/noUnusedImports: too many false positives */
/** biome-ignore-all lint/correctness/noUnusedVariables: <same thing> */
import { ref } from 'vue';
import { visualTest } from '../data/questions';
import { type ForkLiftType, type FormDState, Models } from '../types';

const form = ref<FormDState>({
    // personal
    date: '',
    name: '',
    ID: undefined,
    // equipment
    mod: undefined,
    hours: undefined,
    shortID: undefined,

    answers: {},
});
const selectedModel = ref<ForkLiftType>(undefined);
const handleVisualQ = (questionId: string, value: number) => {
    form.value.answers[questionId] = value;
};
</script>

<template>
    <br>
    <!-- Personal info -->
    <div class="space-y-4">
        <div>
            <label class="block text-sm">Whats your name </label>
            <br>
            <input type="text"
                v-model="form.name"
                placeholder="Enter your name">
        </div>
        <div>
            <label>ID </label>
            <br>
            <input type="number"
                v-model="form.ID"
                required>
        </div>
    </div>
    <br>
    <!-- Equipment info -->
    <div>
        <span>Please select your equipment model</span>
        <div class="centered">
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
        <br>
        <div>
            <label>Hours</label>
            <br>
            <input type="number"
                v-model="form.hours"
                required>
        </div>
    </div>
    <br>
    <!-- Questions -->
     <h2>
         Check list visual
     </h2>
    <div  v-for="q in visualTest" :key="q.id">
        <div class="question-group" v-if="q.eval=='visual'">
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
    <div  v-for="q in visualTest" :key="q.id">
        <div class="question-group" v-if="q.eval=='field'">
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
    <br>
    {{ JSON.stringify(form) }}
</template>

<style scoped>
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
</style>