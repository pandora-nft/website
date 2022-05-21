import ProfileLayout from "layouts/profileLayout"
import { ReactElement } from "react"
import { useNFTsBalance } from "hooks"
import { NFTCard } from "components/NFTs/NFTCard"
const Nft = () => {
  const { NFTBalances } = useNFTsBalance()

  return (
    <>
      <div className="container mx-auto max-w-4/5 min-w-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6">
          {NFTBalances ? (
            NFTBalances.result.map((nft, index) => {
              const NFT = {
                name: nft?.metadata?.name,
                collectionName: nft?.name,
                description: nft?.metadata?.description,
                tokenId: nft?.token_id,
                address: nft?.token_address,
                imageURI: nft?.image,
              }
              return (
                <a
                  key={index}
                  href={`https://testnets.opensea.io/assets/rinkeby/${NFT.address}/${NFT.tokenId}`}
                >
                  <NFTCard NFT={NFT} />
                </a>
              )
            })
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  )
}

Nft.getLayout = function getLayout(page: ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>
}

export default Nft
