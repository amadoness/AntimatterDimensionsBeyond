<script>
import { BlackHoleAnimation } from "./black-hole-animation";
import BlackHoleChargingSliders from "./BlackHoleChargingSliders";
import BlackHoleStateRow from "./BlackHoleStateRow";
import BlackHoleUnlockButton from "./BlackHoleUnlockButton";
import BlackHoleUpgradeRow from "./BlackHoleUpgradeRow";

export default {
  name: "BlackHoleTab",
  components: {
    BlackHoleUpgradeRow,
    BlackHoleStateRow,
    BlackHoleChargingSliders,
    BlackHoleUnlockButton
  },
  data() {
    return {
      isDoomed: false,
      isUnlocked: false,
      isPaused: false,
      isEnslaved: false,
      isLaitela: false,
      pauseMode: 0,
      detailedBH2: "",
      isPermanent: false,
      hasBH2: false,
      blackHoleUptime: [],
      stateChange: "",
    };
  },
  computed: {
    blackHoles: () => BlackHoles.list,
    pauseModeString() {
      switch (this.pauseMode) {
        case BLACK_HOLE_PAUSE_MODE.NO_PAUSE:
          return Localization.text("Do not pause", "停止しない");
        case BLACK_HOLE_PAUSE_MODE.PAUSE_BEFORE_BH1:
          return this.hasBH2
            ? Localization.text("Before BH1", "BH1の前")
            : Localization.text("Before activation", "稼働前");
        case BLACK_HOLE_PAUSE_MODE.PAUSE_BEFORE_BH2:
          return Localization.text("Before BH2", "BH2の前");
        default:
          throw new Error("Unrecognized BH offline pausing mode");
      }
    },
  },
  mounted() {
    this.startAnimation();
  },
  destroyed() {
    if (this.animation) this.animation.unmount();
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.isUnlocked = BlackHoles.areUnlocked;
      this.isPaused = BlackHoles.arePaused;
      // If stop running enslaved, re-mount the black hole animation as it reappears
      if (this.isEnslaved && !Enslaved.isRunning) {
        if (this.animation) this.animation.unmount();
        this.startAnimation();
      }
      this.isEnslaved = Enslaved.isRunning;
      this.isLaitela = Laitela.isRunning;
      this.isPermanent = BlackHoles.arePermanent;
      this.pauseMode = player.blackHoleAutoPauseMode;
      this.hasBH2 = BlackHole(2).isUnlocked;
      this.blackHoleUptime = [BlackHole(1).duration / BlackHole(1).cycleLength,
        BlackHole(2).duration / BlackHole(2).cycleLength];
      this.detailedBH2 = this.bh2Status();

      if (player.blackHoleNegative < 1 && !this.isLaitela) {
        this.stateChange = this.isPaused
          ? Localization.text("Uninvert", "反転解除")
          : Localization.text("Invert", "反転");
      } else {
        this.stateChange = this.isPaused
          ? Localization.text("Unpause", "再開")
          : Localization.text("Pause", "一時停止");
      }
    },
    bh2Status() {
      const bh1Remaining = BlackHole(1).timeWithPreviousActiveToNextStateChange;
      const bh2Remaining = BlackHole(2).timeWithPreviousActiveToNextStateChange;

      // Both BH active
      if (BlackHole(1).isActive && BlackHole(2).isActive) {
        const bh2Duration = Math.min(bh1Remaining, bh2Remaining);
        const duration = TimeSpan.fromSeconds(bh2Duration).toStringShort();
        return Localization.isJapanese
          ? `Black Hole 2はあと${duration}稼働します！`
          : `Black Hole 2 is active for the next ${duration}!`;
      }

      // BH1 active, BH2 will trigger before BH1 runs out
      if (BlackHole(1).isActive && (bh2Remaining < bh1Remaining)) {
        const bh2Duration = Math.min(bh1Remaining - bh2Remaining, BlackHole(2).duration);
        const duration = TimeSpan.fromSeconds(bh2Duration).toStringShort();
        return Localization.isJapanese
          ? `Black Hole 1が停止する前にBlack Hole 2が稼働し、${duration}継続します。`
          : `Black Hole 2 will activate before Black Hole 1 deactivates,
            for ${duration}`;
      }

      // BH2 won't start yet next cycle
      if (BlackHole(1).isActive || (bh2Remaining > BlackHole(1).duration)) {
        const cycleCount = BlackHole(1).isActive
          ? Math.floor((bh2Remaining - bh1Remaining) / BlackHole(1).duration) + 1
          : Math.floor(bh2Remaining / BlackHole(1).duration);
        return Localization.isJapanese
          ? `Black Hole 1があと${formatInt(cycleCount)}回稼働した後、Black Hole 2が稼働します。`
          : `Black Hole 2 will activate after ${quantifyInt("more active cycle", cycleCount)} of Black Hole 1.`;
      }

      // BH1 inactive, BH2 ready to go when BH1 activates
      if (BlackHole(2).isCharged) {
        const bh2Duration = Math.min(BlackHole(1).duration, bh2Remaining);
        const duration = TimeSpan.fromSeconds(bh2Duration).toStringShort();
        return Localization.isJapanese
          ? `Black Hole 2はBlack Hole 1と同時に稼働し、${duration}継続します。`
          : `Black Hole 2 will activate with Black Hole 1,
            for ${duration}.`;
      }

      // BH1 inactive, BH2 starts at some point after BH1 activates
      const bh2Duration = Math.min(BlackHole(1).duration - bh2Remaining, BlackHole(2).duration);
      const delay = TimeSpan.fromSeconds(bh2Remaining).toStringShort();
      const duration = TimeSpan.fromSeconds(bh2Duration).toStringShort();
      return Localization.isJapanese
        ? `Black Hole 1の稼働から${delay}後にBlack Hole 2が稼働し、${duration}継続します。`
        : `Black Hole 2 will activate ${delay} after Black Hole 1, for ${duration}.`;
    },
    togglePause() {
      BlackHoles.togglePause();
      if (BlackHoles.arePaused) {
        player.celestials.enslaved.isAutoReleasing = false;
      }
      this.update();
    },
    changePauseMode() {
      let steps;
      switch (this.pauseMode) {
        case BLACK_HOLE_PAUSE_MODE.NO_PAUSE:
          // Note: We don't need to check for permanent BH2 because the button disappears at that point
          steps = BlackHole(1).isPermanent ? 2 : 1;
          break;
        case BLACK_HOLE_PAUSE_MODE.PAUSE_BEFORE_BH1:
          steps = this.hasBH2 ? 1 : 2;
          break;
        case BLACK_HOLE_PAUSE_MODE.PAUSE_BEFORE_BH2:
          steps = 1;
          break;
        default:
          throw new Error("Unrecognized BH offline pausing mode");
      }
      player.blackHoleAutoPauseMode = (this.pauseMode + steps) % Object.values(BLACK_HOLE_PAUSE_MODE).length;
    },
    startAnimation() {
      setTimeout(() => {
        if (this.$refs.canvas) {
          this.animation = new BlackHoleAnimation(this.$refs.canvas.getContext("2d"));
        }
      }, 1);
    },
    gridStyle() {
      return this.isPermanent ? "l-black-hole-upgrade-permanent" : "l-black-hole-upgrade-grid";
    },
  },
};
</script>

