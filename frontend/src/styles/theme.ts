export const theme = {
  colors: {
    primary: '#C2185B',
    primaryHover: '#AD1457',
    secondaryHover: '#5a6268',
    secondary: '#f06292',  // Um tom mais claro para o hover
    background: '#f8f9fa',     // Um cinza de fundo quase branco
    surface: '#FFFFFF',        // Cor de superfície para cards, modais
    text: '#212529',           // Cor de texto principal (preto suave)
    textSecondary: '#6c757d',  // Cor de texto secundária (cinza)
    border: '#dee2e6',         // Cor para bordas
    danger: '#ef4444',
    dangerHover: '#dc2626',
    success: '#10b981',
    white: '#FFFFFF',
  },
  fonts: {
    navigation: "'Montserrat', sans-serif",
    title: "'Inter', sans-serif",
    body: "'Montserrat', sans-serif"
  }
};

export type ThemeType = typeof theme;