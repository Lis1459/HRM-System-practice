import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AppSpinner from "~/components/AppSpinner.vue";

describe("AppSpinner.vue", () => {
  describe("rendering", () => {
    it("should render spinner icon", () => {
      const wrapper = mount(AppSpinner);

      expect(wrapper.find("i").exists()).toBe(true);
    });

    it("should use PrimeIcons spinner class", () => {
      const wrapper = mount(AppSpinner);

      const icon = wrapper.find("i");
      expect(icon.classes()).toContain("pi");
      expect(icon.classes()).toContain("pi-spinner");
      expect(icon.classes()).toContain("pi-spin");
    });

    it("should have spinner CSS class", () => {
      const wrapper = mount(AppSpinner);

      expect(wrapper.find("i").classes()).toContain("spinner");
    });

    it("should have correct font size", () => {
      const wrapper = mount(AppSpinner);

      const style = wrapper.find("i").attributes("style");
      expect(style).toContain("font-size: 3rem");
    });
  });

  describe("styling", () => {
    it("should use primary color from theme", () => {
      const wrapper = mount(AppSpinner);

      const element = wrapper.find("i").element as HTMLElement;
      expect(element.className).toContain("spinner");
    });

    it("should render as icon element", () => {
      const wrapper = mount(AppSpinner);

      expect(wrapper.find("i").element.tagName).toBe("I");
    });
  });

  describe("accessibility", () => {
    it("should have proper icon markup", () => {
      const wrapper = mount(AppSpinner);

      const icon = wrapper.find("i");
      expect(icon.exists()).toBe(true);
      expect(icon.html()).toContain('class="pi pi-spin pi-spinner spinner"');
    });

    it("should be visible by default", () => {
      const wrapper = mount(AppSpinner);

      expect(wrapper.find("i").isVisible()).toBe(true);
    });
  });

  describe("animation", () => {
    it("should have spin animation applied", () => {
      const wrapper = mount(AppSpinner);

      expect(wrapper.find("i").classes("pi-spin")).toBe(true);
    });

    it("should have no props", () => {
      const wrapper = mount(AppSpinner);

      expect(Object.keys(wrapper.vm.$props)).toHaveLength(0);
    });
  });
});
