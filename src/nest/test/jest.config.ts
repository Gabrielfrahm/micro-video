const core_path = '<rootDir>/../../../node_modules/core/dist';

export default {
  ...require('../jest.config').default,
  displayName: {
    name: 'nest-e2e',
    color: 'yellow',
  },
  rootDir: './',
  testRegex: '.*\\.e2e-spec\\.ts$',
  maxWorkers: 1,
  moduleNameMapper: {
    '/core/(.*)$/': `${core_path}/$1`,
    '#seedwork/(.*)$': `${core_path}/@seedwork/$1`,
    '#category/(.*)$': `${core_path}/category/$1`,
  },
};
