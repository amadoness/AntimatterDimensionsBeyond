<script>
export default {
  name: "RealityAmplifyButton",
  data: () => ({
    isDoomed: false,
    isVisible: false,
    isDisabled: false,
    isActive: false,
    ratio: 1,
    canAmplify: false,
  }),
  computed: {
    tooltip() {
      if (this.isDoomed) return Localization.text(
        "You cannot amplify a Doomed Reality",
        "Doomed RealityはAmplifyできません"
      );
      if (this.isDisabled) return Localization.text(
        "You cannot amplify Celestial Realities",
        "Celestial RealityはAmplifyできません"
      );
      if (!this.canAmplify) {
        return Localization.text(
          "Store more real time or complete the Reality faster to amplify",
          "実時間をさらに貯めるか、より速くRealityするとAmplifyできます"
        );
      }
      return null;
    },
    buttonClass() {
      return {
        "l-reality-amplify-button": true,
        "l-reality-amplify-button--clickable": !this.isDoomed && this.canAmplify,
        "o-enslaved-mechanic-button--storing-time": this.isActive,
      };
    }
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.isVisible = Enslaved.isUnlocked;
      this.isDisabled = isInCelestialReality();
      this.isActive = Enslaved.boostReality;
      this.ratio = Enslaved.realityBoostRatio;
      this.canAmplify = Enslaved.canAmplify;
    },
    toggleActive() {
      if (!this.canAmplify) return;
      Enslaved.boostReality = !Enslaved.boostReality;
    }
  }
};
</script>

<template>
  <button
    v-if="isVisible"
    :class="buttonClass"
    :ach-tooltip="tooltip"
    @click="toggleActive"
  >
    <div v-if="isDoomed">
      {{ Localization.text("You cannot amplify Doomed Realities.", "Doomed RealityはAmplifyできません。") }}
    </div>
    <div v-else-if="canAmplify">
      <span v-if="isActive">{{ Localization.text("Will be amplified:", "Amplify予定:") }}</span>
      <span v-else>{{ Localization.text("Amplify this Reality:", "このRealityをAmplify:") }}</span>
      <br>
      {{ Localization.text("All rewards", "全報酬") }} ×{{ formatInt(ratio) }}
    </div>
    <div v-else>
      {{ Localization.text("Not enough stored real time to amplify.", "Amplifyに必要な実時間が足りません。") }}
    </div>
  </button>
</template>

<style scoped>

</style>
