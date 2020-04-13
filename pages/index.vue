<template>
  <div class="flex flex-col min-h-screen">
    <div class="banner" />

    <div class="main-wrapper flex">
      <div class="chart-graph">
        <!-- Line Graph -->
        <div class="plot">
          <LineChart
            :list="state.svgData"
            :selected-row="state.selectedRow"
            :max-rank="state.maxRank"
            :handle-line-enter="handleLineEnter"
            :handle-line-leave="handleLineLeave"
            :columns="episodes.length"
          />
        </div>

        <!-- Profile -->
        <div class="profile flex mt-4" v-if="state.selectedRow">
          <div class="pic-wrapper">
            <img :src="`/avatars/${state.selectedRow.name}.png`" class="pic">
          </div>

          <div class="text-wrapper">
            <div class="info-name text-lg">
              {{ state.selectedRow.name }}
            </div>
            <div class="info-letter mt-1">
              <LevelCircle
                :level="state.selectedRow.level[state.selectedRow.level.length - 1]
                  ? state.selectedRow.level[state.selectedRow.level.length - 1].level
                  : null"
              />
            </div>
            <div class="info-company small-caps mt-2">
              {{ state.selectedRow.company }}
            </div>
            <div class="info-rank small-caps mt-1">
              {{ state.selectedRow.specialNote }}
            </div>
          </div>
        </div>
      </div>

      <!-- table -->
      <div class="chart-table">
        <h1 class="title">当前排名</h1>

        <v-data-table
          :headers="header"
          :items="state.data"
          disable-pagination
          hide-default-footer
          sort-by="ranking"
          :sort-desc="false"
          fixed-header
          height="500"
        >
          <template #body="{ items }">
            <tbody>
              <tr
                v-for="item in items"
                :key="item.name"
                @mouseenter="handleLineEnter(item)"
              >
                <td>{{ item.ranking.length === episodes.length ? item.ranking[item.ranking.length - 1].rank : '-' }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.company }}</td>
                <td
                  v-for="i of 3"
                  :key="i"
                >
                  <LevelCircle :level="item.level[i - 1] ? item.level[i - 1].level : null" />
                </td>
                <td>
                  <span class="flex justify-center items-center">
                    <img src="~assets/images/up-arrow.png" class="arrow" v-if="item.rankDelta < 0">
                    <img src="~assets/images/neutral-arrow.png" class="arrow" v-if="item.rankDelta === 0">
                    <img src="~assets/images/down-arrow.png" class="arrow" v-if="item.rankDelta > 0">

                    <span class="flex ml-2">{{ item.rankDelta === '-' ? '-' : Math.abs(item.rankDelta) }}</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </div>
    </div>

    <div class="footer flex">
      <p>
        iQiyi's Youth With You 2020 Rankings:
        <a href="https://mozkoe.com/ywy2/">https://mozkoe.com/ywy2/</a>
      </p>
    </div>
  </div>
</template>

<script src="./index.ts" lang="ts"></script>
<style src="./index.sass" lang="sass"></style>
