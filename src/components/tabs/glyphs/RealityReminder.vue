<script>
export default {
  name: "RealityReminder",
  data() {
    return {
      canReality: false,
      isVisible: false,
      isExpanded: false,
      ecCount: 0,
      missingAchievements: 0,
      unpurchasedDilationUpgrades: 0,
      currLog10EP: 0,
      cheapestLog10TD: 0,
      multEPLog10Cost: 0,
      purchasableTS: 0,
      hasDilated: 0,
      availableCharges: 0,
    };
  },
  computed: {
    suggestions() {
      const arr = [];
      if (this.purchasableTS > 0) {
        arr.push(Localization.isJapanese
          ? `Time Studyを追加購入（購入可能: ${formatInt(this.purchasableTS)}）`
          : `Purchase more Time Studies (${formatInt(this.purchasableTS)} available)`);
      }
      if (this.missingAchievements > 0) {
        arr.push(Localization.isJapanese
          ? `残りの実績を達成（残り: ${formatInt(this.missingAchievements)}）`
          : `Complete the rest of your Achievements (${formatInt(this.missingAchievements)} left)`);
      }
      if (this.unpurchasedDilationUpgrades > 0) {
        arr.push(Localization.isJapanese
          ? `残りのDilation Upgradeを購入（残り: ${formatInt(this.unpurchasedDilationUpgrades)}）`
          : `Purchase the remaining Dilation Upgrades (${formatInt(this.unpurchasedDilationUpgrades)} left)`);
      }
      if (this.currLog10EP > 1.3 * this.cheapestLog10TD) {
        arr.push(Localization.isJapanese
          ? `Time Dimensionを追加購入（最安: ${format(Decimal.pow10(this.cheapestLog10TD))} EP）`
          : `Purchase more TDs (cheapest: ${format(Decimal.pow10(this.cheapestLog10TD))} EP)`);
      }
      if (this.currLog10EP > 1.3 * this.multEPLog10Cost) {
        arr.push(Localization.isJapanese
          ? `${formatX(5)} EPアップグレードを追加購入（コスト: ${format(Decimal.pow10(this.multEPLog10Cost))} EP）`
          : `Purchase more ${formatX(5)} EP (cost: ${format(Decimal.pow10(this.multEPLog10Cost))} EP)`);
      }
      if (this.ecCount < 60) {
        arr.push(Localization.isJapanese
          ? `残りのEternity Challengeをクリア（${formatInt(this.ecCount)}/${formatInt(60)}）`
          : `Finish the rest of your ECs (Done: ${formatInt(this.ecCount)}/${formatInt(60)})`);
      }
      if (!this.hasDilated) {
        arr.push(Localization.text("Perform a Dilated Eternity", "Dilated Eternityを行う"));
      }
      if (this.availableCharges > 0) {
        arr.push(Localization.isJapanese
          ? `Infinity UpgradeをさらにCharge（可能: ${formatInt(this.availableCharges)}）`
          : `Charge more Infinity Upgrades (${formatInt(this.availableCharges)} available)`);
      }
      return arr;
    },
    canBeExpanded() {
      return this.canReality && this.suggestions.length !== 0;
    },
    styleObject() {
      const color = (!this.canReality || this.canBeExpanded) ? "var(--color-bad)" : "var(--color-good)";
      // Has both is and canBe in order to force the height back to its minimum size when all suggestions are done
      const height = (this.canBeExpanded && this.isExpanded) ? `${6.5 + 1.5 * this.suggestions.length}rem` : "5rem";
      return {
        color,
        height,
      };
    },
    clickText() {
      if (Localization.isJapanese) return this.isExpanded ? "（クリックで閉じる）" : "（クリックで開く）";
      return `(click to ${this.isExpanded ? "collapse" : "expand"})`;
    },
    realityReminderClass() {
      return {
        "c-reality-reminder": true,
        "c-reality-reminder-pointer": this.canBeExpanded,
      };
    },
    dropDownIconClass() {
      return this.isExpanded ? "far fa-minus-square" : "far fa-plus-square";
    }
  },
  created() {
    // Collapsing it after every reality resets the height to its fixed minimum value, stopping screen jitter
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, () => this.isExpanded = false);
  },
  methods: {
    update() {
      this.canReality = TimeStudy.reality.isBought;
      this.isVisible = !isInCelestialReality();
      this.ecCount = EternityChallenges.completions;
      this.missingAchievements = Achievements.preReality.countWhere(a => !a.isUnlocked);
      // Repeatable dilation upgrades don't have isBought, but do have boughtAmount
      this.unpurchasedDilationUpgrades = DilationUpgrade.all
        .countWhere(u => (u.isBought === undefined ? u.boughtAmount === 0 : !u.isBought) && !u.config.pelleOnly);
      this.currLog10EP = player.eternityPoints.log10();
      this.cheapestLog10TD = Math.min(...TimeDimensions.all.map(x => x.cost.log10()));
      this.multEPLog10Cost = EternityUpgrade.epMult.cost.log10();
      this.purchasableTS = NormalTimeStudyState.studies.countWhere(s => s && s.canBeBought && !s.isBought);
      this.hasDilated = Perk.startTP.canBeApplied ? player.dilation.lastEP.gt(0)
        : player.dilation.tachyonParticles.gt(0);
      this.availableCharges = Ra.chargesLeft;
    },
    clicked() {
      if (!this.canBeExpanded) return;
      this.isExpanded = !this.isExpanded;
    },
  }
};
</script>

<template>
  <div
    v-if="isVisible"
    :class="realityReminderClass"
    :style="styleObject"
    @click="clicked"
  >
    <span v-if="!canReality">
      {{ Localization.text(
        "You still need to unlock Reality in the Time Study Tree.",
        "Time Study TreeでRealityを解放する必要があります。"
      ) }}
    </span>
    <span v-else-if="suggestions.length === 0">
      {{ Localization.text(
        "Ready to Reality! You have unlocked every available upgrade within this Reality.",
        "Realityの準備完了！このReality内で利用可能なアップグレードをすべて解放済みです。"
      ) }}
    </span>
    <span v-else>
      <i :class="dropDownIconClass" />
      <template v-if="Localization.isJapanese">
        Reality前にやっておきたいことが {{ formatInt(suggestions.length) }} 件あります。{{ clickText }}
      </template>
      <template v-else>
        You have {{ quantifyInt("thing", suggestions.length) }}
        you may want to do before Reality. {{ clickText }}
      </template>
      <div
        v-if="isExpanded"
        class="l-suggestions"
      >
        <br>
        <div
          v-for="suggestion in suggestions"
          :key="suggestion"
        >
          {{ suggestion }}
        </div>
      </div>
    </span>
  </div>
</template>

<style scoped>
.l-suggestions {
  font-size: 1rem;
}

.c-reality-reminder-pointer {
  cursor: pointer;
}
</style>
