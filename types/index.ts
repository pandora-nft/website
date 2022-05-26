export interface Lootbox {
  id: number
  address: string
  name: string
  nfts: NFT[]
  tickets: Ticket[]
  isDrawn: boolean
  isRefundable: boolean
  drawTimestamp: number
  ticketPrice: number
  minimumTicketRequired: number
  maxTicketPerWallet: number
  ticketSold: number
  owner: string
}

export interface Ticket extends NFT {
  owner: string
  isClaimed: boolean
  isWinner: boolean
  isRefunded: boolean
  wonTicket?: number
  lootboxId: number
}
export interface NFT {
  id?: string
  name: string
  description?: string
  collectionName: string
  tokenId: number
  address: string
  imageURI: string
  isApproved?: boolean
  isApproving?: boolean
}

export interface formDataType {
  name: string
  ticketPrice: number
  minimumTicketRequired: number
  drawDays: number
  drawHours: number
  drawMinutes: number
  drawSeconds: number
}
export type Chain =
  | "eth"
  | "0x1"
  | "ropsten"
  | "0x3"
  | "rinkeby"
  | "0x4"
  | "goerli"
  | "0x5"
  | "kovan"
  | "0x2a"
  | "polygon"
  | "0x89"
  | "mumbai"
  | "0x13881"
  | "bsc"
  | "0x38"
  | "bsc testnet"
  | "0x61"
  | "avalanche"
  | "0xa86a"
  | "avalanche testnet"
  | "0xa869"
  | "fantom"
  | "0xfa"
  | undefined
