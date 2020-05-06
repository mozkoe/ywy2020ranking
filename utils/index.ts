/* eslint-disable no-param-reassign */
import { DataSortFunction } from 'vuetify'
import { Row } from '~/types/rankingTypes'

export function getNestedValue(obj: any, path: Array<string | number>, fallback?: any): any {
  const last = path.length - 1

  if (last < 0) return obj === undefined ? fallback : obj

  for (let i = 0; i < last; i += 1) {
    if (obj == null) {
      return fallback
    }
    obj = obj[path[i]]
  }

  if (obj == null) return fallback

  return obj[path[last]] === undefined ? fallback : obj[path[last]]
}

export function getObjectValueByPath(obj: any, path: string, fallback?: any): any {
  // credit: http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key#comment55278413_6491621
  if (obj == null || !path || typeof path !== 'string') return fallback
  if (obj[path] !== undefined) return obj[path]
  path = path.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
  path = path.replace(/^\./, '') // strip a leading dot
  return getNestedValue(obj, path.split('.'), fallback)
}

export const getRank = (n: string) => {
  if (n === '-') {
    return -1
  }
  return Number(n)
}

export const getLevelMaxLength = (data: Array<Row>): number => {
  const maxLength = data.map((v) => v.level.length)
    .reduce((p, c) => Math.max(p, c))

  return maxLength
}

export const tableSort: DataSortFunction<Row> = (arr, sortBy, sortDesc, _locale, customSorter) => arr.sort((valueA, valueB) => {
  const compareResult = sortBy.reduce((prevSortResult, sortKey, headerIndex) => {
    if (prevSortResult !== 0) {
      return prevSortResult
    }

    const valueByKeyA = getObjectValueByPath(valueA, sortKey)
    const valueByKeyB = getObjectValueByPath(valueB, sortKey)

    const stillAliveResult = valueB.stillAlive - valueA.stillAlive

    if (stillAliveResult !== 0) {
      return stillAliveResult
    }

    const sortKeyDesc = sortDesc[headerIndex]
    if (customSorter?.[sortKey]) {
      return sortKeyDesc
        ? -customSorter[sortKey](valueByKeyA, valueByKeyB)
        : customSorter[sortKey](valueByKeyA, valueByKeyB)
    }

    if (valueByKeyA > valueByKeyB) {
      return sortKeyDesc ? -1 : 1
    }
    if (valueByKeyA < valueByKeyB) {
      return sortKeyDesc ? 1 : -1
    }
    return 0
  }, 0)

  return compareResult
})

export const compareRank = (a: Row['ranking'], b: Row['ranking']) => {
  const fa = a[a.length - 1]
  const fb = b[b.length - 1]
  if (!fa) {
    return 1
  }

  if (!fb) {
    return -1
  }

  if (fa.episode !== fb.episode) {
    return fb.episode - fa.episode
  }

  return fa.rank - fb.rank
}
