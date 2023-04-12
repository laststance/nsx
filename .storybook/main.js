const path = require('path');
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  typescript: {
    reactDocgen: 'react-docgen-typescript-plugin' // workaround for typescript v5 @see https://github.com/hipstersmoothie/react-docgen-typescript-plugin/issues/78#issuecomment-1409224863
  },
  addons: ['@storybook/addon-essentials'],
  core: {
    'builder': 'webpack5'
  },
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.css$/,
      use: [{
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [require('tailwindcss'), require('autoprefixer')]
          }
        }
      }],
      include: path.resolve(__dirname, '../')
    });
    return config;
  },
  framework: '@storybook/react',
  docs: {
    autodocs: true
  }
};