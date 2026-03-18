import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import cleanup from 'rollup-plugin-cleanup';
import pkg from './package.json' with { type: 'json' };

const BANNER = `/**
 *
 * @author ${pkg.author}
 * @version ${pkg.version}
 * @license ${pkg.license}
 */`;

const config = [
  {
    input: 'src/index.ts',
    output: [
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
    ],
    plugins: [
      resolve(),
      typescript({ tsconfig: './tsconfig.json' }),
      cleanup({ comments: 'none', extensions: ['ts'] }),
    ],
    preserveEntrySignatures: 'strict',
  },
  {
    input: 'src/plugins/index.ts',
    output: [
      {
        file: 'dist/plugins/index.esm.js',
        format: 'esm',
      },
      {
        file: 'dist/plugins/index.umd.js',
        name: 'DarkifyPlugins',
        format: 'umd',
        plugins: [terser()],
      },
    ],
    plugins: [
      resolve(),
      typescript({ tsconfig: './tsconfig.json' }),
      cleanup({ comments: 'none', extensions: ['ts'] }),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/darkify.d.ts',
      format: 'esm',
    },
    plugins: [dts({ tsconfig: './tsconfig.json' })],
  },
  {
    input: 'src/plugins/index.ts',
    external: ['@/types'],
    output: {
      file: 'dist/plugins/index.d.ts',
      format: 'esm',
      paths: {
        '@/types': '../darkify',
      },
    },
    plugins: [dts({ tsconfig: './tsconfig.json' })],
  },
];

export default config;
