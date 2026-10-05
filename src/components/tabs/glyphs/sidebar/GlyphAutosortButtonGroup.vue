<script>
import ButtonCycle from "@/components/ButtonCycle";
import ToggleButton from "@/components/ToggleButton";

export default {
  name: "GlyphAutosortButtonGroup",
  components: {
    ToggleButton,
    ButtonCycle
  },
  data() {
    return {
      autoSort: 0,
      showScoreFilter: false,
      autoCollapse: false,
      showAutoAutoClean: false,
      autoAutoClean: false,
      applyFilterToPurge: false,
    };
  },
  computed: {
    sortModes() {
      // These are the keys for AUTO_SORT_MODE, with SCORE only added conditionally if unlocked
      const availableSortModes = ["NONE", "LEVEL", "POWER", "EFFECT"];
      if (this.showScoreFilter) availableSortModes.push("SCORE");
      return availableSortModes;
    },
    questionMarkTooltip() {
      return Localization.text(
        "The automatic settings below will apply after every Reality",
        "以下の自動設定は各Reality後に適用されます"
      );
    },
    keepTooltip() {
      return Localization.text(
        "If set to ON, Glyphs which your filter accepts will never be auto-purged even if they are worse",
        "ONにすると、フィルターで採用されたGlyphは弱くても自動削除されません"
      );
    }
  },
  watch: {
    autoSort(newValue) {
      player.reality.autoSort = newValue;
    },
    autoCollapse(newValue) {
      player.reality.autoCollapse = newValue;
    },
    autoAutoClean(newValue) {
      player.reality.autoAutoClean = newValue;
    },
    applyFilterToPurge(newValue) {
      player.reality.applyFilterToPurge = newValue;
    },
  },
  methods: {
    update() {
      this.autoSort = player.reality.autoSort;
      this.showScoreFilter = EffarigUnlock.glyphFilter.isUnlocked;
      this.autoCollapse = player.reality.autoCollapse;
      this.showAutoAutoClean = VUnlocks.autoAutoClean.canBeApplied;
      this.autoAutoClean = player.reality.autoAutoClean;
      this.applyFilterToPurge = player.reality.applyFilterToPurge;
    },
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
      {{ Localization.text("Auto Glyph Arrangement:", "Glyph自動整理:") }}
    </div>
    <ButtonCycle
      v-model="autoSort"
      class="c-glyph-inventory-option"
      :text="Localization.text('Auto-sort Mode:', '自動並べ替え:')"
      :labels="sortModes"
    />
    <ToggleButton
      v-model="autoCollapse"
      class="c-glyph-inventory-option"
      :label="Localization.text('Auto-collapse space:', '空きを自動で詰める:')"
    />
    <ToggleButton
      v-if="showAutoAutoClean"
      v-model="autoAutoClean"
      class="c-glyph-inventory-option"
      :label="Localization.text('Auto-purge on Realities:', 'Reality時に自動削除:')"
    />
    <ToggleButton
      v-if="showAutoAutoClean"
      v-model="applyFilterToPurge"
      class="c-glyph-inventory-option"
      :label="Localization.text('Never Auto-purge Glyphs accepted by filter:', 'フィルター採用Glyphを自動削除しない:')"
      tooltip-class="c-glyph-inventory-option__tooltip"
      :tooltip-content="keepTooltip"
    />
  </div>
</template>

<style scoped>

</style>
