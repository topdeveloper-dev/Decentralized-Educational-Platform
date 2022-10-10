import { useEffect  } from "react"
import useSWR from "swr"

const adminAddress = {
    "0x2d1777c92d0da117804078e4f3b3e089816e844a0dff68dfab0b7f0058fbf1ef" : true
}

export const handler = (web3, provider) => () =>{
    const { data, mutate, ...rest } = useSWR( ()=> web3 ?  "web3/accounts" : null ,
        async ()=>{
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]
            if(!account){
                throw new Error("Cannot retreive your account, please refresh your browser");
            }
            return account
        } 
    )

    useEffect(()=>{
        const mutator = accounts => mutate(accounts[0] ?? null)
        provider?.on("accountsChanged", mutator)
    
        return () => {
        provider?.removeListener("accountsChanged", mutator)
         }
    },[provider])


    return{ 
        data,
        isAdmin : (data && adminAddress[web3.utils.keccak256(data)]) ?? false,
        mutate, 
        ...rest
    
}
}