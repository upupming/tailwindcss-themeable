import { Options } from 'tsup'

const options: Options = {
  format: [
    'cjs',
    'esm'
  ],
  clean: true,
  splitting: true,
  dts: true,
  entryPoints: [
    'src/index.ts'
  ],
  minify: true
}

export default options
