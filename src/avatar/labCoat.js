// avatar/labCoatFixed.js
import * as THREE from 'three';

export function createLabCoat(avatar) {
  if (!avatar?.bones?.spine) {
    console.error('❌ Spine não encontrada!');
    return new THREE.Group();
  }

  console.log('✅ Criando jaleco...');
  const coatGroup = new THREE.Group();
  
  // 🔧 FIX: Move o grupo para posição correta no peito
  coatGroup.position.y = 1.5; // Inicia na altura do peito
  coatGroup.position.z = 0.1; // Afasta do corpo para não "colar"

  avatar.bones.spine.add(coatGroup);

  const coatMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: false,
    opacity: 1.0
  });

  const segments = 12;
  const segmentHeight = 0.18;
  const centerGap = 0.15;

  for (let i = 0; i < segments; i++) {
    const topWidth = 1.0 - (i * 0.02);
    const bottomWidth = 1.0 - ((i + 1) * 0.02);

    // Painel ESQUERDO
    const leftGeom = new THREE.BufferGeometry();
    const leftVerts = new Float32Array([
      -topWidth,    -(i * segmentHeight),       0,
      -centerGap/2, -(i * segmentHeight),       0,
      -bottomWidth, -(i + 1) * segmentHeight,   0,
      -centerGap/2, -(i + 1) * segmentHeight,   0
    ]);
    leftGeom.setAttribute('position', new THREE.BufferAttribute(leftVerts, 3));
    leftGeom.setIndex(new Uint16Array([0, 1, 2, 1, 3, 2]));
    leftGeom.computeVertexNormals();
    const leftPanel = new THREE.Mesh(leftGeom, coatMaterial);
    coatGroup.add(leftPanel);

    // Painel DIREITO
    const rightGeom = new THREE.BufferGeometry();
    const rightVerts = new Float32Array([
      centerGap/2,  -(i * segmentHeight),       0,
      topWidth,     -(i * segmentHeight),       0,
      centerGap/2,  -(i + 1) * segmentHeight,   0,
      bottomWidth,  -(i + 1) * segmentHeight,   0
    ]);
    rightGeom.setAttribute('position', new THREE.BufferAttribute(rightVerts, 3));
    rightGeom.setIndex(new Uint16Array([0, 1, 2, 1, 3, 2]));
    rightGeom.computeVertexNormals();
    const rightPanel = new THREE.Mesh(rightGeom, coatMaterial);
    coatGroup.add(rightPanel);
  }

  // 🎲 DEBUG: Caixa vermelha para ver onde o jaleco está
  const debugBox = new THREE.BoxHelper(coatGroup, 0xff0000);
  coatGroup.add(debugBox);
  console.log('📦 Jaleco criado com', segments * 2, 'painéis');

  return coatGroup;
}