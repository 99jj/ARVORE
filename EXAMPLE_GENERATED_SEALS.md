# 📋 Example Generated Seals

This document shows examples of what the pose editor generates for different seal positions.

## Example 1: Tiger Seal (Reference)

**Original TigerSeal.js format:**

```javascript
import { SealBase } from '../SealBase.js';

export class TigerSeal extends SealBase {
    getName() { return 'tiger'; }

    getPose() {
        return {
            leftArm: {
                shoulder: {
                    x: -0.3,
                    y: 0.5,
                    z: -0.5
                },
                elbow: {
                    x: -2.0,
                    y: 0.3,
                    z: 0
                },
                forearm: {
                    x: 0,
                    y: 0,
                    z: 0
                }
            },
            rightArm: {
                shoulder: {
                    x: -0.3,
                    y: -0.5,
                    z: 0.5
                },
                elbow: {
                    x: -2.0,
                    y: -0.3,
                    z: 0
                },
                forearm: {
                    x: 0,
                    y: 0,
                    z: 0
                }
            },
            wrists: {
                left: {
                    x: 3.4415926,
                    y: -1.5707963,
                    z: 0.5
                },
                right: {
                    x: 3.4415926,
                    y: 1.5707963,
                    z: -0.5
                }
            }
        };
    }
}
```

## Example 2: What You'll Generate

When you use the pose editor and generate a seal, you'll get **exactly this format** automatically:

```javascript
import { SealBase } from '../SealBase.js';

export class YourSealNameSeal extends SealBase {
    getName() { return 'yoursealname'; }

    getPose() {
        return {
            // Your exact pose values from visual editor
            leftArm: {
                shoulder: { x: YOUR_VALUES, y: YOUR_VALUES, z: YOUR_VALUES },
                elbow: { x: YOUR_VALUES, y: YOUR_VALUES, z: YOUR_VALUES },
                forearm: { x: YOUR_VALUES, y: YOUR_VALUES, z: YOUR_VALUES }
            },
            rightArm: {
                shoulder: { x: YOUR_VALUES, y: YOUR_VALUES, z: YOUR_VALUES },
                elbow: { x: YOUR_VALUES, y: YOUR_VALUES, z: YOUR_VALUES },
                forearm: { x: YOUR_VALUES, y: YOUR_VALUES, z: YOUR_VALUES }
            },
            wrists: {
                left: { x: YOUR_VALUES, y: YOUR_VALUES, z: YOUR_VALUES },
                right: { x: YOUR_VALUES, y: YOUR_VALUES, z: YOUR_VALUES }
            }
        };
    }
}
```

## Example 3: Sample Dragon Seal (Typical Output)

```javascript
import { SealBase } from '../SealBase.js';

export class DragonSeal extends SealBase {
    getName() { return 'dragon'; }

    getPose() {
        return {
            leftArm: {
                shoulder: {
                    x: -0.5,
                    y: 0.2,
                    z: -0.3
                },
                elbow: {
                    x: -1.5,
                    y: 0.1,
                    z: 0.2
                },
                forearm: {
                    x: 0.1,
                    y: -0.2,
                    z: 0.3
                }
            },
            rightArm: {
                shoulder: {
                    x: -0.5,
                    y: -0.2,
                    z: 0.3
                },
                elbow: {
                    x: -1.5,
                    y: -0.1,
                    z: -0.2
                },
                forearm: {
                    x: 0.1,
                    y: 0.2,
                    z: -0.3
                }
            },
            wrists: {
                left: {
                    x: 3.4,
                    y: -1.6,
                    z: 0.4
                },
                right: {
                    x: 3.4,
                    y: 1.6,
                    z: -0.4
                }
            }
        };
    }
}
```

## Example 4: Sample Rat Seal

```javascript
import { SealBase } from '../SealBase.js';

export class RatSeal extends SealBase {
    getName() { return 'rat'; }

    getPose() {
        return {
            leftArm: {
                shoulder: {
                    x: 0.1,
                    y: 0.8,
                    z: -0.2
                },
                elbow: {
                    x: -2.2,
                    y: 0.5,
                    z: 0.1
                },
                forearm: {
                    x: -0.3,
                    y: -0.1,
                    z: 0.2
                }
            },
            rightArm: {
                shoulder: {
                    x: 0.1,
                    y: -0.8,
                    z: 0.2
                },
                elbow: {
                    x: -2.2,
                    y: -0.5,
                    z: -0.1
                },
                forearm: {
                    x: -0.3,
                    y: 0.1,
                    z: -0.2
                }
            },
            wrists: {
                left: {
                    x: 3.2,
                    y: -1.4,
                    z: 0.6
                },
                right: {
                    x: 3.2,
                    y: 1.4,
                    z: -0.6
                }
            }
        };
    }
}
```

## How to Use These

### Step 1: Create File
Create `AESIR/src/jutsus/seals/DragonSeal.js`

### Step 2: Paste Code
Copy one of the examples above into the file

### Step 3: Import in Your Project
```javascript
import { DragonSeal } from './seals/DragonSeal.js';

const dragon = new DragonSeal();
const pose = dragon.getPose();
console.log(pose); // Shows all arm positions
```

## Understanding the Values

### Rotation Axes (in radians)
- **X axis**: Up/down rotation
- **Y axis**: Left/right rotation  
- **Z axis**: Twist rotation

### Common Values
| Value | Angle | Description |
|-------|-------|-------------|
| 0 | 0° | Neutral |
| 0.5236 | 30° | Slight rotation |
| 0.7854 | 45° | Medium rotation |
| 1.5708 | 90° | Right angle |
| 3.1416 | 180° | Reversed |
| 4.7124 | 270° | Three-quarters |
| -0.5236 | -30° | Opposite direction |

### Position Ranges
- Typical values range from **-3 to +3**
- Values used in examples: **-2.2 to +0.8**
- More extreme values will move arms farther out

## Tips for Understanding Generated Values

1. **leftArm/rightArm**: Main arm rotations (shoulder, elbow, forearm)
2. **wrists**: Hand/wrist rotations (usually around π radians)
3. **Negative X values** in elbow = bent arm
4. **Symmetric Y values** (opposite signs) = arms mirror each other
5. **Z values** control twist/rotation depth

## Testing Your Generated Seals

After creating a seal file:

```javascript
// Test script
import { TigerSeal } from './seals/TigerSeal.js';
import { DragonSeal } from './seals/DragonSeal.js';

const tiger = new TigerSeal();
const dragon = new DragonSeal();

console.log('Tiger pose:', tiger.getPose());
console.log('Dragon pose:', dragon.getPose());

// Use in sequence
const seals = [tiger, dragon, tiger, dragon];
seals.forEach(seal => {
    console.log(`Executing ${seal.getName()} seal with pose:`, seal.getPose());
});
```

## Common Seal Patterns

### Pattern 1: Hands Clasped (Interlocked)
Both arms bent inward, negative X values, Y values opposite signs

### Pattern 2: Hands Open (Palms Out)
Arms more extended, lower negative X in elbows, wider Y separation

### Pattern 3: Hands Crossed (Front)
Like Tiger Seal - arms cross in front of body, shoulders pulled in

### Pattern 4: Hands Raised (Above Head)
Higher Y values on shoulders, positive X rotations

### Pattern 5: Asymmetric (One Hand Different)
Different values for left vs right (not mirror images)

---

**The key insight:** Every seal is just **9 rotation values** (3 for each arm part, plus 2 wrist values). The pose editor captures these automatically!
