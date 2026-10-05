<script>
import CostDisplay from "@/components/CostDisplay";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";

export default {
  name: "EternityUpgradeButton",
  components: {
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay
  },
  props: {
    upgrade: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isBought: false,
      isAffordable: false
    };
  },
  computed: {
    classObject() {
      return {
        "o-eternity-upgrade": true,
        "o-eternity-upgrade--bought": this.isBought,
        "o-eternity-upgrade--available": !this.isBought && this.isAffordable,
        "o-eternity-upgrade--unavailable": !this.isBought && !this.isAffordable
      };
    },
    hasEU2() {
      return Perk.autounlockEU2.canBeApplied;
    },
    localizedConfig() {
      const config = this.upgrade.config;
      const sourceDescription = typeof config.description === "function"
        ? config.description()
        : config.description;
      return {
        ...config,
        description: Localization.eternityUpgradeDescription(config.id, sourceDescription)
      };
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isBought = upgrade.isBought;
      this.isAffordable = upgrade.isAffordable;
    }
  }
};
</script>

<template>
  <button
    :class="classObject"
    @click="upgrade.purchase()"
  >
    <DescriptionDisplay :config="localizedConfig" />
    <EffectDisplay
      br
      :config="localizedConfig"
    />
    <div v-if="!isBought && hasEU2">
      {{ Localization.text("Auto:", "自動:") }} {{ format(upgrade.config.cost / 1e10) }} Eternity Point
    </div>
    <CostDisplay
      v-else-if="!isBought"
      br
      :config="localizedConfig"
      name="Eternity Point"
    />
  </button>
</template>

<style scoped>

</style>
