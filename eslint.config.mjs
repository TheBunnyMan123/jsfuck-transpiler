import globals from "globals";
import pluginJs from "@eslint/js";

export const semi = 'always';

export default [
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  {rules:
    {
      semi: 'error',
      'no-self-assign': 'off'
    }
  }
];