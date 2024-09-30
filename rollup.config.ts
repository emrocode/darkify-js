import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';
import cleanup from 'rollup-plugin-cleanup';
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
        file: 'dist/darkify.cjs.js',
        name: 'Darkify',
        format: 'cjs',
        exports: 'named',
        banner: BANNER,
      },
      {
        file: 'dist/darkify.esm.js',
        format: 'esm',
        banner: BANNER,
      },
      {
        file: 'dist/darkify.umd.js',
        name: 'Darkify',
        format: 'umd',
        banner: BANNER,
        plugins: [terser()],
      },
      {
        file: 'dist/darkify.min.js',
        name: 'Darkify',
        format: 'iife',
        banner: BANNER,
        plugins: [terser()],
      },
    ],
    plugins: [
      typescript(),
      cleanup({
        comments: 'none',
        extensions: ['ts'],
      }),
      commonjs(),
    ],
  },
  {
    input: './src/index.ts',
    output: {
      file: 'dist/darkify.d.ts',
      format: 'esm',
    },
    plugins: [dts()],
  },
];

export default config;
