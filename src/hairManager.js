// Hair System Manager
import { createAfroHair } from './avatar/hair/afroHair.js';
import { createBobHair } from './avatar/hair/bobHair.js';
import { createCurlyHair } from './avatar/hair/curlyHair.js';
import { createLongHair } from './avatar/hair/longHair.js';
import { createMediumHair } from './avatar/hair/mediumHair.js';
import { createMohawkHair } from './avatar/hair/mohawkHair.js';
import { createPonytailHair } from './avatar/hair/ponytailHair.js';
import { createSpikyHair } from './avatar/hair/spikyHair.js';
import { createSideSweptHair } from './avatar/hair/sideSweptHair.js';
import { createSlickedBackHair } from './avatar/hair/slickedBackHair.js';
import { createAsymmetricHair } from './avatar/hair/asymmetricHair.js';
import { createRagnarokSpikyHair } from './avatar/hair/ragnarokSpikyHair.js';
import { createTwinTailsHair } from './avatar/hair/twinTailsHair.js';

export class HairManager {
  constructor() {
    this.currentHairIndex = -1; // -1 = Bald
    this.hairStyles = [
      { name: 'Bald', func: null },
      { name: 'Afro', func: createAfroHair },
      { name: 'Bob', func: createBobHair },
      { name: 'Curly', func: createCurlyHair },
      { name: 'Long', func: createLongHair },
      { name: 'Medium', func: createMediumHair },
      { name: 'Mohawk', func: createMohawkHair },
      { name: 'Ponytail', func: createPonytailHair },
      { name: 'Spiky', func: createSpikyHair },
      { name: 'Side Swept', func: createSideSweptHair },
      { name: 'Slicked Back', func: createSlickedBackHair },
      { name: 'Asymmetric', func: createAsymmetricHair },
      { name: 'RO Spiky', func: createRagnarokSpikyHair },
      { name: 'Twin Tails', func: createTwinTailsHair },
    ];
  }

  /**
   * Set hair style on head bone
   * @param {number} index - Hair style index
   * @param {THREE.Object3D} headBone - Head bone reference
   */
  setHair(index, headBone) {
    this.currentHairIndex = index;
    if (!headBone) return;

    // Remove existing hair
    for (let i = headBone.children.length - 1; i >= 0; i--) {
      const child = headBone.children[i];
      if (child.userData.isHair) {
        headBone.remove(child);
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      }
    }

    const style = this.hairStyles[index];
    const hairNameElement = document.getElementById('hair-name');
    if (hairNameElement) {
      hairNameElement.textContent = style.name;
    }

    if (style.func) {
      const hairGroup = style.func();
      hairGroup.userData.isHair = true;
      headBone.add(hairGroup);
    }
    console.log(`Switched hair to: ${style.name}`);
  }

  /**
   * Get current hair style name
   * @returns {string} Current hair style name
   */
  getCurrentHairName() {
    return this.hairStyles[this.currentHairIndex]?.name || 'Bald';
  }

  /**
   * Get total number of hair styles
   * @returns {number} Number of available styles
   */
  getStyleCount() {
    return this.hairStyles.length;
  }

  /**
   * Get hair style at index
   * @param {number} index - Style index
   * @returns {Object} Hair style object
   */
  getStyleAt(index) {
    return this.hairStyles[index];
  }
}
