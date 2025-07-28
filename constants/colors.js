import { Alert } from "react-native";

const coffeeTheme = {
  primary: "#8B593E",
  background: "#FFF8F3",
  text: "#4A3428",
  border: "#E5D3B7",
  white: "#FFFFFF",
  textLight: "#9A8478",
  expense: "#E74C3C",
  income: "#2ECC71",
  card: "#FFFFFF",
  shadow: "#000000",
};

const forestTheme = {
  primary: "#2E7D32",
  background: "#E8F5E9",
  text: "#1B5E20",
  border: "#C8E6C9",
  white: "#FFFFFF",
  textLight: "#66BB6A",
  expense: "#C62828",
  income: "#388E3C",
  card: "#FFFFFF",
  shadow: "#000000",
};

const oceanTheme = {
  primary: "#0277BD",
  background: "#E1F5FE",
  text: "#01579B",
  border: "#B3E5FC",
  white: "#FFFFFF",
  textLight: "#4FC3F7",
  expense: "#EF5350",
  income: "#26A69A",
  card: "#FFFFFF",
  shadow: "#000000",
};

const purpleTheme = {
  primary: "#6A1B9A",
  background: "#F3E5F5",
  text: "#4A148C",
  border: "#D1C4E9",
  white: "#FFFFFF",
  textLight: "#BqA68C8",
  expense: "#D32F2F",
  income: "#388E3C",
  card: "#FFFFFF",
  shadow: "#000000",
};

const finoraTheme = {
  primary: "#7E57C2",       // Soft purple (brand-like)
  background: "#F2F3F5",    // Light neutral background
  text: "#4A148C",          // Dark gray for high readability
  border: "#D1C4E9",        // Soft purple-gray border
  white: "#FFFFFF",
  textLight: "#3f3f3f",     // Muted text for subtitles
  expense: "#E57373",
  alert: "#e63946" ,      
  income: "#4DB6AC",        // Teal-green for income
  card: "#FFFFFF",
  shadow: "#000000",
  accent: "#4DD0E1",
  asset: "#4e8cff",       // Blue for assets
  liability: "#F7B801",        // Teal accent (secondary brand)
};

const papiTheme = {
  primary: "#FDC856",
  background: "#F2F3F5",
  text: "#1A1A1A",
  border: "#eed382ff",
  textLight: "#3f3f3f", 
  gray: "#999",
  expense: "#E57373",
  alert: "#e63946" ,      
  income: "#4DB6AC",   
  edit: "#2466c2ff",
  white: "#FFFFFF",  
  card: "#FFFFFF",
  shadow: "#000000",
  accent: "#4DD0E1",
  asset: "#4DB6AC",    
  liability: "#E57373",

}


export const THEMES = {
  coffee: coffeeTheme,
  forest: forestTheme,
  purple: purpleTheme,
  ocean: oceanTheme,
  finora: finoraTheme,
  papi: papiTheme
};

// 👇 change this to switch theme
export const COLORS = THEMES.papi;

