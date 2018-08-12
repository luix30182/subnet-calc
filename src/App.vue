<template>
  <div id="app">
    <main-app></main-app>
  </div>
</template>

<script>
import Main from './components/Main.vue'

export default {
  name: 'app',
  components: {
    'main-app': Main
  }
}
</script>

<style>
  body {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }

  #main {
    flex: 1 0 auto;
  }
</style>
