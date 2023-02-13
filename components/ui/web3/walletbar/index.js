import { useWalletInfo } from "@components/hooks/web3"
import { useWeb3 } from "@components/provider"
import { Button } from "@components/ui/common"

export default function WalletBar(){
  const { account, network} = useWalletInfo()
  const { requireInstall } = useWeb3()
    return(
      <section className="text-white bg-indigo-600 rounded-lg">
      <ustify-center lg:justify-start">
            <Button
              className="mr-2 text-sm xs:text-lg p-2"
              variant="white">
              Learn how to purchase
            </Button>
          </div>
          <div>
            { network.hasInitialResponse && !network.isSupported &&
              <div className="bg-red-400 p-4 rounded-lg">
                <div>Connected to wrong network</div>
                <div>
                  Connect to: {` `}
                  <strong className="text-2xl">
                    {network.target}
                  </strong>
                </div>
              </div>
            }
            { requireInstall &&
              <div className="bg-yellow-500 p-4 rounded-lg">
                Cannot connect to network. Please install Metamask.
              </div>
            }
            { network.data &&
              <div>
                <span>Currently on </span>
                <strong className="text-2xl">{network.data}</strong>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
    )
}
