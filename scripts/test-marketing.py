"""Local browser checks. Run against npm run dev; requires Python Playwright.

python3 scripts/test-marketing.py -v
Uses installed Chrome by default (CHEF_TEST_BROWSER_CHANNEL can override it).
"""
import os
import json
import subprocess
import unittest
from pathlib import Path

from playwright.sync_api import expect, sync_playwright

BASE_URL = "http://127.0.0.1:3001"


class MarketingTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(
            headless=True, channel=os.environ.get("CHEF_TEST_BROWSER_CHANNEL", "chrome")
        )

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()

    def setUp(self):
        self.context = self.browser.new_context(viewport={"width": 390, "height": 844})
        self.addCleanup(self.context.close)
        self.page = self.context.new_page()
        self.page.set_default_timeout(10000)

    def visit(self, path="/"):
        return self.page.goto(BASE_URL + path, wait_until="networkidle")

    def test_escape_closes_mobile_menu_and_restores_focus(self):
        self.visit()
        toggle = self.page.locator("button[aria-controls='mobile-menu']")
        toggle.click()
        self.page.locator("#mobile-menu a").first.focus()
        self.page.keyboard.press("Escape")
        self.assertEqual(toggle.get_attribute("aria-expanded"), "false")
        self.assertTrue(toggle.evaluate("el => el === document.activeElement"))

    def test_mobile_section_link_closes_menu(self):
        self.visit()
        toggle = self.page.locator("button[aria-controls='mobile-menu']")
        toggle.click()
        self.page.locator("#mobile-menu a[href='#features']").click()
        self.assertEqual(toggle.get_attribute("aria-expanded"), "false")
        self.assertTrue(self.page.url.endswith("#features"))

    def test_localized_pages_are_readable_without_javascript(self):
        with self.browser.new_context(java_script_enabled=False, viewport={"width": 390, "height": 844}) as context:
            page = context.new_page()
            for path, locale, heading in [
                ("/", "tr", "Elindekilerle bugün ne pişirsem?"),
                ("/en", "en", "What can I cook with what I have?"),
            ]:
                with self.subTest(locale=locale):
                    response = page.goto(BASE_URL + path, wait_until="networkidle")
                    self.assertEqual(response.status, 200)
                    self.assertEqual(page.locator("html").get_attribute("lang"), locale)
                    self.assertEqual(page.locator("main h1").inner_text(), heading)
                    self.assertFalse(page.locator(".menu-toggle").is_visible())
                    for section_heading in page.locator("main h2").all():
                        section_heading.scroll_into_view_if_needed()
                        self.assertTrue(section_heading.is_visible())
                        self.assertEqual(section_heading.evaluate("el => getComputedStyle(el).opacity"), "1")

    def test_localized_missing_pages_have_404_metadata(self):
        for prefix, locale, title in [
            ("", "tr", "Sayfa bulunamadı — Chef-AI"),
            ("/en", "en", "Page not found — Chef-AI"),
        ]:
            for path in ["/not-a-page", "/invite/invalid"]:
                with self.subTest(path=prefix + path):
                    response = self.visit(prefix + path)
                    self.assertEqual(response.status, 404)
                    self.assertEqual(self.page.locator("html").get_attribute("lang"), locale)
                    self.assertEqual(self.page.title(), title)
                    self.assertIn("noindex", self.page.locator('meta[name="robots"]').first.get_attribute("content"))

    def test_language_switch_preserves_section_and_history(self):
        self.visit("/#features")
        switch = self.page.locator("header .language-switch")
        expect(switch).to_have_attribute("href", "/en#features")
        switch.click()
        self.page.wait_for_url(BASE_URL + "/en#features")
        expect(self.page.locator("html")).to_have_attribute("lang", "en")
        self.page.reload(wait_until="networkidle")
        self.assertIn("What can I cook", self.page.locator("h1").inner_text())
        self.page.go_back(wait_until="networkidle")
        expect(self.page.locator("html")).to_have_attribute("lang", "tr")
        self.assertTrue(self.page.url.endswith("/#features"))
        self.page.go_forward(wait_until="networkidle")
        expect(self.page.locator("html")).to_have_attribute("lang", "en")

    def test_invite_keeps_code_across_languages_and_rejects_invalid_codes(self):
        self.visit("/invite/chef-abcdefghijkl")
        expect(self.page.locator(".invite-code")).to_have_text("CHEF-ABCDEFGHIJKL")
        self.page.locator("header .language-switch").click()
        self.page.wait_for_url(BASE_URL + "/en/invite/chef-abcdefghijkl")
        expect(self.page.locator("html")).to_have_attribute("lang", "en")
        expect(self.page.locator(".invite-code")).to_have_text("CHEF-ABCDEFGHIJKL")
        self.page.reload(wait_until="networkidle")
        self.assertIn("You’re invited", self.page.title())
        for prefix in ["", "/en"]:
            for code in ["CHEF-ABC", "CHEF-ABCDEFGHIJKLM", "CHEF-%25ABCD", "CHEF-%253Cscript%253E"]:
                with self.subTest(code=prefix + code):
                    self.assertEqual(self.visit(prefix + "/invite/" + code).status, 404)
                    self.assertEqual(self.page.locator(".invite-code").count(), 0)

    def test_store_urls_only_accept_https_product_pages(self):
        cases = [
            [None, "ios", None], ["", "android", None],
            ["javascript:alert(1)", "ios", None],
            ["http://apps.apple.com/app/id123", "ios", None],
            ["https://apps.apple.com.evil.invalid/app/id123", "ios", None],
            ["https://user:password@apps.apple.com/app/id123", "ios", None],
            ["https://apps.apple.com:444/app/id123", "ios", None],
            ["https://apps.apple.com/", "ios", None],
            ["https://apps.apple.com/app/id123#other", "ios", None],
            ["https://play.google.com/store/apps/details", "android", None],
            ["https://play.google.com/store/apps/details?id=invalid", "android", None],
            ["https://apps.apple.com/app/id123", "android", None],
            ["https://apps.apple.com/us/app/example/id123", "ios", "https://apps.apple.com/us/app/example/id123"],
            ["https://play.google.com/store/apps/details?id=com.example.app", "android", "https://play.google.com/store/apps/details?id=com.example.app"],
        ]
        result = subprocess.run(
            ["node", "-e", "const {storeUrl}=require('./lib/marketing.ts'); const cases=JSON.parse(require('node:fs').readFileSync(0,'utf8')); process.stdout.write(JSON.stringify(cases.map(([url,store])=>storeUrl(url,store))))"],
            input=json.dumps(cases), text=True, capture_output=True, check=True,
            cwd=Path(__file__).resolve().parent.parent, timeout=10,
        )
        self.assertEqual(json.loads(result.stdout), [case[2] for case in cases])

    def test_responsive_pages_and_enlarged_text_do_not_overflow(self):
        for path in ["/", "/en", "/invite/CHEF-ABCDEFGHIJKL", "/en/invite/CHEF-ABCDEFGHIJKL"]:
            self.visit(path)
            for width in [320, 390, 768, 1024, 1440, 1920]:
                with self.subTest(path=path, width=width):
                    self.page.set_viewport_size({"width": width, "height": 900})
                    self.assertLessEqual(self.page.evaluate("document.documentElement.scrollWidth"), width)
            # Desktop 200% zoom has half the CSS viewport; also stress text-only enlargement.
            self.page.set_viewport_size({"width": 720, "height": 450})
            self.assertLessEqual(self.page.evaluate("document.documentElement.scrollWidth"), 720)
            self.page.set_viewport_size({"width": 1440, "height": 1000})
            self.page.evaluate("document.documentElement.style.fontSize = '200%'")
            with self.subTest(path=path, text_size="200%"):
                self.assertLessEqual(self.page.evaluate("document.documentElement.scrollWidth"), 1440)

    def test_reduced_motion_stops_ticket_and_hover_movement(self):
        self.page.emulate_media(reduced_motion="reduce")
        self.page.set_viewport_size({"width": 1440, "height": 1000})
        self.visit()
        ticket = self.page.locator(".recipe-paper")
        self.assertEqual(ticket.evaluate("el => getComputedStyle(el).transform"), "none")
        self.assertEqual(ticket.evaluate("el => el.getAnimations().length"), 0)
        self.page.locator(".button-primary").hover()
        self.assertEqual(self.page.locator(".button-primary").evaluate("el => getComputedStyle(el).transform"), "none")
        self.page.evaluate("window.scrollTo({top: 400, behavior: 'instant'})")
        self.assertEqual(ticket.evaluate("el => getComputedStyle(el).transform"), "none")
        self.assertEqual(self.page.evaluate("getComputedStyle(document.documentElement).scrollBehavior"), "auto")

    def test_text_and_keyboard_focus_meet_contrast_targets(self):
        self.visit()
        self.page.keyboard.press("Tab")
        expect(self.page.locator(".skip-link")).to_be_focused()
        self.assertGreaterEqual(self.page.locator(".skip-link").bounding_box()["y"], 0)
        self.page.keyboard.press("Enter")
        expect(self.page.locator("main")).to_be_focused()
        for selector in [".button-primary", "header .language-switch"]:
            target = self.page.locator(selector)
            target.focus()
            self.assertEqual(target.evaluate("el => getComputedStyle(el).outlineStyle"), "solid")
            self.assertGreaterEqual(float(target.evaluate("el => getComputedStyle(el).outlineWidth").removesuffix("px")), 2)
        for path in ["/", "/en", "/invite/CHEF-ABCDEFGHIJKL", "/en/not-a-page"]:
            self.visit(path)
            failures = self.page.evaluate("""() => {
              const rgb = value => (value.match(/[\\d.]+/g) || []).map(Number);
              const luminance = value => rgb(value).slice(0, 3).map(x => {
                const n = x / 255; return n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4;
              }).reduce((sum, x, i) => sum + x * [.2126, .7152, .0722][i], 0);
              const background = el => {
                for (let current = el; current; current = current.parentElement) {
                  const value = getComputedStyle(current).backgroundColor;
                  if (rgb(value).length === 3 || rgb(value)[3] === 1) return value;
                }
                return 'rgb(255, 255, 255)';
              };
              const failures = [];
              for (const el of document.querySelectorAll('main p, main li, h1, h2, h3, a')) {
                const style = getComputedStyle(el);
                if (!el.getClientRects().length || !el.textContent.trim()) continue;
                const fg = luminance(style.color), bg = luminance(background(el));
                const ratio = (Math.max(fg, bg) + .05) / (Math.min(fg, bg) + .05);
                const large = parseFloat(style.fontSize) >= 24 || (parseFloat(style.fontSize) >= 18.66 && parseInt(style.fontWeight) >= 700);
                if (ratio < (large ? 3 : 4.5)) failures.push({text: el.textContent.trim().slice(0, 60), ratio});
              }
              for (const selector of ['.button-primary', 'header .language-switch']) {
                const el = document.querySelector(selector);
                if (!el) continue;
                el.focus();
                const fg = luminance(getComputedStyle(el).outlineColor), bg = luminance(background(el.parentElement));
                const ratio = (Math.max(fg, bg) + .05) / (Math.min(fg, bg) + .05);
                if (ratio < 3) failures.push({focus: selector, ratio});
              }
              return failures;
            }""")
            self.assertEqual(failures, [], path)

    def test_working_links_touch_targets_and_clean_console(self):
        errors = []
        self.page.on("pageerror", lambda error: errors.append(str(error)))
        self.page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
        for path in ["/", "/en", "/invite/CHEF-ABCD", "/en/invite/CHEF-ABCD"]:
            self.assertEqual(self.visit(path).status, 200)
            self.assertEqual(self.page.locator("main").count(), 1)
            self.assertEqual(self.page.locator("h1").count(), 1)
            self.assertEqual(self.page.locator('a[href="#"]').count(), 0)
            self.assertEqual(self.page.locator(".store-pending").count(), 2)
            self.assertEqual(self.page.locator(".store-badges a").count(), 0)
            for link in self.page.locator('a[href^="#"]').all():
                target = link.get_attribute("href")[1:]
                self.assertTrue(self.page.evaluate("id => Boolean(document.getElementById(id))", target), target)
            # The Next development toolbar is outside the website's landmarks.
            for control in self.page.locator("header a, header button, main a, main button, footer a, footer button").all():
                if control.is_visible() and control.get_attribute("class") != "skip-link":
                    box = control.bounding_box()
                    self.assertGreaterEqual(box["height"], 44, control.inner_text())
                    self.assertGreaterEqual(box["width"], 44, control.inner_text())
        for path in ["/icon", "/apple-icon", "/app-screens/today.png", "/app-screens/pantry.png", "/app-screens/cook.png", "/sw.js"]:
            response = self.context.request.get(BASE_URL + path)
            self.assertEqual(response.status, 200, path)
            response.dispose()
        self.assertEqual(errors, [])


if __name__ == "__main__":
    unittest.main()
