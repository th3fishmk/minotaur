import { createRouter, createWebHistory } from 'vue-router';
import CheckList from '../components/CheckList.vue';
import ListHistory from '../views/ListHistory.vue';
import ListValidated from '../views/ListValidated.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'checklist',
            component: CheckList,
        },
        {
            path: '/validated',
            name: 'validated',
            component: ListValidated,
        },
        {
            path: '/history',
            name: 'History',
            component: ListHistory,
        },
    ],
});

export default router;
