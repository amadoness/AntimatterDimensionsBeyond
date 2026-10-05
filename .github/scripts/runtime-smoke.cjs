const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const runtimeErrors = [];
  page.on("pageerror", err => runtimeErrors.push(`pageerror: ${err.message}`));
  page.on("console", msg => {
    if (msg.type() === "error") runtimeErrors.push(`console: ${msg.text()}`);
  });

  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle", timeout: 120000 });

  await page.waitForSelector(".l-antimatter-dim-tab", { state: "visible", timeout: 30000 });
  await page.waitForSelector(".c-dimension-row", { state: "visible", timeout: 30000 });

  const normalRows = await page.locator(".c-dimension-row:visible").count();
  if (normalRows < 1) throw new Error("No visible Antimatter Dimension rows in normal theme");

  await page.screenshot({ path: "runtime-normal.png", fullPage: true });

  await page.evaluate(() => {
    Tab.achievements.normal.show(true);
    GameUI.update();
  });
  await page.waitForSelector(".l-achievements-tab", { state: "visible", timeout: 30000 });
  await page.waitForSelector(".o-achievement", { state: "visible", timeout: 30000 });
  await page.locator(".o-achievement").first().hover();
  await page.waitForFunction(() => document.body.innerText.includes("まずはここから"), null, { timeout: 30000 });
  await page.screenshot({ path: "runtime-achievements.png", fullPage: true });

  await page.setViewportSize({ width: 980, height: 1200 });
  const firstAchievementRow = page.locator(".l-achievement-grid__row:visible").first();
  const lastAchievement = firstAchievementRow.locator(".o-achievement").last();
  const lastAchievementBox = await lastAchievement.boundingBox();
  if (!lastAchievementBox || lastAchievementBox.x + lastAchievementBox.width > 980.5) {
    throw new Error(`Achievement row is clipped on a 980px mobile viewport: ${JSON.stringify(lastAchievementBox)}`);
  }
  await lastAchievement.hover();
  const lastTooltip = lastAchievement.locator(".o-achievement__tooltip");
  const lastTooltipBox = await lastTooltip.boundingBox();
  if (!lastTooltipBox || lastTooltipBox.x + lastTooltipBox.width > 980.5) {
    throw new Error(`Achievement tooltip is clipped on the right: ${JSON.stringify(lastTooltipBox)}`);
  }
  await page.screenshot({ path: "runtime-achievements-mobile.png", fullPage: true });
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.evaluate(() => {
    player.infinities = new Decimal(1);
    Tab.challenges.normal.show(true);
    GameUI.update();
  });
  await page.waitForSelector(".l-challenges-tab", { state: "visible", timeout: 30000 });
  await page.waitForFunction(
    () => document.body.innerText.includes("一部の通常チャレンジ"),
    null,
    { timeout: 30000 }
  );
  await page.screenshot({ path: "runtime-challenges.png", fullPage: true });

  await page.evaluate(() => {
    Tab.infinity.upgrades.show(true);
    GameUI.update();
  });
  await page.waitForSelector(".l-infinity-upgrades-tab", { state: "visible", timeout: 30000 });
  await page.waitForFunction(
    () => document.body.innerText.includes("総プレイ時間に応じて反物質次元に倍率がかかる"),
    null,
    { timeout: 30000 }
  );
  await page.screenshot({ path: "runtime-infinity.png", fullPage: true });

  await page.evaluate(() => {
    player.eternities = new Decimal(1);
    player.challenge.eternity.unlocked = 1;
    Tab.eternity.upgrades.show(true);
    GameUI.update();
  });
  await page.waitForSelector(".l-eternity-upgrades-grid", { state: "visible", timeout: 30000 });
  await page.waitForFunction(
    () => document.body.innerText.includes("未使用のEternity Pointに応じてInfinity Dimensionに倍率がかかる"),
    null,
    { timeout: 30000 }
  );
  await page.screenshot({ path: "runtime-eternity-upgrades.png", fullPage: true });

  await page.evaluate(() => {
    Tab.eternity.milestones.show(true);
    GameUI.update();
  });
  await page.waitForSelector(".l-eternity-milestone-grid", { state: "visible", timeout: 30000 });
  await page.waitForFunction(
    () => document.body.innerText.includes("Infinity Point倍率アップグレードの自動購入器を解放する"),
    null,
    { timeout: 30000 }
  );
  await page.screenshot({ path: "runtime-eternity-milestones.png", fullPage: true });

  await page.evaluate(() => {
    Tab.challenges.eternity.show(true);
    GameUI.update();
  });
  await page.waitForSelector(".c-challenge-box--eternity", { state: "visible", timeout: 30000 });
  await page.waitForFunction(
    () => document.body.innerText.includes("Time Dimensionが無効になる"),
    null,
    { timeout: 30000 }
  );
  await page.screenshot({ path: "runtime-eternity-challenges.png", fullPage: true });

  await page.evaluate(() => {
    player.eternities = new Decimal(1);
    Tab.eternity.studies.show(true);
    GameUI.update();
  });
  await page.waitForSelector(".l-time-studies-tab", { state: "visible", timeout: 30000 });
  await page.waitForFunction(
    () => document.body.innerText.includes("ティックスピードが弱い効果で第1 Time Dimensionにも作用する"),
    null,
    { timeout: 30000 }
  );
  await page.screenshot({ path: "runtime-time-studies.png", fullPage: true });

  await page.evaluate(() => {
    player.realities = 1;
    Tab.eternity.dilation.show(true);
    GameUI.update();
  });
  await page.waitForSelector(".l-dilation-tab", { state: "visible", timeout: 30000 });
  await page.waitForFunction(
    () => document.body.innerText.includes("Tachyon Particle:") &&
      document.body.innerText.includes("Dilated Time:"),
    null,
    { timeout: 30000 }
  );
  await page.screenshot({ path: "runtime-time-dilation.png", fullPage: true });

  await page.evaluate(() => {
    player.realities = 1;
    Tab.reality.upgrades.show(true);
    GameUI.update();
  });
  await page.waitForSelector(".l-reality-upgrade-grid", { state: "visible", timeout: 30000 });
  await page.waitForFunction(
    () => document.body.innerText.includes("Dilated Timeの獲得速度を強化する"),
    null,
    { timeout: 30000 }
  );
  await page.screenshot({ path: "runtime-reality-upgrades.png", fullPage: true });

  await page.evaluate(() => {
    Tab.reality.perks.show(true);
    GameUI.update();
  });
  await page.waitForSelector(".c-perk-tab", { state: "visible", timeout: 30000 });
  await page.waitForFunction(
    () => document.body.innerText.includes("購入したPerkは恒久的") &&
      PerkNetwork.nodes?.get(0)?.title?.includes("Reality Studyの実績条件を削除"),
    null,
    { timeout: 30000 }
  );
  await page.screenshot({ path: "runtime-perks.png", fullPage: true });

  await page.evaluate(() => {
    Tab.reality.hole.show(true);
    GameUI.update();
  });
  await page.waitForSelector(".l-black-hole-tab", { state: "visible", timeout: 30000 });
  await page.waitForFunction(
    () => document.body.innerText.includes("Black Holeは短時間、ゲーム全体の進行速度を大幅に加速します"),
    null,
    { timeout: 30000 }
  );
  await page.screenshot({ path: "runtime-black-hole.png", fullPage: true });

  await page.evaluate(() => {
    player.realities = 1;
    Tab.reality.glyphs.show(true);
    GameUI.update();
  });
  await page.waitForSelector(".l-glyphs-tab", { state: "visible", timeout: 30000 });
  await page.waitForFunction(
    () => document.body.innerText.includes("Glyphはドラッグまたはダブルクリックで装備できます。") &&
      document.body.innerText.includes("現在有効なGlyph効果:"),
    null,
    { timeout: 30000 }
  );
  await page.screenshot({ path: "runtime-glyphs.png", fullPage: true });

  await page.evaluate(() => {
    Tab.dimensions.antimatter.show(true);
    GameUI.update();
  });
  await page.waitForSelector(".l-antimatter-dim-tab", { state: "visible", timeout: 30000 });

  await page.evaluate(() => {
    player.options.newUI = false;
    ui.view.newUI = false;
    Theme.set("S12");
    GameUI.update();
  });

  await page.waitForSelector(".c-s12-window__inner", { state: "visible", timeout: 30000 });
  await page.waitForSelector(".c-dimension-row", { state: "visible", timeout: 30000 });

  const s12Rows = await page.locator(".c-dimension-row:visible").count();
  if (s12Rows < 1) throw new Error("No visible Antimatter Dimension rows in S12 theme");

  const bodyText = await page.locator("body").innerText();
  if (!bodyText.includes("反物質") && !bodyText.includes("Antimatter")) {
    throw new Error("Main game text is missing after localization");
  }

  await page.screenshot({ path: "runtime-s12.png", fullPage: true });

  if (runtimeErrors.length) {
    throw new Error(`Runtime browser errors detected:\n${runtimeErrors.join("\n")}`);
  }

  console.log(`Runtime smoke test passed. Normal rows=${normalRows}, S12 rows=${s12Rows}`);
  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
