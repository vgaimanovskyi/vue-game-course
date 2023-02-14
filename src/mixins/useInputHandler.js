export const useInputHandler = {
  methods: {
    keydown(e) {
      if (
        (e.key === "ArrowUp" || e.key === "ArrowDown") &&
        !this.game.keys.includes(e.key)
      ) {
        this.game.keys.push(e.key);
      } else if (e.key === " ") {
        this.playerShootTop();
      }
    },
    keyup(e) {
      if (this.game.keys.includes(e.key)) {
        this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
      }
    },
  },
  mounted() {
    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);
  },
};
