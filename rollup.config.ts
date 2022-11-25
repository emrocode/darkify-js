import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import pkg from './package.json' assert { type: 'json' };

const BANNER = `/**
 *
 * @author ${pkg.author}
 * @version ${pkg.version}
 * @license ${pkg.license}
 */`;

const config = [
  {
    input: './src/index.ts',
    output: [
      {
        file: 'dist/darkify.js',
        name: 'Darkify',
        format: 'umd',
        banner: BANNER,
        sourcemap: false,
      },
      {
        file: 'dist/darkify.min.js',
        name: 'Darkify',
        format: 'iife',
        banner: BANNER,
        sourcemap: true,
        plugins: [terser()],
      },
    ],
    plugins: [typescript()],
  },
  {
    input: './src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
];

export default config;
