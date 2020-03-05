<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
   
}
</script>

<style>
body{
  margin:0;
  padding:0;
  font-size: 16px
}
.admin{
  padding: 2% 3%;
 
}
.admin_button{
  padding-bottom: 10px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding:0;
  background-color: #f5f7fa;
}
</style>
