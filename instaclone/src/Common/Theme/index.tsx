import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',

    primary: {
      main: '#3E78B2',
      light: '#6A9FD1',
      dark: '#2C5A87',
      contrastText: '#ffffff',
    },

    secondary: {
      main: '#004BA8',
      light: '#3A7BD5',
      dark: '#00337A',
      contrastText: '#ffffff',
    },

    background: {
      default: '#07070A', // page background
      paper: '#0d0d0e',   // cards, modals
    },

    text: {
      primary: '#ffffff',
      // secondary: '#4A525A',
    },

    divider: '#4A525A',
  },
});

export default theme;