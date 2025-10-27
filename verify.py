from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:8080")
        page.click("text=Start Game")
        page.wait_for_selector(".grid-cols-5")
        page.screenshot(path="verification.png")
        browser.close()

run()
