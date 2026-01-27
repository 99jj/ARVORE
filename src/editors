// Interactive Hand Pose Editor
import * as THREE from 'three';
import { HairManager } from './hairManager.js';
import { HelperManager } from './helperManager.js';
import { InputHandler } from './inputHandler.js';
import { UIPanel } from './uiPanel.js';
import { PoseSerializer } from './poseSerializer.js';
import { PoseOperations } from './poseOperations.js';
import { SealManager } from './sealManager.js';

export class PoseEditor {
  constructor(scene, bones) {
    this.scene = scene;
    this.bones = bones;
    this.defaultPose = null;

    // Initialize managers
    this.hairManager = new HairManager();
    this.helperManager = new HelperManager(scene, bones);
    this.inputHandler = new InputHandler(scene, bones, this.helperManager.getHelpers());
    this.uiPanel = new UIPanel(this);

    // Initialize
    this.init();

    // Set initial hair (optional)
    setTimeout(() => this.setHair(5), 1000); // Default to Medium (index 5)
  }

  init() {
    this.uiPanel.createControlPanel();
    this.helperManager.addHelpers();
    this.setupEventListeners();
    window.poseEditor = this;
    console.log('✅ PoseEditor initialized');

    // Capture initial positions
    this.initialBonePositions = new Map();
    this.helperManager.traverseBones((bone) => {
      this.initialBonePositions.set(bone, bone.position.clone());
    });
    console.log(`✅ Captured initial positions for ${this.initialBonePositions.size} bones`);

    // Setup input callback
    this.inputHandler.setSelectionCallback((bone, name) => {
      this.uiPanel.updateDisplay(bone, name);
    });
  }

  setupEventListeners() {
    document.addEventListener('mousemove', (e) => this.inputHandler.onMouseMove(e));
    document.addEventListener('mousedown', (e) => this.inputHandler.onMouseDown(e));
    document.addEventListener('mouseup', () => this.inputHandler.onMouseUp());
    document.addEventListener('wheel', (e) => this.inputHandler.onMouseWheel(e), { passive: false });
    document.addEventListener('keydown', (e) => this.inputHandler.onKeyDown(e, () => this.toggleHelpers()));
  }

  selectBone(bone, name) {
    this.inputHandler.selectBone(bone, name);
  }

  updateDisplay() {
    const bone = this.inputHandler.getSelectedBone();
    if (!bone) return;
    
    let boneName = 'unknown';
    // Try to find the bone name from the bones object
    for (const [key, value] of Object.entries(this.bones)) {
      if (value === bone) {
        boneName = key;
        break;
      }
    }
    
    this.uiPanel.updateDisplay(bone, boneName);
  }

  toggleHelpers() {
    this.helperManager.toggleVisibility();
  }

  updateHelpers() {
    this.helperManager.updateHelpers();
  }

  nextHair() {
    this.hairManager.currentHairIndex++;
    if (this.hairManager.currentHairIndex >= this.hairManager.getStyleCount()) {
      this.hairManager.currentHairIndex = 0;
    }
    this.setHair(this.hairManager.currentHairIndex);
  }

  previousHair() {
    this.hairManager.currentHairIndex--;
    if (this.hairManager.currentHairIndex < 0) {
      this.hairManager.currentHairIndex = this.hairManager.getStyleCount() - 1;
    }
    this.setHair(this.hairManager.currentHairIndex);
  }

  setHair(index) {
    this.hairManager.setHair(index, this.bones.head);
    this.uiPanel.setHairName(this.hairManager.getCurrentHairName());
  }

  copyPose() {
    const pose = PoseSerializer.getCurrentPose(this.bones);
    PoseSerializer.copyToClipboard(pose);
  }

  async pastePose() {
    const pose = await PoseSerializer.pasteFromClipboard();
    if (pose) {
      PoseSerializer.applyPose(pose, this.bones);
      this.updateDisplay();
    }
  }

  mirrorPose(side) {
    console.log(`Mirror ${side} clicked`);
    PoseOperations.mirrorPose(side, this.bones);
    this.updateDisplay();
  }

  resetPose() {
    console.log('Reset Pose clicked');
    PoseOperations.resetPose(this.bones, this.initialBonePositions, this.defaultPose);
    this.updateDisplay();
  }

  generateSeal() {
    const sealName = this.uiPanel.getSealName();
    SealManager.generateSealFile(sealName, this.bones);
  }
}
