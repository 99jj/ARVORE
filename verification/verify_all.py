from playwright.sync_api import sync_playwright

def verify_all_styles():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating...")
        page.goto("http://localhost:3000/index.html")
        page.wait_for_timeout(2000) # Wait for init

        styles = [
            "Bald", "Afro", "Bob", "Curly", "Long", "Medium", "Mohawk", "Ponytail", "Spiky",
            "Side Swept", "Slicked Back", "Asymmetric", "RO Spiky", "Twin Tails"
        ]

        for i, style in enumerate(styles):
            print(f"Setting style {i}: {style}")
            page.evaluate(f"window.poseEditor.setHair({i})")
            page.wait_for_timeout(500) # Wait for render

            # Verify label
            label = page.inner_text("#hair-name")
            if label != style:
                print(f"WARNING: Label mismatch! Expected {style}, got {label}")

            # Screenshot
            safe_name = f"{i:02d}_{style.replace(' ', '_')}"
            page.screenshot(path=f"verification/{safe_name}.png")

        browser.close()

if __name__ == "__main__":
    verify_all_styles()
