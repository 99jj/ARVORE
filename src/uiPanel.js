// UI Panel Manager
export class UIPanel {
  constructor(poseEditor) {
    this.poseEditor = poseEditor;
    this.panel = null;
  }

  /**
   * Create the main control panel
   */
  createControlPanel() {
    const panel = document.createElement('div');
    panel.id = 'pose-editor-panel';
    panel.style.cssText = `
      position: fixed; top: 10px; right: 10px; width: 320px;
      background: rgba(0, 0, 0, 0.9); color: #0f0;
      font-family: monospace; font-size: 12px; padding: 15px;
      border: 2px solid #0f0; border-radius: 5px;
      max-height: 90vh; overflow-y: auto; z-index: 1000;
    `;

    panel.innerHTML = `
      <div style="margin-bottom: 15px;">
        <strong>🎮 POSE EDITOR</strong>
        <button id="toggle-info" style="float: right; padding: 2px 8px; cursor: pointer;">-</button>
      </div>
      
      <div id="info-content">
      
         <!-- HAIR SELECTOR -->
         <div style="margin-bottom: 10px; background: rgba(0, 100, 200, 0.2); padding: 8px;">
            <strong>Hair Style:</strong>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 5px;">
                <button id="prev-hair" style="width: 30px; font-weight: bold;">&lt;</button>
                <div id="hair-name" style="color: #fff; font-weight: bold;">Bald</div>
                <button id="next-hair" style="width: 30px; font-weight: bold;">&gt;</button>
            </div>
         </div>

        <div style="margin-bottom: 10px; background: rgba(0, 255, 0, 0.1); padding: 8px;">
          <strong>Controls:</strong><br/>
          • Click bone (green ball) to select<br/>
          • Drag: move XY plane<br/>
          • Scroll: zoom only<br/>
          • Keys: X/Y/Z to lock axis
        </div>

        <div style="margin-bottom: 10px;">
          <strong>Selected:</strong>
          <div id="selected-bone" style="color: #0f0; margin-top: 5px;">None</div>
        </div>

        <div style="margin-bottom: 10px;">
          <strong>Position:</strong>
          <div id="position-display" style="color: #0f0; font-size: 11px;">-</div>
          <input type="range" id="pos-x" min="-5" max="5" step="0.01" style="width: 100%; margin: 3px 0;">
          <input type="range" id="pos-y" min="-5" max="5" step="0.01" style="width: 100%; margin: 3px 0;">
          <input type="range" id="pos-z" min="-5" max="5" step="0.01" style="width: 100%; margin: 3px 0;">
        </div>

        <div style="margin-bottom: 10px;">
          <strong>Rotation:</strong>
          <div id="rotation-display" style="color: #0f0; font-size: 11px;">-</div>
          <input type="range" id="rot-x" min="-6.28" max="6.28" step="0.01" style="width: 100%;">
          <input type="range" id="rot-y" min="-6.28" max="6.28" step="0.01" style="width: 100%;">
          <input type="range" id="rot-z" min="-6.28" max="6.28" step="0.01" style="width: 100%;">
        </div>

        <div style="margin-bottom: 10px;">
          <button id="copy-pose" style="width: 100%; padding: 8px; margin-bottom: 5px;">Copy Pose</button>
          <button id="paste-pose" style="width: 100%; padding: 8px; margin-bottom: 5px;">Paste Pose</button>
          <div style="display: flex; gap: 5px; margin-bottom: 5px;">
            <button id="mirror-left" style="flex: 1; padding: 8px; font-size: 11px;">Mirror Left</button>
            <button id="mirror-right" style="flex: 1; padding: 8px; font-size: 11px;">Mirror Right</button>
          </div>
          <button id="generate-seal" style="width: 100%; padding: 8px; margin-bottom: 5px; background: #0f0; color: #000;">Generate Seal</button>
          <button id="reset-pose" style="width: 100%; padding: 8px; background: #f00; color: #fff;">Reset All</button>
        </div>

        <div style="background: rgba(100, 100, 0, 0.3); padding: 8px; margin-bottom: 10px;">
            <strong>Seal Name:</strong>
            <input id="seal-name" type="text" placeholder="e.g., Tiger, Dragon" 
              style="width: 100%; padding: 4px; margin-top: 5px;">
        </div>

        <div style="background: rgba(0, 100, 0, 0.3); padding: 8px; max-height: 200px; overflow-y: auto;">
          <strong>Bones:</strong>
          <div id="bones-list" style="font-size: 10px; margin-top: 5px;"></div>
        </div>
      </div>
    `;

    document.body.appendChild(panel);
    this.panel = panel;
    this.setupPanelEvents();
    this.populateBonesList();
  }

