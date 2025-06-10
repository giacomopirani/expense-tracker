import { ChakraProvider } from "@chakra-ui/react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import GlobalState from "./context/index.jsx";
import "./index.css";
import theme from "./theme.js";

createRoot(document.getElementById("root")).render(
  <GlobalState>
    <ChakraProvider value={theme}>
      <App />
    </ChakraProvider>
  </GlobalState>
);
