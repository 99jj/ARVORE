# 🚀 Quick Start - Hand Pose Editor

## Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Local web server (for ES6 modules)

### Running the Editor

#### Option 1: Using Python (Recommended)
```bash
cd c:\Users\João Pedro\Desktop\ARVORE
python -m http.server 8000
```
Then open: `http://localhost:8000`

#### Option 2: Using Node.js
```bash
cd c:\Users\João Pedro\Desktop\ARVORE
npx http-server
```
Then open: `http://localhost:8080`

#### Option 3: Using VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"

---

## First Time Using It

1. **Open the editor** at `http://localhost:8000`
2. **You should see**:
   - A 3D scene with avatar hands
   - Control panel on the right (green terminal-style)
   - Green spheres representing arm joints

3. **Try these steps**:
   - Click on a green sphere to select a bone
   - Drag to move it around
   - Scroll to rotate
   - Use the right panel sliders for precise control

4. **Create your first seal**:
   - Adjust the hand pose as desired
   - Enter "Tiger" in the "Seal Name" field
   - Click "Generate Seal File"
   - Paste the generated code into: `AESIR/src/jutsus/seals/TigerSeal.js`

---

## File Structure Created

```
ARVORE/
├── index.html
├── src/
│   ├── main.js           ✨ NEW - Interactive pose editor
│   ├── poseEditor.js     ✨ NEW - Editor class with UI
│   └── sealGenerator.js  ✨ NEW - Generates seal files
└── POSE_EDITOR_GUIDE.md  ✨ NEW - Full documentation
```

---

## What Was Modified

### ✅ ARVORE/src/main.js
- **Changed from**: Basic 3D world with ground
- **Changed to**: Interactive hand pose editor
- Now imports and displays the AESIR avatar system
- Integrates PoseEditor for interactive control

### ✅ ARVORE/index.html
- **Updated styles**: Dark terminal look for pose editor
- **Cleaner UI**: Removed old info panel

---

## Using Generated Seals

After generating a seal with the editor:

1. Copy the generated code (automatically copied to clipboard)
2. Create new file: `AESIR/src/jutsus/seals/YourSealNameSeal.js`
3. Paste the code
4. Import and use in your jutsu system:

```javascript
import { TigerSeal } from './TigerSeal.js';
import { DragonSeal } from './DragonSeal.js';

const seals = [
    new TigerSeal(),
    new DragonSeal(),
    // ... more seals
];
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **X** | Lock/unlock X-axis movement |
| **Y** | Lock/unlock Y-axis movement |
| **Z** | Lock/unlock Z-axis movement |
| **Scroll** | Rotate selected bone around Z |
| **Drag** | Move selected bone |

---

## Troubleshooting

**Q: Module not found errors?**
A: You need to run a local server (see "Running the Editor" section)

**Q: Nothing appears in the 3D view?**
A: Check browser console (F12) for errors. Make sure AESIR files are accessible.

**Q: Seal file isn't pasting correctly?**
A: Make sure you:
1. Clicked "Generate Seal File"
2. Entered a valid seal name
3. Check browser console for any errors

**Q: Want to go back to the original ARVORE project?**
A: The original `main.js` is still available at `ARVORE/src/main.js` (we replaced it)
You can restore it from git if needed.

---

## Tips for Better Poses

1. **Start Simple**: Begin with basic hand positions before complex combinations
2. **Use Reference**: Keep the TigerSeal example open while creating new seals
3. **Save Often**: Use "Copy Pose JSON" between attempts
4. **Test Poses**: After creating a seal, test it in your main AESIR project
5. **Document**: Add comments in your seal files about the hand position

---

## Next Steps

✅ Create your first seal (Tiger, Dragon, Rat, etc.)
✅ Build a sequence of seals
✅ Animate transitions between seals
✅ Integrate into full jutsu system
✅ Add special effects to seal animations

---

Enjoy creating seals! 🐯🐲🐀
