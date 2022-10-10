const { createContext, useContext, useEffect, useState, useMemo } = require("react");
import detectEthereumProvider from "@metamask/detect-provider"
import { loadContract } from "@utils/loadContract";
import Web3 from "web3"
import { setupHooks } from "./hooks/setupHooks";

const Web3Context = createContext(null)

const setListener = (provider) =>{
    provider.on("chainChanged", _ => window.location.reload())
}

const createWeb3State = ({web3, provider, contract, isLoading}) =>{
    return {
        web3,
        provider, 
        contract, 
        isLoading, 
        hooks : setupHooks({web3, provider, contract})
    }
}

export default function Web3Provider({children}){
    const [web3Api, setWeb3Api] = useState(createWeb3State({web3 : null, provider : null, contract : null, isLoading : true}))

    useEffect(()=>{
        const loadProvider = async() =>{
            const provider = await detectEthereumProvider()

            if(provider && provider.isMetaMask){
                console.log("It is connecting to Metamask")
                const web3 = new Web3(provider)
                const contract = await loadContract("CourseMarketplace", web3)

                setListener(provider)
                console.log("This is the details of the contract", contract)
                setWeb3Api(createWeb3State({
                    web3, provider, contract, isLoading : false
                })) 
            }else{
                setWeb3Api(api => ({...api, isLoading : false}))
                window.alert("Please install or connect Metamask");
            }
        }

        loadProvider()
    },[])

    const _web3Api = useMemo (()=>{
        const {web3, provider, isLoading} = web3Api
        return {
            ...web3Api,
            requireInstall : !isLoading && !web3,
            connect : provider ? 
            async() => {
                try{
                    await provider.request({ method : "eth_requestAccounts"})
                }catch{
                    console.error("Cannot retreive Account");
                    window.alert("Error when connecting to Metamask, please check");
                    location.reload();
                }
            } :
            () => console.log("Cannot connect to Metamask, please try to reload yr browser")
        }
    },[web3Api])

    return(
        <Web3Context.Provider value={_web3Api}>
            {children}
        </Web3Context.Provider>
    )
}
export function useWeb3(){
    return useContext(Web3Context)
}

export function useHooks(cb){
    const { hooks } = useWeb3()
    return cb(hooks)
}