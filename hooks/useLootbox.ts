import { useState } from "react"
import { useChain } from "react-moralis"
import { Lootbox, NFT, Ticket } from "types"
import { useLoading } from "./useLoading"
import { CHAINID_TO_DETAIL, isChainSupport, TICKET_ADDRESS } from "contract"
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

  // const [tickets, setTickets] = useState<Ticket[]>([])
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
            tokenURI
          }
          tickets{
            id
            owner
            ticketId
            lootbox
            isWinner
            isClaimed
            isRefunded
            image
            name
            description
            wonNFT{
              name
              description
              image
              tokenURI
            }
          }
          }}
        `,
        variables: {
          lootboxId: lootboxId,
        },
      })
      if (result?.data?.data?.singleLootbox) {
        const singleLootbox: any = result.data.data.singleLootbox

        let nfts: NFT[] = []
        for (let nft of singleLootbox.nft) {
          if (nft.image) {
            nfts.push({
              tokenId: Number(nft.tokenId),
              collectionName: nft.collectionName,
              address: nft.address,
              imageURI: nft.image ? nft.image.replace("ipfs://", "https://ipfs.io/ipfs/") : null,
              name: nft.name || null,
              description: nft.description || null,
            })
          } else {
            const res = await axios.get(nft.tokenURI)
            nfts.push({
              tokenId: Number(nft.tokenId),
              collectionName: nft.collectionName,
              address: nft.address,
              imageURI: res.data.image
                ? res.data.image.replace("ipfs://", "https://ipfs.io/ipfs/")
                : null,
              name: res.data.name,
              description: nft.description || null,
            })
          }
        }

        let singleLootboxTickets: Ticket[] = []
        for (const tk of singleLootbox.tickets) {
          let wonNFT = {
            imageURI: null,
          }
          if (tk.isWinner) {
            if (tk.wonNFT.image) {
              wonNFT.imageURI = tk.wonNFT.image.replace("ipfs://", "https://ipfs.io/ipfs/")
            } else {
              if (tk.wonNFT.tokenURI) {
                const res = await axios.get(tk.wonNFT.tokenURI)
                wonNFT.imageURI = res.data.image.replace("ipfs://", "https://ipfs.io/ipfs/")
              }
            }
          }

          const ticket: Ticket = {
            description: tk.description,
            id: tk.id,
            imageURI: tk.image ? tk.image.replace("ipfs://", "https://ipfs.io/ipfs/") : null,
            isClaimed: tk.isClaimed,
            isRefunded: tk.isRefunded,
            isWinner: tk.isWinner,
            owner: tk.owner,
            ticketId: tk.ticketId,
            lootboxId: singleLootbox.id,
            collectionName: tk.name,
            name: tk.name,
            address: chain && isChainSupport(chain) ? TICKET_ADDRESS[chain.chainId] : "",
            tokenId: tk.ticketId,
            wonNFT,
          }
          singleLootboxTickets.push(ticket)
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
          tickets: singleLootboxTickets,
        }

        setLootbox(loot)
        // setTickets(singleLootboxTickets)
        onDone()
        return loot
      }
    }

    onDone()
    return lootbox
  }

  return { fetchLootbox, lootbox, isLoading }
}
