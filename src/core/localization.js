const japaneseNames = {
  "Dimensions": "次元",
  "Antimatter Dimensions": "反物質次元",
  "Infinity Dimensions": "無限次元",
  "Time Dimensions": "時間次元",
  "Options": "オプション",
  "Saving": "セーブ",
  "Visual": "表示",
  "Gameplay": "ゲームプレイ",
  "Statistics": "統計",
  "Challenge records": "チャレンジ記録",
  "Past Prestige Runs": "過去の転生記録",
  "Multiplier Breakdown": "倍率内訳",
  "Glyph Set Records": "グリフセット記録",
  "Speedrun Milestones": "スピードラン・マイルストーン",
  "Speedrun Records": "スピードラン記録",
  "Achievements": "実績",
  "Secret Achievements": "隠し実績",
  "Automation": "自動化",
  "Autobuyers": "自動購入",
  "Automator": "オートメーター",
  "Challenges": "チャレンジ",
  "Infinity Challenges": "無限チャレンジ",
  "Eternity Challenges": "永遠チャレンジ",
  "Infinity": "無限",
  "Infinity Upgrades": "無限アップグレード",
  "Break Infinity": "無限突破",
  "Replicanti": "レプリカンティ",
  "Eternity": "永遠",
  "Time Studies": "時間研究",
  "Eternity Upgrades": "永遠アップグレード",
  "Eternity Milestones": "永遠マイルストーン",
  "Time Dilation": "時間膨張",
  "Reality": "現実",
  "Glyphs": "グリフ",
  "Reality Upgrades": "現実アップグレード",
  "Imaginary Upgrades": "虚数アップグレード",
  "Perks": "パーク",
  "Black Hole": "ブラックホール",
  "Glyph Alchemy": "グリフ錬金術",
  "Celestials": "セレスティアル",
  "Celestial Navigation": "セレスティアル案内",
  "The Nameless Ones": "名もなき者たち",
  "Shop": "ショップ"
};

export const Localization = {
  get language() {
    return player?.options?.language ?? "en";
  },

  get isJapanese() {
    return this.language === "ja";
  },

  text(english, japanese) {
    return this.isJapanese ? japanese : english;
  },

  name(english) {
    return this.isJapanese ? (japaneseNames[english] ?? english) : english;
  },

  setLanguage(language) {
    if (!["en", "ja"].includes(language)) return;
    player.options.language = language;
    GameStorage.save();
    GameUI.update();
  },

  toggleLanguage() {
    this.setLanguage(this.isJapanese ? "en" : "ja");
  }
};
