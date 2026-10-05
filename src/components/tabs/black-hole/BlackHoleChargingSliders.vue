<script>
import { Laitela } from "@/core/globals";

import SliderComponent from "@/components/SliderComponent";

export default {
  name: "BlackHoleChargingSliders",
  components: {
    SliderComponent
  },
  data() {
    return {
      isNegativeBHUnlocked: false,
      isInverted: false,
      isLaitela: false,
      negativeSlider: 0,
      negativeBHDivisor: 1,
      maxNegativeBlackHole: 300,
      isDisabled: false,
    };
  },
  computed: {
    infoTooltip() {
      return this.isLaitela
        ? Localization.text(
          "The physics of this Reality do not allow Black Hole Inversion",
          "このRealityの物理法則ではBlack Holeを反転できません"
        )
        : Localization.text(
          "Black Hole must be paused to activate Inversion",
          "反転を有効にするにはBlack Holeを一時停止する必要があります"
        );
    },
    reqLockText() {
      return Localization.isJapanese
        ? `「${ImaginaryUpgrade(24).name}」の条件ロック中は反転強度を変更できません`
        : `Inversion strength cannot be modified due to Lock for
          "${ImaginaryUpgrade(24).name}"`;
    }
  },
  methods: {
    update() {
      this.isNegativeBHUnlocked = V.isFlipped && BlackHoles.arePermanent;
      this.isInverted = BlackHoles.areNegative;
      this.isLaitela = Laitela.isRunning;
      this.negativeSlider = -Math.log10(player.blackHoleNegative);
      this.negativeBHDivisor = Math.pow(10, this.negativeSlider);
      const maxInversion = player.requirementChecks.reality.slowestBH <= 1e-300;
      this.isDisabled = ImaginaryUpgrade(24).isLockingMechanics && Ra.isRunning && maxInversion;
    },
    adjustSliderNegative(value) {
      this.negativeSlider = value;
      player.blackHoleNegative = Math.pow(10, -this.negativeSlider);
      player.requirementChecks.reality.slowestBH = Math.max(
        player.requirementChecks.reality.slowestBH,
        player.blackHoleNegative
      );
    },
    sliderProps(negative) {
      return {
        min: 0,
        max: negative ? this.maxNegativeBlackHole : 990,
        interval: 1,
        width: "55rem",
        tooltip: false
      };
    },
  }
};
</script>

<template>
  <div>
    <div
      v-if="isNegativeBHUnlocked"
      class="l-black-hole-sliders"
    >
      <b>
        <template v-if="Localization.isJapanese">
          反転Black Holeはゲーム速度を {{ format(negativeBHDivisor, 2, 2) }} で割ります。
          （現在 {{ isInverted ? "有効" : "無効" }}
        </template>
        <template v-else>
          Inverted Black Hole divides game speed by {{ format(negativeBHDivisor, 2, 2) }}.
          (Currently {{ isInverted ? "active" : "inactive" }}
        </template><span
          v-if="negativeSlider !== 0 && !isInverted"
          :ach-tooltip="infoTooltip"
        >
          <i class="fas fa-question-circle l-margin-left" />
        </span>)
      </b>
      <SliderComponent
        v-if="!isDisabled"
        v-bind="sliderProps(true)"
        :value="negativeSlider"
        @input="adjustSliderNegative($event)"
      />
      <div
        v-else
        class="l-lock-text"
      >
        {{ reqLockText }}
      </div>
      <br>
      {{ Localization.text(
        "Inverting the Black Hole only affects its own speedup, no other upgrades or effects, although it will also indirectly affect the Effarig Game speed power effect.",
        "Black Holeの反転はBlack Hole自身の加速効果だけに作用し、他のアップグレードや効果には直接影響しません。ただしEffarigのゲーム速度累乗効果には間接的に影響します。"
      ) }}
    </div>
  </div>
</template>

<style scoped>
.l-black-hole-sliders {
  width: 55rem;
  color: var(--color-text);
}

.l-margin-left {
  margin-left: 0.5rem;
}

.l-lock-text {
  font-weight: bold;
  color: var(--color-bad);
  margin: 0.5rem 0 -0.5rem;
}
</style>
