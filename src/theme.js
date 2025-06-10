import { createSystem, defaultConfig } from "@chakra-ui/react";

const theme = createSystem(defaultConfig, {
  config: {
    initialColorMode: "light",
    useSystemColorMode: true,
  },
});

export default theme;
