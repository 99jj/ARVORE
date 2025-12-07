// ============================================
// SEAL CREATION TEMPLATE
// ============================================
// 
// Instructions:
// 1. Use the Hand Pose Editor (http://localhost:8000)
// 2. Arrange hands into desired seal position
// 3. Click "Generate Seal File"
// 4. Paste the generated code below
// 5. Rename this file to YourSealNameSeal.js
// 6. Import and use in your jutsu system
//
// ============================================

import { SealBase } from '../SealBase.js';

export class ExampleSeal extends SealBase {
    getName() { 
        return 'example'; 
    }

    getPose() {
        return {
            // LEFT ARM rotations
            leftArm: {
                shoulder: {
                    x: 0,  // Shoulder rotation X
                    y: 0,  // Shoulder rotation Y
                    z: 0   // Shoulder rotation Z
                },
                elbow: {
                    x: 0,  // Elbow rotation X (bend)
                    y: 0,  // Elbow rotation Y
                    z: 0   // Elbow rotation Z
                },
                forearm: {
                    x: 0,  // Forearm rotation X
                    y: 0,  // Forearm rotation Y
                    z: 0   // Forearm rotation Z
                }
            },
            
            // RIGHT ARM rotations
            rightArm: {
                shoulder: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                elbow: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                forearm: {
                    x: 0,
                    y: 0,
                    z: 0
                }
            },
            
            // WRIST rotations (if applicable)
            wrists: {
                left: { 
                    x: 0,  // Wrist rotation X
                    y: 0,  // Wrist rotation Y
                    z: 0   // Wrist rotation Z
                },
                right: { 
                    x: 0,
                    y: 0,
                    z: 0
                }
            }
        };
    }
}

/*
REFERENCE VALUES FROM TIGER SEAL:
========================================

Left Arm (arms crossed in front):
- shoulder: { x: -0.3, y: 0.5, z: -0.5 }
- elbow: { x: -2.0, y: 0.3, z: 0 }
- forearm: { x: 0, y: 0, z: 0 }

Right Arm (arms crossed in front):
- shoulder: { x: -0.3, y: -0.5, z: 0.5 }
- elbow: { x: -2.0, y: -0.3, z: 0 }
- forearm: { x: 0, y: 0, z: 0 }

Wrists (palms facing inward):
- left: { x: π+0.3, y: -π/2, z: 0.5 }
- right: { x: π+0.3, y: π/2, z: -0.5 }

ROTATION QUICK REFERENCE:
========================================
π (pi) ≈ 3.14159
π/2 ≈ 1.5708 (90°)
π/4 ≈ 0.7854 (45°)
3π/2 ≈ 4.7124 (270°)

Positive X = rotation around X axis
Positive Y = rotation around Y axis  
Positive Z = rotation around Z axis

Use the editor to find your own values!
*/
