// dashTrails.js
import * as THREE from 'three';

let activeTrails = [];

/**
 * Cria um trail visual para o dash
 * @param {THREE.Vector3} position - Posição do trail
 * @param {THREE.Vector3} direction - Direção do dash
 * @param {THREE.Scene} scene - Cena
 * @param {number} trailLength - Comprimento do trail (opcional, padrão 2)
 * @param {number} opacity - Opacidade do trail (opcional, padrão 0.7)
 */
export function createDashTrail(position, direction, scene, trailLength = 2, opacity = 0.7) {
  // Calcula a direção oposta (atrás do jogador)
  let trailDirection;
  if (direction && direction.length() > 0) {
    // Cria a direção oposta (atrás do dash)
    trailDirection = new THREE.Vector3().copy(direction).negate().normalize();
  } else {
    // Fallback para trás (Z negativo)
    trailDirection = new THREE.Vector3(0, 0, -1);
  }
  
  const trailEnd = position.clone().add(trailDirection.clone().multiplyScalar(trailLength));

  const geometry = new THREE.BufferGeometry().setFromPoints([position, trailEnd]);
  const material = new THREE.LineBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: opacity,
    linewidth: 3,
    fog: false
  });
  const line = new THREE.Line(geometry, material);
  
  // Garante que o trail não interage com physics ou sombras
  line.castShadow = false;
  line.receiveShadow = false;
  
  scene.add(line);

  const trailObj = { line, geometry, material, createdAt: Date.now() };
  activeTrails.push(trailObj);

  // Auto-remove muito rapidamente (200ms)
  setTimeout(() => {
    removeTrail(line, scene);
  }, 200);
}

function removeTrail(line, scene) {
  try {
    // Remove da cena
    if (line.parent) {
      line.parent.remove(line);
    }
    scene.remove(line);
    
    // Limpa recursos
    if (line.geometry) {
      line.geometry.dispose();
    }
    if (line.material) {
      if (Array.isArray(line.material)) {
        line.material.forEach(m => m.dispose());
      } else {
        line.material.dispose();
      }
    }
    
    // Remove referência
    line = null;
  } catch (e) {
    console.warn('Erro ao remover trail:', e);
  }
  
  activeTrails = activeTrails.filter(t => t.line !== line);
}

/**
 * Limpa todos os trails ativos
 * @param {THREE.Scene} scene - Cena
 */
export function cleanupAllTrails(scene) {
  activeTrails.forEach(trail => {
    try {
      scene.remove(trail.line);
      if (trail.geometry) trail.geometry.dispose();
      if (trail.material) trail.material.dispose();
    } catch (e) {
      console.warn('Erro ao limpar trail:', e);
    }
  });
  activeTrails = [];
}
