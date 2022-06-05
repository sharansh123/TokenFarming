import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Header} from "./components/Headers"
import {Container} from "@mui/material"
import {Main} from "./components/Main"
import Box from '@mui/material/Box';


function App() {

  return (
   <div>
       <Header/>
       <Container maxWidth="md">
       <Box sx={{ display: 'flex', flexDirection: 'row' ,justifyContent: 'center',p:1, b:2 }}>
       <h1>Token Farming App</h1></Box>
       <Main/>
       </Container>
       </div>
  );
}

export default App;
