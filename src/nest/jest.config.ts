const core_path = '<rootDir>/../../../node_modules/core/dist';

export default {
  displayName: {
    name: 'nest',
    color: 'magentaBright',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '/core/(.*)$/': '<rootDir>/../../../node_modules/core/dist/$1',
    '#seedwork/(.*)$': `${core_path}/@seedwork/$1`,
    '#category/(.*)$': `${core_path}/category/$1`,
  },
};
