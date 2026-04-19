import { definePreset } from "@primeuix/themes";
import Lara from "@primeuix/themes/lara";

const MyPreset = definePreset(Lara, {
  semantic: {
    colorScheme: {
      light: {
        surface: {
          50: "white",
          100: "white",
          // 200: "#000000",
          // 300: "#000000",
          // 400: "#000000",
          500: "#2E2E2E",
          // 600: "#000000",
          700: "#2E2E2E",
          // 800: "#000000",
          // 900: "#000000",
          950: "#202020",
        },
        primary: {
          200: "#000000",
          500: "#C63031",
          600: "#8A2122",
          // 700: "#C63031",
        },
        text: {
          mutedColor: "#767676",
          hoverMutedColor: "#767676",
        },
      },
      dark: {
        surface: {
          0: "#000000",
        },
        primary: {
          500: "{indigo.500}",
        },
        text: {
          mutedColor: "{surface.400}",
          hoverMutedColor: "{surface.300}",
        },
      },
    },
    focusRing: {
      width: "0px",
      offset: "0px",
      boxShadow: "0",
      filter: "brightness(0.8)",
    },
  },

  components: {
    tabs: {
      tab: {
        borderWidth: "0",
        fontWeight: "500",
        padding: "16px 50px",
        focusRing: {
          width: "0",
          style: "none",
          color: "transparent",
          offset: "0",
          shadow: "none",
        },
      },
      tabpanel: {
        focusRing: {
          width: "0",
          style: "none",
          color: "transparent",
          offset: "0",
          shadow: "none",
        },
      },
      navButton: {
        focusRing: {
          width: "0",
          style: "none",
          color: "transparent",
          offset: "0",
          shadow: "none",
        },
      },
    },
    button: {
      root: {
        badgeSize: "16px",
        borderRadius: "40px",
        // paddingX: "16px",
        label: {
          fontWeight: "500",
        },
      },
    },
    floatlabel: {
      on: {
        borderRadius: "20px",
      },
    },
    password: {
      meter: {
        borderRadius: "0px",
      },
      overlay: {
        borderRadius: "0px",
      },
    },
  },
});

export default {
  preset: MyPreset,
  options: {
    darkModeSelector: ".p-dark",
  },
};
