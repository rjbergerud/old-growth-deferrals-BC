import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// rollup.config.js
export default {
  external: ['leaflet', 'L'],
  input: 'main.js',
  output: {
    file: 'bundle.js',
    format: 'iife',
  },
  plugins: [
      nodeResolve(),
      commonjs(),
  ],
};
