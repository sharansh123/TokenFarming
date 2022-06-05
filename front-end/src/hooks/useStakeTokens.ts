import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import networkMapping from "../chain-info/deployments/map.json"
import {constants,utils} from "ethers"
import {Contract} from "@ethersproject/contracts"
import ERC20 from "../chain-info/contracts/MockERC20.json"
import {useState, useEffect} from "react"
import { useMoralis,useWeb3ExecuteFunction , useWeb3Contract} from "react-moralis";

export const useStakeTokens = (tokenAddress: string) => {

    const {chainId} = useMoralis()
    const chainIdNum: number = Number(chainId)
    const {abi} = TokenFarm
    const tokenFarmAddress = chainId ? networkMapping[String(chainIdNum)]["TokenFarm"][0] : constants.AddressZero
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)
    const ERC20Abi = ERC20.abi
    const ERC20Interface = new utils.Interface(ERC20Abi)
    const ERC20Contract = new Contract(tokenAddress,ERC20Interface)


     const { data, error, fetch, isFetching, isLoading } = useWeb3ExecuteFunction();

     const { data :stakeData, error :stakeError, runContractFunction, isFetching: stakeFetch, isLoading: stakeLoad } = useWeb3Contract();

    const [amountToStake,setAmountToStake] = useState("0")

    const [success, setSuccess] = useState(false)
    const [ approved , setApproved] = useState(false)

    const approve = (amountApprove: string) => {
         const options = {
                abi: ERC20Abi,
                contractAddress: tokenAddress,
                functionName: "approve",
                params:{
                    spender: tokenFarmAddress,
                    amount: amountApprove
                }
              }
        setAmountToStake(amountApprove)
        return fetch({params:options,

        onSuccess: (tx) => tx.wait().then((finalTx) =>{
            setApproved(true);
             const options = {
                                                abi: abi,
                                                contractAddress: tokenFarmAddress,
                                                functionName: "stakeToken",
                                                params:{
                                                    _amount: amountApprove,
                                                    _token: tokenAddress
                                                }
                                              }
                                runContractFunction({params:options,
                                onSuccess: (tx) => tx.wait().then((finalTx) => {setSuccess(true);})
                                })
                                })

        })
    }


   useEffect(() => {
                    console.log(data)
        }, [isFetching,data]
        )

    return {approve,success,approved}
 }