import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

// Next 16 removed `next lint`; linting now runs via ESLint 9 flat config.
// eslint-config-next v16 ships native flat configs, so they're spread directly
// (no FlatCompat bridge needed — that path hit a circular-JSON bug on ESLint 9).
const eslintConfig = [
  // `mobile/` is the Expo/React Native app — it has its own toolchain and lint
  // config, and must not be linted by the Next.js web config.
  { ignores: ['.next/**', 'node_modules/**', 'out/**', 'build/**', 'next-env.d.ts', 'mobile/**'] },
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      // React 19's react-hooks plugin adds this rule, which flags long-standing,
      // working patterns here (e.g. the mount-guard `useEffect(() => setMounted(true), [])`).
      // It's a perf suggestion, not a correctness bug — downgraded to a warning for the
      // Next 16 migration; revisit component-by-component post-launch.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
]

export default eslintConfig
