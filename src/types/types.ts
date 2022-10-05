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

