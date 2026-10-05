<script>
import AntimatterDimensionProgressBar from "./AntimatterDimensionProgressBar";
import AntimatterDimensionRow from "@/components/tabs/antimatter-dimensions/ModernAntimatterDimensionRow";
import AntimatterGalaxyRow from "@/components/tabs/antimatter-dimensions/ModernAntimatterGalaxyRow";
import DimensionBoostRow from "@/components/tabs/antimatter-dimensions/ModernDimensionBoostRow";
import PrimaryButton from "@/components/PrimaryButton";
import TickspeedRow from "@/components/tabs/antimatter-dimensions/TickspeedRow";

export default {
  name: "ModernAntimatterDimensionsTab",
  components: {
    PrimaryButton,
    AntimatterDimensionProgressBar,
    AntimatterDimensionRow,
    AntimatterGalaxyRow,
    DimensionBoostRow,
    TickspeedRow
  },
  data() {
    return {
      hasDimensionBoosts: false,
      buyUntil10: true,
      isSacrificeUnlocked: false,
      isSacrificeAffordable: false,
      buy10Mult: new Decimal(0),
      currentSacrifice: new Decimal(0),
      sacrificeBoost: new Decimal(0),
      disabledCondition: "",
      isQuickResetAvailable: false,
      hasContinuum: false,
      isContinuumActive: false,
      multiplierText: "",
      isFullyAutomated: false,
    };
  },
  computed: {
    sacrificeTooltip() {
      if (this.isFullyAutomated) {
        return Localization.text(
          "Sacrifice autobuyer is enabled and Achievement 118 is unlocked, so Sacrifice is now fully automated",
          "生贄の自動購入が有効で実績118を達成済みのため、生贄は完全自動化されています"
        );
      }
      return Localization.isJapanese
        ? `第8反物質次元を ${formatX(this.sacrificeBoost, 2, 2)} 強化`
        : `Boosts 8th Antimatter Dimension by ${formatX(this.sacrificeBoost, 2, 2)}`;
    },
  },
  methods: {
    maxAll() {
      maxAll();
    },
    sacrifice() {
      sacrificeBtnClick();
    },
    // Toggle single/10 without Continuum, otherwise cycle through all 3 if it's unlocked
    changeBuyMode() {
      if (!this.hasContinuum) {
        player.buyUntil10 = !player.buyUntil10;
        return;
      }
      // "Continuum" => "Until 10" => "Buy 1" => "Continuum"
      if (this.isContinuumActive) {
        Laitela.setContinuum(false);
        player.buyUntil10 = true;
      } else if (player.buyUntil10) {
        player.buyUntil10 = false;
      } else {
        if (ImaginaryUpgrade(21).isLockingMechanics && player.auto.disableContinuum) {
          ImaginaryUpgrade(21).tryShowWarningModal();
          return;
        }
        Laitela.setContinuum(true);
      }
    },
    getUntil10Display() {
      if (this.isContinuumActive) return Localization.text("Continuum", "連続購入");
      return this.buyUntil10
        ? Localization.text("Until 10", "10個まで")
        : Localization.text("Buy 1", "1個購入");
    },
    update() {
      this.hasDimensionBoosts = player.dimensionBoosts > 0;
      this.buyUntil10 = player.buyUntil10;
      this.hasContinuum = Laitela.continuumUnlocked;
      this.isContinuumActive = Laitela.continuumActive;
      this.isQuickResetAvailable = Player.isInAntimatterChallenge && Player.antimatterChallenge.isQuickResettable;

      const isSacrificeUnlocked = Sacrifice.isVisible;
      this.isSacrificeUnlocked = isSacrificeUnlocked;

      this.buy10Mult.copyFrom(AntimatterDimensions.buyTenMultiplier);

      this.multiplierText = Localization.isJapanese
        ? `次元を10個購入した時の倍率: ${formatX(this.buy10Mult, 2, 2)}`
        : `Buy 10 Dimension purchase multiplier: ${formatX(this.buy10Mult, 2, 2)}`;
      if (!isSacrificeUnlocked) return;
      this.isFullyAutomated = Autobuyer.sacrifice.isActive && Achievement(118).isUnlocked;
      this.isSacrificeAffordable = Sacrifice.canSacrifice && !this.isFullyAutomated;
      this.currentSacrifice.copyFrom(Sacrifice.totalBoost);
      this.sacrificeBoost.copyFrom(Sacrifice.nextBoost);
      this.disabledCondition = Sacrifice.disabledCondition;
      let sacText = "";
      if (this.isSacrificeUnlocked) {
        sacText = Localization.isJapanese
          ? ` | 次元の生贄倍率: ${formatX(this.currentSacrifice, 2, 2)}`
          : ` | Dimensional Sacrifice multiplier: ${formatX(this.currentSacrifice, 2, 2)}`;
      }
      this.multiplierText += sacText;
    }
  }
};
</script>

<template>
  <div class="l-antimatter-dim-tab">
    <div class="modes-container">
      <button
        class="o-primary-btn l-button-container"
        @click="changeBuyMode"
      >
        {{ getUntil10Display() }}
      </button>
      <PrimaryButton
        v-show="isSacrificeUnlocked"
        v-tooltip="sacrificeTooltip"
        :enabled="isSacrificeAffordable"
        class="o-primary-btn--sacrifice"
        @click="sacrifice"
      >
        <span v-if="isSacrificeAffordable">
          {{ Localization.text("Dimensional Sacrifice", "次元の生贄") }} ({{ formatX(sacrificeBoost, 2, 2) }})
        </span>
        <span v-else-if="isFullyAutomated && disabledCondition !== ''">
          {{ Localization.text("Dimensional Sacrifice is Automated (Achievement 118)", "次元の生贄は自動化済み（実績118）") }}
        </span>
        <span v-else>{{ Localization.text("Dimensional Sacrifice Disabled", "次元の生贄は無効") }} ({{ disabledCondition }})</span>
      </PrimaryButton>
      <button
        class="o-primary-btn l-button-container"
        @click="maxAll"
      >
        {{ Localization.text("Max All (M)", "全て最大購入 (M)") }}
      </button>
    </div>
    <span>{{ multiplierText }}</span>
    <TickspeedRow />
    <div class="l-dimensions-container">
      <AntimatterDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
      />
    </div>
    <div class="resets-container">
      <DimensionBoostRow />
      <PrimaryButton
        v-if="isQuickResetAvailable"
        class="o-primary-btn--quick-reset"
        onclick="softReset(-1, true, true)"
      >
        {{ Localization.text("Perform a Dimension Boost reset", "次元ブーストのリセットを実行") }}
        <span v-if="hasDimensionBoosts">
          {{ Localization.text(" but lose a Dimension Boost", "（次元ブーストを1つ失う）") }}
        </span>
        <span v-else>{{ Localization.text(" for no gain", "（獲得なし）") }}</span>
      </PrimaryButton>
      <AntimatterGalaxyRow />
    </div>
    <AntimatterDimensionProgressBar />
  </div>
</template>

<style scoped>
.l-button-container {
  width: 100px;
  height: 30px;
  padding: 0;
}
</style>
