# paytm-blink-checkout-vue

## Installation
```sh
$ npm install --save paytm-blink-checkout-vue
```

## Supported Vue versions
2.0.0+ || 3.0.0-rc.0+

For Vue 2:
Install @vue/composition-api as a dependency. 
## Usage
The paytm-blink-checkout-vue provides three components to incorporate Paytm Blink Checkout JS library in a project. 

The component can be imported as:
```javascript
import { CheckoutProvider, Checkout } from 'paytm-blink-checkout-vue'
```

The component are as follows : 

### CheckoutProvider
The component is responsible for setting up Paytm Blink Checkout JS in a project. It sets the Paytm Blink Checkout JS instance and make it available to all its children component via Provider.  It requires **config** property which is mandatory is order to initialize Paytm Blink Checkout JS library. Additionally following props(optional) can be passed: 
1. openInPopup: To show checkout in popup or not, by default it's value is true.
2. env: To load Paytm Blink Checkout JS from 'STAGE' or 'PROD' env, by default it's value is 'PROD'.
3. checkoutJsInstance: To use existing checkoutjs instance.

The  config should be of same format as the  Paytm Blink Checkout JS library, which could be checked from this [link](https://developer.paytm.com/docs/js-checkout/configuration/options/?ref=jsCheckout).

#### Example
```javascript
<CheckoutProvider :config="config" openInPopup="false" env='PROD'>
</CheckoutProvider>
```

###  Checkout
The component is responsible for invoking and displaying the payment page. It should be **always nested inside CheckoutProvider** component. 

#### Example
```javascript
<CheckoutProvider :config="config">
  <Checkout />
</CheckoutProvider>
```

 It could be  nested at any nth level of CheckoutProvider.
 
 #### Example
```javascript
<CheckoutProvider :config="config">
  <Child1>
    <Child2>
       <Checkout />
    </Child2>
  </Child1>
</CheckoutProvider>
```

### injectCheckout
This higher order component injects Paytm Blink Checkout JS instance to the wrapped component and make it available in the wrapped component props as **checkoutJsInstance** . The instance allows to directly interact with Paytm Blink Checkout JS library . The  injected component should be **always nested inside CheckoutProvider** component. 

#### Example

Component that makes use of checkoutJsInstance prop. 

```javascript
export  default {
    name: "Test",
    props: {
        checkoutJsInstance: Object
    }
};
```

Wrap component in a higher order component which provides  **checkoutJsInstance** prop.

```javascript
import injectCheckout from 'paytm-blink-checkout-vue'
const InjectedCheckout = injectCheckout(Test);
```
Render the wrapped component

```javascript
<CheckoutProvider :config="config">
 <InjectedComponent />
</CheckoutProvider>
```