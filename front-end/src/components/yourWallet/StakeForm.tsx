import {Token} from "../Main/Token"
import {formatUnits} from "@ethersproject/units"
import {Button,Slider} from "@mui/material"
import {makeStyles} from "@mui/styles"
import React, {useState} from "react"
import {useStakeTokens} from "../../hooks/useStakeTokens.ts"
import {utils} from "ethers"
import { useMoralis,useWeb3ExecuteFunction } from "react-moralis";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CircularProgress from '@mui/material/CircularProgress';


export interface StakeFormProps{
    token: Token
}

const useStyles = makeStyles((theme)=>(
    {
        container:
        {
            display:"inline-grid",
            gridTemplateColumns: "auto auto",
            gap:  15,
            alignItems: "center"
        }
     }))


export const StakeForm = ({token}: StakeFormProps) => {

    const [amount,setAmount] = useState<number>(0)
    const classes = useStyles()
    const {address,name} = token
    const {account} = useMoralis()

    const handleAmountChange = (event: Event, newValue: number | number[] ) => {
            setAmount(newValue as number)
            console.log(newValue)
    }

    const [openStake, setOpenStake] = React.useState(true);

    const [openApprove, setOpenApprove] = React.useState(true);

    const {approve,success, approved} = useStakeTokens(address)

    const [isLoading,setIsLoading] = useState(false)

    const handleStakeSubmit = () => {
        setIsLoading(true);
        const amountAsWei = utils.parseEther(amount.toString())
        console.log(amountAsWei.toString())
        return approve(amountAsWei.toString())
    }

    return(
    <div className={classes.container}>
    <Slider onChange={handleAmountChange} sx={{width:"500px" , align:"center", margin: 4}} defaultValue={5} min={1} max={20}   valueLabelDisplay="auto" color="secondary" />
    {(isLoading && !success)?<CircularProgress color="secondary" />:<Button onClick={handleStakeSubmit} color="secondary" size="large" variant="outlined">Stake</Button>}
     {( approved && openApprove) ?
          <Alert severity="success" onClose={() => {setOpenApprove(false);}}>
                 <AlertTitle>Approval Complete</AlertTitle>
                 {amount} {token.name} Approved. Waiting for Amount Transfer.
               </Alert> : <></>
         }
    {( success && openStake) ?
      <Alert severity="success" onClose={() => {setOpenStake(false);}}>
             <AlertTitle>Transaction Complete</AlertTitle>
             {amount} {token.name} staked
           </Alert> : <></>
     }
    </div>
    )
}