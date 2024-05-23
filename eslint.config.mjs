import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import tsparser from '@typescript-eslint/parser';

export default [
    {
        files: ['*.ts', '*.tsx', '*.vue'],
        languageOptions: {
            globals: globals.browser,
            parser: tsparser,
            parserOptions: {
                ecmaVersion: 2021,
                sourceType: 'module',
                project: './tsconfig.json',  // 确保指向你的 tsconfig.json 文件
            },
        },
        env: {
            node: true,
        },
        plugins: {
            vue: pluginVue,
            '@typescript-eslint': tseslint,
        },
        rules: {
            'vue/multi-word-component-names': 'off',
        },
    },
    pluginJs.configs.recommended,
    {
        extends: [
            'plugin:vue/vue3-essential',
            'eslint:recommended',
            '@vue/eslint-config-typescript',
        ],
    },
];

