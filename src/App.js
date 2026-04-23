import { Suspense, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  Environment,
  RenderTexture,
  Text,
  PerspectiveCamera
} from "@react-three/drei";
import { LayerMaterial, Displace } from "lamina";

const LINE_1 = "acier & inox";
const LINE_2 = "industries";
const SIZE = 14;

export default function App() {
  return (
    <>
      <Canvas>
        <PerspectiveCamera position={[0, 0, 50]} makeDefault />
        <Suspense>
          <Bubble />
          <Typography />
          <Environment preset="warehouse" />
        </Suspense>
      </Canvas>
    </>
  );
}

const Bubble = () => {
  const displaceRef = useRef(null);
  const { width } = useThree((state) => state.viewport);

  useFrame(({ _ }, dt) => {
    displaceRef.current.offset.x += 4 * dt;
  });

  return (
    <mesh>
      <sphereGeometry args={[width / 8, 128, 128]} />
      <LayerMaterial
        color={"orange"}
        lighting={"physical"}
        transmission={1}
        roughness={0}
        thickness={2}
      >
        <Displace ref={displaceRef} strength={3} scale={0.25} />
      </LayerMaterial>
    </mesh>
  );
};

const Typography = () => {
  const { width, height } = useThree((state) => state.viewport);
  const vw = (size) => (width * size) / 100;
  const vh = (size) => (height * size) / 100;

  return (
    <mesh>
      <planeGeometry args={[width, height, 1]} />
      <meshBasicMaterial>
        <RenderTexture attach="map">
          <color attach="background" args={["hsl(0,0%,03%)"]} />
          <Text
            font="/PPNeueMontreal-Light.otf"
            fontSize={vw(SIZE / 7)}
            position={[0, vh(10), 0]}
          >
            {LINE_1}
          </Text>
          <Text
            font="/PPNeueMontreal-Medium.otf"
            fontSize={vw(SIZE)}
            position={[0, 0, 0]}
          >
            {LINE_2}
          </Text>
        </RenderTexture>
      </meshBasicMaterial>
    </mesh>
  );
};
