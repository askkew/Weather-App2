import './App.css';
import React, {useState, useEffect} from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Grid } from '@mui/material'
import Weatherbutton from './components/buttons/weatherbutton';
import Settingsbutton from './components/buttons/settingsbutton';
import Forecastbutton from './components/buttons/forecastbutton';
import { styled } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios';
import Mainpage from './components/mainpage';



const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f44336',
    },
    secondary: {
      main: '#00e676',
    },
  }
})

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#f44336',
    },
    secondary: {
      main: '#00e676',
    },
  }
})

const Footer = styled('div')({
  width: '100%',
  bottom: 0,
  position: 'absolute',
  display: 'flex !important',
  flexDirection: 'row',
  margin: 0,
  padding: 0,
  marginBottom: 15,
});

const FooterButtonContainer = styled('div')({
  display: 'flex',
  width: '33%',
  justifyContent: 'center',
  padding: 0,
  margin: 0,
})

function App() {

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <div style={{ height: '100vh', background: 'linear-gradient(to right bottom, darkcyan, blue)' }}>
        <Mainpage />

        <Footer container spacing={2} >
          <FooterButtonContainer>
              <Weatherbutton />
          </FooterButtonContainer>
          <FooterButtonContainer>
              <Forecastbutton />
          </FooterButtonContainer>
          <FooterButtonContainer>
              <Settingsbutton />
          </FooterButtonContainer>
        </Footer>
      </div>

    </ThemeProvider>

  );
}

export default App;
