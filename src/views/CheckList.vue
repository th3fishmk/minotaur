<script setup lang="ts">
/** biome-ignore-all lint/correctness/noUnusedVariables: <false positive> */
import { toPng } from 'html-to-image';
import { toDataURL } from 'qrcode';
import { computed, nextTick, onMounted, ref } from 'vue';
import { allQuestions } from '../data/questions';
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

const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}`;
};

// Formats compact 'yyyymmddHHmm' into 'Nov 18, 2026, 02:20 AM'
const formatFancyDate = (compactStr: string) => {
    if (compactStr?.length !== 12) return 'Loading...';

    const year = parseInt(compactStr.slice(0, 4), 10);
    const month = parseInt(compactStr.slice(4, 6), 10) - 1; // JS months are 0-indexed
    const day = parseInt(compactStr.slice(6, 8), 10);
    const hour = parseInt(compactStr.slice(8, 10), 10);
    const minute = parseInt(compactStr.slice(10, 12), 10);

    const dateObj = new Date(year, month, day, hour, minute);

    return dateObj.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};

onMounted(() => {
    form.value.date = getCurrentDate();
});

const showErrors = ref(false);
const isDateInvalid = computed(() => showErrors.value && !form.value.date);
const isNameInvalid = computed(() => showErrors.value && !form.value.name.trim());
const isIdInvalid = computed(() => showErrors.value && form.value.ID === undefined);
const isModInvalid = computed(() => showErrors.value && !form.value.mod);
const isShortIdInvalid = computed(() => showErrors.value && form.value.shortID === undefined);
const isHoursInvalid = computed(() => showErrors.value && form.value.hours === undefined);

// Check if any visualTest questions are missing an answer
const missingQuestions = computed(() => {
    return allQuestions.filter((q) => {
        const val = form.value.answers[q.id];
        return val === undefined || val === null;
    });
});

const isFormValid = computed(() => {
    const validationStatus = {
        date: Boolean(form.value.date),
        name: form.value.name.trim() !== '',
        id: form.value.ID !== undefined,
        mod: form.value.mod !== undefined,
        shortID: form.value.shortID !== undefined,
        hours: form.value.hours !== undefined,
        questions: missingQuestions.value.length === 0,
    };
    console.log('Form validation status:', validationStatus);
    return Object.values(validationStatus).every(Boolean);
});
// Converts the answers object into a super-compact string of values (e.g., "00000000001000...")
const getCompactAnswersString = () => {
    return allQuestions.map((q) => {
        const val = form.value.answers[q.id];
        return val !== undefined && val !== null ? val : '0';
    }).join('');
};

// Ultra-compact array payload
const previewPayload = computed(() => {
    return JSON.stringify([
        form.value.date,
        form.value.name,
        form.value.ID,
        form.value.mod,
        form.value.shortID,
        form.value.hours,
        getCompactAnswersString()
    ]);
});

const handleDone = async () => {
    console.log(`Toggling errors on!`);
    showErrors.value = true;
    if (!isFormValid.value) {
        qrCodeURL.value = '';
        await nextTick();
        const firstErrorElement = document.querySelector(
            '.error, .error-question-box input, input.error inline-error-text'
        ) as HTMLElement;

        if (firstErrorElement) {
            console.log(`Error at + ${firstErrorElement.parentNode?.textContent}`);

            firstErrorElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            firstErrorElement.focus();
        }
        return;
    }
    console.log('Form is valid! Proceeding with data...', form.value);
    console.log(`Final payload: ${previewPayload.value}`);

    try {
        qrCodeURL.value = await toDataURL(appUrlWithPayload.value, {
            errorCorrectionLevel: 'M',
            margin: 2,
            width: 380,
            color: {
                dark: '#0f172a',
                light: '#ffffff',
            },
        });
        await nextTick();
        const qrContainer = document.getElementById('qr-output-container');
        if (qrContainer) {
            qrContainer.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    } catch (err) {
        console.error('Failed to generate qr code: ', err)
    }


    const existingHistoryJson = localStorage.getItem('history_inspections');
    const existingHistory = existingHistoryJson ? JSON.parse(existingHistoryJson) : [];
    const updatedHistory = [form.value, ...existingHistory];
    localStorage.setItem('history_inspections', JSON.stringify(updatedHistory));

    console.log('Inspection record successfully saved to history!');

};

const qrCodeURL = ref<string>('');

const appUrlWithPayload = computed(() => {
    // Strips away any active hashes (#/history, #/) to get the pure base app URL
    const cleanBase = window.location.href.split('#')[0];
    const encodedPayload = encodeURIComponent(previewPayload.value);

    return `${cleanBase}#/validated?data=${encodedPayload}`;
});

