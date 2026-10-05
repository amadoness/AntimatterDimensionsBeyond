<script>
import ChallengeBox from "@/components/ChallengeBox";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";

export default {
  name: "InfinityChallengeBox",
  components: {
    ChallengeBox,
    DescriptionDisplay,
    EffectDisplay
  },
  props: {
    challenge: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      isRunning: false,
      isCompleted: false
    };
  },
  computed: {
    config() {
      return this.challenge.config;
    },
    localizedConfig() {
      const config = this.config;
      const sourceDescription = typeof config.description === "function"
        ? config.description()
        : config.description;
      const reward = config.reward;
      const sourceReward = typeof reward.description === "function"
        ? reward.description()
        : reward.description;
      return {
        ...config,
        description: Localization.infinityChallengeDescription(this.challenge.id, sourceDescription),
        reward: {
          ...reward,
          description: Localization.infinityChallengeReward(this.challenge.id, sourceReward)
        }
      };
    },
    name() {
      return `IC${this.challenge.id}`;
    }
  },
  methods: {
    update() {
      const challenge = this.challenge;
      this.isUnlocked = challenge.isUnlocked;
      this.isRunning = challenge.isRunning;
      this.isCompleted = challenge.isCompleted;
    }
  }
};
</script>

<template>
  <ChallengeBox
    :name="name"
    :is-unlocked="isUnlocked"
    :is-running="isRunning"
    :is-completed="isCompleted"
    class="c-challenge-box--infinity"
    @start="challenge.requestStart()"
  >
    <template #top>
      <DescriptionDisplay :config="localizedConfig" />
      <EffectDisplay
        v-if="isRunning"
        :config="localizedConfig"
      />
    </template>
    <template #bottom>
      <div class="l-challenge-box__bottom--infinity">
        <span>{{ Localization.text("Goal:", "目標:") }} {{ format(config.goal) }} {{ Localization.text("antimatter", "反物質") }}</span>
        <DescriptionDisplay
          :config="localizedConfig.reward"
          :title="Localization.text('Reward:', '報酬:')"
        />
        <EffectDisplay
          :config="localizedConfig.reward"
        />
      </div>
    </template>
  </ChallengeBox>
</template>

<style scoped>

</style>
