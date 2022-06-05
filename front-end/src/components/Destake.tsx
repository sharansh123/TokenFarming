import {Token} from "./Main"
import {Button} from "@mui/material";
import {makeStyles} from "@mui/styles";
import Box from '@mui/material/Box';
import {useState, useEffect} from "react";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CircularProgress from '@mui/material/CircularProgress';
import {DeStakeTokens} from '../hooks/deStakeTokens.ts'

interface stakeProps{
    supportedTokens: Array<Token>
}

export const Destake = ({token}: stakeProps) => {

    const {issueToken,destake,success,rLoad,dLoad,dLoad1 } = DeStakeTokens();

     const [rewardLoad, setRewardLoad] = useState(rLoad);
     const[destakeLoad, setDestakeLoad] = useState(dLoad || dLoad1);
     const [open, setOpen] = useState(true);
     const[hide, setHide] = useState(false);

      const handleChange = () => {
             console.log("fetching data")
             issueToken();
             destake();

        }
      useEffect(() => {
               if(rewardLoad || destakeLoad){
                   setHide(true);
               }
               else{
                setHide(false);
               }
             }, [rewardLoad,destakeLoad]
             )

      useEffect(() => {
            setRewardLoad(rLoad);
      },[rLoad])

      useEffect(() => {
                  setDestakeLoad(dLoad || dLoad1);
            },[dLoad])

      useEffect(() => {
                        setDestakeLoad(dLoad || dLoad1);
                  },[dLoad1])

    return(
    <>
    <Box sx={{ display: 'flex', flexDirection: 'row' ,justifyContent: 'center', p:1, t: 3, }}>
    {(!hide)?<Button onClick={handleChange} color="secondary" size="large" variant="outlined">Destake</Button>:<></>}
    {(rLoad)?<><CircularProgress color="secondary" /><h4>Issuing Reward Tokens</h4></>:<></>}
    {(destakeLoad && !success)?<><CircularProgress color="secondary" /><h4>Destaking Your Amount</h4></>:<></>}
     </Box>
     {( success && open) ?
          <Alert severity="success" onClose={() => {setOpen(false);}}>
                 <AlertTitle>Destake Complete</AlertTitle>
                 Amount Transferred.
               </Alert> : <></>
         }
     </>
    )






}