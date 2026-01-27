// ============================================
// 🎮 INTERACTIVE HAND POSE EDITOR
// ============================================

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { PoseEditor } from './poseEditor.js';
import { defaultPose } from './defaultPose.js';
import { createAvatar } from './avatar/avatar.js';
import { PrimitiveManager } from './primitiveManager.js';
import { VertexEditor } from './vertexEditor.js';

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
// Managers & App Logic
// ============================================
const primitiveManager = new PrimitiveManager(scene);


// Global App Interface
window.app = {
  addPrimitive: (type) => {
    const obj = primitiveManager.createPrimitive(type);

    // Auto-select new object
    transformControl.attach(obj);
    updateSelectionBox(obj);
    console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} added`);
  },
  loadAvatar: () => {
    if (window.avatarLoaded) {
      console.warn("Avatar already loaded");
      return;
    }
    window.avatarLoaded = true;

    console.log('⏳ Loading Avatar...');
    const playerAvatar = createAvatar();
    scene.add(playerAvatar);
    playerAvatar.position.set(0, 0, 0);

    const bones = playerAvatar.bones;

    // Apply Default Pose
    const tempEditor = {
      bones: bones,
      applyPose: (p) => {
        Object.entries(p).forEach(([boneGroup, data]) => {
          if (boneGroup.includes('Arm')) Object.entries(data).forEach(([key, rot]) => {
            const boneName = boneGroup.replace('Arm', '') + key.charAt(0).toUpperCase() + key.slice(1);
            if (bones[boneName]) bones[boneName].rotation.set(rot.x, rot.y, rot.z);
          });
        });
      }
    };
    tempEditor.applyPose(defaultPose);

    // Initialize Pose Editor
    // Note: PoseEditor is attached to window.poseEditor inside its constructor or we do it here?
    // The original code was: const poseEditor = new PoseEditor(scene, bones);
    const poseEditor = new PoseEditor(scene, bones);
    poseEditor.defaultPose = defaultPose;

    // Make sure anim loop sees it if it wasn't already global (it wasn't explicitly assigned to window in original code)
    // Wait, line 218 checks window.poseEditor. 
    // The original code didn't assign 'poseEditor' to window.poseEditor explicitly in the snippet I saw? 
    // Ah, 'window.poseEditor' might be assigned inside PoseEditor class? 
    // Let's assume I need to assign it to be safe.
    window.poseEditor = poseEditor;

    // Attach bones to window for verification/debug
    window.debugBones = bones;

    console.log('✅ Avatar Loaded & Pose Editor Initialized');
  },
  unloadAvatar: () => {
    if (!window.avatarLoaded) {
      console.warn("No avatar to unload");
      return;
    }

    console.log("🗑️ Unloading Avatar...");

    // 1. Dispose Pose Editor (UI, listeners, helpers)
    if (window.poseEditor) {
      window.poseEditor.dispose();
      window.poseEditor = null;
    }

    // 2. Remove Avatar from Scene
    // We need to find the avatar group. Since we didn't store it globally in a clear variable other than scene.add
    // We can search for the "TorsoMesh" or look for the group that contains bones.
    // Ideally loadAvatar should have stored it. 
    // But since it's a hierarchy, we can traverse or simply remove the known structure.
    // However, let's look at loadAvatar again. It calls createAvatar() which returns a Group.
    // We can just find the object named 'HumanAvatar' or similar if createAvatar names it.
    // Let's assume we can simply find the root object.
    // A better way is to store playerAvatar globally in loadAvatar.
    // But we can iterate scene children and remove the one that has our bones or name.

    const avatar = scene.children.find(c => c.type === 'Group' && c.children.length > 0 && (c.children.some(k => k.isBone) || c.getObjectByName('Pelvis')));
    if (avatar) {
      scene.remove(avatar);
      // Optional: Dispose geometry/materials if we want to be thorough
      avatar.traverse(o => {
        if (o.isMesh) {
          if (o.geometry) o.geometry.dispose();
          if (o.material) o.material.dispose();
        }
      });
    }

    window.avatarLoaded = false;
    window.debugBones = null;
    console.log("✅ Avatar Unloaded");
  },
  setTransformMode: (mode) => {
    if (window.transformControl) {
      window.transformControl.setMode(mode);
      console.log("Mode set to:", mode);
    }
  },
  toggleEditMode: () => {
    isEditMode = !isEditMode;
    const btn = document.getElementById('btn-edit-mode');
    const menu = document.getElementById('edit-mode-menu');

    if (isEditMode) {
      btn.innerText = "Edit Mode: ON";
      btn.style.background = "#28a745"; // Green
      menu.style.display = "block"; // Show Menu

      // Enable for currently selected object if any
      console.log("Toggle Edit Mode - Current Object:", transformControl.object);
      if (transformControl.object && transformControl.object.isMesh) {
        vertexEditor.enable(transformControl.object);
        transformControl.detach();
        removeSelectionBox();
      } else {
        alert("Select an object first!");
        isEditMode = false;
        btn.innerText = "Edit Mode: OFF";
        btn.style.background = "#444";
        menu.style.display = "none";
      }
    } else {
      btn.innerText = "Edit Mode: OFF";
      btn.style.background = "#444";
      menu.style.display = "none"; // Hide Menu

      vertexEditor.disable();

      if (vertexEditor.targetMesh) {
        transformControl.attach(vertexEditor.targetMesh);
        updateSelectionBox(vertexEditor.targetMesh);
      }
    }
  },
  setSelectionMode: (mode) => {
    console.log("Selection Mode:", mode);
    vertexEditor.setMode(mode);
  }
};

console.log('✨ Mini-Blender Initialized. Click "Load Avatar" to start character editing.');

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
// Transform Controls & Selection
// ============================================
const transformControl = new TransformControls(camera, renderer.domElement);
transformControl.addEventListener('dragging-changed', (event) => {
  // If dragging a vertex handle, we must update the mesh geometry
  if (isEditMode && transformControl.object && transformControl.object.userData.isHandle) {
    // We need to continuously update? 'change' event is better for continuous update.
    // 'dragging-changed' is start/end.
  }
});
transformControl.addEventListener('change', () => {
  // Continuous update during drag
  if (isEditMode && transformControl.object && transformControl.object.userData.isHandle) {
    vertexEditor.updateGeometryFromHandle(transformControl.object);
  }
});
// FIX: Instead of adding the control object (which fails due to missing Object3D methods on this build),
// we select the internal visual root (_root or getHelper) to add to the scene.
const gizmoVisual = transformControl.getHelper ? transformControl.getHelper() : transformControl._root;
if (gizmoVisual) {
  scene.add(gizmoVisual);
  window.gizmoVisual = gizmoVisual; // Store for raycasting
} else {
  // Fallback if structure is unexpected
  console.warn("Gizmo root not found, trying legacy add.");
  scene.add(transformControl);
}

// Initialize Vertex Editor (Must be after TransformControls is created)
const vertexEditor = new VertexEditor(scene, transformControl);
let isEditMode = false;

const raycaster = new THREE.Raycaster();
raycaster.params.Line.threshold = 0.1; // Make it easier/harder to click lines
const mouse = new THREE.Vector2();

// Selection Box System (Oriented Bounding Box)
// We use a LineSegments object that we will re-parent to the selected mesh.
const selectionBoxMaterial = new THREE.LineBasicMaterial({ color: 0xffff00, depthTest: false, transparent: true });
let selectionBox = null;

function updateSelectionBox(object) {
  if (selectionBox) {
    selectionBox.removeFromParent();
    selectionBox.geometry.dispose();
  }

  let geometryToHighlight = null;
  const type = object.geometry.type;

  // Determine Helper Geometry based on Object Type
  if (type === 'SphereGeometry') {
    // For Sphere, EdgesGeometry is empty (no sharp edges).
    // WireframeGeometry is too dense (shows diagonal mesh lines).
    // We create a simpler low-poly sphere for the visual selection.
    const radius = object.geometry.parameters.radius || 0.5;
    // Create a 'Wireframe' look using a low-poly sphere
    const proxyGeo = new THREE.SphereGeometry(radius, 16, 12);
    geometryToHighlight = new THREE.WireframeGeometry(proxyGeo);

  } else if (type === 'CylinderGeometry') {
    // Cylinder looks great with EdgesGeometry (outline)
    geometryToHighlight = new THREE.EdgesGeometry(object.geometry);

  } else {
    // Default (Box, etc): Use EdgesGeometry (Outline)
    geometryToHighlight = new THREE.EdgesGeometry(object.geometry);
  }

  selectionBox = new THREE.LineSegments(geometryToHighlight, selectionBoxMaterial);

  // Attach to object (so it inherits rotation/scale/position)
  object.add(selectionBox);
  window.selectionBox = selectionBox; // Expose for raycaster ignore
}

function removeSelectionBox() {
  if (selectionBox) {
    selectionBox.removeFromParent();
    if (selectionBox.geometry) selectionBox.geometry.dispose();
    selectionBox = null;
    window.selectionBox = null;
  }
}

// Selection Event
renderer.domElement.addEventListener('mousedown', (event) => {
  // Only handle Left Click (0) for selection
  if (event.button !== 0) return;

  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // Filter objects to select (Primitives and Avatar parts if needed)
  // We include everything initially to check if we hit the gizmo, but exclude our selection box
  const intersectableObjects = scene.children; // Selection box is child of object, handled by recursion?
  // Actually, selection box is a "LineSegments". We can filter loop.

  const intersects = raycaster.intersectObjects(intersectableObjects, true);



  if (intersects.length > 0) {
    // Iterate through hits to find the first meaningful object
    let hitObject = null;
    let isGizmo = false;

    for (let i = 0; i < intersects.length; i++) {
      const obj = intersects[i].object;
      console.log(`Checking: ${obj.type} / ${obj.name}`);

      // Ignore the invisible plane used for dragging
      if (obj.type === 'TransformControlsPlane') continue;

      // Check if it's the Gizmo (Handles)
      let parent = obj;
      let foundGizmo = false;
      while (parent) {
        if (parent === transformControl || (window.gizmoVisual && parent === window.gizmoVisual)) {
          foundGizmo = true;
          break;
        }
        parent = parent.parent;
      }

      if (foundGizmo) {
        // Fix: Ignore "Line" objects in the gizmo (infinite helpers), only interact with Meshes (Handles)
        if (obj.type === 'Line') {
          continue;
        }

        isGizmo = true;
        hitObject = obj;
        break; // Stop at gizmo (highest priority)
      }

      // Ignore our Selection Box (LineSegments inside the object)
      if (obj === window.selectionBox || (window.selectionBox && obj.parent === window.selectionBox)) {
        continue;
      }

      // 4. Edit Mode Logic: Check for Handles
      if (isEditMode) {
        if (obj.userData && obj.userData.isHandle) {
          // If handle is invisible, skip it (VertexEditor visibility logic)
          if (obj.visible === false) continue;

          console.log(`📍 Clicked Handle: ${obj.userData.type}`);
          transformControl.attach(obj);
          hitObject = obj;
          break;
        }
        // In Edit Mode, we want to IGNORE the mesh body if a handle is clicked.
        // If we click the mesh body but NOT a handle, we might probably just do nothing or allow re-selection?
        // For now, if we hit the mesh itself (the one being edited), ignore it so we can click handles "through" it if needed? 
      }

      // If it's a regular mesh (Ground or Object)
      if (obj.isMesh || obj.isSkinnedMesh) {
        if (isEditMode) {
          // In edit mode, if we click the mesh being edited, ignore it (don't re-select object mode)
          if (vertexEditor.targetMesh === obj) continue;
        }
        hitObject = obj;
        break; // Stop at first mesh
      }
    }

    if (isGizmo) {
      return;
    }

    if (hitObject) {
      console.log("🖱️ Valid Click:", hitObject.type);

      // 2. Deselect if Hit Ground
      if (hitObject === chao) {
        transformControl.detach();
        removeSelectionBox();
        return;
      }

      // 3. Attach if Mesh
      console.log("🎯 Selected:", hitObject);
      transformControl.attach(hitObject);

      // Update Selection Box
      updateSelectionBox(hitObject);
    } else {
      transformControl.detach();
      removeSelectionBox();
    }
  } else {
    transformControl.detach();
    removeSelectionBox();
  }
});


// Expose for UI
window.transformControl = transformControl;

// Key listeners for Transform Modes
document.addEventListener('keydown', (event) => {
  switch (event.key.toLowerCase()) {
    case 't': transformControl.setMode('translate'); break;
    case 'r': transformControl.setMode('rotate'); break;
    case 's': transformControl.setMode('scale'); break;
    case 'escape': transformControl.detach(); break;
  }
});


// ============================================
// Animation Loop
// ============================================
function animar() {
  requestAnimationFrame(animar);
  updateCameraFromKeys();

  if (window.poseEditor) {
    window.poseEditor.updateHelpers();
  }

  // Update Selection Helper if active
  if (typeof selectionHelper !== 'undefined' && selectionHelper.visible) {
    selectionHelper.update();
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
  if (window.debugBones) {
    const bones = window.debugBones;
    console.log('=== Final Check ===');
    console.log('Left elbow Y rotation (should be ~0.5):', bones.leftElbow.rotation.y);
    console.log('Right elbow Y rotation (should be ~-0.5):', bones.rightElbow.rotation.y);
    console.log('Left wrist Y rotation (should be ~1.57):', bones.leftWrist.rotation.y);
    console.log('Right wrist Y rotation (should be ~-1.57):', bones.rightWrist.rotation.y);
  }
}, 1000);