<template>
  <div class="l-black-hole-tab">
    <div
      v-if="isEnslaved || isDoomed"
      class="c-black-hole-disabled-description"
    >
      <i v-if="isEnslaved">
        {{ Localization.text("You must... seek... other methods...", "別の…方法を…探すのだ…") }}
        <br>
      </i>
      {{ Localization.text(
        "The physics of this Reality do not allow the existence of Black Holes.",
        "このRealityの物理法則ではBlack Holeは存在できません。"
      ) }}
    </div>
    <div
      v-else-if="!isUnlocked"
      class="l-pre-unlock-text"
    >
      <BlackHoleUnlockButton @blackholeunlock="startAnimation" />
      {{ Localization.text(
        "The Black Hole makes the entire game run significantly faster for a short period of time.",
        "Black Holeは短時間、ゲーム全体の進行速度を大幅に加速します。"
      ) }}
      <br>
      <template v-if="Localization.isJapanese">
        初期状態では1時間に1回、{{ formatInt(10) }}秒間 {{ formatX(180) }} 加速します。
      </template>
      <template v-else>
        Starts at {{ formatX(180) }} faster for {{ formatInt(10) }} seconds, once per hour.
      </template>
      <br>
      <br>
      {{ Localization.text(
        "Unlocking the Black Hole also gives",
        "Black Holeを解放するとAutomator Pointも"
      ) }} {{ formatInt(10) }}{{ Localization.text(" Automator Points.", "獲得します。") }}
    </div>
    <template v-else>
      <div class="c-subtab-option-container">
        <button
          class="o-primary-btn o-primary-btn--subtab-option"
          @click="togglePause"
        >
          {{ stateChange }} Black Hole
        </button>
        <button
          v-if="!isPermanent"
          class="o-primary-btn o-primary-btn--subtab-option l-auto-pause-button"
          @click="changePauseMode"
        >
          {{ Localization.text("Auto-pause:", "自動停止:") }} {{ pauseModeString }}
        </button>
      </div>
      <canvas
        ref="canvas"
        class="c-black-hole-canvas"
        width="400"
        height="400"
      />
      <div class="l-black-hole-upgrade-grid">
        <BlackHoleStateRow
          v-for="(blackHole, i) in blackHoles"
          :key="'state' + i"
          :black-hole="blackHole"
        />
        <span v-if="hasBH2 && !isPermanent">
          <b>{{ detailedBH2 }}</b>
          <br>
          {{ Localization.text(
            "The timer for Black Hole 2 only advances while Black Hole 1 is active.",
            "Black Hole 2のタイマーはBlack Hole 1の稼働中だけ進みます。"
          ) }}
          <br>
          {{ Localization.text(
            "Upgrades affect the internal timer; the header shows real time until next activation.",
            "アップグレードは内部タイマーに作用し、上部表示は次の稼働までの実時間を示します。"
          ) }}
        </span>
        <br>
        <div v-if="!isPermanent">
          <template v-if="Localization.isJapanese">
            Black Holeは稼働率が {{ formatPercents(0.9999, 2) }} を超えると永久稼働になります。
          </template>
          <template v-else>
            Black holes become permanently active when they are active for more than {{ formatPercents(0.9999, 2) }}
            of the time.
          </template>
          <br>
          {{ Localization.text("Active time percent:", "稼働率:") }} {{ formatPercents(blackHoleUptime[0], 3) }}
          <span v-if="hasBH2">
            {{ Localization.text("and", "/") }} {{ formatPercents(blackHoleUptime[1], 3) }}
          </span>
        </div>
        <BlackHoleChargingSliders
          v-if="!isLaitela"
          class="l-enslaved-shop-container"
        />
      </div>
      <div :class="gridStyle()">
        <BlackHoleUpgradeRow
          v-for="(blackHole, i) in blackHoles"
          :key="'upgrades' + i"
          :black-hole="blackHole"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.l-auto-pause-button {
  width: 30rem;
}

.l-pre-unlock-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.c-black-hole-disabled-description {
  font-size: 2.5rem;
  line-height: 1.5;
}
</style>
