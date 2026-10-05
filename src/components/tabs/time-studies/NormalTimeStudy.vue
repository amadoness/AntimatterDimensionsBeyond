<script>
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import HintText from "@/components/HintText";
import TimeStudyButton from "./TimeStudyButton";

export default {
  name: "NormalTimeStudy",
  components: {
    DescriptionDisplay,
    EffectDisplay,
    HintText,
    TimeStudyButton
  },
  props: {
    setup: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    showCost: true,
    showSTCost: false
  }),
  computed: {
    study() {
      return this.setup.study;
    },
    hintText() {
      const id = this.study.id;
      if (!this.setup.path) return id;
      const pathEntry = NormalTimeStudies.pathList.find(p => p.path === this.setup.path);
      if (!Localization.isJapanese) return `${id} ${pathEntry.name}`;
      const pathNames = {
        Antimatter: "反物質",
        Infinity: "Infinity",
        Time: "Time",
        Active: "アクティブ",
        Passive: "パッシブ",
        Idle: "アイドル",
        Light: "光",
        Dark: "闇"
      };
      return `${id} ${pathNames[pathEntry.name] ?? pathEntry.name}`;
    },
    localizedConfig() {
      const config = this.study.config;
      const sourceDescription = typeof config.description === "function"
        ? config.description()
        : config.description;
      return {
        ...config,
        description: Localization.timeStudyDescription(this.study.id, sourceDescription)
      };
    },
    isUseless() {
      return Pelle.uselessTimeStudies.includes(this.study.id) && Pelle.isDoomed;
    }
  },
  methods: {
    update() {
      this.showCost = this.study.id !== 192 || !Enslaved.isRunning;
      // We don't show ST cost if purchased because the first 1-2 of each "set" won't actually cost ST. There's no
      // particularly sensible way to accurately display the actual ST spent other than tracing through buy order
      // of all current studies for every study, and even then it looks odd in practice because then a few studies
      // appear more expensive simply due to buy order.
      this.showSTCost = VUnlocks.vAchievementUnlock.isUnlocked && !TimeStudy(this.study.id).isBought &&
        TimeStudy(this.study.id).costsST() && !Pelle.isDoomed;
    },
  }
};
</script>

<template>
  <TimeStudyButton
    :setup="setup"
    :show-cost="showCost"
    :show-st-cost="showSTCost"
  >
    <HintText
      type="studies"
      class="l-hint-text--time-study"
    >
      {{ hintText }}
    </HintText>
    <span :class="{ 'o-pelle-disabled': isUseless }">
      <DescriptionDisplay
        :config="localizedConfig"
      />
      <EffectDisplay
        br
        :config="localizedConfig"
      />
    </span>
  </TimeStudyButton>
</template>

<style scoped>

</style>
