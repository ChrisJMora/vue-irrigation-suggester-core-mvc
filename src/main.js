import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Login from './views/Login.vue'
import Crops from './views/CropsView.vue'
import Forecasts from './views/ForecastsView.vue'
import Schedules from './views/SchedulesView.vue'
import Sensors from './views/SensorsView.vue'
import SuggestedSchedules from './views/SuggestedSchedulesView.vue'
import ReportView from './views/ReportView.vue'

const routes = [
    { path: '/login', name: 'login', component: Login},
    { path: '/agriculture/schedules/suggested', component: SuggestedSchedules},
    { path: '/agriculture/forecasts', component: Forecasts},
    { path: '/agriculture/crops', component: Crops },
    { path: '/agriculture/schedules', component: Schedules},
    { path: '/agriculture/sensors', component: Sensors},
    { path: '/agriculture/report', component: ReportView},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

createApp(App).use(router).mount('#app')