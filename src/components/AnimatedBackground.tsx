"use client";

import { useEffect, useState } from "react";

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200" />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-200/50 via-transparent to-blue-100/30" />

      {/* Animated blobs container */}
      <div className="absolute inset-0">
        {/* Layer 1 - Largest blobs */}
        <div className="absolute top-0 left-0 w-full h-full opacity-40">
          <div className="smoke-blob smoke-blob-1 bg-gradient-to-r from-blue-300/30 to-blue-400/40" />
          <div className="smoke-blob smoke-blob-2 bg-gradient-to-l from-blue-400/25 to-transparent" />
          <div className="smoke-blob smoke-blob-3 bg-gradient-to-br from-blue-200/35 to-blue-300/30" />
        </div>

        {/* Layer 2 - Medium blobs */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="smoke-blob smoke-blob-4 bg-gradient-to-tl from-blue-300/40 to-blue-200/25" />
          <div className="smoke-blob smoke-blob-5 bg-gradient-to-r from-blue-400/30 to-blue-500/20" />
          <div className="smoke-blob smoke-blob-6 bg-gradient-to-bl from-blue-300/40 to-transparent" />
        </div>

        {/* Layer 3 - Smallest blobs */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="smoke-blob smoke-blob-7 bg-gradient-to-tr from-blue-200/35 to-blue-300/25" />
          <div className="smoke-blob smoke-blob-8 bg-gradient-to-l from-blue-300/30 to-blue-400/35" />
          <div className="smoke-blob smoke-blob-9 bg-gradient-to-br from-blue-400/25 to-blue-300/30" />
        </div>
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Top highlight */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200/20 via-transparent to-transparent" />

      <style jsx>{`
        .smoke-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }

        .smoke-blob-1 {
          width: 400px;
          height: 400px;
          top: -15%;
          left: -10%;
          animation: float1 25s infinite;
        }

        .smoke-blob-2 {
          width: 350px;
          height: 300px;
          top: 15%;
          right: -15%;
          animation: float2 30s infinite;
        }

        .smoke-blob-3 {
          width: 450px;
          height: 250px;
          bottom: -10%;
          left: 5%;
          animation: float3 35s infinite;
        }

        .smoke-blob-4 {
          width: 300px;
          height: 400px;
          top: 25%;
          left: 15%;
          animation: float4 28s infinite;
        }

        .smoke-blob-5 {
          width: 250px;
          height: 350px;
          bottom: 15%;
          right: 10%;
          animation: float5 32s infinite;
        }

        .smoke-blob-6 {
          width: 320px;
          height: 280px;
          top: 55%;
          left: -12%;
          animation: float6 26s infinite;
        }

        .smoke-blob-7 {
          width: 280px;
          height: 200px;
          top: 5%;
          right: 25%;
          animation: float7 24s infinite;
        }

        .smoke-blob-8 {
          width: 200px;
          height: 300px;
          bottom: 5%;
          left: 35%;
          animation: float8 29s infinite;
        }

        .smoke-blob-9 {
          width: 180px;
          height: 220px;
          top: 40%;
          right: 5%;
          animation: float9 27s infinite;
        }

        @keyframes float1 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          25% {
            transform: translate(30px, -40px) rotate(3deg) scale(1.15);
          }
          50% {
            transform: translate(-20px, -30px) rotate(-2deg) scale(0.9);
          }
          75% {
            transform: translate(35px, -15px) rotate(2deg) scale(1.05);
          }
        }

        @keyframes float2 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          33% {
            transform: translate(-35px, 30px) rotate(-3deg) scale(1.2);
          }
          66% {
            transform: translate(25px, -35px) rotate(2deg) scale(0.85);
          }
        }

        @keyframes float3 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          20% {
            transform: translate(40px, -20px) rotate(2deg) scale(1.1);
          }
          40% {
            transform: translate(-30px, -40px) rotate(-2deg) scale(0.95);
          }
          60% {
            transform: translate(35px, -10px) rotate(3deg) scale(1.08);
          }
          80% {
            transform: translate(-15px, -30px) rotate(-1deg) scale(0.92);
          }
        }

        @keyframes float4 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          50% {
            transform: translate(-40px, 35px) rotate(-3deg) scale(1.25);
          }
        }

        @keyframes float5 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          25% {
            transform: translate(30px, 40px) rotate(2deg) scale(0.8);
          }
          75% {
            transform: translate(-35px, -25px) rotate(-2deg) scale(1.15);
          }
        }

        @keyframes float6 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          40% {
            transform: translate(45px, -35px) rotate(3deg) scale(1.18);
          }
          80% {
            transform: translate(-20px, 30px) rotate(-2deg) scale(0.88);
          }
        }

        @keyframes float7 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          30% {
            transform: translate(-25px, -45px) rotate(-2deg) scale(1.08);
          }
          70% {
            transform: translate(35px, 20px) rotate(2deg) scale(0.92);
          }
        }

        @keyframes float8 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          25% {
            transform: translate(-40px, -25px) rotate(-3deg) scale(1.12);
          }
          50% {
            transform: translate(30px, -40px) rotate(2deg) scale(0.82);
          }
          75% {
            transform: translate(-20px, 35px) rotate(-1deg) scale(1.06);
          }
        }

        @keyframes float9 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          50% {
            transform: translate(25px, -30px) rotate(2deg) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
