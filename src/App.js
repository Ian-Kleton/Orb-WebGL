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

// Inner Smile color palette
const BUBBLES = [
  { color: "#F4845F", posX: -0.55, posY: 0.3, radiusFactor: 1.0, speed: 1.0, phase: 0.0 },
  { color: "#F7B267", posX: 0.1, posY: -0.3, radiusFactor: 1.05, speed: 0.85, phase: 1.8 },
  { color: "#F25C54", posX: 0.65, posY: 0.2, radiusFactor: 0.95, speed: 1.15, phase: 3.5 },
  { color: "#A8D8B9", posX: -0.15, posY: 0.55, radiusFactor: 0.9, speed: 0.95, phase: 5.2 }
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
        transmission={1}
        roughness={0}
        thickness={2}
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
