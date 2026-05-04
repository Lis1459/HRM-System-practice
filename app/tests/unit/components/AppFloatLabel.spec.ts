import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AppFloatLabel from "~/components/AppFloatLabel.vue";

const mockFloatLabel = {
  name: "FloatLabel",
  template: '<div class="p-floatlabel"><slot></slot></div>',
  props: ["variant"],
};

describe("AppFloatLabel.vue", () => {
  describe("rendering", () => {
    it("should render float label container", () => {
      const wrapper = mount(AppFloatLabel, {
        props: {
          label: "Email",
          inputId: "email-input",
        },
        global: {
          components: {
            FloatLabel: mockFloatLabel,
          },
        },
      });

      expect(wrapper.find(".app-float-label").exists()).toBe(true);
    });

    it("should render label with correct text", () => {
      const wrapper = mount(AppFloatLabel, {
        props: {
          label: "Email Address",
          inputId: "email-input",
        },
        global: {
          components: {
            FloatLabel: mockFloatLabel,
          },
        },
      });

      const label = wrapper.find("label");
      expect(label.text()).toBe("Email Address");
    });

    it("should connect label to input via for attribute", () => {
      const wrapper = mount(AppFloatLabel, {
        props: {
          label: "Password",
          inputId: "password-field",
        },
        global: {
          components: {
            FloatLabel: mockFloatLabel,
          },
        },
      });

      const label = wrapper.find("label");
      expect(label.attributes("for")).toBe("password-field");
    });

    it("should render slot content", () => {
      const wrapper = mount(AppFloatLabel, {
        props: {
          label: "Name",
          inputId: "name-input",
        },
        slots: {
          default: '<input id="name-input" class="p-inputtext" />',
        },
        global: {
          components: {
            FloatLabel: mockFloatLabel,
          },
        },
      });

      expect(wrapper.find("input").exists()).toBe(true);
    });
  });

  describe("props", () => {
    describe("label prop", () => {
      it("should display label text correctly", () => {
        const wrapper = mount(AppFloatLabel, {
          props: {
            label: "Username",
            inputId: "username",
          },
          global: {
            components: {
              FloatLabel: mockFloatLabel,
            },
          },
        });

        expect(wrapper.find("label").text()).toBe("Username");
      });
    });

    describe("inputId prop", () => {
      it("should provide inputId to slot scope", () => {
        const wrapper = mount(AppFloatLabel, {
          props: {
            label: "Email",
            inputId: "email-field-123",
          },
          slots: {
            default: '<input :id="inputId" />',
          },
          global: {
            components: {
              FloatLabel: mockFloatLabel,
            },
          },
        });

        expect(wrapper.vm.$slots.default).toBeDefined();
      });
    });

    describe("variant prop", () => {
      it('should have default variant of "on"', () => {
        const wrapper = mount(AppFloatLabel, {
          props: {
            label: "Email",
            inputId: "email-input",
          },
          global: {
            components: {
              FloatLabel: mockFloatLabel,
            },
          },
        });
        expect(wrapper.findComponent(mockFloatLabel).props("variant")).toBe(
          "on",
        );
      });

      it('should support "in" variant', () => {
        const wrapper = mount(AppFloatLabel, {
          props: {
            label: "Email",
            inputId: "email-input",
            variant: "in",
          },
          global: {
            components: {
              FloatLabel: mockFloatLabel,
            },
          },
        });

        expect(wrapper.findComponent(mockFloatLabel).props("variant")).toBe(
          "in",
        );
      });

      it('should support "on" variant', () => {
        const wrapper = mount(AppFloatLabel, {
          props: {
            label: "Email",
            inputId: "email-input",
            variant: "on",
          },
          global: {
            components: {
              FloatLabel: mockFloatLabel,
            },
          },
        });

        expect(wrapper.findComponent(mockFloatLabel).props("variant")).toBe(
          "on",
        );
      });

      it('should support "over" variant', () => {
        const wrapper = mount(AppFloatLabel, {
          props: {
            label: "Email",
            inputId: "email-input",
            variant: "over",
          },
          global: {
            components: {
              FloatLabel: mockFloatLabel,
            },
          },
        });

        expect(wrapper.findComponent(mockFloatLabel).props("variant")).toBe(
          "over",
        );
      });
    });
  });

  describe("combinations", () => {
    it("should work with different props combinations", () => {
      const wrapper = mount(AppFloatLabel, {
        props: {
          label: "Username",
          inputId: "username-field",
          variant: "in",
        },
        global: {
          components: {
            FloatLabel: mockFloatLabel,
          },
        },
      });

      expect(wrapper.find("label").text()).toBe("Username");
      expect(wrapper.find("label").attributes("for")).toBe("username-field");
      expect(wrapper.findComponent(mockFloatLabel).props("variant")).toBe("in");
    });
  });

  describe("accessibility", () => {
    it("should have proper label-input association", () => {
      const wrapper = mount(AppFloatLabel, {
        props: {
          label: "Email",
          inputId: "email-field",
        },
        slots: {
          default: '<input id="email-field" class="p-inputtext" />',
        },
        global: {
          components: {
            FloatLabel: mockFloatLabel,
          },
        },
      });

      const label = wrapper.find("label");
      const input = wrapper.find("input");

      expect(label.attributes("for")).toBe(input.attributes("id"));
    });
  });

  describe("styling", () => {
    it("should have correct CSS class structure", () => {
      const wrapper = mount(AppFloatLabel, {
        props: {
          label: "Test",
          inputId: "test-id",
        },
        global: {
          components: {
            FloatLabel: mockFloatLabel,
          },
        },
      });

      expect(wrapper.find(".app-float-label").exists()).toBe(true);
    });
  });

  describe("slot usage", () => {
    it("should support passing input elements through slot", () => {
      const wrapper = mount(AppFloatLabel, {
        props: {
          label: "Email",
          inputId: "email-input",
        },
        slots: {
          default:
            '<input id="email-input" type="email" class="p-inputtext" />',
        },
        global: {
          components: {
            FloatLabel: mockFloatLabel,
          },
        },
      });

      const input = wrapper.find("input");
      expect(input.exists()).toBe(true);
      expect(input.attributes("type")).toBe("email");
    });

    it("should support PrimeVue components in slot", () => {
      const wrapper = mount(AppFloatLabel, {
        props: {
          label: "Select Option",
          inputId: "select-input",
        },
        slots: {
          default: '<select id="select-input" class="p-select"></select>',
        },
        global: {
          components: {
            FloatLabel: mockFloatLabel,
          },
        },
      });

      expect(wrapper.find("select").exists()).toBe(true);
    });
  });
});
