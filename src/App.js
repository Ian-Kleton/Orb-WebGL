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

const BUBBLES = [
  { color: "#d1e0e5", posX: -0.12, posY: 0.08, radiusFactor: 1.05, speed: 1.0, phase: 0.0 },
  { color: "#98dfc7", posX: 0.14, posY: -0.08, radiusFactor: 1.0, speed: 0.88, phase: 2.1 },
  { color: "#5bbdaf", posX: 0.0, posY: 0.16, radiusFactor: 0.97, speed: 1.12, phase: 4.3 }
];

export default function App() {
  return (
    <>
      <Canvas>
        <PerspectiveCamera position={[0, 0, 50]} makeDefault />
        <Suspense>
          {BUBBLES.map((props, i) => (
            <Bubble key={i} {...props} />
          ))}
          <Typography />
          <Environment preset="warehouse" />
        </Suspense>
      </Canvas>
    </>
  );
}

const Bubble = ({ color, posX, posY, radiusFactor, speed, phase }) => {
  const displaceRef = useRef(null);
  const { width } = useThree((state) => state.viewport);
  const radius = (width / 8) * radiusFactor;
  const spacing = width / 6;

  useFrame(({ _ }, dt) => {
    displaceRef.current.offset.x += 4 * dt * speed;
  });

  return (
    <mesh position={[posX * spacing, posY * spacing, 0]}>
      <sphereGeometry args={[radius, 128, 128]} />
      <LayerMaterial
        color={color}
        lighting={"physical"}
        transmission={0}
        roughness={0.15}
        metalness={0.05}
        alpha={0.82}
      >
        <Displace ref={displaceRef} strength={3} scale={0.25} offset={[phase, 0, 0]} />
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
