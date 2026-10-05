import {
  jaAchievementDescriptions,
  jaAchievementNames,
  jaAchievementRewards,
  jaBreakInfinityUpgradeDescriptions,
  jaEternityChallengeDescriptions,
  jaEternityChallengeRewards,
  jaEternityMilestoneActiveConditions,
  jaEternityMilestoneRewards,
  jaEternityUpgradeDescriptions,
  jaInfinityChallengeDescriptions,
  jaInfinityChallengeRewards,
  jaInfinityUpgradeDescriptions,
  jaNormalChallengeDescriptions,
  jaNormalChallengeRewards,
  jaSecretAchievementDescriptions,
  jaSecretAchievementNames
} from "./localization-ja-content";

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

  achievementName(id, fallback) {
    if (!this.isJapanese) return fallback;
    return jaAchievementNames[id] ?? fallback;
  },

  achievementDescription(id, fallback) {
    if (!this.isJapanese) return fallback;
    return jaAchievementDescriptions[id] ?? fallback;
  },

  achievementReward(id, fallback) {
    if (!this.isJapanese) return fallback;
    return jaAchievementRewards[id] ?? fallback;
  },

  secretAchievementName(id, fallback) {
    if (!this.isJapanese) return fallback;
    return jaSecretAchievementNames[id] ?? fallback;
  },

  secretAchievementDescription(id, fallback) {
    if (!this.isJapanese) return fallback;
    return jaSecretAchievementDescriptions[id] ?? fallback;
  },

  normalChallengeDescription(id, fallback) {
    if (!this.isJapanese) return fallback;
    return jaNormalChallengeDescriptions[id] ?? fallback;
  },

  normalChallengeReward(id, fallback) {
    if (!this.isJapanese) return fallback;
    return jaNormalChallengeRewards[id] ?? fallback;
  },

  infinityChallengeDescription(id, fallback) {
    if (!this.isJapanese) return fallback;
    return jaInfinityChallengeDescriptions[id] ?? fallback;
  },

  infinityChallengeReward(id, fallback) {
    if (!this.isJapanese) return fallback;
    return jaInfinityChallengeRewards[id] ?? fallback;
  },

  infinityUpgradeDescription(id, fallback, charged = false) {
    if (!this.isJapanese) return fallback;
    const entry = jaInfinityUpgradeDescriptions[id];
    if (entry === undefined) return jaBreakInfinityUpgradeDescriptions[id] ?? fallback;
    return charged ? (entry.charged ?? entry.normal ?? fallback) : (entry.normal ?? fallback);
  },

  eternityUpgradeDescription(id, fallback) {
    if (!this.isJapanese) return fallback;
    return jaEternityUpgradeDescriptions[id] ?? fallback;
  },

  eternityMilestoneReward(eternities, fallback) {
    if (!this.isJapanese) return fallback;
    return jaEternityMilestoneRewards[eternities] ?? fallback;
  },

  eternityMilestoneActiveCondition(eternities, fallback) {
    if (!this.isJapanese) return fallback;
    return jaEternityMilestoneActiveConditions[eternities] ?? fallback;
  },

  eternityChallengeDescription(id, fallback) {
    if (!this.isJapanese) return fallback;
    return jaEternityChallengeDescriptions[id] ?? fallback;
  },

  eternityChallengeReward(id, fallback) {
    if (!this.isJapanese) return fallback;
    return jaEternityChallengeRewards[id] ?? fallback;
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
