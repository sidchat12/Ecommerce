import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      init={particlesInit}
      options={{
        background: { color: "#111827" },
        particles: {
          color: { value: "#ff3e00" },
          links: { enable: true, color: "#ff3e00" },
          move: { enable: true, speed: 2 },
        },
      }}
      className="h-screen w-full"
    />
  );
};

export default ParticlesBackground;
