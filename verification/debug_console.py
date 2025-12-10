from playwright.sync_api import sync_playwright

def verify_hairs():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Subscribe to console messages
        page.on("console", lambda msg: print(f"BROWSER CONSOLE: {msg.text}"))
        page.on("pageerror", lambda err: print(f"BROWSER ERROR: {err}"))

        print("Navigating...")
        page.goto("http://localhost:3000/index.html")

        # Wait a bit
        page.wait_for_timeout(3000)

        # Check if poseEditor exists
        is_defined = page.evaluate("typeof window.poseEditor !== 'undefined'")
        print(f"poseEditor defined: {is_defined}")

        if is_defined:
             page.evaluate("window.poseEditor.setHair(0)")
             print("Set hair to 0")

        browser.close()

if __name__ == "__main__":
    verify_hairs()
