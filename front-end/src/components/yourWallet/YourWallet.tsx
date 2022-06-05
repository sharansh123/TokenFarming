import {Token} from "../Main"
import {Box,Avatar} from "@mui/material"
import {TabContext,TabPanel, TabList} from "@mui/lab"
import React, {useState} from "react"
import {Tab} from "@mui/material"
import { useMoralis,useERC20Balances } from "react-moralis";
//import {StakeForm} from "./StakeForm"
import {BalanceMsg} from "../BalanceMsg.tsx"
import {StakeForm} from "./StakeForm"

interface YourWalletProps{
    supportedTokens: Array<Token>
}

export const YourWallet = ({supportedTokens}:YourWalletProps) => {

    const [selectedToken,setSelectedToken] = useState<number>(0)
     const { fetchERC20Balances, data, isLoading, isFetching, error } = useERC20Balances();

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
             fetchERC20Balances()
             console.log(data)
            setSelectedToken(parseInt(newValue))
    }
     /*  <WalletBalance token={supportedTokens[selectedToken]}/>
                        <StakeForm token={supportedTokens[selectedToken]}/> */

    return(<Box sx={{ border: 2, borderColor: 'primary.main', borderRadius: '16px', boxShadow: 3 }}>
            <TabContext value={selectedToken.toString()}>
                <TabList onChange={handleChange} aria-label="stake form tabs" variant="fullWidth">
                   { supportedTokens?.map((token,index) =>
                        {return(<Tab icon={<Avatar alt="token" src={token.image}/>} img={token.image}  label={token.name} value={index.toString()} key={index}/>)})}
                </TabList>
                {supportedTokens?.map((token,index) => {
                    return(
                    <TabPanel value={index.toString()} key={index}>
                   {data?.map((tokenInfo,index) => {return(
                    Number(tokenInfo["token_address"])===Number(token.address) ?
                    <BalanceMsg label = {"Your un-staked balance"}
                        amount = {tokenInfo["balance"]}
                        tokenImage = {token.image}
                        /> : <></>
                    )})}
                    <StakeForm token={supportedTokens[selectedToken]}/>
                    </TabPanel>
                    )
                }
                )
                }
            </TabContext>
            </Box>)
}