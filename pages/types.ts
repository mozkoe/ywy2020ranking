interface RowState {
  selected: boolean
}

export interface Row extends RowState {
  name: string
  company: string
  id: number
  rankDelta: number | undefined
  level: Array<{
    name: string
    level: LevelEnum
  }>
  specialNote: string
  ranking: Array<{
    episode: number
    rank: number
  }>
  latestRank: number
  currentRank: number
  stillAlive: number
}

export enum LevelEnum {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  F = 'F',
}
