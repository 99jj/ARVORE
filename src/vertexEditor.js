import * as THREE from 'three';

export class VertexEditor {
    constructor(scene, transformControl) {
        this.scene = scene;
        this.transformControl = transformControl;
        this.enabled = false;
        this.targetMesh = null;
        this.handles = [];

        this.handleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, depthTest: false, transparent: true });
        this.edgeMaterial = new THREE.LineBasicMaterial({ color: 0x0088ff, depthTest: false, transparent: true });
        this.faceMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, depthTest: false, transparent: true, opacity: 0.5, side: THREE.DoubleSide });

        this.handleGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05); // Vertex
        this.faceHandleGeometry = new THREE.PlaneGeometry(0.1, 0.1); // Face (small plane)

        this.activeMode = 'vertex'; // 'vertex', 'edge', 'face', 'all'
    }

    setMode(mode) {
        this.activeMode = mode;
        this.updateHandleVisibility();
    }

    updateHandleVisibility() {
        this.handles.forEach(h => {
            const type = h.userData.type;
            if (this.activeMode === 'all') {
                h.visible = true;
            } else {
                h.visible = (type === this.activeMode);
            }
        });
    }

    enable(mesh) {
        if (this.targetMesh === mesh) return; // Already editing this mesh
        this.disable(); // Clear previous

        if (!mesh || !mesh.isMesh) return;

        this.targetMesh = mesh;
        this.enabled = true;
        this.createHandles(mesh);
    }

    disable() {
        this.clearHandles();
        this.targetMesh = null;
        this.enabled = false;
        this.transformControl.detach();
    }

    clearHandles() {
        this.handles.forEach(handle => {
            handle.removeFromParent();
            // We reuse geometry/material, so don't dispose global ones
        });
        this.handles = [];
    }

    // Called when a handle is moved by TransformControls
    updateGeometryFromHandle(handle) {
        if (!this.targetMesh) return;

        const positionAttribute = this.targetMesh.geometry.attributes.position;
        const type = handle.userData.type;

        if (type === 'vertex') {
            const indices = handle.userData.vertexIndices;
            const localPos = handle.position;

            indices.forEach(index => {
                positionAttribute.setXYZ(index, localPos.x, localPos.y, localPos.z);
            });

            this.syncAllHandles();

        } else if (type === 'edge') {
            // Edge Logic
            const linePosAttr = handle.geometry.attributes.position;
            const p0 = new THREE.Vector3().fromBufferAttribute(linePosAttr, 0);
            const p1 = new THREE.Vector3().fromBufferAttribute(linePosAttr, 1);

            handle.updateMatrix();
            p0.applyMatrix4(handle.matrix); // New Pos A
            p1.applyMatrix4(handle.matrix); // New Pos B

            const indicesA = handle.userData.vertexIndicesA;
            const indicesB = handle.userData.vertexIndicesB;

            indicesA.forEach(idx => positionAttribute.setXYZ(idx, p0.x, p0.y, p0.z));
            indicesB.forEach(idx => positionAttribute.setXYZ(idx, p1.x, p1.y, p1.z));

            this.syncAllHandles();

        } else if (type === 'face') {
            // Face Logic
            const localPos = handle.position;

            const indices = handle.userData.vertexIndices; // [A, B, C]
            const pA = new THREE.Vector3().fromBufferAttribute(positionAttribute, indices[0]);
            const pB = new THREE.Vector3().fromBufferAttribute(positionAttribute, indices[1]);
            const pC = new THREE.Vector3().fromBufferAttribute(positionAttribute, indices[2]);

            const currentCentroid = new THREE.Vector3().add(pA).add(pB).add(pC).divideScalar(3);
            const delta = new THREE.Vector3().subVectors(localPos, currentCentroid);

            [pA, pB, pC].forEach((p, i) => {
                p.add(delta);
                positionAttribute.setXYZ(indices[i], p.x, p.y, p.z);
            });

            this.syncAllHandles();
        }

        positionAttribute.needsUpdate = true;
        this.targetMesh.geometry.computeBoundingBox();
        this.targetMesh.geometry.computeBoundingSphere();
    }

    syncAllHandles() {
        const posAttr = this.targetMesh.geometry.attributes.position;

        this.handles.forEach(h => {
            const type = h.userData.type;
            if (type === 'vertex') {
                // Update vertex handle pos from geometry
                const idx = h.userData.vertexIndices[0];
                h.position.set(posAttr.getX(idx), posAttr.getY(idx), posAttr.getZ(idx));
            }
            else if (type === 'edge') {
                // Update edge lines
                const pA = new THREE.Vector3().fromBufferAttribute(posAttr, h.userData.vertexIndicesA[0]);
                const pB = new THREE.Vector3().fromBufferAttribute(posAttr, h.userData.vertexIndicesB[0]);

                const positions = h.geometry.attributes.position;
                positions.setXYZ(0, pA.x, pA.y, pA.z);
                positions.setXYZ(1, pB.x, pB.y, pB.z);
                positions.needsUpdate = true;

                // Reset handle transform (since geometry moved)
                h.position.set(0, 0, 0); h.rotation.set(0, 0, 0); h.scale.set(1, 1, 1);
                h.updateMatrix();

                h.userData.posA.copy(pA);
                h.userData.posB.copy(pB);
            }
            else if (type === 'face' && h !== this.transformControl.object) {
                // Update other face handles (centroid)
                const idxs = h.userData.vertexIndices;
                const pA = new THREE.Vector3().fromBufferAttribute(posAttr, idxs[0]);
                const pB = new THREE.Vector3().fromBufferAttribute(posAttr, idxs[1]);
                const pC = new THREE.Vector3().fromBufferAttribute(posAttr, idxs[2]);
                h.position.addVectors(pA, pB).add(pC).divideScalar(3);
            }
        });
    }

    createHandles(mesh) {
        const positionAttribute = mesh.geometry.attributes.position;
        const vertexCount = positionAttribute.count;

        // --- 1. Vertex Handles ---
        const uniqueVertices = {};

        for (let i = 0; i < vertexCount; i++) {
            const x = positionAttribute.getX(i);
            const y = positionAttribute.getY(i);
            const z = positionAttribute.getZ(i);

            const key = `${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}`;

            if (!uniqueVertices[key]) {
                uniqueVertices[key] = [];
            }
            uniqueVertices[key].push(i);
        }

        for (const key in uniqueVertices) {
            const indices = uniqueVertices[key];
            const i = indices[0];

            const x = positionAttribute.getX(i);
            const y = positionAttribute.getY(i);
            const z = positionAttribute.getZ(i);

            const handle = new THREE.Mesh(this.handleGeometry, this.handleMaterial);
            handle.position.set(x, y, z);

            handle.userData = {
                isHandle: true,
                type: 'vertex',
                vertexIndices: indices,
                key: key
            };

            mesh.add(handle);
            this.handles.push(handle);
        }

        // --- 2. Edge Handles (Lines) ---
        const indexAttribute = mesh.geometry.index;
        const edges = {};

        const getKey = (idx) => {
            const x = positionAttribute.getX(idx).toFixed(4);
            const y = positionAttribute.getY(idx).toFixed(4);
            const z = positionAttribute.getZ(idx).toFixed(4);
            return `${x},${y},${z}`;
        };

        const count = indexAttribute ? indexAttribute.count : vertexCount;

        for (let i = 0; i < count; i += 3) {
            let a, b, c;
            if (indexAttribute) {
                a = indexAttribute.getX(i);
                b = indexAttribute.getX(i + 1);
                c = indexAttribute.getX(i + 2);
            } else {
                a = i; b = i + 1; c = i + 2;
            }

            const keyA = getKey(a);
            const keyB = getKey(b);
            const keyC = getKey(c);

            this.addEdge(edges, keyA, keyB, uniqueVertices);
            this.addEdge(edges, keyB, keyC, uniqueVertices);
            this.addEdge(edges, keyC, keyA, uniqueVertices);
        }

        for (const edgeKey in edges) {
            const edgeData = edges[edgeKey];
            const posA = edgeData.posA;
            const posB = edgeData.posB;

            const geometry = new THREE.BufferGeometry().setFromPoints([posA, posB]);
            const line = new THREE.Line(geometry, this.edgeMaterial);

            line.userData = {
                isHandle: true,
                type: 'edge',
                vertexIndicesA: edgeData.indicesA,
                vertexIndicesB: edgeData.indicesB,
                posA: posA,
                posB: posB
            };

            mesh.add(line);
            this.handles.push(line);
        }

        // --- 3. Face Handles (Merged Centroids) ---
        const faceGroups = {}; // Key: "NormalX_NormalY_NormalZ_Constant" -> { indices: [], centerAccum: Vector3, count: 0 }

        for (let i = 0; i < count; i += 3) {
            let a, b, c;
            if (indexAttribute) {
                a = indexAttribute.getX(i);
                b = indexAttribute.getX(i + 1);
                c = indexAttribute.getX(i + 2);
            } else {
                a = i; b = i + 1; c = i + 2;
            }

            const pA = new THREE.Vector3().fromBufferAttribute(positionAttribute, a);
            const pB = new THREE.Vector3().fromBufferAttribute(positionAttribute, b);
            const pC = new THREE.Vector3().fromBufferAttribute(positionAttribute, c);

            // Calculate Normal
            const tri = new THREE.Triangle(pA, pB, pC);
            const normal = new THREE.Vector3();
            tri.getNormal(normal);

            // Calculate Plane Constant (d = -normal . point)
            // Use pA as reference point
            const constant = -normal.dot(pA);

            // Create Key (rounded to avoid float precision issues)
            // We use a looser precision for grouping to catch slightly messy geometry
            const key = `${normal.x.toFixed(3)}_${normal.y.toFixed(3)}_${normal.z.toFixed(3)}_${constant.toFixed(3)}`;

            if (!faceGroups[key]) {
                faceGroups[key] = {
                    indices: [],
                    centerAccum: new THREE.Vector3(),
                    vertexCount: 0,
                    normal: normal.clone()
                };
            }

            // Accumulate indices
            // We want UNIQUE vertices for this face group to control them all
            faceGroups[key].indices.push(a, b, c);

            // Accumulate center (weight by area? No, simple average of vertices is fine for handle position)
            faceGroups[key].centerAccum.add(pA).add(pB).add(pC);
            faceGroups[key].vertexCount += 3;
        }

        // Create Handles for Groups
        for (const key in faceGroups) {
            const group = faceGroups[key];

            // Deduplicate indices for efficient updating
            const uniqueIndices = [...new Set(group.indices)];

            // Calculate Centroid
            const center = group.centerAccum.clone().divideScalar(group.vertexCount);

            const faceHandle = new THREE.Mesh(this.faceHandleGeometry, this.faceMaterial);
            faceHandle.position.copy(center);

            // Align to normal
            faceHandle.lookAt(center.clone().add(group.normal));

            faceHandle.userData = {
                isHandle: true,
                type: 'face',
                vertexIndices: uniqueIndices // Controls ALL unique vertices of the coplanar face
            };

            mesh.add(faceHandle);
            this.handles.push(faceHandle);
        }

        this.updateHandleVisibility();
    }

    addEdge(edgeMap, key1, key2, uniqueVertices) {
        if (key1 === key2) return;
        const [k1, k2] = key1 < key2 ? [key1, key2] : [key2, key1];
        const edgeKey = `${k1}|${k2}`;

        if (!edgeMap[edgeKey]) {
            const idxA = uniqueVertices[k1][0];
            const idxB = uniqueVertices[k2][0];
            const posAttr = this.targetMesh.geometry.attributes.position;
            const posA = new THREE.Vector3().fromBufferAttribute(posAttr, idxA);
            const posB = new THREE.Vector3().fromBufferAttribute(posAttr, idxB);

            edgeMap[edgeKey] = {
                indicesA: uniqueVertices[k1],
                indicesB: uniqueVertices[k2],
                posA: posA,
                posB: posB
            };
        }
    }

    shareIndex(arr1, arr2) {
        return arr1[0] === arr2[0];
    }
}
