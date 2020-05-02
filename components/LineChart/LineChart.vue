<template>
  <svg width="100%" height="100%" ref="svg">
    <span v-if="state.updateId && false" />
    <g>
      <path
        v-for="i of props.episodes.length"
        :key="i - 1"
        class="axis-header"
        :d="`M${getXByEpsodes(i - 1)},${getYByPercentage(0) - 10}L${getXByEpsodes(i - 1)},${getYByPercentage(1)}`"
      />
      <text
        v-for="(ep, i) of props.episodes"
        :key="`ep-${ep}`"
        class="episode-label"
        text-anchor="middle"
        :x="getXByEpsodes(i)"
        :y="getYByPercentage(0) - 20"
        fill="#666"
      >
        EP {{ ep }}
      </text>
    </g>
    <g>
      <path
        v-for="line of props.list"
        :key="line.id"
        class="ranking"
        :class="{
          selected: line.selected,
        }"
        :d="pathGenerate(line)"
        :style="{
          stroke: getRowColor(line),
          'stroke-width': line.selected ? 4 : 1,
          opacity: line.selected ? 1 : 0.1,
        }"
        @mouseenter="props.handleLineEnter(line)"
        @click="props.handleLineEnter(line)"
      />
    </g>
    <g
      v-for="(circle, index) of circles"
      :key="index"
    >
      <circle
        class="notch-circle"
        :cx="circle.x"
        :cy="circle.y"
        :fill="circle.color"
        r="16"
      />
      <text
        class="notch-text"
        text-anchor="middle"
        :x="circle.x"
        :y="circle.y + 5"
        :fill="circle.textColor"
      >
        {{ circle.text }}
      </text>
    </g>
  </svg>
</template>

<script src="./LineChart.ts" lang="ts"></script>
<style src="./LineChart.sass" lang="sass" scoped></style>
