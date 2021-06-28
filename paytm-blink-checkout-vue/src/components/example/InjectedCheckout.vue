<template>
  <div><b>IS CHECKOUT JS INJECTED : </b>{{ Boolean(checkoutJsInstance) }}</div>
</template>

<script>
export default {
  name: "InjectedCheckout",
  props: {
    checkoutJsInstance: Object,
  },
};
</script>

