<script>
import ChallengeGrid from "@/components/ChallengeGrid";
import ChallengeTabHeader from "@/components/ChallengeTabHeader";
import NormalChallengeBox from "./NormalChallengeBox";

export default {
  name: "NormalChallengesTab",
  components: {
    ChallengeGrid,
    ChallengeTabHeader,
    NormalChallengeBox
  },
  computed: {
    challenges() {
      return NormalChallenges.all;
    }
  }
};
</script>

<template>
  <div class="l-challenges-tab">
    <ChallengeTabHeader />
    <div>
      {{ Localization.text(
        "Some Normal Challenges have requirements to be able to run that challenge.",
        "一部の通常チャレンジは、開始するために条件を満たす必要があります。"
      ) }}
    </div>
    <div>
      {{ Localization.text(
        "If you have an active Big Crunch Autobuyer, it will attempt to Crunch as soon as possible when reaching Infinite antimatter.",
        "Big Crunch自動購入器が有効なら、反物質がInfinityに到達すると可能な限りすぐCrunchします。"
      ) }}
    </div>
    <ChallengeGrid
      v-slot="{ challenge }"
      :challenges="challenges"
    >
      <NormalChallengeBox :challenge="challenge" />
    </ChallengeGrid>
  </div>
</template>

<style scoped>

</style>
