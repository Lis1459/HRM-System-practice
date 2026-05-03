import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AppDialog from "~/components/AppDialog.vue";

const mockDialog = {
  name: "Dialog",
  template: `
    <div v-show="visible" class="p-dialog" @click.self="$emit('hide')">
      <div class="p-dialog-header">{{ header }}</div>
      <div class="p-dialog-content"><slot></slot></div>
      <div class="p-dialog-footer"><slot name="footer"></slot></div>
    </div>
  `,
  props: [
    "visible",
    "modal",
    "closable",
    "closeOnEscape",
    "dismissableMask",
    "header",
    "style",
  ],
  emits: ["confirm", "cancel", "hide"],
};

const mockAppButton = {
  name: "AppButton",
  template: `<button :data-testid="$attrs['data-testid']" :class="{ 'button-loading': loading }" @click="$emit('click')">{{ label }}</button>`,
  props: ["label", "loading", "severity", "variant"],
  emits: ["click"],
};

describe("AppDialog.vue", () => {
  describe("rendering", () => {
    it("should render dialog component", () => {
      const wrapper = mount(AppDialog, {
        props: {
          visible: true,
          title: "Confirm Action",
        },
        global: {
          components: {
            Dialog: mockDialog,
            AppButton: mockAppButton,
          },
        },
      });

      expect(wrapper.findComponent(mockDialog).exists()).toBe(true);
    });

    it("should display dialog title", () => {
      const wrapper = mount(AppDialog, {
        props: {
          visible: true,
          title: "Delete User",
        },
        global: {
          components: {
            Dialog: mockDialog,
            AppButton: mockAppButton,
          },
        },
      });

      expect(wrapper.find(".p-dialog-header").text()).toContain("Delete User");
    });

    it("should render slot content", () => {
      const wrapper = mount(AppDialog, {
        props: {
          visible: true,
          title: "Confirm",
        },
        slots: {
          default: "Are you sure you want to delete this item?",
        },
        global: {
          components: {
            Dialog: mockDialog,
            AppButton: mockAppButton,
          },
        },
      });

      expect(wrapper.text()).toContain(
        "Are you sure you want to delete this item?",
      );
    });

    it("should render confirm button", () => {
      const wrapper = mount(AppDialog, {
        props: {
          visible: true,
          title: "Confirm",
          confirmLabel: "Delete",
        },
        global: {
          components: {
            Dialog: mockDialog,
            AppButton: mockAppButton,
          },
        },
      });

      const buttons = wrapper.findAllComponents(mockAppButton);
      expect(buttons.some((b) => b.props("label") === "Delete")).toBe(true);
    });

    it("should render cancel button", () => {
      const wrapper = mount(AppDialog, {
        props: {
          visible: true,
          title: "Confirm",
          cancelLabel: "Cancel",
        },
        global: {
          components: {
            Dialog: mockDialog,
            AppButton: mockAppButton,
          },
        },
      });

      const buttons = wrapper.findAllComponents(mockAppButton);
      expect(buttons.some((b) => b.props("label") === "Cancel")).toBe(true);
    });
  });

  describe("props", () => {
    it('should have default confirmLabel of "Confirm"', () => {
      const wrapper = mount(AppDialog, {
        props: {
          visible: true,
          title: "Test",
        },
        global: {
          components: {
            Dialog: mockDialog,
            AppButton: mockAppButton,
          },
        },
      });

      const buttons = wrapper.findAllComponents(mockAppButton);
      expect(buttons.some((b) => b.props("label") === "Confirm")).toBe(true);
    });

    it('should have default cancelLabel of "Cancel"', () => {
      const wrapper = mount(AppDialog, {
        props: {
          visible: true,
          title: "Test",
        },
        global: {
          components: {
            Dialog: mockDialog,
            AppButton: mockAppButton,
          },
        },
      });

      const buttons = wrapper.findAllComponents(mockAppButton);
      expect(buttons.some((b) => b.props("label") === "Cancel")).toBe(true);
    });

    it("should use custom confirmLabel", () => {
      const wrapper = mount(AppDialog, {
        props: {
          visible: true,
          title: "Confirm",
          confirmLabel: "Yes, proceed",
        },
        global: {
          components: {
            Dialog: mockDialog,
            AppButton: mockAppButton,
          },
        },
      });

      const buttons = wrapper.findAllComponents(mockAppButton);
      expect(buttons.some((b) => b.props("label") === "Yes, proceed")).toBe(
        true,
      );
    });

    it("should use custom cancelLabel", () => {
      const wrapper = mount(AppDialog, {
        props: {
          visible: true,
          title: "Confirm",
          cancelLabel: "No, cancel",
        },
        global: {
          components: {
            Dialog: mockDialog,
            AppButton: mockAppButton,
          },
        },
      });

      const buttons = wrapper.findAllComponents(mockAppButton);
      expect(buttons.some((b) => b.props("label") === "No, cancel")).toBe(true);
    });

    it("should pass loading state to confirm button", () => {
      const wrapper = mount(AppDialog, {
        props: {
          visible: true,
          title: "Confirm",
          confirmLabel: "Save",
          loading: true,
        },
        global: {
          components: {
            Dialog: mockDialog,
            AppButton: mockAppButton,
          },
        },
      });

      const buttons = wrapper.findAllComponents(mockAppButton);
      const confirmButton = buttons.find((b) => b.props("label") === "Save");

      expect(confirmButton?.props("loading")).toBe(true);
    });

    it("should default loading to false", () => {
      const wrapper = mount(AppDialog, {
        props: {
          visible: true,
          title: "Confirm",
        },
        global: {
          components: {
            Dialog: mockDialog,
            AppButton: mockAppButton,
          },
        },
      });

      const buttons = wrapper.findAllComponents(mockAppButton);

      const confirmButton = buttons.find(
        (btn) => btn.attributes("data-testid") === "confirm-button",
      );

      expect(confirmButton?.props("loading")).toBe(false);
    });

    it("should set title correctly", () => {
      const wrapper = mount(AppDialog, {
        props: {
          visible: true,
          title: "Important Action",
        },
        global: {
          components: {
            Dialog: mockDialog,
            AppButton: mockAppButton,
          },
        },
      });

      expect(wrapper.findComponent(mockDialog).props("header")).toBe(
        "Important Action",
      );
    });
  });

  describe("v-model binding (visible)", () => {
    it("should show dialog when visible is true", () => {
      const wrapper = mount(AppDialog, {
        props: {
          visible: true,
          title: "Test",
        },
        global: {
          components: {
            Dialog: mockDialog,
            AppButton: mockAppButton,
          },
        },
      });

      expect(wrapper.find(".p-dialog").isVisible()).toBe(true);
    });

    it("should hide dialog when visible is false", () => {
      const wrapper = mount(AppDialog, {
        props: {
          visible: false,
          title: "Test",
        },
        global: {
          components: {
            Dialog: mockDialog,
            AppButton: mockAppButton,
          },
        },
      });

      expect(wrapper.find(".p-dialog").isVisible()).toBe(false);
    });
  });

  describe("events", () => {
    it("should emit confirm event when confirm button clicked", async () => {
      const wrapper = mount(AppDialog, {
        props: {
          visible: true,
          title: "Confirm",
          confirmLabel: "Proceed",
        },
        global: {
          components: {
            Dialog: mockDialog,
            AppButton: mockAppButton,
          },
        },
      });

      const confirmButton = wrapper.find('[data-testid="confirm-button"]');

      await confirmButton.trigger("click");

      expect(wrapper.emitted("confirm")).toBeTruthy();
    });

    it("should emit cancel event when cancel button clicked", async () => {
      const wrapper = mount(AppDialog, {
        props: {
          visible: true,
          title: "Confirm",
        },
        global: {
          components: {
            Dialog: mockDialog,
            AppButton: mockAppButton,
          },
        },
      });

      const cancelButton = wrapper.find('[data-testid="cancel-button"]');

      await cancelButton.trigger("click");

      expect(wrapper.emitted("cancel")).toBeTruthy();
    });
  });

  describe("dialog configuration", () => {
    it("should be modal", () => {
      const wrapper = mount(AppDialog, {
        props: {
          visible: true,
          title: "Test",
        },
        global: {
          components: {
            Dialog: mockDialog,
            AppButton: mockAppButton,
          },
        },
      });

      expect(wrapper.findComponent(mockDialog).props("modal")).toBe(true);
    });

    it("should be closable", () => {
      const wrapper = mount(AppDialog, {
        props: {
          visible: true,
          title: "Test",
        },
        global: {
          components: {
            Dialog: mockDialog,
            AppButton: mockAppButton,
          },
        },
      });

      expect(wrapper.findComponent(mockDialog).props("closable")).toBe(true);
    });

    it("should be closable on escape", () => {
      const wrapper = mount(AppDialog, {
        props: {
          visible: true,
          title: "Test",
        },
        global: {
          components: {
            Dialog: mockDialog,
            AppButton: mockAppButton,
          },
        },
      });

      expect(wrapper.findComponent(mockDialog).props("closeOnEscape")).toBe(
        true,
      );
    });

    it("should have dismissable mask", () => {
      const wrapper = mount(AppDialog, {
        props: {
          visible: true,
          title: "Test",
        },
        global: {
          components: {
            Dialog: mockDialog,
            AppButton: mockAppButton,
          },
        },
      });

      expect(wrapper.findComponent(mockDialog).props("dismissableMask")).toBe(
        true,
      );
    });

    it("should have correct width style", () => {
      const wrapper = mount(AppDialog, {
        props: {
          visible: true,
          title: "Test",
        },
        global: {
          components: {
            Dialog: mockDialog,
            AppButton: mockAppButton,
          },
        },
      });

      const style = wrapper.findComponent(mockDialog).props("style");
      expect(style).toHaveProperty("width", "50rem");
    });
  });

  describe("accessibility", () => {
    it("should have proper footer with buttons", () => {
      const wrapper = mount(AppDialog, {
        props: {
          visible: true,
          title: "Confirm",
        },
        global: {
          components: {
            Dialog: mockDialog,
            AppButton: mockAppButton,
          },
        },
      });

      const footer = wrapper.find(".p-dialog-footer");
      expect(footer.exists()).toBe(true);
      expect(footer.findAllComponents(mockAppButton)).toHaveLength(2);
    });

    it("should have consistent button styling", () => {
      const wrapper = mount(AppDialog, {
        props: {
          visible: true,
          title: "Confirm",
        },
        global: {
          components: {
            Dialog: mockDialog,
            AppButton: mockAppButton,
          },
        },
      });

      const buttons = wrapper.findAllComponents(mockAppButton);
      buttons.forEach((button) => {
        expect(button.classes("dialog-button")).toBe(true);
      });
    });
  });
});
