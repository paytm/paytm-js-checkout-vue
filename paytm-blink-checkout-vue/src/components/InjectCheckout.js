import { inject, h, isVue2 } from "vue-demi";

/**
 * The higher order component injects Checkout JS instance to the wrapped component
 * and make it available in the wrapped component props as checkoutJsInstance .
 * The instance allows to directly interact with CheckoutJs library .
 * The  injected component should be always nested inside CheckoutProvider component.
 *
 * Example
 *
 * Component that makes use of checkoutJsInstance prop.
 * export  default {
 *   name: "Test",
 *   props: {
 *      checkoutJsInstance: Object
 *  }
 * };
 *
 * Wrap component in a higher order component which provides checkoutJsInstance prop.
 * const InjectedCheckout = injectCheckout(Test);
 *
 * Render the wrapped component
 * <CheckoutProvider :config="config">
 *   <InjectedComponent />
 * </CheckoutProvider>
 *
 */
export default function (WrappedComponent) {
    const originalProps = WrappedComponent.props || {};

    return {
        setup() {
            const checkoutJsInstance = inject("checkoutJsInstance");

            return {
                checkoutJsInstance,
            };
        },

        render() {
            return h(
                WrappedComponent,
                isVue2
                    ? {
                        props: {
                            ...this.$props,
                            checkoutJsInstance: this.checkoutJsInstance,
                        },
                    }
                    : {
                        ...this.$props,
                        checkoutJsInstance: this.checkoutJsInstance,
                    },
                typeof this.$slots.default === "function"
                    ? this.$slots.default()
                    : this.$slots.default
            );
        },
        props: [...Object.keys(originalProps).filter(prop => prop !== "checkoutJsInstance")],
    };
}
