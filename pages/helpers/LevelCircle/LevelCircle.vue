<template>
  <div
    class="level-circle"
    :style="{
      backgroundColor: bgColor,
      color: textColor,
    }"
  >
    {{ props.level }}
  </div>
</template>

<script src="./LevelCircle.ts" lang="ts"></script>
<style src="./LevelCircle.sass" lang="sass" scoped></style>
