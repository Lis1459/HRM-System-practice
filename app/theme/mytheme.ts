import { definePreset } from "@primeuix/themes";
import Lara from "@primeuix/themes/lara";

const MyPreset = definePreset(Lara, {
  semantic: {
    colorScheme: {
      light: {
        surface: {
          0: "#F5F5F7", // bg у табов
          50: "#F5F5F7", // bg у табов
          100: "#0000000a", // bg у secondary surface у button
          200: "#0000000a", // active у secondary button (можно переписать на что-то серое)
          300: "#A7A7A7", // рамка у инпута
          // 400: "#000000",
          500: "#2E2E2E", //
          // 600: "#000000",
          700: "#2E2E2E",
          // 800: "#000000",
          // 900: "#000000",
          950: "#202020",
        },
        primary: {
          200: "#000000",
          500: "#C63031", // цвет кнопки
          600: "#8A2122", // hover цвет кнопки
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
        label: {
          fontWeight: "500",
        },
      },
      outlined: {
        secondary: {
          hoverBackground: "var(--p-text-muted-color)",
        },
      },
    },
    inputtext: {
      root: {
        borderRadius: "0px",
      },
    },
    floatlabel: {
      on: {
        borderRadius: "20px",
      },
      root: {
        fontWeight: "400",
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
    message: {
      text: {
        fontSize: "12px",
        fontWeight: "400",
      },
    },
    select: {
      root: {
        disabledBackground: "var(--p-surface-100)",
        borderRadius: "0px",
        focusRing: {
          shadow: "none",
        },
      },
    },
    progressspinner: {
      root: {
        colorOne: "#000",
        // colorOne: "var(--p-rimary-500)",
        // colorOne: "var(--p-rimary-500)",
        // colorOne: "var(--p-rimary-500)",
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
