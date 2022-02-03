import { createGlobalStyle } from 'styled-components'

export const theme = {
  primaryColor: "#50dc64", // The green 
  backgroundColor: "#242323" // The dark grey
}

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${theme.backgroundColor} !important;
  }
`

