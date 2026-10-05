<script>
export default {
  name: "NewGame",
  data() {
    return {
      opacity: 0,
      visible: false,
      hasMoreCosmetics: false,
      selectedSetName: "",
    };
  },
  computed: {
    style() {
      return {
        opacity: this.opacity,
        visibility: this.visible ? "visible" : "hidden",
      };
    }
  },
  methods: {
    update() {
      this.visible = GameEnd.endState > END_STATE_MARKERS.SHOW_NEW_GAME && !GameEnd.removeAdditionalEnd;
      this.opacity = (GameEnd.endState - END_STATE_MARKERS.SHOW_NEW_GAME) * 2;
      this.hasMoreCosmetics = GlyphAppearanceHandler.lockedSets.length > 0;
      this.selectedSetName = GlyphAppearanceHandler.chosenFromModal?.name ?? "None (will choose randomly)";
    },
    continueBeyond() {
      NG.continueBeyond();
    },
    openSelectionModal() {
      Modal.cosmeticSetChoice.show();
    }
  }
};
</script>

<template>
  <div
    class="c-new-game-container"
    :style="style"
  >
    <h2>
      {{ Localization.text("You have reached the end of Antimatter Dimensions.", "Antimatter Dimensionsの終点に到達しました。") }}
    </h2>
    <h3>
      {{ Localization.text(
        "Continue beyond the ending without resetting. Your completed Pelle state, resources, upgrades, and progress will be preserved.",
        "リセットせずにエンディングの先へ進みます。Pelleの完了状態、資源、アップグレード、進行状況はそのまま保持されます。"
      ) }}
    </h3>
    <h3>
      {{ Localization.text(
        "You can use the button in the top-right to view the completed game before continuing.",
        "続行前に右上のボタンからクリア後のゲーム状態を確認できます。"
      ) }}
    </h3>
    <div class="c-new-game-button-container">
      <button
        class="c-new-game-button"
        @click="continueBeyond"
      >
        {{ Localization.text("Continue Beyond", "Beyondへ進む") }}
      </button>
    </div>
    <br>
    <h3 v-if="hasMoreCosmetics">
      {{ Localization.text(
        "For completing the game, you also unlock a new cosmetic set of your choice for Glyphs. These are freely modifiable once you reach Reality again, but are purely visual and offer no gameplay bonuses.",
        "ゲームクリア報酬として、グリフ用の新しい外見セットを1つ選んで解放できます。再びRealityへ到達すれば自由に変更できますが、見た目だけの要素でゲーム上のボーナスはありません。"
      ) }}
      <br>
      <button
        class="c-new-game-button"
        @click="openSelectionModal"
      >
        {{ Localization.text("Choose Cosmetic Set", "外見セットを選ぶ") }}
      </button>
      <br>
      <br>
      {{ Localization.text("Selected Set:", "選択中:") }} {{ selectedSetName }}
    </h3>
    <h3 v-else>
      {{ Localization.text("You have unlocked all Glyph cosmetic sets!", "すべてのグリフ外見セットを解放済みです！") }}
    </h3>
    <br>
    <h3>
      {{ Localization.text(
        "Beyond v0.1 preserves the original completed game state. New postgame progression will begin after this point.",
        "Beyond v0.1では本編クリア時の状態を保持します。この先から新しいクリア後進行が始まります。"
      ) }}
    </h3>
  </div>
</template>

<style scoped>
.c-new-game-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 9;
  justify-content: center;
  align-items: center;
  transform: translate(-50%, -50%);
  pointer-events: auto;
}

.t-s12 .c-new-game-container {
  color: white;
}

.c-new-game-button-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.c-new-game-button {
  font-family: Typewriter;
  background: grey;
  border: black;
  border-radius: var(--var-border-radius, 0.5rem);
  margin-top: 1rem;
  padding: 1rem;
  cursor: pointer;
}
</style>
