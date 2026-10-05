<script>
export default {
  name: "EternityPointsHeader",
  data() {
    return {
      eternityPoints: new Decimal()
    };
  },
  methods: {
    update() {
      this.eternityPoints.copyFrom(Currency.eternityPoints.value.floor());
    }
  }
};
</script>

<template>
  <div class="c-eternity-tab__header">
    {{ Localization.text("You have", "所持:") }}
    <span class="c-eternity-tab__eternity-points">{{ format(eternityPoints, 2) }}</span>
    {{ Localization.text(pluralize("Eternity Point", eternityPoints), "永遠ポイント") }}
  </div>
</template>

<style scoped>

</style>
