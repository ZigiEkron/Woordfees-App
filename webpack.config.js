const { withExpo } = require('@expo/webpack-config');
const path = require('path');

module.exports = (env, argv) => {
  const config = withExpo(env, argv);
  config.resolve = config.resolve || {};
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    'react-native-maps': path.resolve(__dirname, 'web-stubs/react-native-maps.js'),
  };
  return config;
};
