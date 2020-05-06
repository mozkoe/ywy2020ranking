<template>
  <div
    class="profile flex mt-4 mb-6 ml-lg-5"
    v-if="props.selectedRow"
  >
    <div class="pic-wrapper relative">
      <img
        :src="imgPath"
        alt="avatar"
        class="pic placeholder-pic absolute w-full left-0 top-0"
      >
      <transition mode="out-in" name="avatar">
        <img
          v-for="url of props.imageList"
          :src="url"
          :key="url"
          class="pic avatar-pic absolute w-full left-0 top-0"
          alt="avatar"
        >
      </transition>
    </div>

    <div class="text-wrapper ml-4 flex flex-col">
      <div class="info-name text-lg flex items-center">
        {{ props.selectedRow.name }}

        <img
          v-if="props.selectedRow.ranking.length === props.episodes.length &&
            props.selectedRow.ranking[props.selectedRow.ranking.length - 1].rank <= electionNumber"
          src="~/assets/images/elected.png"
          class="elected-big"
        >
      </div>
      <div class="text-xs mt-1 text-gray-600 flex">
        <span class="font-bold">当前排名：</span>
        {{
          props.selectedRow.ranking.length === props.episodes.length ?
            props.selectedRow.ranking[props.selectedRow.ranking.length - 1].rank :
            '-'
        }}

        <span class="flex items-center ml-4">
          <span class="font-bold">排名变动：</span>

          <span class="flex items-center" v-if="props.selectedRow.rankDelta !== undefined">
            <img src="~assets/images/up-arrow.png" class="arrow" v-if="props.selectedRow.rankDelta > 0">
            <img src="~assets/images/neutral-arrow.png" class="arrow" v-if="props.selectedRow.rankDelta === 0">
            <img src="~assets/images/down-arrow.png" class="arrow" v-if="props.selectedRow.rankDelta < 0">
            <span class="flex ml-1">{{ getAbsRanking(props.selectedRow.rankDelta) }}</span>
          </span>

          <span class="flex items-center" v-if="props.selectedRow.rankDelta === undefined">
            -
          </span>
        </span>
      </div>
      <div class="info-letter mt-1 flex items-center">
        <div class="text-xs flex-none self-center text-gray-600 font-bold">历史评级：</div>

        <div class="flex flex-wrap">
          <div
            class="mr-1 mb-1"
            v-for="(item, index) in props.selectedRow.level"
            :key="index"
          >
            <LevelCircle
              :level="item.level"
            />
          </div>
        </div>
      </div>
      <div class="info-company small-caps mt-2">
        {{ props.selectedRow.company }}

        <!-- info -->
        <span class="ml-2" v-if="props.selectedRow.specialNote">{{ props.selectedRow.specialNote }}</span>
      </div>
    </div>
  </div>
</template>

<script src="./ProfileCard.ts" lang="ts"></script>
<style src="./ProfileCard.sass" lang="sass" scoped></style>
