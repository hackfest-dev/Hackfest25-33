"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Particles from "react-tsparticles";
import { loadTrianglesPreset } from "tsparticles-preset-triangles";
import { useCallback } from "react";

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("testuser");
  const [password, setPassword] = useState("password123");

   const particlesInit = useCallback(async engine => {
    await loadTrianglesPreset(engine);
  }, []);

  const handleLogin = () => {
    // In a real application, you'd verify these credentials against a database.
    if (username === "testuser" && password === "password123") {
      router.push("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-secondary overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "#f5f5f5", // Light Gray
            },
          },
          particles: {
            number: {
              value: 80,
              density: {
                enable: true,
                area: 800,
              },
            },
            color: {
              value: "#B026FF",
            },
            shape: {
              type: "triangle",
            },
            opacity: {
              value: 0.8,
              random: true,
              anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false,
              },
            },
            size: {
              value: 4,
              random: true,
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: "#008080", // Teal
              opacity: 0.4,
              width: 4,
            },
            move: {
              enable: true,
              speed: 2,
              direction: "none",
              random: false,
              straight: false,
              out_mode: "out",
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200,
              },
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: {
                enable: true,
                mode: "repulse",
              },
              onclick: {
                enable: true,
                mode: "push",
              },
              resize: true,
            },
            modes: {
              repulse: {
                distance: 200,
                duration: 0.4,
              },
              push: {
                particles_nb: 4,
              },
            },
          },
          retina_detect: true,
        }}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      />
      <h1 className="text-2xl font-semibold mb-4 z-10 text-primary">Login</h1>
      <div className="flex flex-col space-y-2 w-80 z-10">
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin} className="bg-primary text-primary-foreground hover:bg-primary/80">
          Login
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
