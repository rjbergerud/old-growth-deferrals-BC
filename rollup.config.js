import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

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
      serve(),
      livereload(),
  ],
};
