import {Token} from "./Main"
import * as React from 'react';
import {Button} from "@mui/material";
import { useMoralis,useWeb3ExecuteFunction , useWeb3Contract, useERC20Balances} from "react-moralis";
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import networkMapping from "../chain-info/deployments/map.json"
import {constants,utils} from "ethers"
import {Contract} from "@ethersproject/contracts"
import ERC20 from "../chain-info/contracts/ERC20.json"
import {useState, useEffect} from "react"
import { styled } from '@mui/material/styles';
import MuiGrid from '@mui/material/Grid';
import {Avatar} from "@mui/material"
import Divider from '@mui/material/Divider';
import {makeStyles} from "@mui/styles";
import dapp from "../dapp.jpeg"
import eth from "../eth.jpeg"
import dai from "../dai.jpeg"
import {formatUnits} from "@ethersproject/units"
import Box from '@mui/material/Box';


interface StakeProps{
    supportedTokens: Array<Token>
}


const Grid = styled(MuiGrid)(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  '& [role="separator"]': {
    margin: theme.spacing(0, 2),
  },
}));

const useStyles = makeStyles((theme)=>(
    {
        container:
        {
            display:"inline-grid",
            gridTemplateColumns: "auto auto auto",
            gap:  10,
            alignItems: "center"
        },
        tokenImage:
        {
            width: "32px"
         },
         amount:{
                    fontWeight: 700
                 },
    }

))


export const StakeDetails = ({supportedTokens}:StakeProps) => {

     const classes = useStyles()

     var tokenAddress: String =  '0xB6Fd019a488442f4e79BcB410AaBfa7B3d430866';

     const {chainId, account} = useMoralis()
        const chainIdNum: number = Number(chainId)
        const tokenFarmAddress = chainId ? networkMapping[String(chainIdNum)]["TokenFarm"][0] : constants.AddressZero

       const { fetchERC20Balances, data, isLoading, isFetching, error } = useERC20Balances();

    const [tokenData, setTokenData] = useState(null)

    const handleChange = () => {
         console.log("fetching data")
         return fetchERC20Balances({params: {address: tokenFarmAddress}})
    }

    useEffect(() => {
                setTokenData(data)
                console.log(data)
            }, [data]
            )

    return(
    <div>
    <Box sx={{ display: 'flex', flexDirection: 'row' ,justifyContent: 'center',p:1, b:2 }}>
    <h3>Token Farm Details</h3>
    </Box>
    <Box sx={{ border: 2, borderColor: 'primary.main', borderRadius: '16px', boxShadow: 3 }}>
     <Grid container>
          <Grid item xs>
          <div className={classes.container}>
           <Avatar className={classes.tokenImage} src={dapp} alt="token logo"/>
           <div>DAPP Balance:</div>
           {tokenData?.map((tokenInfo,index)=>
           {return (
            (tokenInfo["symbol"] == "DAPP")?<div>{tokenInfo["balance"] ? parseFloat(formatUnits(tokenInfo["balance"],18)) : 0}</div>:<></>
           )}
           )}
           </div>
          </Grid>
          <Divider orientation="vertical" flexItem>
          </Divider>
          <Grid item xs>
            <div className={classes.container}>
                     <Avatar className={classes.tokenImage} src={eth} alt="token logo"/>
                     <div>WETH Balance:</div>
            {tokenData?.map((tokenInfo,index)=>
            {return (
            (tokenInfo["symbol"] == "WETH")?<div>{tokenInfo["balance"] ? parseFloat(formatUnits(tokenInfo["balance"],18)) : 0}</div>:<></>
           )}
           )}
            </div>
          </Grid>
          <Divider orientation="vertical" flexItem>
            </Divider>
            <Grid item xs>
              <div className={classes.container}>
                       <Avatar className={classes.tokenImage} src={dai} alt="token logo"/>
                       <div>DAI Balance:</div>
                       {tokenData?.map((tokenInfo,index)=>
                        {return (
                        (tokenInfo["symbol"] == "FAU")?<div>{tokenInfo["balance"] ? parseFloat(formatUnits(tokenInfo["balance"],18)) : 0}</div>:<></>
                          )}
                          )}
                         </div>
            </Grid>
        </Grid>
        </Box>
     <Box sx={{ display: 'flex', justifyContent: 'center', p:4, t: 10, }}>
    <Button onClick={handleChange} color="secondary" size="large" variant="outlined">Refresh</Button></Box>
    </div>
    )

}
