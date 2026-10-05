<script>
export default {
  name: "BlackHoleStateRow",
  props: {
    blackHole: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      isPermanent: false,
      isActive: false,
      isCharged: false,
      nextChange: "",
      state: "",
    };
  },
  computed: {
    description() {
      return Localization.isJapanese ? `Black Hole ${this.blackHole.id}` : this.blackHole.description(true);
    },
    id() {
      return this.blackHole.id;
    }
  },
  methods: {
    update() {
      const { blackHole } = this;
      this.isUnlocked = blackHole.isUnlocked;
      if (!this.isUnlocked) return;
      this.isPermanent = blackHole.isPermanent;
      this.isActive = blackHole.isActive;
      this.isCharged = blackHole.isCharged;
      this.nextChange = TimeSpan.fromSeconds(blackHole.timeWithPreviousActiveToNextStateChange).toStringShort();
      this.state = blackHole.displayState;
    }
  }
};
</script>

<template>
  <h3 v-if="isUnlocked">
    {{ description }} {{ Localization.text("State:", "状態:") }}
    <template v-if="isPermanent">
      {{ Localization.text("Permanently Active", "永久に稼働") }}
    </template>
    <template v-else-if="isActive">
      {{ Localization.text("Active", "稼働中") }} ({{ nextChange }} {{ Localization.text("remaining", "残り") }})
    </template>
    <template v-else-if="id === 2 && isCharged">
      {{ Localization.text("Charged", "充填済み") }} ({{ Localization.text("Activates with Black Hole 1", "Black Hole 1と同時に稼働") }}, {{ nextChange }} {{ Localization.text("remaining", "残り") }})
    </template>
    <template v-else>
      {{ Localization.text("Inactive", "停止中") }} ({{ Localization.text("Activation in", "稼働まで") }} {{ nextChange }})
    </template>
  </h3>
</template>

<style scoped>

</style>
