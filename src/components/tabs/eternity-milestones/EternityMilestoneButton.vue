<script>
export default {
  name: "EternityMilestoneButton",
  props: {
    getMilestone: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      isReached: false,
      isLocked: false,
    };
  },
  computed: {
    milestone() {
      return this.getMilestone();
    },
    config() {
      return this.milestone.config;
    },
    eternities() {
      return this.config.eternities;
    },
    reward() {
      const reward = this.config.reward;
      const source = typeof reward === "function" ? reward() : reward;
      return Localization.eternityMilestoneReward(this.eternities, source);
    },
    rewardClassObject() {
      return {
        "o-eternity-milestone__reward": true,
        "o-eternity-milestone__reward--locked": !this.isReached,
        "o-eternity-milestone__reward--reached": this.isReached,
        "o-eternity-milestone__reward--small-font": this.reward.length > 80
      };
    },
    activeCondition() {
      const source = this.config.activeCondition ? this.config.activeCondition() : null;
      return Localization.eternityMilestoneActiveCondition(this.eternities, source);
    },
    isDoomed: () => Pelle.isDoomed,
    isUseless() {
      return this.isDoomed && this.config.pelleUseless;
    }
  },
  methods: {
    update() {
      this.isLocked = this.isDoomed && this.config.givenByPelle !== undefined;
      this.isReached = this.milestone.isReached;
    }
  }
};
</script>

<template>
  <div
    v-if="!config.invisible"
    class="l-eternity-milestone"
  >
    <span class="o-eternity-milestone__goal">
      <template v-if="Localization.isJapanese">
        Eternity {{ formatInt(eternities) }}回:
      </template>
      <template v-else>
        {{ quantifyInt("Eternity", eternities) }}:
      </template>
    </span>
    <button
      v-tooltip="activeCondition"
      :class="rewardClassObject"
    >
      <span :class="{ 'o-pelle-disabled': isUseless }">
        {{ reward }}
        {{ (isLocked && !isReached)
          ? Localization.text("(Locked behind a Pelle Upgrade)", "（Pelle Upgradeで解放）")
          : "" }}
      </span>
    </button>
  </div>
</template>

<style scoped>

</style>
