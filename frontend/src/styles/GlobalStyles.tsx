import { createGlobalStyle } from 'styled-components';
import type { ThemeType } from './theme';

export const GlobalStyle = createGlobalStyle<{ theme: ThemeType }>`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    font-family: ${props => props.theme.fonts.body};
    -webkit-font-smoothing: antialiased;
    line-height: 1.5;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${props => props.theme.fonts.title};
    color: ${props => props.theme.colors.primary};
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: ${props => props.theme.fonts.navigation};
    cursor: pointer;
    border: none;
    background: none;
  }
`;