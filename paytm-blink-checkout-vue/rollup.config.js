import esbuild from 'rollup-plugin-esbuild';
import pkgJson from './package.json';

const dist = 'library-dist';
const name = 'PaytmBlinkCheckoutVue';
const globals = { 'vue-demi': 'VueDemi'  };

const baseConfig = {
  input: 'src/library-entry.js',
  external: [...Object.keys(pkgJson.peerDependencies), ...Object.keys(pkgJson.dependencies)],
  plugins: [
    esbuild({
        target: 'es6',
        minify: true,
    }),
  ],
};

export default [
  {
    ...baseConfig,
    output: {
      file: dist + '/index.esm.js',
      format: 'esm',
    },
  },
  {
    ...baseConfig,
    output: {
      name,
      globals,
      file: dist + '/index.umd.js',
      format: 'umd',
      exports: 'named',
      compact: true,
    },
  },
  {
    ...baseConfig,
    output: {
      name,
      globals,
      file: dist + '/index.min.js',
      format: 'iife',
      exports: 'named',
      compact: true,
    },
  },
];