const cardRef = ref<HTMLElement | null>(null);
const downloadCardImage = async () => {
    if (!cardRef.value) return;

    try {
        // Convert the HTML card element into a high-quality PNG data URL
        const dataUrl = await toPng(cardRef.value, { cacheBust: true });

        // Create a temporary link to trigger the file download
        const link = document.createElement('a');
        link.download = `inspection-card-${form.value.ID || 'report'}-${form.value.date}.png`;
        link.href = dataUrl;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (err) {
        console.error('Failed to download inspection card image:', err);
    }
};

</script>

<template>
    <div class="checklist-wrapper">
        <h1>
            Check list de equipo de carga
        </h1>

        <form @submit.prevent="handleDone"
            class="form-container">
            <div class="form-container-centered">
                <div class="input-group">
                    <span> Date: <strong>{{ formatFancyDate(form.date) }}</strong></span>
                </div>
                <div class="input-group">
                    <label class="input-label">Name</label>
                    <input :class="{ error: isNameInvalid }"
                        type="text"
                        v-model="form.name"
                        placeholder="E.g. Juan Pérez"
                        class="styled-input">
                </div>
                <div class="input-group">
                    <label class="input-label">ID</label>
                    <input type="number"
                        :class="{ error: isIdInvalid }"
                        v-model="form.ID"
                        placeholder="Eg 7275379"
                        class="styled-input">
                </div>
            </div>

            <div class="form-container-centered">
                <div>
                    <label class="input-label">Selecciona tu tipo de montacargas</label>
                    <span v-if="showErrors && isModInvalid">
                        ⚠️ Por favor selecciona una opción
                    </span>
                    <div class="input-group"
                        :class="{ 'error-question-box': isModInvalid }">
                        <div class="option-group">
                            <label class="
                            option-item"
                                v-for="m in Models"
                                :key="m.value">
                                <input type="radio"
                                    v-model="form.mod"
                                    :value="m.value"
                                    name="equipment-model">
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
                    <input input
                        :class="{ error: isShortIdInvalid }"
                        type="number"
                        v-model="form.shortID"
                        placeholder="eg 1894"
                        class="styled-input">
                </div>
                <div class="input-group">
                    <label class="input-label">Horómetro</label>
                    <input :class="{ error: isHoursInvalid }"
                        type="number"
                        v-model="form.hours"
                        placeholder="hours"
                        class="styled-input">
                </div>
            </div>
            <br>

            <h2>Check list visual</h2>
            <div v-for="q in allQuestions"
                :key="'visual-' + q.id">
                <div v-if="q.eval == 'visual'">
                    <span v-if="showErrors && missingQuestions.some(m => m.id === q.id)"
                        class="inline-error-text error">
                        ⚠️ Por favor, selecciona una opción
                    </span>
                    <div class="question-group">
                        <div class="question-text">
                            <b>{{ q.text }}</b>
                            <small>{{ q.description }}</small>
                        </div>
                        <div class="centered">
                            <div class="three-state-toggle">
                                <label class="toggle-option">
                                    <input type="radio"
                                        :name="'q-' + q.id"
                                        :value="0"
                                        v-model="form.answers[q.id]">
                                    <span class="btn check">✓</span>
                                </label>
                                <label class="toggle-option">
                                    <input type="radio"
                                        :name="'q-' + q.id"
                                        :value="1"
                                        v-model="form.answers[q.id]">
                                    <span class="btn na">N/A</span>
                                </label>
                                <label class="toggle-option">
                                    <input type="radio"
                                        :name="'q-' + q.id"
                                        :value="2"
                                        v-model="form.answers[q.id]">
                                    <span class="btn cross">✕</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <h2>Check list operacional</h2>
            <div v-for="q in allQuestions"
                :key="'field-' + q.id">
                <div v-if="q.eval == 'field'">
                    <span v-if="showErrors && missingQuestions.some(m => m.id === q.id)"
                        class="inline-error-text error">
                        ⚠️ Por favor, selecciona una opción
                    </span>
                    <div class="question-group">
                        <div class="question-text">
                            <b>{{ q.text }}</b>
                            <small>{{ q.description }}</small>
                        </div>
                        <div class="centered">
                            <div class="three-state-toggle">
                                <label class="toggle-option">
                                    <input type="radio"
                                        :name="'q-' + q.id"
                                        :value="0"
                                        v-model="form.answers[q.id]">
                                    <span class="btn check">✓</span>
                                </label>
                                <label class="toggle-option">
                                    <input type="radio"
                                        :name="'q-' + q.id"
                                        :value="1"
                                        v-model="form.answers[q.id]">
                                    <span class="btn na">N/A</span>
                                </label>
                                <label class="toggle-option">
                                    <input type="radio"
                                        :name="'q-' + q.id"
                                        :value="2"
                                        v-model="form.answers[q.id]">
                                    <span class="btn cross">✕</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-container-centered">
                <div class="input-group">
                    <button type="submit"
                        class="done-btn">
                        Done!
                    </button>
                </div>
            </div>

        </form>
    </div>

    <div class="data-preview-container">
        <h4> Raw Payload Preview (Array Format)</h4>
        <pre class="preview-code"><code>{{ previewPayload }}</code></pre>
        <pre class="preview-code"><code>{{ appUrlWithPayload }}</code></pre>
    </div>

    <div v-if="qrCodeURL"
        ref="cardRef"
        id="qr-output-section"
        class="qr-result-card">

        <div class="qr-header">
            <h3>{{ form.name }}</h3>
            <span class="badge-id">ID: {{ form.ID }}</span>
        </div>

        <div class="qr-image-container">
            <img :src="qrCodeURL"
                alt="Generated Form QR Code"
                class="qr-image" />
        </div>

        <div class="qr-details-grid">
            <div class="detail-item">
                <span class="label">Model:</span>
                <span class="value">{{ form.mod }}</span>
            </div>
            <div class="detail-item">
                <span class="label">Short ID:</span>
                <span class="value">{{ form.shortID }}</span>
            </div>
            <div class="detail-item">
                <span class="label">Hours:</span>
                <span class="value">{{ form.hours }}h</span>
            </div>
            <div class="detail-item">
                <span class="label">Timestamp:</span>
                <span class="value">{{ formatFancyDate(form.date) }}</span>
            </div>
        </div>
        <button @click="downloadCardImage"
            class="download-btn">
            Save image
        </button>

        <p class="qr-meta">Deep-link payload size: {{ appUrlWithPayload.length }} chars (Array format)</p>
    </div>
</template>

<style scoped>
.download-btn {
    width: 100%;
    background-color: #0284c7;
    color: white;
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 1rem;
    transition: background-color 0.2s;
}

.download-btn:hover {
    background-color: #0369a1;
}

.qr-result-card {
    margin-top: 2rem;
    padding: 1.75rem;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 12px;
    text-align: center;
    color: #0f172a;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
}

.qr-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 0.75rem;
    margin-bottom: 1rem;
}

