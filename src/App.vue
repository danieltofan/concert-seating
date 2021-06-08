<template>
  <div id="app">
    <section class="stage-wrapper">
      <img class="stage" alt="Stage" src="./assets/logo.png">
      <div class="centered">STAGE</div>
    </section>

    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  .stage-wrapper {
    position: relative;
    text-align: center;
    color: white;
    margin: 30px;

    .stage {
      width: 120px;
      height: 120px;
      position: relative;
    }

    .centered {
      position: absolute;
      font-weight: bold;
      letter-spacing: 1px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -25px);
    }
  }

  a {
    color: #2c3e50;
    padding: 5px 20px;
    text-decoration: none;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
</style>
