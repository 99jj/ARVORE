// Input Event Handler
import * as THREE from 'three';

export class InputHandler {
  constructor(scene, bones, allHelpers) {
    this.scene = scene;
    this.bones = bones;
    this.allHelpers = allHelpers;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.dragAxis = null;
    this.selectedBone = null;
    this.onBoneSelected = null; // Callback for bone selection
  }

  /**
   * Handle mouse move
   * @param {MouseEvent} e - Mouse event
   */
  onMouseMove(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  /**
   * Handle mouse down (bone selection)
   * @param {MouseEvent} e - Mouse event
   */
  onMouseDown(e) {
    if (e.target.closest('#pose-editor-panel')) return;

    this.raycaster.setFromCamera(this.mouse, window.__camera);
    const intersects = this.raycaster.intersectObjects(this.allHelpers);

    if (intersects.length > 0) {
      const clickedBone = intersects[0].object.userData.bone;
      const boneName = clickedBone.name || 'unnamed';
      this.selectBone(clickedBone, boneName);
    }
  }

  /**
   * Handle mouse up
   */
  onMouseUp() {
    // Currently not used, but kept for future drag functionality
  }

  /**
   * Handle mouse wheel
   * @param {WheelEvent} e - Wheel event
   */
  onMouseWheel(e) {
    e.preventDefault();
    // Only zoom, don't rotate bones
  }

  /**
   * Handle key down (axis locking, helpers toggle)
   * @param {KeyboardEvent} e - Key event
   * @param {Function} onToggleHelpers - Callback for helpers toggle
   */
  onKeyDown(e, onToggleHelpers) {
    if (e.key === 'x' || e.key === 'X') {
      this.dragAxis = this.dragAxis === 'x' ? null : 'x';
    }
    if (e.key === 'y' || e.key === 'Y') {
      this.dragAxis = this.dragAxis === 'y' ? null : 'y';
    }
    if (e.key === 'z' || e.key === 'Z') {
      this.dragAxis = this.dragAxis === 'z' ? null : 'z';
    }

    if (e.key === 'g' || e.key === 'G') {
      if (onToggleHelpers) onToggleHelpers();
    }
  }

  /**
   * Select a bone
   * @param {THREE.Object3D} bone - Bone to select
   * @param {string} name - Bone name
   */
  selectBone(bone, name) {
    if (this.selectedBone === bone) return;

    // Deselect previous
    if (this.selectedBone?.userData?.visualHelper) {
      this.selectedBone.userData.visualHelper.material.color.setHex(0x00ff00);
    }

    this.selectedBone = bone;

    // Select new
    if (this.selectedBone.userData.visualHelper) {
      this.selectedBone.userData.visualHelper.material.color.setHex(0xffff00);
    }

    if (this.onBoneSelected) {
      this.onBoneSelected(bone, name);
    }

    console.log(`Selected bone: ${name}`);
  }

  /**
   * Get currently selected bone
   * @returns {THREE.Object3D} Selected bone or null
   */
  getSelectedBone() {
    return this.selectedBone;
  }

  /**
   * Set callback for bone selection
   * @param {Function} callback - Callback function (bone, name)
   */
  setSelectionCallback(callback) {
    this.onBoneSelected = callback;
  }
}
