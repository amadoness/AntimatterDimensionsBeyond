<script>
export default {
  name: "GlyphSortButtonGroup",
  data() {
    return {
      showScoreFilter: false,
    };
  },
  methods: {
    update() {
      this.showScoreFilter = EffarigUnlock.glyphFilter.isUnlocked;
    },
    sortByLevel() {
      Glyphs.sortByLevel();
    },
    sortByPower() {
      Glyphs.sortByPower();
    },
    sortByScore() {
      Glyphs.sortByScore();
    },
    sortByEffect() {
      Glyphs.sortByEffect();
    },
    collapseEmpty() {
      Glyphs.collapseEmptySlots();
    }
  }
};
</script>

<template>
  <div class="o-glyph-inventory-management-group">
    <div class="l-glyph-sacrifice-options__header">
      {{ Localization.text("Sort Glyphs:", "Glyphを並べ替え:") }}
    </div>
    <button
      class="c-glyph-inventory-option"
      @click="sortByLevel"
    >
      {{ Localization.text("Sort by level", "Level順") }}
      <div class="c-glyph-inventory-option__tooltip">
        {{ Localization.text("Arranges by decreasing Glyph level", "Glyph Levelの高い順に並べます") }}
      </div>
    </button>
    <button
      class="c-glyph-inventory-option"
      @click="sortByPower"
    >
      {{ Localization.text("Sort by power", "Power順") }}
      <div class="c-glyph-inventory-option__tooltip">
        {{ Localization.text("Arranges by decreasing level×rarity", "Level×Rarityの高い順に並べます") }}
      </div>
    </button>
    <button
      class="c-glyph-inventory-option"
      @click="sortByEffect"
    >
      {{ Localization.text("Sort by effect", "効果順") }}
      <div class="c-glyph-inventory-option__tooltip">
        {{ Localization.text("Groups Glyphs together based on effects", "効果ごとにGlyphをまとめます") }}
      </div>
    </button>
    <button
      v-if="showScoreFilter"
      class="c-glyph-inventory-option"
      @click="sortByScore"
    >
      {{ Localization.text("Sort by score", "Score順") }}
      <div class="c-glyph-inventory-option__tooltip">
        {{ Localization.text("Arranges by decreasing Glyph filter score", "Glyph Filter Scoreの高い順に並べます") }}
      </div>
    </button>
    <button
      class="c-glyph-inventory-option"
      @click="collapseEmpty"
    >
      {{ Localization.text("Collapse empty space", "空きスロットを詰める") }}
      <div class="c-glyph-inventory-option__tooltip">
        {{ Localization.text("Moves all Glyphs to the earliest empty slots", "Glyphを前方の空きスロットへ詰めます") }}
      </div>
    </button>
  </div>
</template>

<style scoped>

</style>
