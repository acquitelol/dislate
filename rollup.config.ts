import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import json from '@rollup/plugin-json'

import manifest from './manifest.json';
import { defineConfig } from 'rollup';
import crypto from 'crypto';
import path from 'path';
import fs from "fs"

const hash = crypto.createHash('sha256');

async function calculateHash(folderPath: string) {
   const files = await readDirRecursive(folderPath);
   for (const file of files) {
      const content = await fs.promises.readFile(file);
      hash.update(content);
   }
   return hash.digest('hex').substring(0, 8);
}

async function readDirRecursive(folderPath: string): Promise<string[]> {
   const files: string[] = [];
   const dirents = await fs.promises.readdir(folderPath, { withFileTypes: true });
   for (const dirent of dirents) {
      const fullPath = path.join(folderPath, dirent.name);
      if (dirent.isDirectory()) {
         files.push(...await readDirRecursive(fullPath));
      } else {
         files.push(fullPath);
      }
   }
   return files;
}

(async function main() {
   manifest.plugin.hash = `${await calculateHash("src")}`
   fs.writeFileSync("./manifest.json", JSON.stringify(manifest, null, 3))
})()

export default defineConfig({
   input: 'src/index.tsx',
   output: [
      {
         file: `dist/${manifest.name}.js`,
         format: 'cjs',
         strict: false
      },
   ],
   plugins: [
      nodeResolve(),
      commonjs(),
      json(),
      esbuild({ minify: true, target: 'ES2019' })
   ]
});