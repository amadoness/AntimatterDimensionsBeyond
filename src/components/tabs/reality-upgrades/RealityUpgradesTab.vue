<script>
import RealityUpgradeButton from "./RealityUpgradeButton";

export default {
  name: "RealityUpgradesTab",
  components: {
    RealityUpgradeButton
  },
  computed: {
    upgrades: () => RealityUpgrades.all,
    costScalingTooltip: () => (Localization.isJapanese
      ? `${format(1e30)} RMを超えると価格上昇が速くなり、${format(Decimal.NUMBER_MAX_VALUE, 1)} RMを超えるとさらに加速します。`
      : `Prices start increasing faster above ${format(1e30)} RM and then even faster
        above ${format(Decimal.NUMBER_MAX_VALUE, 1)} RM`),
    possibleTooltip: () => Localization.text(
      "Checkered upgrades are impossible to unlock this Reality. Striped upgrades are still possible.",
      "格子柄のアップグレードはこのRealityでは解放不可能です。縞模様のものはまだ解放できます。"
    ),
    lockTooltip: () => Localization.text(
      "This will only function if you have not already failed the condition or unlocked the upgrade.",
      "条件をすでに失敗している場合や、アップグレードを解放済みの場合は機能しません。"
    ),
  },
  methods: {
    id(row, column) {
      return (row - 1) * 5 + column - 1;
    }
  }
};
</script>

<template>
  <div class="l-reality-upgrade-grid">
    <div class="c-reality-upgrade-infotext">
      {{ Localization.text("Mouseover", "追加情報は") }} <i class="fas fa-question-circle" />
      {{ Localization.text("icons for additional information.", "アイコンで確認できます。") }}
      <br>
      {{ Localization.text(
        "The first row of upgrades can be purchased endlessly for increasing costs",
        "1段目のアップグレードは、価格が上がり続けますが何度でも購入できます"
      ) }}
      <span :ach-tooltip="costScalingTooltip">
        <i class="fas fa-question-circle" />
      </span>
      {{ Localization.text("and the rest are single-purchase.", "。それ以外は1回だけ購入できます。") }}
      <br>
      {{ Localization.text(
        "Single-purchase upgrades also have requirements which, once completed, permanently unlock the ability to purchase the upgrades at any point.",
        "1回限りのアップグレードには解放条件があり、一度達成すれば以後いつでも購入可能になります。"
      ) }}
      <span :ach-tooltip="possibleTooltip">
        <i class="fas fa-question-circle" />
      </span>
      <br>
      {{ Localization.text(
        "Locked upgrades show their requirement and effect by default; unlocked ones show their effect, current bonus, and cost. Hold shift to swap this behavior.",
        "未解放では条件と効果、解放済みでは効果・現在の倍率・コストを表示します。Shiftを押すと表示を切り替えます。"
      ) }}
      <br>
      <template v-if="Localization.isJapanese">
        <i class="fas fa-lock-open" />付きアップグレードをShift+クリックすると、このReality中に解放条件を失敗する行動を防止できます。
      </template>
      <template v-else>
        You can shift-click upgrades with <i class="fas fa-lock-open" /> to make the game prevent you
        from doing anything this Reality which would cause you to fail their unlock condition.
      </template>
      <span :ach-tooltip="lockTooltip">
        <i class="fas fa-question-circle" />
      </span>
      <br>
      {{ Localization.text(
        "Every completed row of purchased upgrades increases your Glyph level by",
        "購入済みアップグレードを1行完成させるごとにGlyph Levelが"
      ) }} {{ formatInt(1) }}{{ Localization.text(".", "上がります。") }}
    </div>
    <div
      v-for="row in 5"
      :key="row"
      class="l-reality-upgrade-grid__row"
    >
      <RealityUpgradeButton
        v-for="column in 5"
        :key="id(row, column)"
        :upgrade="upgrades[id(row, column)]"
      />
    </div>
  </div>
</template>

<style scoped>
.c-reality-upgrade-infotext {
  color: var(--color-text);
  margin: -1rem 0 1.5rem;
}
</style>
