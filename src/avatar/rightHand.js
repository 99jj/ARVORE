// src/avatar/rightHand.js
import * as THREE from 'three';
import { materials } from './materials.js';

export function addRightHand(bones) {
  const { skin } = materials;

  // Anexa diretamente ao osso do antebraço
  const wrist = new THREE.Bone();
  wrist.position.set(0, -0.15, 0); // Ajustado para igualar ARVORE (-0.15)
  wrist.rotation.x = Math.PI;     // Aponta para baixo
  wrist.rotation.y = Math.PI / 2; // Palma para o corpo (espelhado)

  bones.rightForearm.add(wrist);
  bones.rightWrist = wrist;

  // PALMA: Reduced size ~25%
  const palm = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.32, 0.10),
    skin
  );
  palm.position.set(0, 0.16, 0);
  wrist.add(palm);

  // Smaller fingers (Reduced ~25%)
  const fingerGeo = new THREE.CylinderGeometry(0.020, 0.018, 0.11, 8);
  const tipGeo = new THREE.SphereGeometry(0.020, 16, 16);

  const fingers = {};

  // DEDOS: grow in Y
  const config = [
    { name: 'thumb', x: 0.14, y: 0.08, z: 0.00, rotZ: -1.0 },
    { name: 'index', x: 0.10, y: 0.32, z: 0.00 },
    { name: 'middle', x: 0.035, y: 0.32, z: 0.00 },
    { name: 'ring', x: -0.035, y: 0.32, z: 0.00 },
    { name: 'pinky', x: -0.10, y: 0.32, z: 0.00 }
  ];

  config.forEach(c => {
    const base = new THREE.Bone();
    wrist.add(base);
    base.position.set(c.x, c.y, c.z);
    if (c.rotZ) base.rotation.z = c.rotZ;
    base.name = `${c.name}Finger_base`;

    const prox = new THREE.Bone();
    base.add(prox);
    prox.position.y = 0.00; // CRESCIMENTO RETO
    prox.name = `${c.name}Finger_prox`;
    const proxMesh = new THREE.Mesh(fingerGeo.clone(), skin);
    prox.add(proxMesh);
    proxMesh.position.y = 0.055; // Half of 0.11

    let mid = null;
    if (c.name !== 'thumb') {
      mid = new THREE.Bone();
      prox.add(mid);
      mid.position.y = 0.09; // Reduced from 0.12
      mid.name = `${c.name}Finger_mid`;
      const midMesh = new THREE.Mesh(fingerGeo.clone(), skin);
      mid.add(midMesh);
      midMesh.position.y = 0.055;
    }

    const dist = new THREE.Bone();
    (mid || prox).add(dist);
    dist.position.y = c.name === 'thumb' ? 0.07 : 0.09; // Reduced from 0.10/0.12
    dist.name = `${c.name}Finger_dist`;
    const distMesh = new THREE.Mesh(fingerGeo.clone(), skin);
    dist.add(distMesh);
    distMesh.position.y = 0.055;

    const tip = new THREE.Mesh(tipGeo.clone(), skin);
    tip.position.y = 0.06; // Reduced from 0.08
    dist.add(tip);

    fingers[c.name] = { base, prox, mid, dist };
  });

  bones.rightHandFingers = fingers;
}