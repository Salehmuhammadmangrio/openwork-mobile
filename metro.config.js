const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// On web, some packages (e.g. zustand v5) ship ESM entries that use `import.meta`,
// which cannot run in a classic (non-module) <script> tag. Drop the `import`
// resolver condition for web so those packages fall back to their CommonJS entry.
const { resolver } = config;
resolver.unstable_enablePackageExports = true;
resolver.unstable_conditionNames = ['require', 'react-native', 'browser'];

module.exports = config;
