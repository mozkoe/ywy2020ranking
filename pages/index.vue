<template>
  <div class="flex flex-col min-h-screen justify-between">
    <div class="banner" />

    <div class="main-wrapper flex">
      <div class="chart-graph">
        <!-- Line Graph -->
        <div class="plot">
          <LineChart
            v-if="state.episodes.length"
            :list="state.svgData"
            :selected-row="state.selectedRow"
            :max-rank="state.maxRank"
            :handle-line-enter="handleLineEnter"
            :handle-line-leave="handleLineLeave"
            :episodes="state.episodes"
          />
        </div>

        <!-- Profile -->
        <div
          class="profile flex mt-4 mb-6 ml-lg-5"
          v-if="state.selectedRow"
        >
          <div class="pic-wrapper relative">
            <img
              src="~/assets/images/ywy2.jpg"
              class="pic placeholder-pic absolute w-full left-0 top-0"
            >
            <transition mode="out-in" name="avatar">
              <img
                v-for="url of imageList"
                :src="url"
                :key="url"
                class="pic avatar-pic absolute w-full left-0 top-0"
              >
            </transition>
          </div>

          <div class="text-wrapper ml-4 flex flex-col">
            <div class="info-name text-lg flex items-center">
              {{ state.selectedRow.name }}

              <img
                v-if="state.selectedRow.ranking.length === state.episodes.length &&
                  state.selectedRow.ranking[state.selectedRow.ranking.length - 1].rank <= electionNumber"
                src="~/assets/images/elected.png"
                class="elected-big"
              >
            </div>
            <div class="text-xs mt-1 text-gray-600 flex">
              <span class="font-bold">当前排名：</span>
              {{
                state.selectedRow.ranking.length === state.episodes.length ?
                  state.selectedRow.ranking[state.selectedRow.ranking.length - 1].rank :
                  '-'
              }}

              <span class="flex items-center ml-4">
                <span class="font-bold">排名变动：</span>

                <span class="flex items-center">
                  <img src="~assets/images/up-arrow.png" class="arrow" v-if="state.selectedRow.rankDelta > 0">
                  <img src="~assets/images/neutral-arrow.png" class="arrow" v-if="state.selectedRow.rankDelta === 0">
                  <img src="~assets/images/down-arrow.png" class="arrow" v-if="state.selectedRow.rankDelta < 0">
                  <span class="flex ml-1">{{ state.selectedRow.rankDelta === '-' ? '-' : getAbsRanking(state.selectedRow.rankDelta) }}</span>
                </span>
              </span>
            </div>
            <div class="info-letter mt-1 flex items-center">
              <div class="text-xs flex-none self-center text-gray-600 font-bold">历史评级：</div>

              <div class="flex flex-wrap">
                <div
                  class="mr-1 mb-1"
                  v-for="(item, index) in state.selectedRow.level"
                  :key="index"
                >
                  <LevelCircle
                    :level="item.level"
                  />
                </div>
              </div>
            </div>
            <div class="info-company small-caps mt-2">
              {{ state.selectedRow.company }}

              <!-- info -->
              <span class="ml-2" v-if="state.selectedRow.specialNote">{{ state.selectedRow.specialNote }}</span>
              <span class="ml-2" v-if="state.selectedRow.ranking.length !== state.episodes.length && !state.selectedRow.specialNote">
                已淘汰
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- table -->
      <div class="chart-table mt-lg-0">
        <div class="flex justify-between items-center title-wrap">
          <span class="flex font-bold title self-end">当前排名</span>
          <span class="flex">
            <v-text-field
              v-model="state.search"
              label="Search"
              single-line
              hide-details
            >
              <template #append>
                <v-icon>{{ i.mdiMagnify }}</v-icon>
              </template>
            </v-text-field>
          </span>
        </div>

        <v-data-table
          :headers="state.showMore ? header : headerMobile"
          :items="state.data"
          fixed-header
          disable-pagination
          hide-default-footer
          :height="state.tableHeight"
          sort-by="ranking"
          :sort-desc="false"
          :search="state.search"
          :mobile-breakpoint="state.showMore ? 600 : 0"
        >
          <template #top>
            <div class="flex">
              <v-switch :ripple="false" v-model="state.showMore" label="More info" />
            </div>
          </template>
          <template #item="{ item, headers, index }">
            <tr
              class="table-row"
              :class="{
                'table-row-more': state.showMore,
                'isEliminated': item.isEliminated,
                'currentElected': electionNumber > index,
              }"
              @mouseenter="handleLineEnter(item)"
              @click="handleLineEnter(item)"
            >
              <!-- ranking -->
              <td>
                <div class="mobile-row-header" v-if="state.showMore">
                  {{ headers[0].text }}
                </div>
                <div class="mobile-row-content flex items-center">
                  {{ item.ranking.length === state.episodes.length ? item.ranking[item.ranking.length - 1].rank : '-' }}

                  <!-- <img v-if="electionNumber > index" src="~/assets/images/elected.png" class="elected"> -->
                  <img
                    v-if="item.ranking.length === state.episodes.length &&
                      item.ranking[item.ranking.length - 1].rank <= electionNumber"
                    src="~/assets/images/elected.png"
                    class="elected"
                  >
                </div>
              </td>

              <!-- name -->
              <td>
                <div class="mobile-row-header" v-if="state.showMore">
                  {{ headers[1].text }}
                </div>
                <div class="mobile-row-content">
                  {{ item.name }}
                </div>
              </td>

              <!-- company -->
              <td>
                <div class="mobile-row-header" v-if="state.showMore">
                  {{ headers[2].text }}
                </div>
                <div class="mobile-row-content">
                  {{ item.company }}
                </div>
              </td>

              <!-- level list -->
              <td
                v-for="i of state.levelMax"
                :key="i"
                :class="{ 'hidden': !state.showMore }"
              >
                <div class="mobile-row-header" v-if="state.showMore">
                  {{ headers[2 + i].text }}
                </div>
                <div class="mobile-row-content">
                  <LevelCircle :level="item.level[i - 1] ? item.level[i - 1].level : null" />
                </div>
              </td>

              <!-- ranking change -->
              <td>
                <div class="mobile-row-header" v-if="state.showMore">
                  {{ headers[6].text }}
                </div>
                <div class="mobile-row-content ranking-change">
                  <span class="flex items-center">
                    <img src="~assets/images/up-arrow.png" class="arrow" v-if="item.rankDelta > 0">
                    <img src="~assets/images/neutral-arrow.png" class="arrow" v-if="item.rankDelta === 0">
                    <img src="~assets/images/down-arrow.png" class="arrow" v-if="item.rankDelta < 0">
                    <span class="flex ml-1">{{ item.rankDelta === '-' ? '-' : getAbsRanking(item.rankDelta) }}</span>
                  </span>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </div>

    <div class="footer flex mt-10">
      <footer>
        iQiyi's Youth With You 2020 Rankings:
        <a href="https://mozkoe.com/ywy2020/">https://mozkoe.com/ywy2020/</a>
      </footer>
    </div>
  </div>
</template>

<script src="./index.ts" lang="ts"></script>
<style src="./index.sass" lang="sass"></style>
