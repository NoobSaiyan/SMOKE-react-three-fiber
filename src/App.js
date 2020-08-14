import React, { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "react-three-fiber";
import { TextureLoader, Object3D } from "three";
import textureUrl from "./images/smoke.png";
import { OrbitControls } from "drei";
import "./App.css";

function Cloud() {
  const tempObject = useMemo(() => new Object3D(), []);
  const ref = useRef();
  const texture = useLoader(TextureLoader, textureUrl);

  const particles = useMemo(() => {
    const cloudParticles = [];
    for (let p = 0; p < 50; p++) {
      const positionX = Math.random() * 800 - 400;
      const positionZ = Math.random() * 500 - 400;
      const rotationZ = Math.random() * 2 * Math.PI;

      cloudParticles.push({ positionX, positionZ, rotationZ });
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
        transparent={true}
        opacity={0.5}
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
      <meshPhongMaterial attach="material" />
    </mesh>
  );
}

function App() {
  return (
    <>
      <Canvas camera={{ fov: 60, position: [0, 0, 650] }}>
        <fog attach="fog" args={["#090b1f", 0, 25]} />
        <ambientLight color="#555555" intensity={0.2} />
        <directionalLight
          color="#ff1100"
          intensity={2}
          position={[0, 0, 200]}
        />

        <directionalLight
          color="#ff1100"
          intensity={20}
          position={[0, 0, -200]}
          rotation={[1, 0, 0]}
        />
        <pointLight color="#d40027" intensity={20} position={[-200, 0, -40]} />
        <pointLight color="#d8547e" intensity={20} position={[100, 0, -40]} />
        <pointLight color="#ff0048" intensity={20} position={[300, 0, -50]} />
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
