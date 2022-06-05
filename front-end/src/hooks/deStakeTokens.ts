import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import networkMapping from "../chain-info/deployments/map.json"
import {constants,utils} from "ethers"
import {Contract} from "@ethersproject/contracts"
import ERC20 from "../chain-info/contracts/MockERC20.json"
import {useState, useEffect} from "react"
import { useMoralis,useWeb3ExecuteFunction , useWeb3Contract} from "react-moralis";



export const DeStakeTokens = () => {

    const {chainId} = useMoralis()
    const chainIdNum: number = Number(chainId)
    const {abi} = TokenFarm
    const tokenFarmAddress = chainId ? networkMapping[String(chainIdNum)]["TokenFarm"][0] : constants.AddressZero


    const [success, setSuccess] = useState(false);

    const { data: rewardData,error: rewardError, fetch: rewardFetch, isLoading: rewardLoad } = useWeb3ExecuteFunction();

    const { data :destakeData, error :destakeError, runContractFunction: dContractFunc, isLoading: destakeLoad } = useWeb3Contract();

    const { data :destakeData1, error :destakeError1, runContractFunction: fContractFunc, isLoading: destakeLoad1 } = useWeb3Contract();


    const issueToken = () => {
        const options = {
                        abi: abi,
                        contractAddress: tokenFarmAddress,
                        functionName: "issueToken"
                      }
        return(rewardFetch({params: options}))
    }

    const destake = () => {
    const options = {
                    abi: abi,
                    contractAddress: tokenFarmAddress,
                    functionName: "unStakeToken",
                    params:{
                        _token: '0xfab46e002bbf0b4509813474841e0716e6730136'
                    }
                  }
            return dContractFunc({params:options,

            onSuccess: (tx) => tx.wait().then((finalTx) =>{
                 const options = {
                                                    abi: abi,
                                                    contractAddress: tokenFarmAddress,
                                                    functionName: "unStakeToken",
                                                    params:{
                                                        _token: '0xb6fd019a488442f4e79bcb410aabfa7b3d430866'
                                                    }
                                                  }
                                    fContractFunc({params:options,
                                    onSuccess: (tx) => tx.wait().then((finalTx) => {setSuccess(true);})
                                    })
                                    })

            })

    }

     useEffect(() => {
                        console.log(rewardData)
            }, [rewardData,rewardError]
            )
     useEffect(() => {
                             console.log(destakeData)
                 }, [destakeData]
                 )
     useEffect(() => {
                             console.log(destakeData1)
                 }, [destakeData1]
                 )

    return {issueToken,destake,success,rewardLoad,destakeLoad,destakeLoad1}



}