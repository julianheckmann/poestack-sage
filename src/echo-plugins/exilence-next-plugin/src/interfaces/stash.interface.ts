import { IItem } from './item.interface'

export interface IStash {
  stashes: IStashTab[]
}

export interface IStashTabResponse {
  stash: IStashTab
}

export interface IStashTab {
  id: string
  index: number
  name: string
  type: string
  metadata: IMetaData
  items?: IItem[]
  parent?: string
  children?: IStashTab[]
}

export interface ICompactTab {
  id: string
  name: string
  index: number
  color: string
}

export interface IMetaData {
  colour?: string
  public?: boolean
  folder?: boolean
  items?: number
}

export interface IChildStashTab {
  id: string
  parent?: string
  name: string
  type: string
  metadata: IChildMapMetaData
}

export interface IChildMapMetaData {
  items: number
  map: IMapMetaData
}

export interface IMapMetaData {
  section: string
  name: string
  image: string
  tier?: number // All non special maps
  index?: number // Special maps
}
