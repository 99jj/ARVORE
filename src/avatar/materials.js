// avatar/materials.js
import * as THREE from 'three';

export const materials = {
  skin: new THREE.MeshPhongMaterial({ color: 0xffcc99 }),
  clothes: new THREE.MeshPhongMaterial({ color: 0x111111 }),
  pants: new THREE.MeshPhongMaterial({ color: 0x000066 }),
  bodyDark: new THREE.MeshPhongMaterial({ color: 0x222266 }),
  eyeWhite: new THREE.MeshPhongMaterial({ color: 0xffffff }),
  eyeBlack: new THREE.MeshPhongMaterial({ color: 0x000000 }),
  mouth: new THREE.MeshPhongMaterial({ color: 0x8b4545 })
};