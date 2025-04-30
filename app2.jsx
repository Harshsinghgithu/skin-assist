import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations, OrbitControls, Html, PerspectiveCamera } from '@react-three/drei';

// Text-to-speech function
function speak(message, callback) {
  try {
    speechSynthesis.cancel(); // Cancel any previous speech first

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'en-US'; // Ensures consistent behavior across browsers
    utterance.onend = callback; // Trigger callback when speech finishes

    speechSynthesis.speak(utterance);
    console.log("Speaking:", message);
  } catch (error) {
    console.error("Error with speech synthesis:", error);
  }
}

function GameDoctor(props) {
  const groupRef = useRef();
  const { scene, animations } = useGLTF('/models/doctor_-_sketchfab_weekly_-_13_mar23.glb');
  const { actions } = useAnimations(animations, scene);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);

  useEffect(() => {
    // Fix orientation — rotate the actual scene
    scene.rotation.y = Math.PI / 10; // Adjusted rotation to face the front

    // Play animation
    if (actions) {
      const action = actions[Object.keys(actions)[0]];
      action.reset().fadeIn(1).play();
    }

    speak("Welcome to the AI Clinic, where health meets the future.", () => {
      console.log("Speech complete!");
    });
    setShowSpeechBubble(true);
  }, [actions, scene]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 5) * 0.05 - 1;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]} {...props}>
      <primitive object={scene} scale={2.5} />
      {showSpeechBubble && (
        <Html position={[0, 3, 0]} center distanceFactor={10} transform>
          <div
            style={{
              backgroundColor: 'rgba(0, 123, 255, 0.8)',
              padding: '16px 40px',
              borderRadius: '25px',
              fontSize: '22px',
              fontWeight: '600',
              color: '#00FFFF',
              textAlign: 'center',
              lineHeight: '1.5',
              animation: 'fadeIn 1s ease-in-out, bubbleEntrance 1s ease-in-out, neonGlow 1.5s infinite alternate',
            }}
          >
            Welcome to the AI Clinic, where health meets the future.
          </div>
        </Html>
      )}
    </group>
  );
}

function FuturisticCity(props) {
  const { scene, error } = useGLTF('/models/skysphere_futurstic_city.glb');
  const cityRef = useRef();

  useEffect(() => {
    console.log("Loaded Futuristic City:", scene);
  }, [scene]);

  if (error) {
    console.error("Error loading city model:", error);
    return null;
  }

  return (
    <primitive
      ref={cityRef}
      object={scene}
      scale={50}
      position={[0, -15, -100]} // Position background lower and farther for entering effect
      {...props}
    />
  );
}

function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, -2, 15); // Adjust camera to provide a full view
    camera.lookAt(0, -1, 0); // Center on the doctor's face
  }, [camera]);

  return null;
}

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas style={{ width: '100%', height: '100%' }}>
        <PerspectiveCamera makeDefault position={[0, 1.8, 8]} />
        <CameraController />

        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

        <FuturisticCity />
        <GameDoctor />
      </Canvas>

      {/* Add iframe for chatbot here */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          width: '300px',
          height: '400px',
          zIndex: 10, // Ensures it is above the 3D canvas
        }}
      >
        <iframe
          id="chatbotFrame"
          src="https://www.chatbase.co/chatbot-iframe/5ccidlaseyFWV8BBsjZKy"
          allow="microphone;"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '15px',
          }}
        ></iframe>
      </div>
    </div>
  );
}

export default App;
