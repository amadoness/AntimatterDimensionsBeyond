<script>
import wordShift from "@/core/word-shift";

import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import EternityChallengeBoxWrapper from "./EternityChallengeBoxWrapper";

export default {
  name: "EternityChallengeBox",
  components: {
    EternityChallengeBoxWrapper,
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
      isCompleted: false,
      canBeUnlocked: false,
      completions: 0,
      showGoalSpan: false,
      lastGoal: "",
    };
  },
  computed: {
    config() {
      return this.challenge.config;
    },
    localizedConfig() {
      const config = this.config;
      const description = typeof config.description === "function"
        ? config.description()
        : config.description;
      const rewardDescription = typeof config.reward.description === "function"
        ? config.reward.description()
        : config.reward.description;
      return {
        ...config,
        description: Localization.eternityChallengeDescription(this.challenge.id, description),
        reward: {
          ...config.reward,
          description: Localization.eternityChallengeReward(this.challenge.id, rewardDescription)
        }
      };
    },
    goalDisplay() {
      const config = this.config;
      let goal = Localization.isJapanese
        ? `目標: ${this.goalAtCompletions(this.completions)} IP`
        : `Goal: ${this.goalAtCompletions(this.completions)} IP`;
      if (config.restriction) {
        const restriction = config.restriction(this.completions);
        if (Localization.isJapanese && this.challenge.id === 4) {
          goal += restriction === 0
            ? "（Infinity 0回で）"
            : `（Infinity ${formatInt(restriction)}回以下で）`;
        } else if (Localization.isJapanese && this.challenge.id === 12) {
          goal += `（ゲーム内${format(restriction, 0, 1)}秒以内）`;
        } else {
          goal += ` ${config.formatRestriction(restriction)}`;
        }
      }
      return goal;
    },
    firstGoal() {
      return this.goalAtCompletions(0);
    },
    currentRewardConfig() {
      const challenge = this.challenge;
      const config = this.config.reward;
      return {
        effect: () => config.effect(challenge.completions),
        formatEffect: config.formatEffect,
        cap: config.cap,
      };
    },
    nextRewardConfig() {
      const challenge = this.challenge;
      const config = this.config.reward;
      return {
        effect: () => config.effect(challenge.completions + 1),
        formatEffect: config.formatEffect,
        cap: config.cap,
      };
    },
    name() {
      return `EC${this.challenge.id}`;
    }
  },
  methods: {
    update() {
      const challenge = this.challenge;
      this.isUnlocked = challenge.isUnlocked;
      this.isRunning = challenge.isRunning;
      this.isCompleted = challenge.isFullyCompleted;
      this.completions = challenge.completions;
      this.showGoalSpan = PlayerProgress.realityUnlocked();
      this.canBeUnlocked = TimeStudy.eternityChallenge(challenge.id).canBeBought;

      this.lastGoal = (Enslaved.isRunning && this.challenge.id === 1)
        ? wordShift.wordCycle(this.config.scrambleText.map(x => format(x)))
        : this.goalAtCompletions(this.challenge.maxCompletions - 1);
    },
    start() {
      if (this.canBeUnlocked) {
        TimeStudy.eternityChallenge(this.challenge.id).purchase();
      } else this.challenge.requestStart();
    },
    goalAtCompletions(completions) {
      return format(this.challenge.goalAtCompletions(completions), 2, 1);
    }
  }
};
</script>

<template>
  <EternityChallengeBoxWrapper
    :name="name"
    :is-unlocked="isUnlocked"
    :is-running="isRunning"
    :is-completed="isCompleted"
    :can-be-unlocked="canBeUnlocked"
    :completion-count="completions"
    @start="start"
  >
    <template #top>
      <DescriptionDisplay :config="localizedConfig" />
    </template>
    <template #bottom>
      <div :style="{ visiblity: completions < 5 ? 'visible' : 'hidden' }">
        <div>
          <template v-if="Localization.isJapanese">
            クリア回数: {{ formatInt(completions) }}回
          </template>
          <template v-else>
            Completed {{ quantifyInt("time", completions) }}
          </template>
        </div>
        {{ goalDisplay }}
      </div>
      <span v-if="showGoalSpan">
        {{ Localization.text("Goal Span:", "目標範囲:") }} {{ firstGoal }} IP - {{ lastGoal }} IP
      </span>
      <span>
        {{ Localization.text("Reward:", "報酬:") }}
        <DescriptionDisplay
          :config="localizedConfig.reward"
          :length="55"
          name="c-challenge-box__reward-description"
        />
      </span>
      <span>
        <EffectDisplay
          v-if="completions > 0"
          :config="currentRewardConfig"
        />
        <span v-if="completions > 0 && completions < 5">|</span>
        <EffectDisplay
          v-if="completions < 5"
          :config="nextRewardConfig"
          :label="Localization.text('Next', '次')"
          :ignore-capped="true"
        />
      </span>
    </template>
  </EternityChallengeBoxWrapper>
</template>

<style scoped>

</style>
