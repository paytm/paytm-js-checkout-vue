<template>
  <Example />
</template>

<script>
import Example from './components/example/Example.vue';

export default {
  name: 'App',
  components: {
    Example: Example
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
