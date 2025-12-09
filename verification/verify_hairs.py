from playwright.sync_api import sync_playwright

def verify_hairs():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Navigate
        print("Navigating to http://localhost:3000...")
        page.goto("http://localhost:3000/index.html")

        # 2. Wait for app ready
        print("Waiting for app initialization...")
        page.wait_for_selector("#next-hair", state="visible")

        # Wait extra time for the setTimeout(1000) in constructor to fire
        page.wait_for_timeout(2000)

        # 3. Reset to specific index (Bald = 0) via JS to ensure known state
        print("Resetting hair to Bald (Index 0)...")
        page.evaluate("window.poseEditor.setHair(0)")
        page.wait_for_timeout(500)

        # Capture Bald
        page.screenshot(path="verification/00_Bald.png")
        print("Captured 00_Bald")

        # 4. Cycle through all styles
        # Current list size in code I wrote:
        # Bald, Afro, Bob, Curly, Long, Medium, Mohawk, Ponytail, Spiky (9 original)
        # + Side Swept, Slicked Back, Asymmetric, RO Spiky, Twin Tails (5 new)
        # Total = 14 styles.

        # Starting from 0 (Bald), next click -> 1 (Afro)

        styles = [
            "Afro", "Bob", "Curly", "Long", "Medium", "Mohawk", "Ponytail", "Spiky",
            "Side Swept", "Slicked Back", "Asymmetric", "RO Spiky", "Twin Tails"
        ]

        for i, style_name in enumerate(styles):
            page.click("#next-hair")
            page.wait_for_timeout(500)

            # Get actual label
            current_label = page.inner_text("#hair-name")
            print(f"Click {i+1}: Expected '{style_name}', Got '{current_label}'")

            # Screenshot
            safe_name = f"{i+1:02d}_{style_name.replace(' ', '_')}"
            page.screenshot(path=f"verification/{safe_name}.png")

        browser.close()

if __name__ == "__main__":
    verify_hairs()
