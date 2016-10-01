import typescript from 'rollup-plugin-typescript';

export default {
  entry: 'src/main.ts',
  format: 'cjs',
  dest: 'bin/kps',
  banner: '#!/usr/bin/env node',
  plugins: [
    typescript({
      typescript: require("typescript")
    })
  ]
}