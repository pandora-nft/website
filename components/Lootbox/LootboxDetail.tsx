import { convertToCountdown } from "utils"
import { ethers } from "ethers"

interface LootboxDetailProps {
  numItems: number
  ticketPrice: number
  ticketSold: number
  drawTimestamp: number
}

export const LootboxDetail: React.FC<LootboxDetailProps> = ({
  numItems,
  ticketPrice,
  ticketSold,
  drawTimestamp,
}) => {
  const createLabel = (topic: string, value: any) => {
    return (
      <div>
        <h3 className="text-mainPink font-medium">{value}</h3>
        <h3 className="font-bold">{topic}</h3>
      </div>
    )
  }
  const { time, metric } = convertToCountdown(drawTimestamp)

  return (
    <div className="grid grid-cols-4 gap-5 mb-5">
      {createLabel("items", numItems)}
      {createLabel("ticket price", ethers.utils.formatEther(ticketPrice.toString()))}
      {createLabel("ticket sold", ticketSold)}
      {createLabel("draw in", `${time} ${metric}`)}
    </div>
  )
}
