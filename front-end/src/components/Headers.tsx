import {Button} from "@mui/material"
import {makeStyles} from "@mui/styles"
import { useMoralis } from "react-moralis";
import Chip from '@mui/material/Chip';


 const useStyles = makeStyles((theme)=>({
            container:
            {
            padding: 22,
            display: "flex",
            justifyContent: "flex-end",
            gap: 10
            }
            }))


export const Header = () => {

    const { authenticate, logout, isAuthenticated, account, chainId } = useMoralis();
    const classes = useStyles()
    console.log(Number(chainId))
    return (
        <div className = {classes.container}>
        <div>
        { isAuthenticated ?
            <div>
            <Chip label={account}/>
            <Button href="#text-buttons" variant = "contained"
                onClick = {() => logout()}>
                Disconnect
            </Button></div> :
            <Button href="#text-buttons" variant = "contained"
                            onClick = {() => authenticate()}>
                 Connect
            </Button>
        }
        </div>
        </div>
    )
}