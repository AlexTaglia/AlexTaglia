import { type } from "os"

export interface AssetFile {
  file: File
  src?: string
}

export type ComputeRarity = {
  trait_type: string,
  value: string
  prevalence?: number,
  display_type?: string
}


export type FloorPriceData = {
  [key: string]: FloorPrice
}

export type FloorPrice = {
  id: string
  collectionUrl: string,
  floorPrice: number
  priceCurrency: string,
  retrievedAt: string
}

export type Mex = {
  sender: string;
  timestamp : number ;
  msg: string;

}

export type Friend = {
  pubkey: string;
  name: string
}

export type User = {
  name: string;
  friendList: Friend[]
}

export type ActiveChat = {
  name: string,
  pubkey: string,
}

export type LoginResp = {
  username: string, 
  addr: string, 
  showConnectButto: string
}
