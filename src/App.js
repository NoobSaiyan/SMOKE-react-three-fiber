import React, { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { Object3D } from "three";
import cloudImg from "./images/smoke.png";
import { OrbitControls, useTextureLoader } from "drei";
import "./App.css";

function Cloud() {
  const tempObject = useMemo(() => new Object3D(), []);
  const ref = useRef();
  const texture = useTextureLoader(cloudImg);

  const particles = useMemo(() => {
    const cloudParticles = [];
    for (let p = 0; p < 50; p++) {
      const positionX = Math.random() * 800 - 400;
      const positionZ = Math.random() * 500 - 500;
      const rotationZ = Math.random() * 2 * Math.PI;

      cloudParticles.push({
        positionX,
        positionZ,
        rotationZ,
      });
    }
    return cloudParticles;
  });

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { positionX, positionZ, rotationZ } = particle;
      tempObject.position.set(positionX, 0, positionZ);
      tempObject.rotation.set(0, 0, rotationZ);
      tempObject.updateMatrix();
      ref.current.setMatrixAt(i, tempObject.matrix);
    });
    particles.forEach((particle) => (particle.rotationZ -= 0.001));
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[null, null, 50]}>
      <planeBufferGeometry attach="geometry" args={[500, 500]} />
      <meshLambertMaterial
        attach="material"
        map={texture}
        depthWrite={false}
        transparent
        opacity={0.55}
      />
    </instancedMesh>
  );
}

//revolving dibba for test
function Dibba() {
  const mesh = useRef();
  useFrame(
    () =>
      (mesh.current.rotation.x = mesh.current.rotation.y = mesh.current.rotation.z += 0.01)
  );
  return (
    <mesh ref={mesh}>
      <boxBufferGeometry attach="geometry" args={[20, 20, 20]} />
      <meshLambertMaterial attach="material" />
    </mesh>
  );
}

function App() {
  return (
    <>
      <Canvas camera={{ fov: 60, position: [0, 0, 250], far: 6000 }}>
        <directionalLight
          color="#ff1100"
          intensity={2}
          position={[0, 0, 200]}
        />
        <directionalLight
          color="#ff1100"
          intensity={2}
          position={[0, 0, -200]}
          rotation={[1, 0, 0]}
        />
        <ambientLight color="#555555" intensity={0.5} />
        <pointLight
          color="#d40027"
          intensity={20}
          position={[-200, 0, -40]}
          distance={2000}
          decay={1.5}
        />
        <pointLight
          color="#d8547e"
          intensity={20}
          position={[100, 0, -40]}
          distance={2000}
          decay={1.5}
        />
        <pointLight
          color="#ff0048"
          intensity={20}
          position={[300, 0, -50]}
          distance={2000}
          decay={1.5}
        />
        <Dibba />
        <Suspense fallback={null}>
          <Cloud />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </>
  );
}

export default App;
