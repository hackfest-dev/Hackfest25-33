"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Particles from "react-tsparticles";
import { loadTrianglesPreset } from "tsparticles-preset-triangles";
import { useEffect, useRef, useCallback } from "react";
import * as THREE from 'three';
import GLOBE from 'vanta/dist/vanta.globe.min';

export default function Home() {
  const router = useRouter();
  const vantaRef = useRef(null);
  const vantaEffect = useRef<any>(undefined);

  const particlesInit = useCallback(async (engine: any) => {
    await loadTrianglesPreset(engine);
  }, []);

  useEffect(() => {
    if (!vantaEffect.current) {
      vantaEffect.current = GLOBE({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0xc916d6,
        backgroundColor: 0xc0910
      });
    }
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden" style={{ backgroundColor: "#660066" }}>
      {/* Vanta.js Globe */}
      <div ref={vantaRef} className="absolute top-0 left-0 w-full h-full" />
      
      {/* Particles Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "transparent",
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
              color: "#B026FF",
              opacity: 0.4,
              width:4 ,
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
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1 }}
      />
      
      {/* Content Container */}
      <div className="flex flex-col items-start z-10 absolute top-1/4 left-10">
        {/* TERRAFLOW Heading */}
        <h1 className="font-bold" style={{ color: "white", fontSize: "120px", WebkitTextStroke: "3px white", textShadow: "2px 2px 4px #000000", fontFamily: "Castellar", marginBottom:"12px" }}>
          TERRAFLOW
        </h1>
        {/* Subheading */}
        <p className="text-lg" style={{ color: "white", fontSize: "45px", marginBottom:"10px" }}>
          Mapping Progress, effortlessly!
        </p>
        {/* Sign In Button */}
        <Button onClick={() => router.push("/login")} style={{fontSize: "25px", padding: "20px 40px", backgroundColor: "white", color: "#730073"}}>
          Sign In
        </Button>
      </div>
    </div>
  );
}