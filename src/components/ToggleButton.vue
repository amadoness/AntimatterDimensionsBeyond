<script>
export default {
  name: "ToggleButton",
  props: {
    label: {
      type: String,
      required: false,
      default: ""
    },
    on: {
      type: String,
      required: false,
      default: "ON"
    },
    off: {
      type: String,
      required: false,
      default: "OFF"
    },
    value: {
      type: Boolean,
      required: true
    },
    tooltipClass: {
      type: String,
      required: false,
      default: ""
    },
    tooltipContent: {
      type: String,
      required: false,
      default: ""
    }
  },
  computed: {
    displayText() {
      let onText = this.on;
      let offText = this.off;
      if (this.on === "ON") onText = Localization.text("ON", "オン");
      if (this.on === "Enabled") onText = Localization.text("Enabled", "有効");
      if (this.off === "OFF") offText = Localization.text("OFF", "オフ");
      if (this.off === "Disabled") offText = Localization.text("Disabled", "無効");
      const stateText = this.value ? onText : offText;
      return `${this.label} ${stateText}`.trim();
    }
  },
};
</script>

<template>
  <button
    v-bind="$attrs"
    @click="emitInput(!value)"
  >
    {{ displayText }}
    <div
      v-if="tooltipClass"
      :class="tooltipClass"
    >
      {{ tooltipContent }}
    </div>
  </button>
</template>

