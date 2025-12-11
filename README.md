# 🎮 Interactive Hand Pose Editor

A visual system for creating hand seals without manual coordinate calculations.

## ⚡ Quick Start (2 minutes)

### 1. Start Server
```bash
cd c:\Users\João Pedro\Desktop\ARVORE
python -m http.server 8000
```

### 2. Open Browser
```
http://localhost:8000
```

### 3. Create Your First Seal
1. Click a green sphere (bone/joint)
2. Drag to move it, scroll to rotate
3. Type a name in "Seal Name" field (e.g., "Tiger")
4. Click "Generate Seal File"
5. Move the downloaded file to your seals folder

Done! 🎉

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `X` | Lock/unlock X-axis movement |
| `Y` | Lock/unlock Y-axis movement |
| `Z` | Lock/unlock Z-axis movement |
| `G` | Toggle helper visibility |
| `Scroll` | Rotate selected bone |
| `Click` | Select bone |
| `Drag` | Move bone on XY plane |

---

## 🎯 Control Panel Features

### Hair Styling
- **← / →** buttons - Cycle through 14 different hairstyles
- Current options: Bald, Afro, Bob, Curly, Long, Medium, Mohawk, Ponytail, Spiky, Side Swept, Slicked Back, Asymmetric, RO Spiky, Twin Tails

### Pose Management
- **Copy Pose** - Save current pose as JSON
- **Paste Pose** - Load previously saved pose
- **Mirror Left** - Mirror left arm to right
- **Mirror Right** - Mirror right arm to left
- **Reset All** - Return to default pose

### Seal Generation
- **Seal Name** - Enter name for your seal
- **Generate Seal File** - Create and download the seal file

### Manual Control
- **Position Sliders (X/Y/Z)** - Fine-tune bone positions
- **Rotation Sliders (X/Y/Z)** - Fine-tune bone rotations
- **Bones List** - Click any bone to select it

---

## 📁 Project Structure

```
ARVORE/
├── index.html                 - Main web page
├── package.json              - Project dependencies
├── README.md                 - This file
├── QUICK_REFERENCE.txt       - Keyboard shortcuts reference
├── SEAL_TEMPLATE.js          - Template for creating seals
│
└── src/
    ├── main.js               - Entry point
    ├── poseEditor.js         - Main coordinator
    ├── hairManager.js        - Hair system
    ├── helperManager.js      - Bone visualization
    ├── inputHandler.js       - Input handling
    ├── uiPanel.js            - UI management
    ├── poseSerializer.js     - Data persistence
    ├── poseOperations.js     - Pose operations
    ├── sealManager.js        - Seal generation
    ├── sealGenerator.js      - Code generation
    ├── defaultPose.js        - Default pose data
    │
    └── avatar/
        ├── head.js
        ├── torso.js
        ├── leftArm.js, rightArm.js
        ├── leftLeg.js, rightLeg.js
        └── hair/
            └── (14 different hair styles)
```

---

## 🔧 How It Works

1. **Visual Editing** - Click and drag bones in the 3D viewport
2. **Real-time Updates** - See position/rotation values update instantly
3. **Serialization** - Save poses as JSON for later reuse
4. **Code Generation** - Automatically generate seal class files
5. **Multiple Hair Styles** - Choose from 14 different hairstyles

---

## 📝 Creating a Seal (Step by Step)

1. **Position Arms**
   - Click the green sphere for shoulder/elbow/wrist
   - Drag to move, scroll to rotate
   - Use sliders for precise control

2. **Adjust Fingers**
   - Click finger joints to select them
   - Rotate with scroll wheel or sliders
   - Mirror between hands with buttons

3. **Save or Generate**
   - Click "Copy Pose" to save as JSON (for reuse)
   - Enter seal name and click "Generate Seal File"
   - Code is automatically created and copied to clipboard

4. **Use the File**
   - Download saves to your computer as `SealNameSeal.js`
   - Place in your AESIR project at `src/jutsus/seals/`
   - Done! The seal is ready to use

---

## 💡 Tips

- **Symmetry** - Use Mirror buttons to quickly match both sides
- **Reuse Poses** - Copy a pose JSON to clipboard for later
- **Small Adjustments** - Use rotation sliders for fine-tuning
- **Reset Often** - Click "Reset All" if you get confused
- **Save Work** - Copy your final pose JSON before generating the seal

---

## 🎨 Features

✅ 14 different hairstyles
✅ Full body pose editing (arms, legs, fingers)
✅ Real-time visualization with 3D helpers
✅ Keyboard shortcuts for power users
✅ Pose serialization (save/load)
✅ Automatic seal code generation
✅ Mirror pose functionality
✅ Reset to default pose

---

## 🚀 Server Options

**Python (Recommended)**
```bash
python -m http.server 8000
```

**Node.js**
```bash
npx http-server
```

**VS Code**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

---

## 📞 Troubleshooting

**Page won't load?**
- Make sure you're running a local server (not opening `index.html` directly)

**Bones not moving?**
- Click the green sphere to select it first
- Make sure you're not clicking inside the control panel

**Can't see helpers?**
- Press `G` to toggle visibility
- They should be green spheres around the skeleton

**Seal file won't generate?**
- Make sure you've entered a seal name
- Check browser console for error messages

---

Good luck creating your seals! 🎉
