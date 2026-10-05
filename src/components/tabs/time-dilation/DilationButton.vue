<script>
export default {
  name: "DilationButton",
  data() {
    return {
      isUnlocked: false,
      isRunning: false,
      hasGain: false,
      requiredForGain: new Decimal(),
      canEternity: false,
      eternityGoal: new Decimal(),
      tachyonGain: new Decimal(),
      remnantRequirement: 0,
      showRequirement: false,
      creditsClosed: false
    };
  },
  computed: {
    disableText() {
      // Doesn't need to be reactive or check strike status; it's always permanent once entered in Doomed
      return Pelle.isDoomed
        ? Localization.text("Dilation is permanent.", "Time Dilationは永久です。")
        : Localization.text("Disable Dilation.", "Time Dilationを解除する。");
    }
  },
  methods: {
    update() {
      this.isUnlocked = PlayerProgress.dilationUnlocked();
      this.isRunning = player.dilation.active;
      this.remnantRequirement = Pelle.remnantRequirementForDilation;
      this.showRequirement = Pelle.isDoomed && !Pelle.canDilateInPelle;
      if (!this.isRunning) return;
      this.canEternity = Player.canEternity;
      // This lets this.hasGain be true even before eternity.
      this.hasGain = getTachyonGain(false).gt(0);
      if (this.canEternity && this.hasGain) {
        this.tachyonGain.copyFrom(getTachyonGain(true));
      } else if (this.hasGain) {
        this.eternityGoal.copyFrom(Player.eternityGoal);
      } else {
        this.requiredForGain.copyFrom(getTachyonReq());
      }
      this.creditsClosed = GameEnd.creditsEverClosed;
    },
    dilate() {
      if (this.creditsClosed) return;
      startDilatedEternityRequest();
    }
  }
};
</script>

<template>
  <button
    class="o-dilation-btn"
    :class="isUnlocked ? 'o-dilation-btn--unlocked' : 'o-dilation-btn--locked'"
    @click="dilate()"
  >
    <span v-if="!isUnlocked">
      {{ Localization.text("Purchase the Dilation Study to unlock.", "Dilation Studyを購入すると解放されます。") }}
    </span>
    <span v-else-if="!isRunning">
      {{ Localization.text("Dilate time.", "時間をDilateする。") }}
      <div v-if="showRequirement">
        {{ Localization.text("Requires", "必要:") }} {{ format(remnantRequirement, 2) }} Remnant
      </div>
    </span>
    <span v-else-if="canEternity && hasGain">
      {{ disableText }}
      <br>
      <template v-if="Localization.isJapanese">
        Tachyon Particleを {{ format(tachyonGain, 2, 1) }} 獲得。
      </template>
      <template v-else>
        Gain {{ quantify("Tachyon Particle", tachyonGain, 2, 1) }}.
      </template>
    </span>
    <span v-else-if="hasGain">
      {{ disableText }}
      <br>
      <template v-if="Localization.isJapanese">
        {{ format(eternityGoal, 1, 0) }} Infinity Pointに到達してEternityするとTachyon Particleを獲得。
      </template>
      <template v-else>
        Reach {{ quantify("Infinity Point", eternityGoal, 1, 0) }} to Eternity and gain Tachyon Particles.
      </template>
    </span>
    <span v-else>
      {{ disableText }}
      <br>
      <template v-if="Localization.isJapanese">
        {{ format(requiredForGain, 2, 1) }} 反物質に到達すると、より多くのTachyon Particleを獲得。
      </template>
      <template v-else>
        Reach {{ format(requiredForGain, 2, 1) }} antimatter to gain more Tachyon Particles.
      </template>
    </span>
  </button>
</template>

<style scoped>

</style>
