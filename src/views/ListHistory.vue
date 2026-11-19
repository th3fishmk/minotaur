<template>
    <div class="page-container">
        <div class="header-section">
            <h2>Historial de checklists</h2>
            <p class="subtitle"> Los checks que hayas realizado
            </p>
        </div>

        <div v-if="historyRecords.length === 0"
            class="empty-state">
            <p>Aún no has hecho ningún check list!</p>
        </div>

        <div v-else
            class="table-container">
            <table class="history-table">
                <thead>
                    <tr>
                        <th class="actions-col">Actions</th>
                        <th>Date / Timestamp</th>
                        <th>Asociado</th>
                        <th>Numero</th>
                        <th>Model</th>
                        <th>Equipo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(record, index) in sortedHistory"
                        :key="index">
                        <td class="actions-col">
                            <button @click="openModal(record)"
                                class="view-btn">View</button>
                        </td>
                        <td>{{ formatFancyDate(record.date) }}</td>
                        <td class="font-bold">{{ record.name }}</td>
                        <td class="font-mono">{{ record.ID }}</td>
                        <td><span class="badge-mod">{{ record.mod }}</span></td>
                        <td class="font-mono">{{ record.shortID }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <Teleport to="body">

            <div v-if="showModal && activeRecord"
                class="modal-backdrop"
                @click.self="closeModal">
                <div class="modal-card">

                    <div class="modal-header">
                        <h3>Detalles del checklist</h3>
                        <button @click="closeModal"
                            class="close-x-btn"
                            aria-label="Close modal">&times;</button>
                    </div>

                    <div class="report-meta-grid">
                        <div class="meta-item">
                            <span class="label">Nombre del asociado</span>
                            <span class="value">{{ activeRecord.name }}</span>
                        </div>
                        <div class="meta-item">
                            <span class="label">Numero de asociado</span>
                            <span class="value font-mono">{{ activeRecord.ID }}</span>
                        </div>
                        <div class="meta-item">
                            <span class="label">Tipo</span>
                            <span class="value">{{ activeRecord.mod }}</span>
                        </div>
                        <div class="meta-item">
                            <span class="label">Numero económico</span>
                            <span class="value font-mono">{{ activeRecord.shortID }}</span>
                        </div>
                        <div class="meta-item">
                            <span class="label">Horas operadas</span>
                            <span class="value">{{ activeRecord.hours }}h</span>
                        </div>
                        <div class="meta-item">
                            <span class="label">Fecha y hora</span>
                            <span class="value">{{ formatFancyDate(activeRecord.date) }}</span>
                        </div>
                    </div>

                    <div v-if="activeRecord"
                        class="questions-breakdown">
                        <h4>Visual Test Questionnaire Results</h4>
                        <div class="questions-list">
                            <div v-for="(val, qKey) in activeRecord.answers"
                                :key="qKey"
                                class="question-row"
                                :class="{
                                    'passed': val === 0,
                                    'na': val === 1,
                                    'failed': val === 2,
                                }">
                                <span class="q-text"><strong>Q{{ qKey }}:</strong> {{ getQuestionText(qKey) }}</span>
                                <span class="q-status">{{ fancyAnswer(val) }}</span>
                            </div>
                        </div>
                    </div>
                    <code>{{ activeRecord }}</code>
                    <div class="modal-actions">
                        <button @click="recreateQR"
                            class="qr-action-btn">Re-create QR Code</button>
                        <button @click="closeModal"
                            class="reset-btn">Close Report</button>
                    </div>

                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { allQuestions } from '../data/questions';
import type { FormDState } from '../types';
import { useRouter } from 'vue-router';

const showModal = ref(false);
const activeRecord = ref<FormDState | undefined>();

const getQuestionText = (qKey: string | number) => {
    const found = allQuestions.find((q: any) => String(q.id) === String(qKey));
    return found ? found.text : `Question ${qKey}`;
};

