import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2E7D32', // Un beau vert émeraude/agriculture
    accent: '#8D6E63', // Marron terre (chocolat/cacao)
    background: '#F1F8E9', // Vert très très clair pour le fond
    surface: '#FFFFFF',
    text: '#333333',
    error: '#B00020',
    onPrimary: '#FFFFFF',
    success: '#4CAF50',
    warning: '#FFC107',
  },
  roundness: 12,
};