.qr-header h3 {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 700;
    color: #1e293b;
}

.badge-id {
    background-color: #f1f5f9;
    color: #475569;
    padding: 0.25rem 0.6rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    font-family: monospace;
}

.qr-image-container {
    background: #f8fafc;
    border: 1px dashed #cbd5e1;
    border-radius: 8px;
    padding: 1rem;
    display: inline-block;
    margin-bottom: 1rem;
}

.qr-image {
    display: block;
    margin: 0 auto;
    max-width: 100%;
    height: auto;
}

.qr-details-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem 1rem;
    background: #f8fafc;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    text-align: left;
    margin-bottom: 1rem;
    font-size: 0.85rem;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}

.detail-item .label {
    color: #64748b;
}

.detail-item .value {
    font-weight: 600;
    color: #0f172a;
}

.qr-meta {
    margin: 0;
    font-size: 0.75rem;
    color: #94a3b8;
    font-family: monospace;
}

.data-preview-container {
    background-color: #1e293b;
    color: #38bdf8;
    padding: 1rem;
    border-radius: 6px;
    margin: 1.5rem 0;
    font-family: monospace;
    font-size: 0.8rem;
}

.data-preview-container h4 {
    margin: 0 0 0.5rem 0;
    color: #e2e8f0;
    font-size: 0.85rem;
    font-family: inherit;
}

.preview-code {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
}

.system-date-banner {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    font-size: 0.875rem;
    color: #475569;
    margin-bottom: 1.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.error-question-box {
    border: 2px solid #ef4444;
    background-color: #fef2f2;
    border-radius: 6px;
    padding: 8px;
}

.inline-error-text {
    display: block;
    color: #ef4444;
    font-size: 0.75rem;
    font-weight: bold;
    margin-top: 4px;
}

.error-banner {
    background-color: #fee2e2;
    border: 1px solid #ef4444;
    color: #991b1b;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 1rem;
    font-size: 0.875rem;
}

input.error {
    border-color: #ef4444 !important;
    background-color: #fef2f2;
}

.error-banner {
    color: #ef4444;
    font-weight: 600;
    font-size: 0.875rem;
}

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

.three-state-toggle input[value="0"]:checked+.btn {
    background-color: #16a34a;
    color: #ffffff;
}

.three-state-toggle input[value="1"]:checked+.btn {
    background-color: #4b5563;
    color: #ffffff;
}

.three-state-toggle input[value="2"]:checked+.btn {
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