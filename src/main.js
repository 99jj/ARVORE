// ============================================
// 🎮 INTERACTIVE HAND POSE EDITOR
// ============================================

import * as THREE from 'three';
import { PoseEditor } from './poseEditor.js';
import { defaultPose } from './defaultPose.js';
// ✅ IMPORTA AVATAR COMPLETO
import { createAvatar } from './avatar/avatar.js';

console.log('🚀 Iniciando Hand Pose Editor...');

// ============================================
// Setup Scene, Camera, Renderer
// ============================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.5, 2.5);
window.__camera = camera;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// ============================================
// Lighting
// ============================================
const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(luzAmbiente);

const sol = new THREE.DirectionalLight(0xffffff, 0.8);
sol.position.set(5, 10, 7);
sol.castShadow = true;
scene.add(sol);

// ============================================
// Ground
// ============================================
const planoGeometria = new THREE.PlaneGeometry(20, 20);
const planoMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,  // Branco para melhor contraste
  roughness: 0.8
});
const chao = new THREE.Mesh(planoGeometria, planoMaterial);
chao.rotation.x = -Math.PI / 2;
chao.receiveShadow = true;
scene.add(chao);

// ============================================
// Create Full Avatar
// ============================================
const playerAvatar = createAvatar();
scene.add(playerAvatar);

// Resetar posição Y para 0 (no AESIR ele nasce no y=2 ou 5)
// Para o editor, queremos ele no chão
playerAvatar.position.set(0, 2.0, 0); // Mantem 2.0 se o pé fica no chao ~0

// Expõe bones para o editor
const bones = playerAvatar.bones;

// Ajuste rápido de compatibilidade se necessário
// O PoseEditor espera bones.leftArm etc.
// O skeleton.js do AESIR já exporta essa estrutura plana em 'createSkeleton'??
// Verificamos avatar.js -> const bones = createSkeleton(); return avatar (com avatar.bones = bones)
// skeleton.js retorna objeto { root, pelvis, ... leftArm ... } 
// Então 'bones' é exatamente o que precisamos.

console.log('✅ Full Avatar loaded!');



// ✅ APLICA POSE INICIAL ANTES DO EDITOR
console.log('✅ Aplicando pose padrão...');
const tempEditor = {
  bones: bones, applyPose: (p) => {
    // Quick apply before full editor loads
    Object.entries(p).forEach(([boneGroup, data]) => {
      if (boneGroup.includes('Arm')) Object.entries(data).forEach(([key, rot]) => {
        const boneName = boneGroup.replace('Arm', '') + key.charAt(0).toUpperCase() + key.slice(1);
        if (bones[boneName]) bones[boneName].rotation.set(rot.x, rot.y, rot.z);
      });
    });
  }
};
tempEditor.applyPose(defaultPose);



// ============================================
// Initialize Pose Editor
// ============================================
const poseEditor = new PoseEditor(scene, bones);

console.log('✅ Pose editor initialized!');
poseEditor.defaultPose = defaultPose;

// ============================================
// Camera Controls (Simplified)
// ============================================
let isRightMouseDown = false;
let isMiddleMouseDown = false; // ✅ Pan com botão do meio
let lastMouseX = 0;
let lastMouseY = 0;
const cameraCenter = new THREE.Vector3(0, 1.5, 0);
const keys = {};

document.addEventListener('mousedown', (e) => {
  if (e.button === 2) {
    isRightMouseDown = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  }
  // ✅ Botão do meio (scroll) para pan
  if (e.button === 1) {
    isMiddleMouseDown = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    e.preventDefault();
  }
});

document.addEventListener('mouseup', (e) => {
  if (e.button === 2) {
    isRightMouseDown = false;
  }
  if (e.button === 1) {
    isMiddleMouseDown = false;
  }
});

document.addEventListener('mousemove', (e) => {
  // ✅ Pan com botão do meio
  if (isMiddleMouseDown) {
    const deltaMove = { x: e.clientX - lastMouseX, y: e.clientY - lastMouseY };
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    const panSpeed = 0.005;

    // Calcula vetores right e up da câmera
    const right = new THREE.Vector3();
    const up = new THREE.Vector3();
    camera.getWorldDirection(new THREE.Vector3());
    right.setFromMatrixColumn(camera.matrix, 0);
    up.setFromMatrixColumn(camera.matrix, 1);

    // Move camera e centro
    const panX = right.multiplyScalar(-deltaMove.x * panSpeed);
    const panY = up.multiplyScalar(deltaMove.y * panSpeed);

    camera.position.add(panX).add(panY);
    cameraCenter.add(panX).add(panY);
  }

  // Rotação com botão direito
  if (isRightMouseDown) {
    const deltaMove = { x: e.clientX - lastMouseX, y: e.clientY - lastMouseY };
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    const offset = camera.position.clone().sub(cameraCenter);

    const spherical = new THREE.Spherical().setFromVector3(offset);
    spherical.theta -= deltaMove.x * 0.01;
    spherical.phi -= deltaMove.y * 0.01;

    spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

    offset.setFromSpherical(spherical);
    camera.position.addVectors(offset, cameraCenter);
    camera.lookAt(cameraCenter);
  }
});

document.addEventListener('wheel', (e) => {
  e.preventDefault();
  const zoomSpeed = 0.1;
  const direction = camera.position.clone().normalize();
  const distance = camera.position.length();
  const newDistance = e.deltaY > 0 ? distance + zoomSpeed : distance - zoomSpeed;

  if (newDistance > 0.5 && newDistance < 20) {
    // CORREÇÃO: Usar copy() em vez de atribuição direta
    camera.position.copy(direction.multiplyScalar(newDistance));
  }
}, { passive: false });

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function updateCameraFromKeys() {
  const panSpeed = 0.1;
  if (keys['ArrowUp']) camera.position.y += panSpeed;
  if (keys['ArrowDown']) camera.position.y -= panSpeed;
  if (keys['ArrowLeft']) camera.position.x -= panSpeed;
  if (keys['ArrowRight']) camera.position.x += panSpeed;
}

document.addEventListener('contextmenu', (e) => e.preventDefault());

// ============================================
// Animation Loop
// ============================================
function animar() {
  requestAnimationFrame(animar);
  updateCameraFromKeys();

  if (window.poseEditor) {
    window.poseEditor.updateHelpers();
  }


  renderer.render(scene, camera);
}
animar();

// ============================================
// Responsive
// ============================================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});




// ✅ VERIFICAÇÃO DE SANIDADE
setTimeout(() => {
  console.log('=== Final Check ===');
  console.log('Left elbow Y rotation (should be ~0.5):', bones.leftElbow.rotation.y);
  console.log('Right elbow Y rotation (should be ~-0.5):', bones.rightElbow.rotation.y);
  console.log('Left wrist Y rotation (should be ~1.57):', bones.leftWrist.rotation.y);
  console.log('Right wrist Y rotation (should be ~-1.57):', bones.rightWrist.rotation.y);
}, 1000);