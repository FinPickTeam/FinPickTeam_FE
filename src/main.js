import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { setupCalendar } from 'v-calendar';

import App from './App.vue';
import router from './router';
import './assets/main.css';
import 'v-calendar/style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(setupCalendar, { componentPrefix: 'V' });
app.use(pinia);
app.use(router);

app.mount('#app');
