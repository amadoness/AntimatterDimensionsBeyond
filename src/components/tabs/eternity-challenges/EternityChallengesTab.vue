<script>
import ChallengeGrid from "@/components/ChallengeGrid";
import ChallengeTabHeader from "@/components/ChallengeTabHeader";
import EternityChallengeBox from "./EternityChallengeBox";

export default {
  name: "EternityChallengesTab",
  components: {
    ChallengeTabHeader,
    ChallengeGrid,
    EternityChallengeBox
  },
  data() {
    return {
      unlockedCount: 0,
      showAllChallenges: false,
      autoEC: false,
      isAutoECVisible: false,
      hasUpgradeLock: false,
      remainingECTiers: 0,
      untilNextEC: TimeSpan.zero,
      untilAllEC: TimeSpan.zero,
      hasECR: false,
    };
  },
  computed: {
    challenges() {
      return EternityChallenges.all;
    },
    upgradeLockNameText() {
      return RealityUpgrade(12).isLockingMechanics
        ? RealityUpgrade(12).name
        : ImaginaryUpgrade(15).name;
    },
    nextECText() {
      if (this.untilNextEC.totalMilliseconds === 0 && !this.autoEC) {
        return Localization.text("Immediately upon unpausing", "一時停止解除後すぐ");
      }
      return Localization.isJapanese ? `${this.untilNextEC}（実時間）` : `${this.untilNextEC} (real time)`;
    },
    allECText() {
      if (this.untilAllEC.totalMilliseconds === 0 && !this.autoEC) {
        return Localization.text("Immediately upon unpausing", "一時停止解除後すぐ");
      }
      return Localization.isJapanese
        ? `${this.untilAllEC}後（実時間）`
        : `After ${this.untilAllEC} (real time)`;
    }
  },
  methods: {
    update() {
      this.showAllChallenges = player.options.showAllChallenges;
      this.unlockedCount = EternityChallenges.all
        .filter(this.isChallengeVisible)
        .length;
      this.isAutoECVisible = Perk.autocompleteEC1.canBeApplied;
      this.autoEC = player.reality.autoEC;
      const shouldPreventEC7 = TimeDimension(1).amount.gt(0);
      this.hasUpgradeLock = RealityUpgrade(12).isLockingMechanics ||
        (ImaginaryUpgrade(15).isLockingMechanics && shouldPreventEC7 &&
          !Array.range(1, 6).some(ec => !EternityChallenge(ec).isFullyCompleted));
      const remainingCompletions = EternityChallenges.remainingCompletions;
      this.remainingECTiers = remainingCompletions;
      if (remainingCompletions !== 0) {
        const autoECInterval = EternityChallenges.autoComplete.interval;
        const untilNextEC = Math.max(autoECInterval - player.reality.lastAutoEC, 0);
        this.untilNextEC.setFrom(untilNextEC);
        this.untilAllEC.setFrom(untilNextEC + (autoECInterval * (remainingCompletions - 1)));
      }
      this.hasECR = Perk.studyECRequirement.isBought;
    },
    isChallengeVisible(challenge) {
      return challenge.completions > 0 || challenge.isUnlocked || challenge.hasUnlocked ||
        (this.showAllChallenges && PlayerProgress.realityUnlocked());
    }
  }
};
</script>

<template>
  <div class="l-challenges-tab">
    <ChallengeTabHeader />
    <div v-if="isAutoECVisible">
      {{ Localization.text(
        "Eternity Challenges are automatically completed sequentially, requiring all previous Eternity Challenges to be fully completed before any progress is made.",
        "Eternity Challengeは順番に自動クリアされます。前のEternity Challengeを5回すべてクリアするまで、次には進みません。"
      ) }}
    </div>
    <div
      v-if="isAutoECVisible && remainingECTiers > 0"
      class="c-challenges-tab__auto-ec-info l-challenges-tab__auto-ec-info"
    >
      <div class="l-challenges-tab__auto-ec-timers">
        <span
          v-if="hasUpgradeLock"
          class="l-emphasis"
        >
          {{ Localization.text(
            "Auto EC is currently disabled because of the",
            "Auto ECはアップグレード条件ロック"
          ) }} "{{ upgradeLockNameText }}"
          {{ Localization.text("upgrade requirement lock.", "のため現在無効です。") }}
        </span>
        <span v-if="remainingECTiers > 0">
          {{ Localization.text(
            "Next Auto Eternity Challenge completion:",
            "次のEternity Challenge自動クリア:"
          ) }} {{ nextECText }}
        </span>
        <span>
          {{ Localization.text(
            "All Auto Eternity Challenge completions:",
            "残りすべてのEternity Challenge自動クリア:"
          ) }} {{ allECText }}
        </span>
        <br>
      </div>
    </div>
    <div>
      {{ Localization.text(
        "Complete Eternity Challenges again for a bigger reward, maximum of",
        "Eternity Challengeは再クリアするたび報酬が強化され、最大"
      ) }} {{ formatInt(5) }}
      {{ Localization.text(
        "times.",
        "回までクリアできます。"
      ) }}<br>
      {{ Localization.text(
        "The rewards are applied permanently with no need to have the respective Eternity Challenge Time Study purchased.",
        "報酬は恒久的に適用され、対応するEternity ChallengeのTime Studyを所持し続ける必要はありません。"
      ) }}
    </div>
    <div v-if="!hasECR">
      {{ Localization.text(
        "When you respec out of an unlocked Eternity Challenge, you don't need to redo the secondary requirement in order to unlock it again until you complete it; only the Time Theorems are required.",
        "解放済みEternity ChallengeをRespecで外しても、クリアするまでは再解放時に副条件をやり直す必要はなく、Time Theoremだけで再解放できます。"
      ) }}
    </div>
    <div v-if="unlockedCount !== 12">
      <template v-if="Localization.isJapanese">
        Eternity Challengeは {{ formatInt(12) }}個中 {{ formatInt(unlockedCount) }}個確認済みです。
      </template>
      <template v-else>
        You have seen {{ formatInt(unlockedCount) }} out of {{ formatInt(12) }} Eternity Challenges.
      </template>
    </div>
    <div v-else>
      {{ Localization.text(
        `You have seen all ${formatInt(12)} Eternity Challenges.`,
        `Eternity Challengeを全${formatInt(12)}個確認済みです。`
      ) }}
    </div>
    <ChallengeGrid
      v-slot="{ challenge }"
      :challenges="challenges"
      :is-challenge-visible="isChallengeVisible"
    >
      <EternityChallengeBox :challenge="challenge" />
    </ChallengeGrid>
  </div>
</template>

<style scoped>
.l-emphasis {
  font-weight: bold;
  color: var(--color-bad);
}
</style>
