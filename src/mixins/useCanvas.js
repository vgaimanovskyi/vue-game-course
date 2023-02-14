export const useCanvas = {
  data() {
    return {
      canvas: null,
      ctx: null,
    };
  },
  methods: {
    initCanvas() {
      this.canvas = this.$refs.canvas;
      this.canvas.width = 1024;
      this.canvas.height = 768;
      this.ctx = this.canvas.getContext("2d");
    },
  },
  mounted() {
    this.initCanvas();
  },
};
