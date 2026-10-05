<script>
export default {
  name: "OpenModalHotkeysButton",
  methods: {
    handleClick() {
      Modal.hotkeys.show();
    }
  }
};
</script>

<template>
  <p
    class="c-options-tab__hotkeys-link"
    @click="handleClick"
  >
    {{ Localization.text("Press", "ホットキー一覧は") }} <kbd>?</kbd>
    {{ Localization.text("to open the hotkey list.", "キーで開けます。") }}
  </p>
</template>
