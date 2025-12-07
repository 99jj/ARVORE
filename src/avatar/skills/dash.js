// dash.js
import * as THREE from 'three';
import { createDashTrail, cleanupAllTrails } from './dashTrails.js';

// Estado interno do dash
export let dashState = {
  active: false,
  dashInterval: null,
  forceCleanupTimer: null,
  scene: null,
  lastDashTime: 0
};

/**
 * Executa o dash: move o player gradualmente para uma nova posição.
 * Callback opcional é chamado a cada step do dash para adicionar efeitos visuais.
 * @param {THREE.Object3D} player - O objeto do player.
 * @param {THREE.Scene} scene - A cena.
 * @param {THREE.Vector3} direction - Vetor de direção do dash.
 * @param {PhysicsWorld} physicsWorld - O mundo de física.
 * @param {Function} onDashStep - Callback opcional chamado a cada passo (posição) do dash.
 */
export function dash(player, scene, direction, physicsWorld, onDashStep) {
  // Se ainda estamos em dash, ignora
  if (dashState.active) {
    return;
  }

  // Define a velocidade do dash (unidades por segundo)
  const dashSpeed = 100;
  const dashDuration = 0.15; // segundos
  const dashDistance = dashSpeed * dashDuration;

  // Ativa o estado do dash
  dashState.active = true;
  dashState.scene = scene;
  dashState.lastDashTime = Date.now();

  // Divide o dash em 10 passos para atualização gradual
  const steps = 10;
  const dashDurationMs = dashDuration * 1000; // converter para ms
  const intervalTime = dashDurationMs / steps;
  const velocityPerStep = new THREE.Vector3().copy(direction).multiplyScalar(dashSpeed);
  let step = 0;

  // Função para finalizar o dash
  const finalizeDash = () => {
    cleanupAllTrails(scene);
    dashState.active = false;
    dashState.scene = null;
  };

  // Configura um timer para limpeza forçada
  dashState.forceCleanupTimer = setTimeout(() => {
    console.log("Dash completed");
    finalizeDash();
  }, dashDurationMs + 50);

  // Configura o intervalo para executar o dash
  dashState.dashInterval = setInterval(() => {
    step++;
    
    // Se tem physics world, aplica velocidade. Senão, move direto (fallback)
    if (physicsWorld && player.userData.physicsBody) {
      physicsWorld.setBodyVelocity(
        player,
        velocityPerStep.x,
        velocityPerStep.y,
        velocityPerStep.z
      );
    } else {
      // Fallback: movimento direto sem physics
      const stepDelta = new THREE.Vector3().copy(direction).multiplyScalar(dashDistance / steps);
      player.position.add(stepDelta);
    }

    // Chama callback para efeitos visuais (se fornecido)
    if (onDashStep) {
      onDashStep(player.position.clone(), step, steps, direction);
    }

    // Se o dash terminou
    if (step >= steps) {
      // Limpa o intervalo
      clearInterval(dashState.dashInterval);
      dashState.dashInterval = null;
      
      // Para a velocidade de dash (zera velocidade horizontal)
      if (physicsWorld && player.userData.physicsBody) {
        const currentVel = physicsWorld.getBodyVelocity(player);
        physicsWorld.setBodyVelocity(player, 0, currentVel.y, 0);
      }
      
      // Finaliza o dash
      finalizeDash();
    }
  }, intervalTime);
}

/**
 * Registra os listeners para dash (double-tap) nas teclas W, A, S e D.
 * @param {THREE.Object3D} player - O objeto do player.
 * @param {THREE.Scene} scene - A cena.
 * @param {PhysicsWorld} physicsWorld - O mundo de física.
 * @param {THREE.Camera} camera - A câmera para calcular direção.
 * @param {Function} onDashStep - Callback para criar trails a cada passo.
 */
export function registerDashListeners(player, scene, physicsWorld, camera, onDashStep) {
  let lastWTime = 0;
  let lastATime = 0;
  let lastSTime = 0;
  let lastDTime = 0;
  const doubleTapThreshold = 300; // milissegundos

  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    const now = Date.now();

    if (key === 'w' && !event.repeat) {
      if (now - lastWTime < doubleTapThreshold) {
        console.log("Double tap detectado em W! Executando dash para frente.");
        const dir = new THREE.Vector3(0, 0, 1);
        camera.getWorldDirection(dir);
        dir.y = 0;
        dir.normalize();
        dash(player, scene, dir, physicsWorld, onDashStep);
      }
      lastWTime = now;
    }
    if (key === 's' && !event.repeat) {
      if (now - lastSTime < doubleTapThreshold) {
        console.log("Double tap detectado em S! Executando dash para trás.");
        const dir = new THREE.Vector3(0, 0, 1);
        camera.getWorldDirection(dir);
        dir.y = 0;
        dir.normalize();
        dir.negate();
        dash(player, scene, dir, physicsWorld, onDashStep);
      }
      lastSTime = now;
    }
    if (key === 'a' && !event.repeat) {
      if (now - lastATime < doubleTapThreshold) {
        console.log("Double tap detectado em A! Executando dash para a esquerda.");
        const dir = new THREE.Vector3(0, 0, 1);
        camera.getWorldDirection(dir);
        dir.y = 0;
        dir.normalize();
        const left = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), dir);
        dash(player, scene, left, physicsWorld, onDashStep);
      }
      lastATime = now;
    }
    if (key === 'd' && !event.repeat) {
      if (now - lastDTime < doubleTapThreshold) {
        console.log("Double tap detectado em D! Executando dash para a direita.");
        const dir = new THREE.Vector3(0, 0, 1);
        camera.getWorldDirection(dir);
        dir.y = 0;
        dir.normalize();
        const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0));
        dash(player, scene, right, physicsWorld, onDashStep);
      }
      lastDTime = now;
    }
  });
  
  // Verificação periódica para garantir que o state seja reset
  setInterval(() => {
    if (dashState.dashInterval === null && dashState.forceCleanupTimer === null) {
      dashState.active = false;
    }
  }, 100);
}