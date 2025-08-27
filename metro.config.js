const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configurar alias para resolver los paths
config.resolver.alias = {
  '@': path.resolve(__dirname, '.'),
  '@/components': path.resolve(__dirname, 'src/presentation/components'),
  '@/hooks': path.resolve(__dirname, 'src/shared/utils'),
  '@/constants': path.resolve(__dirname, 'src/shared/constants'),
};

module.exports = config;