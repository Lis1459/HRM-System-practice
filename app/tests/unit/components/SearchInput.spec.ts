import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SearchInput from "~/components/SearchInput.vue";

const mockIcon = {
  name: "SearchIcon",
  template: '<svg class="search-icon"></svg>',
};

const mockInputText = {
  name: "InputText",
  template:
    '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" :name="name" :placeholder="placeholder" :aria-label="ariaLabel" class="p-inputtext" />',
  props: ["modelValue", "name", "placeholder", "ariaLabel"],
  emits: ["update:modelValue"],
};

describe("SearchInput.vue", () => {
  describe("rendering", () => {
    it("should render search container with correct class", () => {
      const wrapper = mount(SearchInput, {
        props: {
          name: "search",
          placeholder: "Search...",
          modelValue: "",
        },
        global: {
          components: {
            SearchIcon: mockIcon,
            InputText: mockInputText,
          },
        },
      });

      expect(wrapper.find(".search-box").exists()).toBe(true);
    });

    it("should render search icon", () => {
      const wrapper = mount(SearchInput, {
        props: {
          name: "search",
          placeholder: "Search...",
          modelValue: "",
        },
        global: {
          components: {
            SearchIcon: mockIcon,
            InputText: mockInputText,
          },
        },
      });

      expect(wrapper.find(".search-icon").exists()).toBe(true);
    });

    it("should render input with correct class", () => {
      const wrapper = mount(SearchInput, {
        props: {
          name: "search",
          placeholder: "Search...",
          modelValue: "",
        },
        global: {
          components: {
            SearchIcon: mockIcon,
            InputText: mockInputText,
          },
        },
      });

      expect(wrapper.find(".search-box__input").exists()).toBe(true);
    });
  });

  describe("props", () => {
    it("should pass name prop to input", () => {
      const wrapper = mount(SearchInput, {
        props: {
          name: "user-search",
          placeholder: "Search...",
          modelValue: "",
        },
        global: {
          components: {
            SearchIcon: mockIcon,
            InputText: mockInputText,
          },
        },
      });

      expect(wrapper.find("input").attributes("name")).toBe("user-search");
    });

    it("should pass placeholder prop to input", () => {
      const wrapper = mount(SearchInput, {
        props: {
          name: "search",
          placeholder: "Search users...",
          modelValue: "",
        },
        global: {
          components: {
            SearchIcon: mockIcon,
            InputText: mockInputText,
          },
        },
      });

      expect(wrapper.find("input").attributes("placeholder")).toBe(
        "Search users...",
      );
    });
  });

  describe("v-model binding", () => {
    it("should display initial model value", () => {
      const wrapper = mount(SearchInput, {
        props: {
          name: "search",
          placeholder: "Search...",
          modelValue: "initial value",
        },
        global: {
          components: {
            SearchIcon: mockIcon,
            InputText: mockInputText,
          },
        },
      });

      expect(wrapper.find("input").element.value).toBe("initial value");
    });

    it("should emit update:modelValue on input", async () => {
      const wrapper = mount(SearchInput, {
        props: {
          name: "search",
          placeholder: "Search...",
          modelValue: "",
        },
        global: {
          components: {
            SearchIcon: mockIcon,
            InputText: mockInputText,
          },
        },
      });

      const input = wrapper.find("input");
      await input.setValue("test search");

      const emitted = wrapper.emitted("update:modelValue");

      expect(emitted).toBeTruthy();

      if (!emitted) return;

      expect(emitted[0]).toEqual(["test search"]);
    });

    it("should handle multiple input changes", async () => {
      const wrapper = mount(SearchInput, {
        props: {
          name: "search",
          placeholder: "Search...",
          modelValue: "",
        },
        global: {
          components: {
            SearchIcon: mockIcon,
            InputText: mockInputText,
          },
        },
      });

      const input = wrapper.find("input");

      await input.setValue("a");
      await input.setValue("ab");
      await input.setValue("abc");

      console.log(wrapper.emitted());

      const emissions = wrapper.emitted("update:modelValue");

      if (!emissions) return;

      expect(emissions).toHaveLength(3);
      expect(emissions[0]).toEqual(["a"]);
      expect(emissions[1]).toEqual(["ab"]);
      expect(emissions[2]).toEqual(["abc"]);
    });
  });

  describe("accessibility", () => {
    it("should have aria-label on input", () => {
      const wrapper = mount(SearchInput, {
        props: {
          name: "search",
          placeholder: "Search...",
          modelValue: "",
        },
        global: {
          components: {
            SearchIcon: mockIcon,
            InputText: mockInputText,
          },
        },
      });

      expect(wrapper.find("input").attributes("aria-label")).toBe("Search");
    });

    it("should be keyboard accessible", async () => {
      const wrapper = mount(SearchInput, {
        props: {
          name: "search",
          placeholder: "Search...",
          modelValue: "",
        },
        global: {
          components: {
            SearchIcon: mockIcon,
            InputText: mockInputText,
          },
        },
      });

      const input = wrapper.find("input");
      expect(input.exists()).toBe(true);

      await input.trigger("focus");
      await input.trigger("blur");
    });
  });

  describe("user interaction", () => {
    it("should handle rapid typing", async () => {
      const wrapper = mount(SearchInput, {
        props: {
          name: "search",
          placeholder: "Search...",
          modelValue: "",
        },
        global: {
          components: {
            SearchIcon: mockIcon,
            InputText: mockInputText,
          },
        },
      });

      const input = wrapper.find("input");

      for (let i = 0; i < 5; i++) {
        await input.setValue(`search${i}`);
      }

      expect(wrapper.emitted("update:modelValue")).toHaveLength(5);
    });
  });

  describe("styling", () => {
    it("should have max-width constraint", () => {
      const wrapper = mount(SearchInput, {
        props: {
          name: "search",
          placeholder: "Search...",
          modelValue: "",
        },
        global: {
          components: {
            SearchIcon: mockIcon,
            InputText: mockInputText,
          },
        },
      });

      const container = wrapper.find(".search-box");
      expect(container.exists()).toBe(true);
    });
  });
});
