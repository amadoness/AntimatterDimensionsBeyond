<script>
import ChallengeGrid from "@/components/ChallengeGrid";
import ChallengeTabHeader from "@/components/ChallengeTabHeader";
import InfinityChallengeBox from "./InfinityChallengeBox";

export default {
  name: "InfinityChallengesTab",
  components: {
    ChallengeGrid,
    ChallengeTabHeader,
    InfinityChallengeBox
  },
  data() {
    return {
      nextIC: 0,
      showAllChallenges: false
    };
  },
  computed: {
    challenges() {
      return InfinityChallenges.all;
    },
    nextAtDisplay() {
      const first = this.nextIC?.id === 1;
      const next = InfinityChallenges.nextICUnlockAM;

      if (first) {
        return Localization.isJapanese
          ? `最初のInfinity Challengeは${format(next)}反物質で解放されます。`
          : `The first Infinity Challenge unlocks at ${format(next)} antimatter.`;
      }
      if (next === undefined) {
        return Localization.text("All Infinity Challenges unlocked", "すべてのInfinity Challengeを解放済み");
      }
      return Localization.isJapanese
        ? `次のInfinity Challengeは${format(next)}反物質で解放されます。`
        : `Next Infinity Challenge unlocks at ${format(next)} antimatter.`;
    }
  },
  methods: {
    update() {
      this.nextIC = InfinityChallenges.nextIC;
      this.showAllChallenges = player.options.showAllChallenges;
    },
    isChallengeVisible(challenge) {
      return challenge.isUnlocked || (this.showAllChallenges && PlayerProgress.eternityUnlocked());
    }
  }
};
</script>

<template>
  <div class="l-challenges-tab">
    <ChallengeTabHeader />
    <div>
      {{ Localization.text(
        "An active Big Crunch Autobuyer will Crunch immediately when reaching an Infinity Challenge's antimatter goal, regardless of settings.",
        "Big Crunch自動購入器が有効なら、設定に関係なくInfinity Challengeの反物質目標に到達した瞬間にCrunchします。"
      ) }}
    </div>
    <div>{{ nextAtDisplay }}</div>
    <ChallengeGrid
      v-slot="{ challenge }"
      :challenges="challenges"
      :is-challenge-visible="isChallengeVisible"
    >
      <InfinityChallengeBox :challenge="challenge" />
    </ChallengeGrid>
  </div>
</template>

<style scoped>

</style>
