const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Thêm định dạng wasm vào danh sách assets
config.resolver.assetExts.push('wasm');

module.exports = config;