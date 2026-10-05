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
