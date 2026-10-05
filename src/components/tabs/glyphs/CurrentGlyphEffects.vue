<script>
import CurrentGlyphEffect from "./CurrentGlyphEffect";
import GlyphSetName from "@/components/GlyphSetName";

const glyphEffectsOrder =
  ["powerpow", "powermult", "powerdimboost", "powerbuy10",
    "infinitypow", "infinityinfmult", "infinityIP", "infinityrate",
    "replicationpow", "replicationdtgain", "replicationspeed", "replicationglyphlevel",
    "timepow", "timeshardpow", "timeEP", "timespeed", "timeetermult",
    "dilationpow", "dilationTTgen", "dilationDT", "dilationgalaxyThreshold",
    "effarigrm", "effarigglyph", "effarigblackhole", "effarigachievement",
    "effarigforgotten", "effarigdimensions", "effarigantimatter",
    "cursedgalaxies", "cursedtickspeed", "curseddimensions", "cursedEP",
    "realityglyphlevel", "realitygalaxies", "realityrow1pow", "realityDTglyph",
    "companiondescription", "companionEP"];

export default {
  name: "CurrentGlyphEffects",
  components: {
    GlyphSetName,
    CurrentGlyphEffect
  },
  data() {
    return {
      effects: [],
      isColored: false,
      hasEffarig: false,
      hasReality: false,
      logTotalSacrifice: 0,
      pelleChaosEffect: {},
    };
  },
  computed: {
    isSoftcapActive() {
      return this.effects.length && !this.effects.every(e => e.value.capped === false);
    },
    uniqueGlyphText() {
      if (!this.hasEffarig && !this.hasReality) return "";
      const uniqueGlyphs = [];
      if (this.hasEffarig) uniqueGlyphs.push(
        `<span style="color: ${GlyphAppearanceHandler.getBorderColor("effarig")};">Effarig</span>`);
      if (this.hasReality) uniqueGlyphs.push(
        `<span style="animation: a-reality-glyph-description-cycle 10s infinite;">Reality</span>`);
      if (Localization.isJapanese) {
        return `${uniqueGlyphs.join(" または ")} Glyphはそれぞれ1個までしか装備できません。`;
      }
      return `You cannot have more than one ${uniqueGlyphs.join(" or ")}
        Glyph equipped${uniqueGlyphs.length > 1 ? " each." : "."}`;
    },
    noEffects() {
      return !this.effects.length;
    },
    glyphSet() {
      return Glyphs.activeList;
    },
    pelleGlyphText() {
      if (!Pelle.isDoomed) return "";
      return Localization.isJapanese
        ? `Glyph Rarityは${formatPercents(strengthToRarity(Pelle.glyphStrength))}固定、
          Level上限は${formatInt(Pelle.glyphMaxLevel)}です`
        : `Glyph Rarity is set to ${formatPercents(strengthToRarity(Pelle.glyphStrength))}
          and Level is capped at ${formatInt(Pelle.glyphMaxLevel)}`;
    },
    showChaosText() {
      return this.pelleChaosEffect.isUnlocked && !this.noEffects;
    },
    chaosEffect() {
      return this.pelleChaosEffect.description;
    },
  },
  watch: {
    logTotalSacrifice() {
      this.glyphsChanged();
    }
  },
  created() {
    this.on$(GAME_EVENT.GLYPHS_EQUIPPED_CHANGED, this.glyphsChanged);
    this.glyphsChanged();
  },
  methods: {
    update() {
      this.isColored = player.options.glyphTextColors;
      this.hasEffarig = Glyphs.active.some(g => g && g.type === "effarig");
      this.hasReality = Glyphs.active.some(g => g && g.type === "reality");

      this.logTotalSacrifice = GameCache.logTotalGlyphSacrifice.value;

      this.pelleChaosEffect = Pelle.specialGlyphEffect;
    },
    glyphsChanged() {
      this.effects = getActiveGlyphEffects();
      this.effects.sort((a, b) => glyphEffectsOrder.indexOf(a.id) - glyphEffectsOrder.indexOf(b.id));
    },
  }
};
</script>

<template>
  <div class="c-current-glyph-effects l-current-glyph-effects">
    <div class="pelle-current-glyph-effects">
      {{ pelleGlyphText }}
    </div>
    <div class="c-current-glyph-effects__header">
      {{ Localization.text("Currently active Glyph effects:", "現在有効なGlyph効果:") }}
    </div>
    <GlyphSetName :glyph-set="glyphSet" />
    <br v-if="isSoftcapActive || hasEffarig || hasReality">
    <span v-html="uniqueGlyphText" />
    <div
      v-if="isSoftcapActive"
      class="l-current-glyph-effects__capped-header"
    >
      <template v-if="Localization.isJapanese">
        <span class="c-current-glyph-effects__effect--capped">斜体</span>の効果はSoftcapにより少し低下しています
      </template>
      <template v-else>
        <span class="c-current-glyph-effects__effect--capped">Italic</span> effects have been slightly reduced
        due to a softcap
      </template>
    </div>
    <br>
    <div v-if="noEffects">
      {{ Localization.text("None (equip Glyphs to get their effects)", "なし（Glyphを装備すると効果が発動します）") }}
    </div>
    <CurrentGlyphEffect
      v-for="effect in effects"
      :key="effect.id + logTotalSacrifice"
      :effect="effect"
      :is-colored="isColored"
    />
    <div
      v-if="showChaosText"
      class="pelle-current-glyph-effects"
    >
      {{ chaosEffect }}
    </div>
  </div>
</template>

<style scoped>

</style>
