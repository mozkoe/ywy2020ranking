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
        <ProfileCard
          v-if="state.episodes.length"
          :selected-row="state.selectedRow"
          :get-abs-ranking="getAbsRanking"
          :image-list="imageList"
          :episodes="state.episodes"
          :election-number="electionNumber"
          img-path="/images/ywy2020.jpg"
        />
      </div>

      <!-- table -->
      <div class="chart-table mt-lg-0">
        <div class="flex justify-between items-center title-wrap">
          <span class="flex font-bold title self-end">排行榜</span>
          <span class="flex">
            <v-text-field
              v-model="state.search"
              label="搜索"
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
          :custom-sort="tableSort"
        >
          <template #top>
            <div class="flex">
              <v-switch :ripple="false" v-model="state.showMore" label="更多信息" />
            </div>
          </template>
          <template #item="{ item, headers, index }">
            <tr
              class="table-row"
              :class="{
                'table-row-more': state.showMore,
                'isEliminated': !item.stillAlive,
                'currentElected': electionNumber > index,
              }"
              @click="handleLineEnter(item)"
            >
              <!-- ranking -->
              <td>
                <div class="mobile-row-header" v-if="state.showMore">
                  {{ headers[0].text }}
                </div>
                <div class="mobile-row-content flex items-center">
                  {{ item.ranking.length === state.episodes.length ? item.ranking[item.ranking.length - 1].rank : '-' }}

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
                    <span class="flex ml-1">{{ item.rankDelta === undefined ? '-' : getAbsRanking(item.rankDelta) }}</span>
                  </span>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script src="./index.ts" lang="ts"></script>
<style src="./index.sass" lang="sass" scoped></style>
