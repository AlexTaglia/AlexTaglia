import Particles from "react-tsparticles";
import type { Container as ContainerTS, Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";
import { useCallback } from 'react';

export const ParticlesCustom = () => {

  const particlesInit = useCallback(async (engine: Engine) => {
    console.log(engine);

    // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: ContainerTS | undefined) => {
    await console.log(container);
  }, []);


  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        background: {
          color: {
            value: "var(--gray-light)",
          },
        },
        fpsLimit: 60,
        fullScreen: {
          zIndex: 0,
        },


        particles: {
          color: {
            value: "#007bff",

          },
          links: {
            enable: true,
            value: "#007bff545",
            distance: 100
          },
          move: {
            enable: true,
            speed: 0.5,
          }
        }
      }}
    />

  );
}


