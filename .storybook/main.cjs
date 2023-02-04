module.exports = {
  "stories": [
    "../ui/**/*.mdx",
    "../ui/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  "docs": {},
  "staticDirs": ["../ui/public"]
}
