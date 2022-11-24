import { nodeResolve } from '@rollup/plugin-node-resolve';
import common_js from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import json from '@rollup/plugin-json';

import manifest from './manifest.json';
import { defineConfig } from 'rollup';

const is_production = manifest.release=="stable"
   ? true
   : false

export default defineConfig({
   input: 'src/index.tsx',
   output: [
      {
         file: `dist/${manifest.name}.js`,
         format: 'esm',
         strict: false
      },
   ],
   plugins: [
      nodeResolve(),
      common_js(),
      json(),
      esbuild({ 
         minify: is_production, 
         target: 'ES2019',
      }),
   ]
});