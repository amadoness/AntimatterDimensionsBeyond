<script>
import ToggleButton from "@/components/ToggleButton";

export default {
  name: "GlyphProtectedRowButtonGroup",
  components: {
    ToggleButton
  },
  data() {
    return {
      protectedRows: 0,
      moveGlyphs: false,
    };
  },
  computed: {
    questionMarkTooltip() {
      return Localization.text(
        "Protected slots are unaffected by anything which may move or purge Glyphs. New Glyphs will never be inserted into these slots.",
        "保護スロットはGlyphの移動・削除処理の影響を受けず、新しいGlyphもここには入りません。"
      );
    }
  },
  watch: {
    moveGlyphs(newValue) {
      player.reality.moveGlyphsOnProtection = newValue;
    },
  },
  methods: {
    update() {
      this.moveGlyphs = player.reality.moveGlyphsOnProtection;
      this.protectedRows = player.reality.glyphs.protectedRows;
    },
    addRow() {
      Glyphs.changeProtectedRows(1);
    },
    removeRow() {
      Glyphs.changeProtectedRows(-1);
    },
    isProtectedRowsMax() {
      return this.protectedRows === Glyphs.totalSlots / 10 - 1;
    },
    addRowButtonClass() {
      return {
        "c-glyph-inventory-option": true,
        "o-non-clickable": this.isProtectedRowsMax()
      };
    },
    removeRowButtonClass() {
      return {
        "c-glyph-inventory-option": true,
        "o-non-clickable": this.protectedRows === 0
      };
    }
  }
};
</script>

<template>
  <div class="o-glyph-inventory-management-group">
    <div class="l-glyph-sacrifice-options__header">
      <div
        v-tooltip="questionMarkTooltip"
        class="o-questionmark"
      >
        ?
      </div>
      <template v-if="Localization.isJapanese">
        保護スロット: {{ formatInt(protectedRows) }}行
      </template>
      <template v-else>
        Protected Slots: ({{ quantifyInt("row", protectedRows) }})
      </template>
    </div>
    <button
      :class="addRowButtonClass()"
      @click="addRow"
    >
      {{ Localization.text("Add a protected row", "保護行を追加") }}
      <div
        v-if="isProtectedRowsMax()"
        class="c-glyph-inventory-option__tooltip"
      >
        {{ Localization.text("One row is permanently un-protected for new Glyphs", "新しいGlyph用に1行は常に非保護のまま残ります") }}
      </div>
    </button>
    <button
      :class="removeRowButtonClass()"
      @click="removeRow"
    >
      {{ Localization.text("Remove a protected row", "保護行を減らす") }}
    </button>
    <ToggleButton
      v-model="moveGlyphs"
      class="c-glyph-inventory-option"
      :label="Localization.text('Move Glyphs on changing row count:', '行数変更時にGlyphを移動:')"
    />
  </div>
</template>

<style scoped>
.o-non-clickable {
  cursor: auto;
}
</style>