const historyRecords = ref<FormDState[]>([]);

onMounted(() => {
    const saved = localStorage.getItem('history_inspections');
    if (saved) {
        try {
            const rawParsed = JSON.parse(saved);

            // Map and validate each record against FormDState
            historyRecords.value = Array.isArray(rawParsed)
                ? rawParsed.map((item: any) => ({
                    date: item.date || '',
                    name: item.name || '',
                    ID: item.ID !== undefined ? Number(item.ID) : undefined,
                    mod: item.mod || '',
                    shortID: item.shortID !== undefined ? Number(item.shortID) : undefined,
                    hours: item.hours !== undefined ? Number(item.hours) : undefined,
                    // Ensure answers is always a Record<string, number> dictionary
                    answers: typeof item.answers === 'object' && item.answers !== null ? item.answers : {}
                }))
                : [];
        } catch (e) {
            console.error('Failed to parse history storage:', e);
            historyRecords.value = [];
        }
    }
});

const fancyAnswer = (resp: number) => {
    if (resp === 0) {
        return 'Bien'
    } else if (resp === 1) {
        return 'No aplica'
    } else if (resp === 2) {
        return 'Mal'
    } else {
        return 'Unknown'
    }
}
// Multi-level sorting: Date (descending) -> shortID (ascending) -> Name (alphabetical)
const sortedHistory = computed(() => {
    return [...historyRecords.value].sort((a, b) => {
        // 1. Sort by Date descending (newest first)
        const dateA = a.date || '';
        const dateB = b.date || '';
        if (dateA !== dateB) {
            return dateB.localeCompare(dateA);
        }

        // 2. Sort by Short ID ascending
        const shortIdA = Number(a.shortID) || 0;
        const shortIdB = Number(b.shortID) || 0;
        if (shortIdA !== shortIdB) {
            return shortIdA - shortIdB;
        }

        // 3. Sort by Name alphabetically
        const nameA = a.name || '';
        const nameB = b.name || '';
        return nameA.localeCompare(nameB);
    });
});

// Format compact yyyymmddHHmm date string
const formatFancyDate = (compactStr: string) => {
    if (!compactStr || compactStr.length !== 12) return compactStr || 'N/A';
    const year = parseInt(compactStr.slice(0, 4), 10);
    const month = parseInt(compactStr.slice(4, 6), 10) - 1;
    const day = parseInt(compactStr.slice(6, 8), 10);
    const hour = parseInt(compactStr.slice(8, 10), 10);
    const minute = parseInt(compactStr.slice(10, 12), 10);

    const dateObj = new Date(year, month, day, hour, minute);
    return isNaN(dateObj.getTime()) ? compactStr : dateObj.toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    });
};

const openModal = (record: any) => {
    activeRecord.value = record;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    activeRecord.value = undefined;
};

const router = useRouter();
// ... existing refs and onMounted ...

const recreateQR = () => {
    if (!activeRecord.value) return;

    // 1. Rebuild the compact answers string from the answers dictionary
    const answersStr = allQuestions.map(q => {
        const val = activeRecord.value?.answers[q.id];
        return val !== undefined ? val : 0;
    }).join('');

    // 2. Build the compact array payload
    const payloadArray = [
        activeRecord.value.date,
        activeRecord.value.name,
        activeRecord.value.ID,
        activeRecord.value.mod,
        activeRecord.value.shortID,
        activeRecord.value.hours,
        answersStr
    ];

    // 3. Encode and navigate to Home with the data query
    const encodedData = JSON.stringify(payloadArray);
    router.push({ path: '/', query: { data: encodedData } });
};
</script>

<style scoped>
.page-container {
    max-width: 900px;
    margin: 2rem auto;
    padding: 0 1rem;
    color: #0f172a;
}

.header-section {
    margin-bottom: 1.5rem;
}

.subtitle {
    color: #64748b;
    font-size: 0.9rem;
    margin-top: 0.25rem;
}

