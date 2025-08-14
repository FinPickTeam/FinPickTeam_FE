// src/composables/useSelectDelete.js
import { ref } from 'vue';

export function useSelectDelete() {
  const isDeleteMode = ref(false);
  const selected = ref([]);
  const showModal = ref(false);

  const toggleMode = () => {
    isDeleteMode.value = !isDeleteMode.value;
    selected.value = [];
  };
  const toggleSelect = (item) => {
    const i = selected.value.indexOf(item);
    i > -1 ? selected.value.splice(i, 1) : selected.value.push(item);
  };
  const openConfirm = () => {
    if (selected.value.length) showModal.value = true;
  };
  const closeConfirm = () => {
    showModal.value = false;
  };

  return {
    isDeleteMode,
    selected,
    showModal,
    toggleMode,
    toggleSelect,
    openConfirm,
    closeConfirm,
  };
}
