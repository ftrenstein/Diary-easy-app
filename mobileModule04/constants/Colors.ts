const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

// Градиентные цвета
export const GradientColors = {
  primary: ["#1de15c", "#eeff20"], // Основной зеленый градиент
  secondary: ["#6366f1", "#8b5cf6"], // Фиолетовый градиент
  accent: ["#f59e0b", "#f97316"], // Оранжевый градиент
};

export default {
  light: {
    text: "#000",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
  },
};
