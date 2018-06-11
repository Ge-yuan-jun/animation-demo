<template lang="pug">
  canvas#myCanvas(ref="my-canvas")
</template>

<script src="./index.ts" lang="ts"></script>

<style>
* {
  margin: 0;
  padding: 0;
}
body {
  overflow: hidden;
}
#myCanvas {
  border: 1px;
  background-color: lavenderblush;
}
.a {
  text-align: center;
  font-weight: bold;
  font-size: 17px;
  color: #787878;
  font-family: "Comic Sans MS", cursive;
}
.tou {
  font-size: 14px;
  text-align: center;
  color: #787878;
  font-family: "Comic Sans MS", cursive;
}
</style>