  /**
   * Setup panel event listeners
   */
  setupPanelEvents() {
    const toggleBtn = document.getElementById('toggle-info');
    const infoContent = document.getElementById('info-content');

    toggleBtn.addEventListener('click', () => {
      const isHidden = infoContent.style.display === 'none';
      infoContent.style.display = isHidden ? 'block' : 'none';
      toggleBtn.textContent = isHidden ? '-' : '+';
    });

    // HAIR CONTROLS
    document.getElementById('prev-hair').onclick = () => {
      this.poseEditor.previousHair();
    };
    document.getElementById('next-hair').onclick = () => {
      this.poseEditor.nextHair();
    };

    // POSE CONTROLS
    document.getElementById('copy-pose').onclick = () => {
      this.poseEditor.copyPose();
    };
    document.getElementById('paste-pose').onclick = () => {
      this.poseEditor.pastePose();
    };
    document.getElementById('mirror-left').onclick = () => {
      this.poseEditor.mirrorPose('left');
    };
    document.getElementById('mirror-right').onclick = () => {
      this.poseEditor.mirrorPose('right');
    };
    document.getElementById('generate-seal').onclick = () => {
      this.poseEditor.generateSeal();
    };
    document.getElementById('reset-pose').onclick = () => {
      this.poseEditor.resetPose();
    };

    // SLIDERS - Position
    ['pos-x', 'pos-y', 'pos-z'].forEach((id, idx) => {
      document.getElementById(id).oninput = (e) => {
        const selectedBone = this.poseEditor.inputHandler.getSelectedBone();
        if (selectedBone) {
          const axis = ['x', 'y', 'z'][idx];
          selectedBone.position[axis] = parseFloat(e.target.value);
          this.poseEditor.updateDisplay();
        }
      };
    });

    // SLIDERS - Rotation
    ['rot-x', 'rot-y', 'rot-z'].forEach((id, idx) => {
      document.getElementById(id).oninput = (e) => {
        const selectedBone = this.poseEditor.inputHandler.getSelectedBone();
        if (selectedBone) {
          const axis = ['x', 'y', 'z'][idx];
          selectedBone.rotation[axis] = parseFloat(e.target.value);
          this.poseEditor.updateDisplay();
        }
      };
    });
  }

  /**
   * Populate bones list in the panel
   */
  populateBonesList() {
    const bonesList = document.getElementById('bones-list');
    const style = `display:block;width:100%;padding:4px;margin:2px 0;background:rgba(0,255,0,0.2);color:#0f0;border:1px solid #0f0;border-radius:2px;cursor:pointer;font-family:monospace;font-size:10px;`;

    // BODY
    ['root', 'pelvis', 'spine', 'neck', 'head'].forEach(name => {
      const btn = document.createElement('button');
      btn.textContent = name;
      btn.style.cssText = style;
      btn.onclick = () => this.poseEditor.selectBone(this.poseEditor.bones[name], name);
      bonesList.appendChild(btn);
    });

    // ARMS
    ['leftArm', 'leftElbow', 'leftForearm', 'leftWrist', 'rightArm', 'rightElbow', 'rightForearm', 'rightWrist'].forEach(name => {
      const btn = document.createElement('button');
      btn.textContent = name;
      btn.style.cssText = style;
      btn.onclick = () => this.poseEditor.selectBone(this.poseEditor.bones[name], name);
      bonesList.appendChild(btn);
    });

    // LEGS
    ['leftLeg', 'leftKnee', 'leftAnkle', 'rightLeg', 'rightKnee', 'rightAnkle'].forEach(name => {
      const btn = document.createElement('button');
      btn.textContent = name;
      btn.style.cssText = style + ';background:rgba(0,0,255,0.2);border-color:#55f;';
      btn.onclick = () => this.poseEditor.selectBone(this.poseEditor.bones[name], name);
      bonesList.appendChild(btn);
    });

    // FINGERS
    ['left', 'right'].forEach(side => {
      Object.entries(this.poseEditor.bones[`${side}HandFingers`] || {}).forEach(([finger, joints]) => {
        if (!joints) return;
        const { base, prox, mid, dist } = joints;

        const baseBtn = document.createElement('button');
        baseBtn.textContent = `${side} ${finger} base`;
        baseBtn.style.cssText = style;
        baseBtn.onclick = () => this.poseEditor.selectBone(base, `${side}${finger}Base`);
        bonesList.appendChild(baseBtn);

        const proxBtn = document.createElement('button');
        proxBtn.textContent = `${side} ${finger} prox`;
        proxBtn.style.cssText = style;
        proxBtn.onclick = () => this.poseEditor.selectBone(prox, `${side}${finger}Prox`);
        bonesList.appendChild(proxBtn);

        if (mid) {
          const midBtn = document.createElement('button');
          midBtn.textContent = `${side} ${finger} mid`;
          midBtn.style.cssText = style;
          midBtn.onclick = () => this.poseEditor.selectBone(mid, `${side}${finger}Mid`);
          bonesList.appendChild(midBtn);
        }

        const distBtn = document.createElement('button');
        distBtn.textContent = `${side} ${finger} dist`;
        distBtn.style.cssText = style;
        distBtn.onclick = () => this.poseEditor.selectBone(dist, `${side}${finger}Dist`);
        bonesList.appendChild(distBtn);
      });
    });
  }

  /**
   * Update display values for selected bone
   * @param {THREE.Object3D} bone - Selected bone
   * @param {string} name - Bone name
   */
  updateDisplay(bone, name) {
    if (!bone) return;
    const pos = bone.position;
    const rot = bone.rotation;

    document.getElementById('selected-bone').textContent = name;
    document.getElementById('position-display').textContent = `x: ${pos.x.toFixed(2)} y: ${pos.y.toFixed(2)} z: ${pos.z.toFixed(2)}`;
    document.getElementById('rotation-display').textContent = `x: ${rot.x.toFixed(2)} y: ${rot.y.toFixed(2)} z: ${rot.z.toFixed(2)}`;

    document.getElementById('pos-x').value = pos.x;
    document.getElementById('pos-y').value = pos.y;
    document.getElementById('pos-z').value = pos.z;
    document.getElementById('rot-x').value = rot.x;
    document.getElementById('rot-y').value = rot.y;
    document.getElementById('rot-z').value = rot.z;
  }

  /**
   * Get seal name input value
   * @returns {string} Seal name
   */
  getSealName() {
    const input = document.getElementById('seal-name');
    return input ? input.value.trim() : '';
  }

  /**
   * Update hair name display
   * @param {string} name - Hair style name
   */
  setHairName(name) {
    const hairNameEl = document.getElementById('hair-name');
    if (hairNameEl) {
      hairNameEl.textContent = name;
    }
  }
}
