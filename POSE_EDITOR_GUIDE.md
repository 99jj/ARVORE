# 🎮 Interactive Hand Pose Editor

An interactive 3D hand pose simulator built with Three.js to easily create and save hand seal positions (jutsus) for the AESIR project.

## Features

✅ **Interactive Pose Manipulation**
- Click on arm/elbow/forearm bones to select them
- Drag with mouse to move bones on XY plane
- Scroll to rotate around Z axis
- Press X/Y/Z keys to lock movement to specific axis

✅ **Real-time Preview**
- Visual indicators (green/yellow spheres) show selectable bones
- Immediate feedback of pose changes
- Smooth animation

✅ **Position & Rotation Control**
- Fine-tune via sliders in the control panel
- Precise numeric input for both position and rotation
- All three axes (x, y, z) independently controllable

✅ **Save & Load Poses**
- **Copy Pose JSON**: Export current pose as JSON to clipboard
- **Paste Pose JSON**: Import previously saved pose from clipboard
- **Generate Seal File**: Auto-generate a complete seal class file ready to use

## How to Use

### 1. Start the Editor
```bash
cd ARVORE
# Open index.html in a browser (use a local server for modules)
```

### 2. Manipulate the Hand
1. **Select a bone**: Click on any green sphere (represents arm/elbow/forearm)
2. **Move**: Drag the mouse to reposition on XY plane
3. **Rotate**: Scroll up/down to rotate around Z axis
4. **Fine-tune**: Use sliders on the right panel or keyboard shortcuts

### 3. Lockdown Movement (Optional)
- Press **X** to lock movement to X axis only
- Press **Y** to lock movement to Y axis only  
- Press **Z** to lock movement to Z axis only
- Press again to unlock

### 4. Save Your Pose

#### Option A: Export as JSON
```javascript
1. Click "Copy Pose JSON"
2. Paste into a file or use later with "Paste Pose JSON"
```

#### Option B: Generate Seal File (Recommended)
```javascript
1. Enter seal name in "Seal Name" field (e.g., "Tiger", "Dragon")
2. Click "Generate Seal File"
3. The complete seal class is copied to clipboard
4. Paste into: AESIR/src/jutsus/seals/YourSealSeal.js
5. Done! The seal is ready to use
```

### 5. Workflow Example

```
┌─────────────────────────────────────┐
│  Start with default pose            │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  Manipulate arms, wrists, fingers   │
│  (Drag, scroll, use sliders)        │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  Enter seal name (e.g., "Tiger")    │
│  Click "Generate Seal File"         │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  Paste into TigerSeal.js            │
│  Seal is ready to use!              │
└─────────────────────────────────────┘
```

## Generated Seal Format

When you generate a seal file, it creates a class like this:

```javascript
import { SealBase } from '../SealBase.js';

export class TigerSeal extends SealBase {
    getName() { return 'tiger'; }

    getPose() {
        return {
            leftArm: {
                shoulder: { x: -0.3, y: 0.5, z: -0.5 },
                elbow: { x: -2.0, y: 0.3, z: 0 },
                forearm: { x: 0, y: 0, z: 0 }
            },
            rightArm: {
                shoulder: { x: -0.3, y: -0.5, z: 0.5 },
                elbow: { x: -2.0, y: -0.3, z: 0 },
                forearm: { x: 0, y: 0, z: 0 }
            },
            wrists: {
                left: { x: 3.44, y: -1.57, z: 0.5 },
                right: { x: 3.44, y: 1.57, z: -0.5 }
            }
        };
    }
}
```

Just paste this into a file named `YourSealSeal.js` in the `AESIR/src/jutsus/seals/` folder!

## Control Panel Guide

### Left Side (Main View)
- **3D Scene**: Shows your avatar's hands and arms
- **Green/Yellow Spheres**: Click to select bones for manipulation

### Right Side (Control Panel)

| Button | Function |
|--------|----------|
| **-** | Toggle panel collapse |
| **Copy Pose JSON** | Export pose as JSON |
| **Paste Pose JSON** | Import pose from JSON |
| **Generate Seal File** | Create ready-to-use seal class |
| **Reset All** | Return to default pose |

### Sliders
- **Position**: Adjust X, Y, Z coordinates (-5 to +5)
- **Rotation**: Adjust rotation angles in radians (-2π to +2π)

## File Structure

```
ARVORE/
├── index.html              # Main HTML entry point
├── src/
│   ├── main.js            # Updated main file with pose editor
│   ├── poseEditor.js      # Pose editor class
│   └── sealGenerator.js   # Seal template generator
```

Connected to:
```
AESIR/
└── src/
    └── avatar/
        ├── skeleton.js    # Bone structure
        ├── leftArm.js     # Left arm mesh
        ├── rightArm.js    # Right arm mesh
        ├── leftHand.js    # Left hand & fingers
        └── rightHand.js   # Right hand & fingers
```

## Tips & Tricks

💡 **For Complex Poses**
1. Start with simple poses first
2. Work one arm at a time
3. Use the sliders for fine-tuning
4. Take multiple saves along the way

💡 **Reusing Existing Poses**
1. Open browser console
2. Find console.log output with pose JSON
3. Copy it
4. Use "Paste Pose JSON" to restore

💡 **Creating Seal Sequences**
- Create multiple seals using this editor
- Each seal is a static pose
- Use seal sequences in your jutsu combinations

## Troubleshooting

**Problem**: Bones won't move
- **Solution**: Make sure a bone is selected (should be yellow)

**Problem**: Movement feels jerky
- **Solution**: Try using the slider controls for smoother adjustment

**Problem**: Generated seal file looks wrong
- **Solution**: Make sure you're in the right pose before generating
- Use "Copy Pose JSON" first to verify the data

## Next Steps

1. Create more seals using this editor
2. Combine seals into jutsu sequences
3. Add animations between seals
4. Build your complete jutsu system!

---

**Created for AESIR - Interactive Hand Pose System** 🐯
