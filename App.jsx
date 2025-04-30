import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations, OrbitControls, Html, PerspectiveCamera } from '@react-three/drei';

// ✅ Text-to-speech
function speak(message, callback) {
  try {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'en-US';
    utterance.onend = callback;
    speechSynthesis.speak(utterance);
    console.log("Speaking:", message);
  } catch (error) {
    console.error("Speech synthesis error:", error);
  }
}

function GameDoctor(props) {
  const groupRef = useRef();
  const { scene, animations } = useGLTF('/models/doctor_-_sketchfab_weekly_-_13_mar23.glb');
  const { actions } = useAnimations(animations, scene);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);

  useEffect(() => {
    scene.rotation.y = Math.PI / 10;
    if (actions) {
      const action = actions[Object.keys(actions)[0]];
      action.reset().fadeIn(1).play();
    }

    speak("Welcome to the AI Clinic, where health meets the future.", () => {
      console.log("Speech complete!");
    });

    setShowSpeechBubble(true);

    const timeout = setTimeout(() => {
      setShowSpeechBubble(false);
    }, 5000);

    return () => clearTimeout(timeout);
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
              animation: 'fadeIn 1s ease-in-out',
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
  const { scene, error } = useGLTF('/models/background.glb');
  const cityRef = useRef();

  useEffect(() => {
    console.log("Futuristic city loaded:", scene);
  }, [scene]);

  if (error) {
    console.error("City model load error:", error);
    return null;
  }

  return (
    <primitive
      ref={cityRef}
      object={scene}
      scale={50}
      position={[0, -15, -100]}
      {...props}
    />
  );
}

function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, -2, 15);
    camera.lookAt(0, -1, 0);
  }, [camera]);

  return null;
}

function App() {
  // ✅ Voice recognition handler
  const startVoice = () => {
    const recognition = new window.webkitSpeechRecognition() || new window.SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("User said:", transcript);

      try {
        const res = await fetch("http://localhost:5000/chatbase-voice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ message: transcript })
        });

        const data = await res.json();
        const reply = data?.messages?.[0]?.content || "Sorry, I couldn't understand.";
        speak(reply, () => console.log("Spoken response done."));
      } catch (err) {
        console.error("Voice fetch error:", err);
      }
    };

    recognition.onerror = (e) => console.error("Speech error:", e);
    recognition.start();
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }

          html, body, #root {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            overflow: hidden;
            background-color: #000;
            font-family: 'Segoe UI', sans-serif;
          }

          .metaverse-container {
            width: 100vw;
            height: 100vh;
            position: relative;
          }

          .chatbot-container {
            position: fixed;
            bottom: 20px; 
            left: 30px;
            width: 320px;
            height: 480px;
            z-index: 999;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            overflow: hidden;
            backdrop-filter: blur(10px);
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .chatbot-container iframe {
            width: 100%;
            height: 100%;
            border: none;
            animation: fadeIn 5s ease-in-out;
          }

          .chatbot-container iframe:focus {
            box-shadow: 0 0 15px #00FFFF;
          }

          .logo-glow {
            font-size: 32px;
            font-weight: bold;
            color: #00ffff;
            text-shadow: 0 0 8px #00ffff, 0 0 16px #00ffff, 0 0 24px #00ffff;
            padding: 12px;
            text-align: center;
            font-family: 'Orbitron', sans-serif;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 15px;
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            animation: fadeIn 2s ease-in-out;
          }

          .logo-glow:hover {
            cursor: pointer;
            transform: scale(1.1);
          }

          /* Credits styling */
          .credits-container {
            position: fixed;
            bottom: 10px;
            right: 10px;
            font-size: 12px;
            color: #00ffff;
            font-family: 'Segoe UI', sans-serif;
            text-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff;
            z-index: 9999;
            background: rgba(0, 0, 0, 0.5);
            padding: 8px;
            border-radius: 5px;
            animation: fadeIn 3s ease-in-out;
          }
        `}
      </style>

      <div className="metaverse-container">
        <Canvas style={{ width: '100%', height: '100%' }}>
          <PerspectiveCamera makeDefault position={[0, 1.8, 8]} />
          <CameraController />
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          <FuturisticCity />
          <GameDoctor />
        </Canvas>
      </div>

      {/* ✅ Floating Chatbot */}
      <div className="chatbot-container">
        <iframe
          src="https://www.chatbase.co/chatbot-iframe/5ccidlaseyFWV8BBsjZKy"
          allow="microphone;"
        ></iframe>
      </div>

      {/* ✅ Skin Assistant Logo at the top */}
      <div className="logo-glow">Skin Assistant</div>

      {/* ✅ Credits Section */}
      <div className="credits-container">
        <p>Credits: 3D Models by Sketchfab & Chatbase Integration</p>
      </div>
    </>
  );
}

export default App;
