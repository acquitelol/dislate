import esbuild from 'rollup-plugin-esbuild';
import packageJson from './package.json';

export default {
   input: 'src/index.js',
   output: [
      {
         file: `dist/${packageJson.name}.min.js`,
         format: 'umd',
         name: "translate",
         strict: true,
      },
   ],
   plugins: [
      esbuild({ 
         minify: true, 
         target: 'es2017',
      }),
   ]
};