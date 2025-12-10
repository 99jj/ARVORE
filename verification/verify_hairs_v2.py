from playwright.sync_api import sync_playwright

def verify_hairs():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating...")
        page.goto("http://localhost:3000/index.html")
        page.wait_for_selector("#next-hair", state="visible")

        # Wait for the initial Medium set
        page.wait_for_timeout(2000)

        # Force Reset to Bald
        print("Resetting to Bald...")
        page.evaluate("window.poseEditor.setHair(0)")
        page.wait_for_timeout(500)

        # Check start
        start_label = page.inner_text("#hair-name")
        print(f"Start Label: {start_label}") # Should be Bald

        styles = [
            "Afro", "Bob", "Curly", "Long", "Medium", "Mohawk", "Ponytail", "Spiky",
            "Side Swept", "Slicked Back", "Asymmetric", "RO Spiky", "Twin Tails"
        ]

        for i, style in enumerate(styles):
            # Click
            page.click("#next-hair")

            # Wait for text to CHANGE from previous?
            # Or just wait a bit.
            page.wait_for_timeout(500)

            # Check
            current_label = page.inner_text("#hair-name")
            current_index = page.evaluate("window.poseEditor.currentHairIndex")
            print(f"Step {i+1}: Index={current_index}, Label='{current_label}' (Expected '{style}')")

            # Screenshot
            page.screenshot(path=f"verification/{i+1:02d}_{style.replace(' ', '_')}.png")

        browser.close()

if __name__ == "__main__":
    verify_hairs()
