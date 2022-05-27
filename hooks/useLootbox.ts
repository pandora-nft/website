import { useState } from "react"
import { useChain } from "react-moralis"
import { Lootbox, NFT, Ticket } from "types"
import { useLoading } from "./useLoading"
import { CHAINID_TO_DETAIL } from "contract"
import axios from "axios"

export const useLootbox = () => {
  const { chain } = useChain()
  const { isLoading, onLoad, onDone } = useLoading()
  const [lootbox, setLootbox] = useState<Lootbox>({
    id: 0,
    address: "",
    name: "",
    nfts: [],
    tickets: [],
    isDrawn: false,
    isRefundable: false,
    drawTimestamp: 0,
    ticketPrice: 0,
    minimumTicketRequired: 0,
    maxTicketPerWallet: 0,
    ticketSold: 0,
    owner: "",
  })

  const [tickets, setTickets] = useState<Ticket[]>([])
  const fetchLootbox = async (_lootboxAddress: string, lootboxId?: number) => {
    onLoad()
    if (!isNaN(lootboxId)) {
      const result = await axios.post(CHAINID_TO_DETAIL[chain.chainId].api, {
        query: `
        query singleLootbox($lootboxId: Int!) {
          singleLootbox (id: $lootboxId)
          {
          id
          address
          drawTimestamp
          ticketPrice
          minimumTicketRequired
          maxTicketPerWallet
          owner
          ticketSold
          numNFT
          isDrawn
          isRefundable
          name
          boxId
          nft{
            id
            collectionName
            collectionSymbol
            address
            name
            image
            description
            tokenId
          }
          tickets{
            owner
            isClaimed
            isWinner
            isRefunded
            ticketId
          }
          }}
        `,
        variables: {
          lootboxId: lootboxId,
        },
      })
      if (result?.data?.data?.singleLootbox) {
        const singleLootbox: any = result.data.data.singleLootbox
        console.log("lootbox before push to set", singleLootbox)

        let nfts: NFT[] = []
        for (let nft of singleLootbox.nft) {
          nfts.push({
            tokenId: Number(nft.tokenId),
            collectionName: nft.collectionName,
            address: nft.address,
            imageURI: nft.image ? nft.image.replace("ipfs://", "https://ipfs.io/ipfs/") : null,
            name: nft.name || null,
            description: nft.description || null,
          })
        }

        const loot: Lootbox = {
          id: singleLootbox.id,
          name: singleLootbox.name,
          address: singleLootbox.address,
          nfts,
          isDrawn: singleLootbox.isDrawn,
          isRefundable: singleLootbox.isRefundable,
          drawTimestamp: singleLootbox.drawTimestamp,
          ticketPrice: singleLootbox.ticketPrice,
          minimumTicketRequired: singleLootbox.minimumTicketRequired,
          maxTicketPerWallet: singleLootbox.maxTicketPerWallet,
          ticketSold: singleLootbox.ticketSold,
          owner: singleLootbox.owner,
          tickets: singleLootbox.tickets,
        }

        // console.log(loot)
        setLootbox(loot)
        setTickets(tickets)
        onDone()
        return loot
      }
    }

    onDone()
    return lootbox
  }

  return { fetchLootbox, lootbox, isLoading, tickets }
}
