import CONSTANTS from "../constants";
import { inject, defineComponent, h, isVue2 } from "vue-demi";

export default defineComponent({
  name: "Checkout",
  setup() {
    const elementId = inject("elementId");
    const checkoutJsInstance = inject("checkoutJsInstance");

    return {
      elementId,
      checkoutJsInstance,
    };
  },
  watch: {
    checkoutJsInstance: function (newVal, oldVal) {
      oldVal !== newVal && this.invoke(newVal);
    },
  },
  mounted() {
    this.checkoutJsInstance && this.invoke(this.checkoutJsInstance);
  },
  methods: {
    invoke(checkoutJsInstance) {
      if (checkoutJsInstance && checkoutJsInstance.invoke) {
        try {
          checkoutJsInstance.invoke();
        } catch (error) {
          console.error(CONSTANTS.ERRORS.INVOKE, error);
        }
      }
    },
  },
  render() {
    return h(
      "div",
      isVue2
        ? {
          attrs: {
            id: this.elementId,
          },
        }
        : {
          id: this.elementId,
        },
      []
    );
  },
});