.empty-state {
    text-align: center;
    padding: 3rem;
    background: #f8fafc;
    border: 1px dashed #cbd5e1;
    border-radius: 8px;
    color: #64748b;
}

.page-container {
    max-width: 900px;
    margin: 1.5rem auto;
    padding: 0 0.75rem;
    color: #0f172a;
    width: 100%;
    /* Ensure it fills the screen width */
    box-sizing: border-box;
    /* Include padding in width calculations */
}

.table-container {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    overflow-x: auto;
    width: 100%;
    /* Prevent stretching past parent */
    box-sizing: border-box;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.history-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 0.85rem;
    /* Slightly tighter text for mobile views */
    white-space: nowrap;
    /* Keep table cells from wrapping awkwardly until scrolled */
}

.history-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 0.9rem;
}

.history-table th {
    background: #f8fafc;
    color: #475569;
    font-weight: 600;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid #e2e8f0;
}

.history-table td {
    padding: 0.85rem 1rem;
    border-bottom: 1px solid #f1f5f9;
    color: #1e293b;
}

.history-table tr:last-child td {
    border-bottom: none;
}

.font-bold {
    font-weight: 600;
}

.font-mono {
    font-family: monospace;
}

.badge-mod {
    background: #f1f5f9;
    color: #334155;
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 600;
}

.actions-col {
    text-align: right;
}

.view-btn {
    background: #f1f5f9;
    color: #0284c7;
    border: 1px solid #cbd5e1;
    padding: 0.35rem 0.75rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.2s;
}

.view-btn:hover {
    background: #0284c7;
    color: white;
    border-color: #0284c7;
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 64px;
    /* 👈 Match your bottom navbar's exact height (e.g. 60px–70px) */
    background-color: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 900;
    padding: 1rem;
    box-sizing: border-box;
}

.modal-card {
    background: #ffffff;
    width: 100%;
    max-width: 600px;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    max-height: 100%;
    /* 👈 Fits inside the remaining space above the navbar */
    overflow-y: auto;
    box-sizing: border-box;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #f1f5f9;
    padding-bottom: 0.75rem;
    margin-bottom: 1.25rem;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 700;
}

.close-x-btn {
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #64748b;
    line-height: 1;
}

.report-meta-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.85rem;
    background: #f8fafc;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.25rem;
}

.meta-item {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}

.meta-item .label {
    font-size: 0.7rem;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.meta-item .value {
    font-size: 0.9rem;
    font-weight: 600;
    color: #1e293b;
}

.questions-breakdown h4 {
    margin: 0 0 0.75rem 0;
    font-size: 0.9rem;
    color: #334155;
}

.questions-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    /* max-height: 220px; */
    overflow-y: auto;
    background: #f8fafc;
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}

.question-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.4rem 0.75rem;
    background: #ffffff;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    font-size: 0.85rem;
}

.question-row.passed .q-status {
    color: #166534;
    font-weight: 600;
}

.question-row.failed .q-status {
    color: #991b1b;
    font-weight: 600;
}

.question-row.na .q-status {
    color: #64748b;
    font-weight: 500;
    font-style: italic;
}

.reset-btn {
    width: 100%;
    background-color: #0f172a;
    color: white;
    border: none;
    padding: 0.65rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 1.25rem;
}

.reset-btn:hover {
    background-color: #1e293b;
}

.modal-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.25rem;
}

.qr-action-btn {
    flex: 1;
    background-color: #0284c7;
    color: white;
    border: none;
    padding: 0.65rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
}

.qr-action-btn:hover {
    background-color: #0369a1;
}

/* Adjust reset-btn to fit next to it */
.reset-btn {
    flex: 1;
    background-color: #f1f5f9;
    color: #334155;
    border: 1px solid #cbd5e1;
    padding: 0.65rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 0;
    /* Override previous margin */
}

.reset-btn:hover {
    background-color: #e2e8f0;
}
</style>