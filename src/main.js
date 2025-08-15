import { createApp } from 'vue';
import { createPinia } from 'pinia';

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue';
import router from './router';
import './assets/main.css';
import './assets/overrides.css';
import 'v-calendar/style.css';

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate); // ★ Pinia 영구 저장 플러그인 연결

app.use(pinia);
app.use(router);

app.mount('#app');
