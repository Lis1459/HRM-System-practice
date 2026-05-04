import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import AppButton from "~/components/AppButton.vue";
import { createPinia, setActivePinia } from "pinia";

// Mock PrimeVue Button
const mockButton = {
  name: "Button",
  template:
    '<button :type="type" :variant="variant" class="p-button" vRipple><slot /></button>',
  props: ["type", "variant", "vRipple"],
};

describe("AppButton.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("rendering", () => {
    it("should render button with slot content", () => {
      const wrapper = mount(AppButton, {
        slots: {
          default: "Click me",
        },
      });

      expect(wrapper.html()).toContain("Click me");
    });

    it("should apply app-button class", () => {
      const wrapper = mount(AppButton, {
        global: {
          components: { Button: mockButton },
        },
      });

      expect(wrapper.find("button").classes()).toContain("app-button");
    });

    it("should render with correct HTML structure", () => {
      const wrapper = mount(AppButton, {
        slots: {
          default: "Submit",
        },
        global: {
          components: { Button: mockButton },
        },
      });

      const button = wrapper.find("button");
      expect(button.exists()).toBe(true);
    });
  });

  describe("props", () => {
    describe("buttonType prop", () => {
      it('should use default buttonType of "button"', () => {
        const wrapper = mount(AppButton, {
          global: {
            components: { Button: mockButton },
          },
        });

        expect(wrapper.find("button").attributes("type")).toBe("button");
      });

      it('should set type to "submit"', () => {
        const wrapper = mount(AppButton, {
          props: {
            buttonType: "submit",
          },
          global: {
            components: { Button: mockButton },
          },
        });

        expect(wrapper.find("button").attributes("type")).toBe("submit");
      });

      it('should set type to "reset"', () => {
        const wrapper = mount(AppButton, {
          props: {
            buttonType: "reset",
          },
          global: {
            components: { Button: mockButton },
          },
        });

        expect(wrapper.find("button").attributes("type")).toBe("reset");
      });
    });

    describe("variant prop", () => {
      it('should use default variant of "undefined"', () => {
        const wrapper = mount(AppButton, {
          global: {
            components: { Button: mockButton },
          },
        });

        const button = wrapper.find("button");
        expect(button.classes("app-button--undefined")).toBe(true);
      });

      it('should apply "text" variant class', () => {
        const wrapper = mount(AppButton, {
          props: {
            variant: "text",
          },
          global: {
            components: { Button: mockButton },
          },
        });

        expect(wrapper.find("button").classes("app-button--text")).toBe(true);
      });

      it('should apply "outlined" variant class', () => {
        const wrapper = mount(AppButton, {
          props: {
            variant: "outlined",
          },
          global: {
            components: { Button: mockButton },
          },
        });

        expect(wrapper.find("button").classes("app-button--outlined")).toBe(
          true,
        );
      });

      it('should map "text" variant to PrimeVue text variant', () => {
        const wrapper = mount(AppButton, {
          props: {
            variant: "text",
          },
          global: {
            components: { Button: mockButton },
          },
        });

        expect(wrapper.find("button").attributes("variant")).toBe("text");
      });

      it('should map "outlined" variant to PrimeVue outlined variant', () => {
        const wrapper = mount(AppButton, {
          props: {
            variant: "outlined",
          },
          global: {
            components: { Button: mockButton },
          },
        });

        expect(wrapper.find("button").attributes("variant")).toBe("outlined");
      });

      it('should map "undefined" variant to undefined', () => {
        const wrapper = mount(AppButton, {
          props: {
            variant: "undefined",
          },
          global: {
            components: { Button: mockButton },
          },
        });

        const variant = wrapper.find("button").attributes("variant");
        expect(variant === undefined || variant === "").toBe(true);
      });
    });
  });

  describe("combinations", () => {
    it("should work with submit button and text variant", () => {
      const wrapper = mount(AppButton, {
        props: {
          buttonType: "submit",
          variant: "text",
        },
        slots: {
          default: "Submit",
        },
        global: {
          components: { Button: mockButton },
        },
      });

      const button = wrapper.find("button");
      expect(button.attributes("type")).toBe("submit");
      expect(button.attributes("variant")).toBe("text");
      expect(button.classes("app-button--text")).toBe(true);
    });

    it("should work with reset button and outlined variant", () => {
      const wrapper = mount(AppButton, {
        props: {
          buttonType: "reset",
          variant: "outlined",
        },
        slots: {
          default: "Reset",
        },
        global: {
          components: { Button: mockButton },
        },
      });

      const button = wrapper.find("button");
      expect(button.attributes("type")).toBe("reset");
      expect(button.attributes("variant")).toBe("outlined");
    });
  });

  describe("slot content", () => {
    it("should render complex slot content", () => {
      const wrapper = mount(AppButton, {
        slots: {
          default: '<span class="icon">✓</span> Save',
        },
        global: {
          components: { Button: mockButton },
        },
      });

      expect(wrapper.html()).toContain("Save");
    });

    it("should render empty slot gracefully", () => {
      const wrapper = mount(AppButton, {
        global: {
          components: { Button: mockButton },
        },
      });

      expect(wrapper.find("button").exists()).toBe(true);
    });
  });
});
