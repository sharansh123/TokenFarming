import helperConfig from "../helper-config.json"
import networkMapping from "../chain-info/deployments/map.json"
import {constants} from "ethers"
import { useMoralis } from "react-moralis";
import brownieConfig from "../brownie-config.json"
import dapp from "../dapp.jpeg"
import eth from "../eth.jpeg"
import dai from "../dai.jpeg"
import {YourWallet} from "./yourWallet/YourWallet"
import {makeStyles} from "@mui/styles"
import {StakeDetails} from "./StakeDetails"
import {Destake} from "./Destake"


export type Token = {
    image: String,
    address: String,
    name: String
}

export const Main = () => {
    const {chainId} = useMoralis()
    var chainIdNum : number = Number(chainId)
    console.log(chainId)
    const networkName = chainId ? helperConfig[String(chainIdNum)] : "dev"
    console.log(networkName)
    const dappAddress = chainId ? networkMapping[String(chainIdNum)]["DappToken"][0] : constants.AddressZero
    const wethAddress = chainId ? brownieConfig["networks"][networkName]["weth_token"] : constants.AddressZero
    const fauAddress = chainId ? brownieConfig["networks"][networkName]["fau_token"] : constants.AddressZero
    console.log(wethAddress)
    console.log(fauAddress)
    const supportedToken: Array<Token> = [
    {image:dapp,address:dappAddress,name:"DAPP"},
    {image:eth,address:wethAddress,name:"WETH"},
    {image:dai,address:fauAddress,name:"DAI"}
    ]

    return(
    <>
    <YourWallet supportedTokens={supportedToken}/>
    <StakeDetails supportedToken={supportedToken}/>
    <Destake supportedToken={supportedToken}/>
    </>
    )

}