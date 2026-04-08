"use client";

/* eslint-disable react-hooks/immutability -- mutating typed arrays in animation frame is intentional */

import { useRef, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const COLS = 140;
const ROWS = 50;
const SPACING = 0.22;
const SPHERE_SIZE = 0.055;

function WavePoints() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const colorArray = useMemo(() => new Float32Array(COLS * ROWS * 3), []);

  const onPointerMove = useCallback((e: PointerEvent) => {
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [onPointerMove]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const mx = mouse.current.x;
    const my = mouse.current.y;

    let idx = 0;
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const x = (col - COLS / 2) * SPACING;
        const z = (row - ROWS / 2) * SPACING;

        const distFromMouse = Math.sqrt(
          (x / (COLS * SPACING * 0.5) - mx) ** 2 +
          (z / (ROWS * SPACING * 0.5) + my) ** 2,
        );
        const mouseWave = Math.max(0, 1 - distFromMouse * 0.7) * 0.6;

        const y =
          Math.sin(x * 1.2 + t * 0.8) * 0.15 +
          Math.sin(z * 1.5 + t * 0.6) * 0.12 +
          Math.cos((x + z) * 0.8 + t * 1.1) * 0.1 +
          mouseWave;

        dummy.position.set(x, y, z);
        const scale = 1 + mouseWave * 2.5;
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(idx, dummy.matrix);

        const height01 = THREE.MathUtils.clamp((y + 0.3) / 0.9, 0, 1);
        color.setStyle("#0ea5e9").lerp(new THREE.Color("#ffffff"), height01 * 0.7 + mouseWave * 0.3);
        colorArray[idx * 3] = color.r;
        colorArray[idx * 3 + 1] = color.g;
        colorArray[idx * 3 + 2] = color.b;

        idx++;
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    const geom = meshRef.current.geometry;
    geom.setAttribute("color", new THREE.InstancedBufferAttribute(colorArray, 3));
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COLS * ROWS]}>
      <sphereGeometry args={[SPHERE_SIZE, 8, 8]} />
      <meshStandardMaterial
        vertexColors
        roughness={0.4}
        metalness={0.1}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

function Rig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 5, 8);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

export function WaveField() {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: 55 }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#7dd3fc" />
        <Rig />
        <WavePoints />
      </Canvas>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "6rem",
          background: "linear-gradient(to top, #ffffff, transparent)",
        }}
      />
    </div>
  );
}
