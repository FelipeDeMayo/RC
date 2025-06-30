export const theme = {
  colors: {
    primary: '#1A1A1A',        // Preto principal
    primaryHover: '#D81B60', // Um tom mais claro para o hover
    background: '#f4f4f4',     // Cinza de fundo
    text: '#333333',           // Cor de texto padrão
    white: '#FFFFFF',
    danger: '#ef4444',         // Vermelho para ações de perigo/cancelar
    dangerHover: '#dc2626',
    success: '#10b981',        // Verde para preços ou sucesso
  },
  fonts: {
    navigation: "'Montserrat', sans-serif",
    title: "'Inter', sans-serif",
    body: "'Montserrat', sans-serif"
  }
};

export type ThemeType = typeof theme;