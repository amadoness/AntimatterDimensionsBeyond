<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "PrimaryToggleButton",
  components: {
    PrimaryButton
  },
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
  <PrimaryButton
    v-bind="$attrs"
    @click="emitInput(!value)"
  >
    {{ displayText }}
  </PrimaryButton>
</template>

