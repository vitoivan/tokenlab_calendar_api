import { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '(src/|test/user|test/auth).*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  maxWorkers: 2,
  collectCoverageFrom: ['src/**/*.ts', '!**/node_modules/**', 'src/**.ts'],
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: ['.module.ts'],

  testEnvironment: 'node',
  moduleDirectories: ['node_modules', 'src'],
  // setupFiles: ['<rootDir>/test/setup/set-env-vars.ts'],
  rootDir: './',
  modulePaths: ['<rootDir>/src'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
};

export default config;
