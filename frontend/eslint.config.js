import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      "react-refresh": pluginReactRefresh,
      "react-hooks": pluginReactHooks,
    },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    },
  },
  ...tseslint.configs.recommended,
  {
    ...pluginReactConfig,
    settings: {
      react: { version: "detect" }
    }
  },
  {
    // É AQUI QUE A MÁGICA ACONTECE
    rules: {
      "react-refresh/only-export-components": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      
      // ADICIONAMOS ESTA LINHA PARA DESLIGAR O AVISO PARA SEMPRE
      "@typescript-eslint/no-empty-interface": "off",
    }
  },
  {
    ignores: ["dist", "eslint.config.js"]
  }
];