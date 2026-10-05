<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "PerkPointLabel",
  components: {
    PrimaryButton
  },
  data() {
    return {
      pp: 0,
      treeLayout: 0,
      physicsEnabled: false,
      physicsOverride: false,
    };
  },
  computed: {
    layoutText() {
      const english = PerkLayouts[this.treeLayout].buttonText;
      if (!Localization.isJapanese) return english;
      const japanese = [
        "標準配置",
        "ランダム配置",
        "Android配置",
        "四角配置",
        "横グリッド",
        "STARTからの距離",
        "かたまり"
      ];
      return japanese[this.treeLayout] ?? english;
    },
    physicsText() {
      const enabled = this.physicsOverride ?? this.physicsEnabled;
      const enableStr = enabled
        ? Localization.text("Enabled", "有効")
        : Localization.text("Disabled", "無効");
      const fixed = this.physicsOverride === undefined ? "" : Localization.text(" (fixed)", "（固定）");
      return `${enableStr}${fixed}`;
    }
  },
  created() {
    this.treeLayout = player.options.perkLayout;
    this.physicsOverride = PerkLayouts[this.treeLayout].forcePhysics;
  },
  methods: {
    update() {
      this.pp = Math.floor(Currency.perkPoints.value);
      this.physicsEnabled = player.options.perkPhysicsEnabled;
    },
    togglePhysics() {
      if (this.physicsOverride !== undefined) return;
      player.options.perkPhysicsEnabled = !player.options.perkPhysicsEnabled;
      PerkNetwork.setPhysics(player.options.perkPhysicsEnabled);
    },
    physicsClassObject() {
      return {
        "o-primary-btn c-button-physics": true,
        "o-primary-btn--disabled": this.physicsOverride !== undefined
      };
    },
    centerTree() {
      PerkNetwork.resetPosition(true);
    },
    straightenEdges() {
      PerkNetwork.setEdgeCurve(false);
      PerkNetwork.setEdgeCurve(true);
    },
    cycleLayout() {
      // Step forward once, but if this lands us on a locked layout, keep stepping until it doesn't
      let newIndex = (player.options.perkLayout + 1) % PerkLayouts.length;
      while (!(PerkLayouts[newIndex].isUnlocked?.() ?? true)) {
        newIndex = (newIndex + 1) % PerkLayouts.length;
      }

      player.options.perkLayout = newIndex;
      this.treeLayout = newIndex;
      this.physicsOverride = PerkLayouts[this.treeLayout].forcePhysics;
      PerkNetwork.currentLayout = PerkLayouts[this.treeLayout];
      PerkNetwork.setPhysics(player.options.perkPhysicsEnabled);
      PerkNetwork.moveToDefaultLayoutPositions(this.treeLayout);
    }
  }
};
</script>

<template>
  <div class="c-perk-tab__header">
    <template v-if="Localization.isJapanese">
      Perk Point: <span class="c-perk-tab__perk-points">{{ format(pp, 2) }}</span>
    </template>
    <template v-else>
      You have <span class="c-perk-tab__perk-points">{{ format(pp, 2) }}</span> {{ pluralize("Perk Point", pp) }}.
    </template>
    <br>
    {{ Localization.text(
      "Perk choices are permanent and cannot be respecced.",
      "購入したPerkは恒久的で、振り直すことはできません。"
    ) }}
    <br>
    {{ Localization.text(
      "Diamond-shaped perks also give Automator Points.",
      "ひし形のPerkはAutomator Pointも獲得できます。"
    ) }}
    <br>
    <div class="perk-settings">
      <PrimaryButton
        class="o-primary-btn c-button-perk-layout"
        @click="cycleLayout"
      >
        {{ Localization.text("Perk Layout:", "Perk配置:") }} {{ layoutText }}
      </PrimaryButton>
      <PrimaryButton
        :class="physicsClassObject()"
        @click="togglePhysics"
      >
        {{ Localization.text("Physics:", "物理演算:") }} {{ physicsText }}
      </PrimaryButton>
      <br>
      <PrimaryButton
        class="o-primary-btn"
        @click="centerTree"
      >
        {{ Localization.text("Center Tree on START", "STARTを中央にする") }}
      </PrimaryButton>
      <PrimaryButton
        class="o-primary-btn"
        @click="straightenEdges"
      >
        {{ Localization.text("Straighten Edges", "接続線を整える") }}
      </PrimaryButton>
    </div>
  </div>
</template>

<style scoped>
.perk-settings > button {
  margin-right: 1rem;
}

.c-button-perk-layout {
  width: 30rem;
  margin-bottom: 1rem;
}

.c-button-physics {
  width: 27rem;
  margin-bottom: 1rem;
}
</style>
