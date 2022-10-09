import Particles from "react-tsparticles";
import type { Container as ContainerTS, Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";
import { useCallback } from 'react';
import useMediaQuery from "../shared/hook/useMediaQuery";
import { useWeb3React } from "@web3-react/core";

export const ParticlesCustom = () => {

  const particlesInit = useCallback(async (engine: Engine) => {

    // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: ContainerTS | undefined) => {
    // await console.log(container);
  }, []);

  const isMobile = useMediaQuery(950)
  const {account} = useWeb3React()

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        background: {
          color: {
            value: "#383838",
          },
        },
        fpsLimit: 60,
        fullScreen: {
          zIndex: 0,
        },


        particles: {
          color: {
            value: account ? "#1FDAD5" : "#d3f5eb",

          },
          links: {
            enable: true,
            value: account ? "#1FDAD5" : "#d3f5eb",
            distance: isMobile ? 100 : 200
          },
          move: {
            enable: true,
            speed: 0.2,
          },
          
        }
      }}
    />

  );
}


