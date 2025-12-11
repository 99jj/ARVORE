// Helper and Bone Visualization Manager
import * as THREE from 'three';

export class HelperManager {
  constructor(scene, bones) {
    this.scene = scene;
    this.bones = bones;
    this.allHelpers = [];
    this.helpersVisible = true;
  }

  /**
   * Get all editable bone names
   * @returns {Array<string>} Array of bone names
   */
  static getBoneNames() {
    return [
      'root', 'pelvis', 'spine', 'neck', 'head',
      'leftArm', 'leftElbow', 'leftForearm', 'leftWrist',
      'rightArm', 'rightElbow', 'rightForearm', 'rightWrist',
      'leftLeg', 'leftKnee', 'leftAnkle',
      'rightLeg', 'rightKnee', 'rightAnkle'
    ];
  }

  /**
   * Traverse all editable bones
   * @param {Function} callback - Function to call for each bone
   */
  traverseBones(callback) {
    const boneNames = HelperManager.getBoneNames();
    boneNames.forEach(name => {
      if (this.bones[name]) callback(this.bones[name]);
    });

    ['left', 'right'].forEach(side => {
      const fingers = this.bones[`${side}HandFingers`] || {};
      Object.values(fingers).forEach(joints => {
        if (joints.base) callback(joints.base);
        if (joints.prox) callback(joints.prox);
        if (joints.mid) callback(joints.mid);
        if (joints.dist) callback(joints.dist);
      });
    });
  }

  /**
   * Create and add helper spheres for all bones
   */
  addHelpers() {
    // Clear old helpers
    this.allHelpers.forEach(h => this.scene.remove(h));
    this.allHelpers = [];

    const mat = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
      depthTest: false,
      depthWrite: false,
      transparent: true
    });

    // Body helpers
    const boneNames = HelperManager.getBoneNames();
    boneNames.forEach(name => {
      const bone = this.bones[name];
      if (!bone) return;

      let size = 0.08;
      if (['hand', 'wrist', 'ankle'].some(s => name.toLowerCase().includes(s))) size = 0.06;
      if (['neck'].some(s => name.toLowerCase().includes(s))) size = 0.15;
      if (['head'].includes(name)) size = 0.20;
      if (['pelvis', 'spine', 'root'].includes(name)) size = 0.15;
      if (['knee', 'elbow'].some(s => name.toLowerCase().includes(s))) size = 0.12;

      const helper = new THREE.Mesh(new THREE.SphereGeometry(size, 8, 8), mat.clone());
      helper.userData.bone = bone;
      bone.userData.visualHelper = helper;
      this.scene.add(helper);
      this.allHelpers.push(helper);
    });

    // Finger helpers
    ['left', 'right'].forEach(side => {
      const fingers = this.bones[`${side}HandFingers`] || {};
      Object.entries(fingers).forEach(([fingerName, joints]) => {
        if (!joints) return;
        const { base, prox, mid, dist } = joints;

        const baseHelper = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), mat.clone());
        baseHelper.userData.bone = base;
        base.userData.visualHelper = baseHelper;
        this.scene.add(baseHelper);
        this.allHelpers.push(baseHelper);

        const proxHelper = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), mat.clone());
        proxHelper.userData.bone = prox;
        prox.userData.visualHelper = proxHelper;
        this.scene.add(proxHelper);
        this.allHelpers.push(proxHelper);

        if (mid) {
          const midHelper = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), mat.clone());
          midHelper.userData.bone = mid;
          mid.userData.visualHelper = midHelper;
          this.scene.add(midHelper);
          this.allHelpers.push(midHelper);
        }

        const distHelper = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), mat.clone());
        distHelper.userData.bone = dist;
        dist.userData.visualHelper = distHelper;
        this.scene.add(distHelper);
        this.allHelpers.push(distHelper);
      });
    });

    console.log(`✅ ${this.allHelpers.length} helpers criados`);
  }

  /**
   * Update helper positions to match bone world positions
   */
  updateHelpers() {
    this.allHelpers.forEach(helper => {
      if (helper.userData?.bone) {
        helper.position.copy(helper.userData.bone.getWorldPosition(new THREE.Vector3()));
      }
    });
  }

  /**
   * Toggle visibility of all helpers
   */
  toggleVisibility() {
    this.helpersVisible = !this.helpersVisible;
    this.allHelpers.forEach(helper => {
      helper.visible = this.helpersVisible;
    });
    console.log(`🟢 Helpers ${this.helpersVisible ? 'visíveis' : 'ocultos'} (tecla G)`);
  }

  /**
   * Get all helper objects
   * @returns {Array<THREE.Mesh>} Array of helpers
   */
  getHelpers() {
    return this.allHelpers;
  }

  /**
   * Check if helpers are visible
   * @returns {boolean} Visibility state
   */
  isVisible() {
    return this.helpersVisible;
  }
}
