<template>
  <div>
    <textarea cols="50" rows="25" ref="textAreaRef" />
    <div>
      <button type="button" @click="this.toggleCheckout">
        Toggle Checkout Screen
      </button>
      <button type="button" @click="this.renderUpdateConfig">
        Re-render updated config
      </button>
      <button type="button" @click="this.loadCheckoutScript">
        Use existing checkout instance
      </button>
      <input
        type="checkbox"
        @click="this.toggleOpenInPopup"
        :checked="openInPopup"
      />
      Open in popup
    </div>
    <br />

    <div><b>CHECKOUT VISIBILITY :</b> {{ showCheckout }}</div>
    <CheckoutProvider
      :config="config"
      :checkoutJsInstance="checkoutJsInstance"
      :openInPopup="openInPopup"
      env="STAGE"
    >
      <Checkout v-if="showCheckout" />
      <InjectedCheckout />
    </CheckoutProvider>
  </div>
</template>

<script>
import CheckoutProvider from "../CheckoutProvider";
import Checkout from "../Checkout";
import CONFIG from "../../mocks/merchant-config";
import InjectedCheckout from "./InjectedCheckout";
import injectCheckout from "../InjectCheckout";

const USE_EXISTING_CHECKOUT_INSTANCE = "Use existing checkout instance : ";

export default {
  name: "Example",
  data() {
    return {
      config: this.appendHandler(CONFIG),
      showCheckout: false,
      openInPopup: true,
      checkoutJsInstance: null,
    };
  },
  components: {
    CheckoutProvider: CheckoutProvider,
    Checkout: Checkout,
    InjectedCheckout: injectCheckout(InjectedCheckout),
  },
  computed: {
    configString: function () {
      try {
        return JSON.stringify(this.config, null, 4);
      } catch (ex) {
        return "";
      }
    },
  },
  mounted() {
    if (this.$refs.textAreaRef) {
      this.$refs.textAreaRef.value = this.configString;
    }
  },
  methods: {
    appendHandler(config) {
      const newConfig = { ...config };

      newConfig.handler = {
        notifyMerchant: this.notifyMerchantHandler,
      };

      return newConfig;
    },
    notifyMerchantHandler(eventType, data) {
      console.log("MERCHANT NOTIFY LOG", eventType, data);
    },

    renderUpdateConfig() {
      const config = this.getUpdatedConfig();

      if (config) {
        this.config = config;
      } else {
        alert("Invalid config. Please make sure it's a valid json");
      }
    },

    getUpdatedConfig() {
      const config = this.parse(this.$refs.textAreaRef.value);

      return config && this.appendHandler(config);
    },

    parse(value) {
      try {
        return JSON.parse(value);
      } catch (err) {
        console.error("Invalid config JSON");
        return null;
      }
    },

    toggleOpenInPopup() {
      this.openInPopup = !this.openInPopup;
    },

    toggleCheckout() {
      this.showCheckout = !this.showCheckout;
    },

    loadCheckoutScript() {
      const url =
        "https://securegw-stage.paytm.in/merchantpgpui/checkoutjs/merchants/";
      const scriptElement = document.createElement("script");
      scriptElement.async = true;
      scriptElement.src = url.concat(CONFIG.merchant.mid);
      scriptElement.type = "application/javascript";
      scriptElement.onload = () => {
        const checkoutJsInstance = this.getCheckoutJsObj();

        if (checkoutJsInstance && checkoutJsInstance.onLoad) {
          checkoutJsInstance.onLoad(() => {
            this.checkoutJsInstance = checkoutJsInstance;
            this.renderUpdateConfig();
          });
        } else {
          console.error(
            USE_EXISTING_CHECKOUT_INSTANCE + "onload not available!"
          );
        }
      };
      scriptElement.onerror = () => {
        console.error(USE_EXISTING_CHECKOUT_INSTANCE + "script load fail!");
      };
      document.body.appendChild(scriptElement);
    },

    getCheckoutJsObj() {
      if (window && window.Paytm && window.Paytm.CheckoutJS) {
        return window.Paytm.CheckoutJS;
      } else {
        console.error(
          USE_EXISTING_CHECKOUT_INSTANCE + "Checkout instance not found!"
        );
      }

      return null;
    },
  },
};
</script>
