import { ref, onMounted } from "vue";

export function useCanvas() {
  const canvas = ref(null);
  const context = ref(null);

  onMounted(() => {
    canvas.value.width = 1000;
    canvas.value.height = 500;
    context.value = canvas.value.getContext("2d");
  });

  return { canvas, context };
}
