import {makeStyles} from "@mui/styles"
import {Avatar} from "@mui/material"
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import {formatUnits} from "@ethersproject/units"

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
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
                 }
    }

))

export interface BalanceMsgProps{
    label: string,
    amount: number,
    tokenImage: string
}


export const BalanceMsg = ({label,amount,tokenImage}:BalanceMsgProps) => {

    const classes = useStyles()

    const formattedToken: number = amount ? parseFloat(formatUnits(amount,18)) : 0

    return(
        <Item>
        <div className = {classes.container}>
        <div>{label}</div>
        <div className={classes.amount}>{formattedToken}</div>
        <Avatar className={classes.tokenImage} src={tokenImage} alt="token logo"/>
        </div>
        </Item>
    )
}