import { definePreset } from "@primeuix/themes";
import Lara from "@primeuix/themes/lara";

const MyPreset = definePreset(Lara, {
  semantic: {
    colorScheme: {
      light: {
        surface: {
          50: "white",
          100: "white",
          200: "#000000",
          300: "#000000",
          400: "#000000",
          500: "#2E2E2E",
          600: "#000000",
          700: "#2E2E2E",
          800: "#000000",
          900: "#000000",
          950: "#000000",
        },
        primary: {
          500: "#C63031",
        },
      },
      dark: {
        surface: {
          0: "#000000",
        },
        primary: {
          500: "{indigo.500}",
        },
      },
    },
  },

  components: {
    tabs: {
      tab: {
        borderWidth: "0",
        fontWeight: "500",
        padding: "16px 50px",
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
