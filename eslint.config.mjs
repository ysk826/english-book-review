import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // 追加: TypeScriptの未使用変数ルールをカスタマイズ
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "vars": "all",
          "varsIgnorePattern": "^_", // _ で始まる変数は無視
          "args": "after-used",
          "argsIgnorePattern": "^_", // _ で始まる引数は無視
          "destructuredArrayIgnorePattern": "^_" // 分割代入での _ は無視
        }
      ]
    }
  }
];

export default eslintConfig;
