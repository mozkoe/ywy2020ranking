<template>
  <div class="flex flex-col min-h-screen justify-between">
    <div>
      <div class="banner" />
      <div class="banner banner-pc2020" />
    </div>

    <div class="desc">
      <div class="font-bold">mozkoe 排名站</div>
      <div class="mt-2 font-rotate">easy peasy lemon squeezy</div>
    </div>

    <div class="main-wrapper flex">
      <div>
        <router-link to="/ywy2020/" class="link">爱奇艺 青春有你 2 - 排行榜</router-link>
      </div>

      <div class="mt-4">
        <span class="text-gray-500">腾讯视频 创造营 2020 - 排行榜（即将开放）</span>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script src="./index.ts" lang="ts"></script>
<style src="./index.sass" lang="sass" scoped></style>
