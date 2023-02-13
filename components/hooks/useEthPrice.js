import useSWR from "swr"

const URL = "https://api.coingecko.com/api/v3/coins/ethereum?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false"
export const COURSE_PRICE = 15



export const useEthPrice = () =>{
    const {data, ...rest} = useSWR(
        URL,
        fetcher,
        {refreshInterval : 1000}
    )

    const perItem = (data && (COURSE_PRICE / Number(data)).toFixed(6)) ?? null

    return {
        eth : {data, perItem, ...rest}
    }
}
