from playwright.sync_api import sync_playwright

def check_styles():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000/index.html")
        page.wait_for_timeout(3000)

        # Dump names
        names = page.evaluate("window.poseEditor.hairStyles.map(h => h.name)")
        print("Styles in browser:", names)

        browser.close()

if __name__ == "__main__":
    check_styles()
