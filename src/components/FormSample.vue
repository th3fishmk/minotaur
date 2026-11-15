<script setup lang="ts">
import { ref } from 'vue';
import { visualTest } from '../data/questions';
import { type ForkLiftType, type FormDState, Models } from '../types';

const form = ref<FormDState>({
    name: '',
    ID: 0,
    mod: undefined,
    visualQ: {},
});

const selectedModel = ref<ForkLiftType>(undefined);

const handleVisualQ = (questionId: string, value: number) => {
    form.value.visualQ[questionId] = value;
};
</script>

<template>
    <br>
    <div class="space-y-4">
        <!-- personal info -->
        <div>
            <label class="block text-sm">Whats your name </label>
            <input type="text" v-model="form.name" placeholder="Enter your name" >
        </div>
        <div>
            <label >What's your employee id </label>
            <input type="number" v-model="form.ID" >
        </div>
    </div>
    <br>
    <span>Please select your equipment model</span>
    <div class="option-group">
      <label class="option-item" v-for="m in Models" :key="m.value">
        <input type="radio" v-model="form.mod" :value="m.value" :name="m.value" required>
        <span class="btn">{{ m.label }}</span>
      </label>
    </div>
    <br>
    <span>Visual</span>
    <div v-for="q in visualTest" :key="q.id">
        {{ q.text }}
        <div class="three-state-toggle">
            <label class="toggle-option">
                <input type="radio" :name="q.id" value="yes" @click="handleVisualQ(q.id, 0)">
                <span class="btn check">✓</span>
            </label>
            <label class="toggle-option">
                <input type="radio" :name="q.id" value="na" @click="handleVisualQ(q.id, 1)">
                <span class="btn na">N/A</span>
            </label>
            <label class="toggle-option">
                <input type="radio" :name="q.id" value="no" @click="handleVisualQ(q.id, 2)">
                <span class="btn cross">✕</span>
            </label>
        </div>
    </div>
    <br>
    <span>results:</span>
    <div>
      <code> {{ JSON.stringify(form) }} </code>
    </div>
</template>

<style scoped>
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
.three-state-toggle input[value="yes"]:checked + .btn {
  background-color: #16a34a; /* green */
  color: #ffffff;
}

.three-state-toggle input[value="na"]:checked + .btn {
  background-color: #4b5563; /* gray */
  color: #ffffff;
}

.three-state-toggle input[value="no"]:checked + .btn {
  background-color: #dc2626; /* red */
  color: #ffffff;
}

.option-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem; /* space between buttons */
  border-radius: 0.375rem;
}

.option-item {
  position: relative;
  flex: 1; /* Makes buttons grow to share the space equally */
  min-width: 80px; /* Ensures buttons don't get too squished */
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
  width: 100%;
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
.option-item input[type="radio"]:checked + .btn {
  background-color: #2563eb; /* Primary blue (or dynamic color) */
  color: #ffffff;
  border-color: #2563eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
</style>