import * as THREE from 'three';
import { HelperManager } from './helperManager.js';
import { PoseOperations } from './poseOperations.js';
import { InputHandler } from './ui/inputHandler.js';
import { UIPanel } from './ui/uiPanel.js';
import { HairManager } from './hairManager.js';
import { PoseSerializer } from './poseSerializer.js';
import { copyTemplateToClipboard } from './sealGenerator.js';

export class PoseEditor {
    constructor(scene, bones) {
        this.scene = scene;
        this.bones = bones;
        this.copiedPose = null;

        // 1. Initialize Managers
        this.helperManager = new HelperManager(scene, bones);
        this.helperManager.addHelpers();

        this.hairManager = new HairManager();
        // Set initial hair if head exists
        if (this.bones.head) {
            this.hairManager.setHair(0, this.bones.head); // Bald start
        }

        // 2. Setup Input Handling
        this.inputHandler = new InputHandler(
            scene,
            bones,
            this.helperManager.getHelpers()
        );

        this.inputHandler.setSelectionCallback((bone, name) => {
            this.selectBone(bone, name);
        });

        // 3. Setup global listeners
        this.setupGlobalEvents();

        // 4. Create UI Panel
        this.uiPanel = new UIPanel(this);
        this.uiPanel.createControlPanel();
        this.uiPanel.setHairName(this.hairManager.getCurrentHairName());

        // 5. Start loop update
        this.defaultPose = null;
    }

    setupGlobalEvents() {
        this._boundMouseMove = (e) => this.inputHandler.onMouseMove(e);
        this._boundMouseDown = (e) => this.inputHandler.onMouseDown(e);
        this._boundMouseUp = (e) => this.inputHandler.onMouseUp(e);
        this._boundMouseWheel = (e) => this.inputHandler.onMouseWheel(e);
        this._boundKeyDown = (e) => {
            this.inputHandler.onKeyDown(e, () => {
                this.helperManager.toggleVisibility();
            });
        };

        window.addEventListener('mousemove', this._boundMouseMove);
        window.addEventListener('mousedown', this._boundMouseDown);
        window.addEventListener('mouseup', this._boundMouseUp);
        window.addEventListener('wheel', this._boundMouseWheel, { passive: false });
        window.addEventListener('keydown', this._boundKeyDown);
    }

    // =========================================
    // Control Methods (Called by UI)
    // =========================================

    selectBone(bone, name) {
        // Forward to input handler to update visuals
        this.inputHandler.selectBone(bone, name);

        // Attach TransformControls (Global Window access as per main.js)
        if (window.transformControl) {
            window.transformControl.attach(bone);
        }

        // Update UI
        this.uiPanel.updateDisplay(bone, name);
    }

    updateDisplay() {
        const bone = this.inputHandler.getSelectedBone();
        const headers = {
            leftArm: "Left Arm", leftElbow: "Left Elbow", leftForearm: "Left Forearm", leftHand: "Left Hand",
            rightArm: "Right Arm", rightElbow: "Right Elbow", rightForearm: "Right Forearm", rightHand: "Right Hand"
            // ... map others if needed or just use raw name
        };

        if (bone) {
            // Reverse lookup name if needed, or pass it. 
            // InputHandler stores selected bone object, but UI needs name.
            // We can find key by value in bones object
            const name = Object.keys(this.bones).find(key => this.bones[key] === bone) || 'Unknown';
            this.uiPanel.updateDisplay(bone, name);
        }
    }

    // --- Hair ---
    nextHair() {
        let current = this.hairManager.currentHairIndex;
        current = (current + 1) % this.hairManager.getStyleCount();
        this.hairManager.setHair(current, this.bones.head);
        this.uiPanel.setHairName(this.hairManager.getCurrentHairName());
    }

    previousHair() {
        let current = this.hairManager.currentHairIndex;
        current = (current - 1 + this.hairManager.getStyleCount()) % this.hairManager.getStyleCount();
        this.hairManager.setHair(current, this.bones.head);
        this.uiPanel.setHairName(this.hairManager.getCurrentHairName());
    }

    // --- Pose Operations ---
    copyPose() {
        this.copiedPose = PoseSerializer.serializePose(this.bones);
        alert('📋 Pose copied!');
    }

    pastePose() {
        if (!this.copiedPose) return alert('No pose copied!');
        PoseSerializer.applyPose(this.bones, this.copiedPose);
        this.updateDisplay();
    }

    mirrorPose(side) {
        PoseOperations.mirrorPose(side, this.bones);
        this.updateDisplay();
    }

    resetPose() {
        // We need initial positions. Let's assume HelperManager didn't store them 
        // but we can just reset rotations to 0.
        PoseOperations.resetPose(this.bones, null, this.defaultPose);
        this.updateDisplay();
    }

    generateSeal() {
        const name = this.uiPanel.getSealName() || 'NewSeal';
        const pose = PoseSerializer.serializePose(this.bones);
        copyTemplateToClipboard(name, pose);
    }

    // Update loop
    updateHelpers() {
        this.helperManager.updateHelpers();

        // Also continuously update UI if dragging (optional, expensive)
        if (this.inputHandler.getSelectedBone() && window.transformControl && window.transformControl.dragging) {
            this.updateDisplay();
        }
    }

    dispose() {
        // Remove listeners
        window.removeEventListener('mousemove', this._boundMouseMove);
        window.removeEventListener('mousedown', this._boundMouseDown);
        window.removeEventListener('mouseup', this._boundMouseUp);
        window.removeEventListener('wheel', this._boundMouseWheel);
        window.removeEventListener('keydown', this._boundKeyDown);

        // Remove UI
        if (this.uiPanel && this.uiPanel.panel) {
            this.uiPanel.panel.remove();
        }

        // Dispose managers
        if (this.helperManager) {
            this.helperManager.dispose();
        }

        // Detach transform controls if attached
        if (window.transformControl) {
            window.transformControl.detach();
        }

        console.log("💥 PoseEditor Disposed");
    }
}
