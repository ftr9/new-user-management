module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@babel/plugin-proposal-export-namespace-from',
      'react-native-reanimated/plugin',
      'nativewind/babel',
      require.resolve('expo-router/babel'),
      [
        'babel-plugin-root-import',
        {
          paths: [
            {
              rootPathSuffix: './aComponents',
              rootPathPrefix: '@components',
            },
            {
              rootPathSuffix: './constants',
              rootPathPrefix: '@constants',
            },
            {
              rootPathSuffix: './utils',
              rootPathPrefix: '@utils',
            },
            {
              rootPathSuffix: './config',
              rootPathPrefix: '@config',
            },
            {
              rootPathSuffix: './store',
              rootPathPrefix: '@store',
            },
          ],
        },
      ],
    ],
  };
};
