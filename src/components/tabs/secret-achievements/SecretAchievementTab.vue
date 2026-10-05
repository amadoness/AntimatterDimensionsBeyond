<script>
import SecretAchievementRow from "./SecretAchievementRow";

export default {
  name: "SecretAchievementTab",
  components: {
    SecretAchievementRow
  },
  computed: {
    rows: () => SecretAchievements.allRows,
  }
};
</script>

<template>
  <div class="l-achievements-tab">
    <div class="c-achievements-tab__header">
      <span>
        {{ Localization.text(
          "Secret Achievements are optional and give no bonuses.",
          "隠し実績は任意要素で、ゲーム上のボーナスはありません。"
        ) }}
      </span>
    </div>
    <div class="l-achievement-grid">
      <secret-achievement-row
        v-for="(row, i) in rows"
        :key="i"
        :row="row"
      />
    </div>
  </div>
</template>
