from playwright.sync_api import sync_playwright

def verify_hairs():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
        page.on("pageerror", lambda err: print(f"ERROR: {err}"))

        print("Navigating...")
        page.goto("http://localhost:3000/index.html")
        page.wait_for_timeout(2000)

        print("Resetting to Bald...")
        page.evaluate("window.poseEditor.setHair(0)")
        page.wait_for_timeout(500)

        # Try to go to Bob (Index 2) directly
        print("Setting to Bob (Index 2)...")
        page.evaluate("window.poseEditor.setHair(2)")
        page.wait_for_timeout(500)
        idx = page.evaluate("window.poseEditor.currentHairIndex")
        lbl = page.inner_text("#hair-name")
        print(f"Index: {idx}, Label: {lbl}")

        # Try to go to Side Swept (Index 9) directly
        print("Setting to Side Swept (Index 9)...")
        page.evaluate("window.poseEditor.setHair(9)")
        page.wait_for_timeout(500)
        idx = page.evaluate("window.poseEditor.currentHairIndex")
        lbl = page.inner_text("#hair-name")
        print(f"Index: {idx}, Label: {lbl}")

        browser.close()

if __name__ == "__main__":
    verify_hairs()
