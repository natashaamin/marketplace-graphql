import { Config, configUmiAlias, createConfig } from '@umijs/max/test';

export default async () => {
  return (await configUmiAlias({
    ...createConfig({
      target: 'browser',
      jsTransformer: 'esbuild',
      jsTransformerOpts: { jsx: 'automatic' },
    }),
    verbose: true,
    collectCoverageFrom: [
      'src/**/*.{ts,js,tsx,jsx}',
      '!src/.umi/**',
      '!src/.umi-test/**',
      '!src/.umi-production/**'
    ],
  })) as Config.InitialOptions;
};