import { provide, ref, defineComponent, h } from "vue-demi";
import CONSTANTS from "../constants";

function isTrue(value) {
  return typeof value === "boolean"
    ? value
    : typeof value === "string"
      ? value === "true"
      : false;
}

function propChangedHandler(newVal, oldVal) {
  oldVal !== newVal && this.preSetup();
}

/**
 * The component is responsible for setting up Checkout JS library.
 * It sets the Checkout JS instance and make it available to all its children
 * component via Provider.  It requires config property which is
 * mandatory is order to initialize Checkout JS library. Additionally openInPopup
 * prop can also be passed to show checkout in popup or not, by default its
 * value is true.
 * The  config should be of same format as the  Checkout JS library, which
 * could be checked from this
 * [link](https://developer.paytm.com/docs/js-checkout/configuration/options/?ref=jsCheckout).
 *
 * Example
 * <CheckoutProvider :config="config" env="PROD" :openInPopup="openInPopup">
 * </CheckoutProvider>
 */
export default defineComponent({
  name: "CheckoutProvider",
  data() {
    return {
      isScriptLoaded: false,
      isScriptLoading: false,
      localConfig: null,
    };
  },
  setup() {
    const localCheckoutJsInstance = ref(null);
    const elementId = ref(
      CONSTANTS.IDS.CHECKOUT_ELEMENT + new Date().getTime()
    );

    provide("checkoutJsInstance", localCheckoutJsInstance);
    provide("elementId", elementId);

    return {
      localCheckoutJsInstance,
      elementId,
    };
  },
  props: {
    config: Object,
    checkoutJsInstance: Object,
    openInPopup: Boolean,
    env: String,
  },
  watch: {
    config: propChangedHandler,
    checkoutJsInstance: propChangedHandler,
    openInPopup: propChangedHandler,
  },
  mounted() {
    this.preSetup();
  },
  methods: {
    preSetup() {
      const { config, checkoutJsInstance } = this;
      const merchantId = config && config.merchant && config.merchant.mid;

      if (!merchantId) {
        console.error(CONSTANTS.ERRORS.MERCHANT_ID_NOT_FOUND);
        return;
      }

      const prevMerchantId =
        this.localConfig &&
        this.localConfig.merchant &&
        this.localConfig.merchant.mid;
      this.localConfig = config;

      if (
        (checkoutJsInstance || this.isScriptLoaded) &&
        prevMerchantId === merchantId
      ) {
        this.initializeCheckout();
      } else if (
        !this.isScriptLoading ||
        (prevMerchantId && merchantId !== prevMerchantId)
      ) {
        this.loadCheckoutScript(merchantId);
      }
    },

    loadCheckoutScript(merchantId) {
      const env =
        CONSTANTS.ENV[(this.env || "").toUpperCase()] || CONSTANTS.ENV.PROD;
      const scriptElement = document.createElement("script");
      scriptElement.async = true;
      scriptElement.src =
        CONSTANTS.HOSTS[env] +
        CONSTANTS.LINKS.CHECKOUT_JS_URL.concat(merchantId);
      scriptElement.type = "application/javascript";
      scriptElement.onload = this.setupCheckoutJsOnScriptLoad;
      scriptElement.onerror = (error) => {
        console.error(CONSTANTS.ERRORS.FAILED_TO_LOAD_SCRIPT, error);
        this.isScriptLoading = false;
      };
      document.body.appendChild(scriptElement);
      this.isScriptLoading = true;
    },

    setupCheckoutJsOnScriptLoad() {
      const checkoutJsInstance = this.getCheckoutJsObj();
      this.isScriptLoading = true;
      this.isScriptLoaded = false;

      if (checkoutJsInstance && checkoutJsInstance.onLoad) {
        checkoutJsInstance.onLoad(() => {
          this.isScriptLoading = false;
          this.isScriptLoaded = true;
          this.initializeCheckout();
        });
      } else {
        console.error(CONSTANTS.ERRORS.INVALID_CHECKOUT_JS_INSTANCE);
      }
    },

    initializeCheckout() {
      const { openInPopup = true } = this;
      // Set checkoutJsInstance via shallow copy so that invoke method in
      // checkout component can be invoked via shallow comparison.
      const checkoutJsInstance = { ...this.getCheckoutJsObj() };

      if (
        checkoutJsInstance &&
        checkoutJsInstance.init &&
        checkoutJsInstance.invoke
      ) {
        checkoutJsInstance
          .init({
            ...this.config,
            root: isTrue(openInPopup) ? "" : `#${this.elementId}`,
          })
          .then(() => {
            this.localCheckoutJsInstance = checkoutJsInstance;
          })
          .catch((error) => {
            console.error(CONSTANTS.ERRORS.INIT, error);
          });
      } else {
        console.error(CONSTANTS.ERRORS.INVALID_CHECKOUT_JS_INSTANCE);
      }
    },

    getCheckoutJsObj() {
      if (this.checkoutJsInstance) {
        return this.checkoutJsInstance;
      }

      if (window && window.Paytm && window.Paytm.CheckoutJS) {
        return window.Paytm.CheckoutJS;
      }

      console.warn(CONSTANTS.ERRORS.CHECKOUT_NOT_AVAILABLE);
      return null;
    },
  },
  render() {
    return h(
      "span",
      {},
      typeof this.$slots.default === 'function' ? this.$slots.default() : this.$slots.default
    );
  }
});