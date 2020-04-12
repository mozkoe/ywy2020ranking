<template>
  <div>
    <div class="banner" />

    <div class="mainWrapper flex">
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
          <div class="picWrapper">
            <img :src="`/avatars/${state.selectedRow.name}.png`" class="pic">
          </div>

          <div class="textWrapper ml-4">
            <span class="infoName text-lg">
              {{ state.selectedRow.name }}
            </span>
            <span class="infoLetter letter">
              <LevelCircle
                :level="state.selectedRow.level[state.selectedRow.level.length - 1]
                  ? state.selectedRow.level[state.selectedRow.level.length - 1].level
                  : null"
              />
            </span>
            <div class="infoCompany smallCaps mt-1">
              {{ state.selectedRow.company }}
            </div>
            <div class="infoRank">
              {{ state.selectedRow.specialNote }}
            </div>
          </div>
        </div>
      </div>

      <!-- Top 11 -->
      <div class="chart-table">
        <h1>当前排名</h1>

        <v-data-table
          :headers="header"
          :items="state.data"
          disable-pagination
          hide-default-footer
          sort-by="ranking"
          :sort-desc="false"
          fixed-header
          height="500"
          class="elevation-1"
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
                  <img src="~assets/images/up-arrow.png" class="arrow" v-if="item.rankDelta < 0">
                  <img src="~assets/images/neutral-arrow.png" class="arrow" v-if="item.rankDelta === 0">
                  <img src="~assets/images/down-arrow.png" class="arrow" v-if="item.rankDelta > 0">
                  {{ item.rankDelta === '-' ? '-' : Math.abs(item.rankDelta) }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </div>
    </div>

    <div class="footer">
      <p>
        Youth With You 2020 Rankings:
        <a href="https://mozkoe.com/ywy2/">https://mozkoe.com/ywy2/</a>
      </p>
    </div>
  </div>
</template>

<script src="./index.ts" lang="ts"></script>
<style src="./index.sass" lang="sass"></style>
