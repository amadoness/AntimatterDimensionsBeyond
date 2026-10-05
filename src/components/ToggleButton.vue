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
      const onText = this.on === "ON" ? Localization.text("ON", "オン")
        : this.on === "Enabled" ? Localization.text("Enabled", "有効") : this.on;
      const offText = this.off === "OFF" ? Localization.text("OFF", "オフ")
        : this.off === "Disabled" ? Localization.text("Disabled", "無効") : this.off;
      return `${this.label} ${this.value ? onText : offText}`.trim();
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

