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
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-100" />

      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="smoke-blob smoke-blob-1 bg-gradient-to-r from-green-100/40 to-white/60" />
          <div className="smoke-blob smoke-blob-2 bg-gradient-to-l from-green-200/30 to-transparent" />
          <div className="smoke-blob smoke-blob-3 bg-gradient-to-br from-white/50 to-green-50/40" />
        </div>

        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="smoke-blob smoke-blob-4 bg-gradient-to-tl from-green-100/50 to-white/30" />
          <div className="smoke-blob smoke-blob-5 bg-gradient-to-r from-white/40 to-green-200/20" />
          <div className="smoke-blob smoke-blob-6 bg-gradient-to-bl from-green-50/60 to-transparent" />
        </div>

        <div className="absolute top-0 left-0 w-full h-full opacity-15">
          <div className="smoke-blob smoke-blob-7 bg-gradient-to-tr from-green-200/30 to-white/20" />
          <div className="smoke-blob smoke-blob-8 bg-gradient-to-l from-green-100/40 to-green-50/30" />
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-green-50/20 via-transparent to-white/10" />

      <style jsx>{`
        .smoke-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }

        .smoke-blob-1 {
          width: 300px;
          height: 300px;
          top: -10%;
          left: -5%;
          animation: float1 20s infinite;
        }

        .smoke-blob-2 {
          width: 250px;
          height: 250px;
          top: 20%;
          right: -10%;
          animation: float2 25s infinite;
        }

        .smoke-blob-3 {
          width: 400px;
          height: 200px;
          bottom: -5%;
          left: 10%;
          animation: float3 30s infinite;
        }

        .smoke-blob-4 {
          width: 350px;
          height: 350px;
          top: 30%;
          left: 20%;
          animation: float4 22s infinite;
        }

        .smoke-blob-5 {
          width: 200px;
          height: 300px;
          bottom: 20%;
          right: 15%;
          animation: float5 28s infinite;
        }

        .smoke-blob-6 {
          width: 280px;
          height: 280px;
          top: 60%;
          left: -8%;
          animation: float6 24s infinite;
        }

        .smoke-blob-7 {
          width: 320px;
          height: 180px;
          top: 10%;
          right: 20%;
          animation: float7 26s infinite;
        }

        .smoke-blob-8 {
          width: 240px;
          height: 240px;
          bottom: 10%;
          left: 40%;
          animation: float8 32s infinite;
        }

        @keyframes float1 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          25% {
            transform: translate(20px, -30px) rotate(2deg) scale(1.1);
          }
          50% {
            transform: translate(-15px, -20px) rotate(-1deg) scale(0.9);
          }
          75% {
            transform: translate(25px, -10px) rotate(1deg) scale(1.05);
          }
        }

        @keyframes float2 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          33% {
            transform: translate(-25px, 20px) rotate(-2deg) scale(1.15);
          }
          66% {
            transform: translate(15px, -25px) rotate(1deg) scale(0.85);
          }
        }

        @keyframes float3 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          20% {
            transform: translate(30px, -15px) rotate(1deg) scale(1.1);
          }
          40% {
            transform: translate(-20px, -30px) rotate(-1deg) scale(0.9);
          }
          60% {
            transform: translate(25px, -5px) rotate(2deg) scale(1.05);
          }
          80% {
            transform: translate(-10px, -20px) rotate(-1deg) scale(0.95);
          }
        }

        @keyframes float4 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          50% {
            transform: translate(-30px, 25px) rotate(-2deg) scale(1.2);
          }
        }

        @keyframes float5 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          25% {
            transform: translate(20px, 30px) rotate(1deg) scale(0.8);
          }
          75% {
            transform: translate(-25px, -20px) rotate(-1deg) scale(1.1);
          }
        }

        @keyframes float6 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          40% {
            transform: translate(35px, -25px) rotate(2deg) scale(1.15);
          }
          80% {
            transform: translate(-15px, 20px) rotate(-1deg) scale(0.9);
          }
        }

        @keyframes float7 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          30% {
            transform: translate(-20px, -35px) rotate(-1deg) scale(1.05);
          }
          70% {
            transform: translate(25px, 15px) rotate(1deg) scale(0.95);
          }
        }

        @keyframes float8 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          25% {
            transform: translate(-30px, -20px) rotate(-2deg) scale(1.1);
          }
          50% {
            transform: translate(20px, -30px) rotate(1deg) scale(0.85);
          }
          75% {
            transform: translate(-15px, 25px) rotate(-1deg) scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
