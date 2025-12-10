from playwright.sync_api import sync_playwright

def verify_all_styles_robust():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Enable console logging
        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
        page.on("pageerror", lambda err: print(f"ERROR: {err}"))

        print("Navigating...")
        page.goto("http://localhost:3000/index.html")
        page.wait_for_timeout(3000) # Wait for init

        styles = [
            "Bald", "Afro", "Bob", "Curly", "Long", "Medium", "Mohawk", "Ponytail", "Spiky",
            "Side Swept", "Slicked Back", "Asymmetric", "RO Spiky", "Twin Tails"
        ]

        for i, style in enumerate(styles):
            print(f"--- Attempting to set style {i}: {style} ---")

            # Use evaluate handle to ensure we are waiting for the promise/execution?
            # setHair is synchronous though.
            page.evaluate(f"window.poseEditor.setHair({i})")

            # Wait a bit
            page.wait_for_timeout(1000)

            # Check label
            label = page.inner_text("#hair-name")
            print(f"Current Label: {label}")

            if label != style:
                print(f"!!! FAIL: Expected {style}, got {label}")
            else:
                page.screenshot(path=f"verification/{i:02d}_{style.replace(' ', '_')}.png")
                print(f"Captured {style}")

        browser.close()

if __name__ == "__main__":
    verify_all_styles_robust()
