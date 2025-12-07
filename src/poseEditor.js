// Interactive Hand Pose Editor
import * as THREE from 'three';
import { generateSealTemplate } from './sealGenerator.js';

export class PoseEditor {
  constructor(scene, bones) {
    this.scene = scene;
    this.bones = bones;
    this.selectedBone = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.isDragging = false;
    this.dragAxis = null;
    this.dragPlane = new THREE.Plane();
    this.dragPoint = new THREE.Vector3();
    this.initialPos = new THREE.Vector3();
    this.allHelpers = [];
    this.helpersVisible = true; // ✅ Toggle com tecla G

    this.init();
    this.defaultPose = null;
  }

  init() {
    this.createControlPanel();
    this.addHelpers();
    this.setupEventListeners();
    window.poseEditor = this;
    console.log('✅ PoseEditor initialized');
    // 3. CAPTURE INITIAL POSITIONS (for reset)
    // We need to do this AFTER bones are set up but BEFORE any edits
    this.initialBonePositions = new Map();
    this.traverseBones((bone) => {
      this.initialBonePositions.set(bone, bone.position.clone());
    });
    console.log(`✅ Captured initial positions for ${this.initialBonePositions.size} bones`);
  }

  // Helper to traverse all editable bones
  traverseBones(callback) {
    // Body + Arms + Legs
    ['root', 'pelvis', 'spine', 'neck', 'head',
      'leftArm', 'leftElbow', 'leftForearm', 'leftWrist',
      'rightArm', 'rightElbow', 'rightForearm', 'rightWrist',
      'leftLeg', 'leftKnee', 'leftAnkle',
      'rightLeg', 'rightKnee', 'rightAnkle'].forEach(name => {
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

  // ✅ ATUALIZA POSIÇÃO MUNDIAL DOS HELPERS
  updateHelpers() {
    this.allHelpers.forEach(helper => {
      if (helper.userData?.bone) {
        helper.position.copy(helper.userData.bone.getWorldPosition(new THREE.Vector3()));
      }
    });
  }

  addHelpers() {
    // Limpar antigos
    this.allHelpers.forEach(h => this.scene.remove(h));
    this.allHelpers = [];

    const mat = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
      depthTest: false,
      depthWrite: false,
      transparent: true
    });

    // BRAÇOS (8 helpers)
    // FULL BODY HELPERS
    ['root', 'pelvis', 'spine', 'neck', 'head',
      'leftArm', 'leftElbow', 'leftForearm', 'leftWrist',
      'rightArm', 'rightElbow', 'rightForearm', 'rightWrist',
      'leftLeg', 'leftKnee', 'leftAnkle',
      'rightLeg', 'rightKnee', 'rightAnkle'].forEach(name => {
        const bone = this.bones[name];
        if (!bone) return;

        let size = 0.08;
        if (['hand', 'wrist', 'ankle'].some(s => name.toLowerCase().includes(s))) size = 0.06;
        if (['neck'].some(s => name.toLowerCase().includes(s))) size = 0.15; // Bigger Neck
        if (['head'].includes(name)) size = 0.20; // Big Head info
        if (['pelvis', 'spine', 'root'].includes(name)) size = 0.15; // Enable selection inside body
        if (['knee', 'elbow'].some(s => name.toLowerCase().includes(s))) size = 0.12; // Joints

        const helper = new THREE.Mesh(new THREE.SphereGeometry(size, 8, 8), mat.clone());
        helper.userData.bone = bone;
        bone.userData.visualHelper = helper;
        this.scene.add(helper);
        this.allHelpers.push(helper);
      });

    // DEDOS (32 helpers = 5 dedos × 4 joints × 2 mãos)
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
    this.controlPanel = panel;
    this.setupPanelEvents();
    this.populateBonesList();
  }

  setupPanelEvents() {
    const toggleBtn = document.getElementById('toggle-info');
    const infoContent = document.getElementById('info-content');

    toggleBtn.addEventListener('click', () => {
      const isHidden = infoContent.style.display === 'none';
      infoContent.style.display = isHidden ? 'block' : 'none';
      toggleBtn.textContent = isHidden ? '-' : '+';
    });

    document.getElementById('copy-pose').onclick = () => {
      console.log('Copy Pose clicked');
      this.copyPoseToClipboard();
    };
    document.getElementById('paste-pose').onclick = () => {
      console.log('Paste Pose clicked');
      this.pastePoseFromClipboard();
    };
    document.getElementById('mirror-left').onclick = () => {
      console.log('Mirror Left clicked (Copy Left -> Right)');
      this.mirrorPose('left');
    };
    document.getElementById('mirror-right').onclick = () => {
      console.log('Mirror Right clicked (Copy Right -> Left)');
      this.mirrorPose('right');
    };
    document.getElementById('generate-seal').onclick = () => {
      console.log('Generate Seal clicked');
      this.generateSealFile();
    };
    document.getElementById('reset-pose').onclick = () => {
      console.log('Reset Pose clicked');
      this.resetPose();
    };

    // Sliders
    ['pos-x', 'pos-y', 'pos-z'].forEach((id, idx) => {
      document.getElementById(id).oninput = (e) => {
        if (this.selectedBone) {
          const axis = ['x', 'y', 'z'][idx];
          this.selectedBone.position[axis] = parseFloat(e.target.value);
          this.updateDisplay();
        }
      };
    });

    ['rot-x', 'rot-y', 'rot-z'].forEach((id, idx) => {
      document.getElementById(id).oninput = (e) => {
        if (this.selectedBone) {
          const axis = ['x', 'y', 'z'][idx];
          this.selectedBone.rotation[axis] = parseFloat(e.target.value);
          this.updateDisplay();
        }
      };
    });
  }

  populateBonesList() {
    const bonesList = document.getElementById('bones-list');
    const style = `display:block;width:100%;padding:4px;margin:2px 0;background:rgba(0,255,0,0.2);color:#0f0;border:1px solid #0f0;border-radius:2px;cursor:pointer;font-family:monospace;font-size:10px;`;

    // 1. BODY
    ['root', 'pelvis', 'spine', 'neck', 'head'].forEach(name => {
      const btn = document.createElement('button');
      btn.textContent = name;
      btn.style.cssText = style;
      btn.onclick = () => this.selectBone(this.bones[name], name);
      bonesList.appendChild(btn);
    });

    // 2. ARMS
    ['leftArm', 'leftElbow', 'leftForearm', 'leftWrist', 'rightArm', 'rightElbow', 'rightForearm', 'rightWrist'].forEach(name => {
      const btn = document.createElement('button');
      btn.textContent = name;
      btn.style.cssText = style;
      btn.onclick = () => this.selectBone(this.bones[name], name);
      bonesList.appendChild(btn);
    });

    // 3. LEGS
    ['leftLeg', 'leftKnee', 'leftAnkle', 'rightLeg', 'rightKnee', 'rightAnkle'].forEach(name => {
      const btn = document.createElement('button');
      btn.textContent = name;
      btn.style.cssText = style + ';background:rgba(0,0,255,0.2);border-color:#55f;'; // Diferenciar pernas
      btn.onclick = () => this.selectBone(this.bones[name], name);
      bonesList.appendChild(btn);
    });

    // Finger bones
    ['left', 'right'].forEach(side => {
      Object.entries(this.bones[`${side}HandFingers`] || {}).forEach(([finger, joints]) => {
        if (!joints) return;
        const { base, prox, mid, dist } = joints;

        // Base
        const baseBtn = document.createElement('button');
        baseBtn.textContent = `${side} ${finger} base`;
        baseBtn.style.cssText = style;
        baseBtn.onclick = () => this.selectBone(base, `${side}${finger}Base`);
        bonesList.appendChild(baseBtn);

        // Prox
        const proxBtn = document.createElement('button');
        proxBtn.textContent = `${side} ${finger} prox`;
        proxBtn.style.cssText = style;
        proxBtn.onclick = () => this.selectBone(prox, `${side}${finger}Prox`);
        bonesList.appendChild(proxBtn);

        // Mid
        if (mid) {
          const midBtn = document.createElement('button');
          midBtn.textContent = `${side} ${finger} mid`;
          midBtn.style.cssText = style;
          midBtn.onclick = () => this.selectBone(mid, `${side}${finger}Mid`);
          bonesList.appendChild(midBtn);
        }

        // Dist
        const distBtn = document.createElement('button');
        distBtn.textContent = `${side} ${finger} dist`;
        distBtn.style.cssText = style;
        distBtn.onclick = () => this.selectBone(dist, `${side}${finger}Dist`);
        bonesList.appendChild(distBtn);
      });
    });
  }

  setupEventListeners() {
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('mousedown', (e) => this.onMouseDown(e));
    document.addEventListener('mouseup', () => this.onMouseUp());
    document.addEventListener('wheel', (e) => this.onMouseWheel(e), { passive: false });
    document.addEventListener('keydown', (e) => this.onKeyDown(e));
  }

  onMouseMove(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    // ✅ DRAG DESATIVADO: Não permite mover position dos bones para evitar
    // descolar dedos das mãos - apenas seleção é permitida
  }

  onMouseDown(e) {
    if (e.target.closest('#pose-editor-panel')) return;

    this.raycaster.setFromCamera(this.mouse, window.__camera);
    const intersects = this.raycaster.intersectObjects(this.allHelpers);

    if (intersects.length > 0) {
      const clickedBone = intersects[0].object.userData.bone;
      const boneName = clickedBone.name || 'unnamed';
      this.selectBone(clickedBone, boneName);
      // ✅ DRAG DESATIVADO: Apenas seleciona o bone, não permite mover position
      // Isso evita que dedos sejam "descolados" da mão acidentalmente
      // Use os sliders no painel para editar rotação do bone selecionado
    }
  }

  onMouseUp() {
    this.isDragging = false;
  }

  onMouseWheel(e) {
    // ✅ DESATIVADO: Não rotaciona bones
    e.preventDefault();
    // Deixa apenas o zoom da câmera funcionar
  }

  onKeyDown(e) {
    if (e.key === 'x' || e.key === 'X') this.dragAxis = this.dragAxis === 'x' ? null : 'x';
    if (e.key === 'y' || e.key === 'Y') this.dragAxis = this.dragAxis === 'y' ? null : 'y';
    if (e.key === 'z' || e.key === 'Z') this.dragAxis = this.dragAxis === 'z' ? null : 'z';

    // ✅ Toggle helpers visibility com tecla G
    if (e.key === 'g' || e.key === 'G') {
      this.toggleHelpersVisibility();
    }
  }

  // ✅ Mostra/Esconde as bolinhas verdes (helpers)
  toggleHelpersVisibility() {
    this.helpersVisible = !this.helpersVisible;
    this.allHelpers.forEach(helper => {
      helper.visible = this.helpersVisible;
    });
    console.log(`🟢 Helpers ${this.helpersVisible ? 'visíveis' : 'ocultos'} (tecla G)`);
  }

  selectBone(bone, name) {
    // Desseleciona anterior
    if (this.selectedBone?.userData?.visualHelper) {
      this.selectedBone.userData.visualHelper.material.color.setHex(0x00ff00);
    }

    this.selectedBone = bone;

    // Seleciona novo
    if (this.selectedBone.userData.visualHelper) {
      this.selectedBone.userData.visualHelper.material.color.setHex(0xffff00);
    }

    document.getElementById('selected-bone').textContent = name;
    this.updateDisplay();
  }

  updateDisplay() {
    if (!this.selectedBone) return;
    const pos = this.selectedBone.position;
    const rot = this.selectedBone.rotation;

    document.getElementById('position-display').textContent = `x: ${pos.x.toFixed(2)} y: ${pos.y.toFixed(2)} z: ${pos.z.toFixed(2)}`;
    document.getElementById('rotation-display').textContent = `x: ${rot.x.toFixed(2)} y: ${rot.y.toFixed(2)} z: ${rot.z.toFixed(2)}`;

    document.getElementById('pos-x').value = pos.x;
    document.getElementById('pos-y').value = pos.y;
    document.getElementById('pos-z').value = pos.z;
    document.getElementById('rot-x').value = rot.x;
    document.getElementById('rot-y').value = rot.y;
    document.getElementById('rot-z').value = rot.z;
  }

  // ✅ MIRROR POSE (Left <-> Right)
  mirrorPose(sourceSide) {
    // sourceSide: 'left' or 'right'
    const targetSide = sourceSide === 'left' ? 'right' : 'left';

    // Capitalize for bone lookup
    const Source = sourceSide.charAt(0).toUpperCase() + sourceSide.slice(1);
    const Target = targetSide.charAt(0).toUpperCase() + targetSide.slice(1);

    const applyMirror = (sourceBone, targetBone) => {
      if (!sourceBone || !targetBone) return;
      // Mirroring heuristic: x -> x, y -> -y, z -> -z
      targetBone.rotation.x = sourceBone.rotation.x;
      targetBone.rotation.y = -sourceBone.rotation.y;
      targetBone.rotation.z = -sourceBone.rotation.z;
    };

    // 1. Mirror Arms
    ['Arm', 'Elbow', 'Forearm', 'Wrist'].forEach(part => {
      const sourceBone = this.bones[`${sourceSide}${part}`];
      const targetBone = this.bones[`${targetSide}${part}`];
      applyMirror(sourceBone, targetBone);
    });

    // 2. Mirror Fingers
    const sourceFingers = this.bones[`${sourceSide}HandFingers`] || {};
    const targetFingers = this.bones[`${targetSide}HandFingers`] || {};

    Object.keys(sourceFingers).forEach(fingerName => {
      const sJoints = sourceFingers[fingerName];
      const tJoints = targetFingers[fingerName];
      if (!sJoints || !tJoints) return;

      applyMirror(sJoints.base, tJoints.base);
      applyMirror(sJoints.prox, tJoints.prox);
      if (sJoints.mid && tJoints.mid) applyMirror(sJoints.mid, tJoints.mid);
      applyMirror(sJoints.dist, tJoints.dist);
    });

    this.updateDisplay();
    alert(`✅ Mirrored ${Source} to ${Target}`);
  }

  // ✅ RESET COMPLETO
  resetPose() {
    try {
      console.log('resetPose chamado, restoring initial positions and defaultPose rotation');

      // 1. Restore Initial Positions
      if (this.initialBonePositions) {
        this.initialBonePositions.forEach((pos, bone) => {
          bone.position.copy(pos);
        });
      }

      // 2. Reset Rotations (Force all to 0,0,0)
      ['root', 'pelvis', 'spine', 'neck', 'head',
        'leftArm', 'leftElbow', 'leftForearm', 'leftWrist',
        'rightArm', 'rightElbow', 'rightForearm', 'rightWrist',
        'leftLeg', 'leftKnee', 'leftAnkle',
        'rightLeg', 'rightKnee', 'rightAnkle'].forEach(name => {
          if (this.bones[name]) this.bones[name].rotation.set(0, 0, 0);
        });

      // Reset fingers
      ['left', 'right'].forEach(side => {
        const fingers = this.bones[`${side}HandFingers`] || {};
        Object.values(fingers).forEach(joints => {
          if (joints.base) joints.base.rotation.set(0, 0, 0);
          if (joints.prox) joints.prox.rotation.set(0, 0, 0);
          if (joints.mid) joints.mid.rotation.set(0, 0, 0);
          if (joints.dist) joints.dist.rotation.set(0, 0, 0);
        });
      });

      // 3. Apply Default Pose if exists
      if (!this.defaultPose) {
        console.warn('❌ Pose padrão não definida, usando T-pose completo');
      } else {
        this.applyPose(this.defaultPose);
      }

      this.updateDisplay();
      alert('🔄 Resetado para pose padrão e posições iniciais!');

    } catch (err) {
      console.error('❌ Erro no resetPose:', err);
      alert('❌ Erro ao resetar: ' + err.message);
    }
  }

  // ✅ SERIALIZAÇÃO CORRETA
  getCurrentPose() {
    const serialize = (vec) => ({
      x: parseFloat(vec.x.toFixed(4)),
      y: parseFloat(vec.y.toFixed(4)),
      z: parseFloat(vec.z.toFixed(4))
    });

    const pose = {
      leftArm: {
        shoulder: serialize(this.bones.leftArm.rotation),
        elbow: serialize(this.bones.leftElbow.rotation),
        forearm: serialize(this.bones.leftForearm.rotation),
        wrist: serialize(this.bones.leftWrist.rotation)
      },
      rightArm: {
        shoulder: serialize(this.bones.rightArm.rotation),
        elbow: serialize(this.bones.rightElbow.rotation),
        forearm: serialize(this.bones.rightForearm.rotation),
        wrist: serialize(this.bones.rightWrist.rotation)
      },
      leftFingers: {}, rightFingers: {}
    };

    // Dedos
    ['left', 'right'].forEach(side => {
      pose[`${side}Fingers`] = {};
      Object.entries(this.bones[`${side}HandFingers`] || {}).forEach(([name, joints]) => {
        if (!joints) return;
        pose[`${side}Fingers`][name] = {
          base: serialize(joints.base.rotation),
          prox: serialize(joints.prox.rotation),
          mid: joints.mid ? serialize(joints.mid.rotation) : null,
          dist: serialize(joints.dist.rotation)
        };
      });
    });

    return pose;
  }


  copyPoseToClipboard() {
    const pose = this.getCurrentPose();
    navigator.clipboard.writeText(JSON.stringify(pose, null, 2))
      .then(() => alert('✅ Pose copiada!'))
      .catch(() => alert('❌ Erro ao copiar'));
  }

  pastePoseFromClipboard() {
    navigator.clipboard.readText().then(text => {
      try {
        const pose = JSON.parse(text);
        this.applyPose(pose);
        alert('✅ Pose colada!');
      } catch {
        alert('❌ JSON inválido');
      }
    });
  }

  applyPose(pose) {
    if (!pose) return;

    // Helper para aplicar rotação de objeto plain {x, y, z}
    const applyRotation = (bone, rot) => {
      if (bone && rot) bone.rotation.set(rot.x, rot.y, rot.z);
    };

    // Aplica braços
    applyRotation(this.bones.leftArm, pose.leftArm?.shoulder);
    applyRotation(this.bones.leftElbow, pose.leftArm?.elbow);
    applyRotation(this.bones.leftForearm, pose.leftArm?.forearm);
    applyRotation(this.bones.leftWrist, pose.leftArm?.wrist);

    applyRotation(this.bones.rightArm, pose.rightArm?.shoulder);
    applyRotation(this.bones.rightElbow, pose.rightArm?.elbow);
    applyRotation(this.bones.rightForearm, pose.rightArm?.forearm);
    applyRotation(this.bones.rightWrist, pose.rightArm?.wrist);

    // Aplica dedos
    ['left', 'right'].forEach(side => {
      const fingerPoses = pose[`${side}Fingers`] || {};
      Object.entries(fingerPoses).forEach(([name, rotations]) => {
        const joints = this.bones[`${side}HandFingers`]?.[name];
        if (!joints) return;
        applyRotation(joints.base, rotations.base);
        applyRotation(joints.prox, rotations.prox);
        if (joints.mid) applyRotation(joints.mid, rotations.mid);
        applyRotation(joints.dist, rotations.dist);
      });
    });

    this.updateDisplay();
  }

  // ✅ GERAÇÃO DE SEAL COM DOWNLOAD FALLBACK
  generateSealFile() {
    console.log('generateSealFile chamado');
    const sealNameInput = document.getElementById('seal-name');
    console.log('seal-name element:', sealNameInput);

    const sealName = sealNameInput ? sealNameInput.value.trim() : '';
    console.log('sealName:', sealName);

    if (!sealName) {
      alert('⚠️ Digite um nome (ex: Tiger, Dragon, Rat)');
      return;
    }

    try {
      console.log('Gerando pose...');
      const pose = this.getCurrentPose();
      console.log('Pose gerada:', pose);

      console.log('Gerando template...');
      const template = generateSealTemplate(sealName, pose);
      console.log('Template gerado, tamanho:', template.length);

      // Sempre faz download do arquivo
      this.downloadSealFile(sealName, template);

      // Também copia para clipboard como backup
      navigator.clipboard.writeText(template).catch(() => { });

    } catch (err) {
      console.error('❌ Erro em generateSealFile:', err);
      alert('❌ Falha na geração: ' + err.message);
    }
  }

  downloadSealFile(sealName, content) {
    const capName = sealName.charAt(0).toUpperCase() + sealName.slice(1).toLowerCase();
    const blob = new Blob([content], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${capName}Seal.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert(`✅ ${capName}Seal.js baixado!\n\n📁 Mova para:\nAESIR/src/jutsus/seals/${capName}Seal.js`);
  }
}