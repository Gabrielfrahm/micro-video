import { Test } from '@nestjs/testing';
import * as Joi from 'joi';
import { join } from 'path';
import { CONFIG_DB_SCHEMA, ConfigModule } from '../config.module';

function expectValidate(schema: Joi.Schema, value: any) {
  return expect(schema.validate(value, { abortEarly: false }).error.message);
}

describe('Schema Unit test', () => {
  describe('DB SCHEMA', () => {
    const schema = Joi.object({
      ...CONFIG_DB_SCHEMA,
    });

    describe('DB CONNECTION', () => {
      it('invalid cases - required', () => {
        expectValidate(schema, {}).toContain('is required');
      });
      test('invalid cases - when values is not mysql | sqlite', () => {
        expectValidate(schema, { DB_CONNECTION: 'fake' }).toContain(
          'must be one of [mysql, sqlite]',
        );
      });

      test('valid cases', () => {
        const arrange = ['mysql', 'sqlite'];

        arrange.forEach((item) => {
          expectValidate(schema, { DB_CONNECTION: item }).not.toContain(
            'DB_CONNECTION',
          );
        });
      });
    });

    describe('DB HOST', () => {
      it('invalid cases - required', () => {
        expectValidate(schema, {}).toContain('is required');

        expectValidate(schema, {
          DB_HOST: 1,
        }).toContain('"DB_HOST" must be a string');
      });

      test('valid cases', () => {
        const arrange = ['some value'];

        arrange.forEach((item) => {
          expectValidate(schema, {
            DB_HOST: item,
          }).not.toContain('DB_HOST');
        });
      });
    });

    describe('DB DATABASE', () => {
      it('invalid cases - required', () => {
        expectValidate(schema, { DB_CONNECTION: 'mysql' }).toContain(
          'is required',
        );
        expectValidate(schema, { DB_CONNECTION: 'sqlite' }).toContain(
          'is required',
        );

        expectValidate(schema, {
          DB_DATABASE: 1,
        }).toContain('"DB_DATABASE" must be a string');
      });

      test('valid cases', () => {
        const arrange = [
          { DB_CONNECTION: 'sqlite' },
          { DB_CONNECTION: 'sqlite', DB_DATABASE: 'some value' },
          { DB_CONNECTION: 'mysql', DB_DATABASE: 'some value' },
        ];

        arrange.forEach((item) => {
          expectValidate(schema, {
            DB_HOST: item,
          }).not.toContain('DB_DATABASE');
        });
      });
    });

    describe('DB USER', () => {
      it('invalid cases - required', () => {
        expectValidate(schema, { DB_CONNECTION: 'mysql' }).toContain(
          'is required',
        );
        expectValidate(schema, { DB_CONNECTION: 'sqlite' }).toContain(
          'is required',
        );

        expectValidate(schema, {
          DB_USER: 1,
        }).toContain('"DB_USER" must be a string');
      });

      test('valid cases', () => {
        const arrange = [
          { DB_CONNECTION: 'sqlite' },
          { DB_CONNECTION: 'sqlite', DB_USER: 'some value' },
          { DB_CONNECTION: 'mysql', DB_USER: 'some value' },
        ];

        arrange.forEach((item) => {
          expectValidate(schema, {
            item,
          }).not.toContain('DB_USER');
        });
      });
    });

    describe('DB PASSWORD', () => {
      it('invalid cases - required', () => {
        expectValidate(schema, { DB_CONNECTION: 'mysql' }).toContain(
          'is required',
        );
        expectValidate(schema, { DB_CONNECTION: 'sqlite' }).toContain(
          'is required',
        );

        expectValidate(schema, {
          DB_PASSWORD: 1,
        }).toContain('"DB_PASSWORD" must be a string');
      });

      test('valid cases', () => {
        const arrange = [
          { DB_CONNECTION: 'sqlite' },
          { DB_CONNECTION: 'sqlite', DB_PASSWORD: 'some value' },
          { DB_CONNECTION: 'mysql', DB_PASSWORD: 'some value' },
        ];

        arrange.forEach((item) => {
          expectValidate(schema, {
            item,
          }).not.toContain('DB_PASSWORD');
        });
      });
    });
    describe('DB PORT', () => {
      it('invalid cases - required', () => {
        expectValidate(schema, { DB_CONNECTION: 'mysql' }).toContain(
          'is required',
        );
        expectValidate(schema, { DB_CONNECTION: 'sqlite' }).toContain(
          'is required',
        );

        expectValidate(schema, {
          DB_PORT: 'some value',
        }).toContain('"DB_PORT" must be a number');
      });

      test('valid cases', () => {
        const arrange = [
          { DB_CONNECTION: 'sqlite' },
          { DB_CONNECTION: 'sqlite', DB_PORT: 123 },
          { DB_CONNECTION: 'mysql', DB_PASSWORD: 321 },
        ];

        arrange.forEach((item) => {
          expectValidate(schema, {
            item,
          }).not.toContain('DB_PORT');
        });
      });
    });

    describe('DB LOGGING', () => {
      it('invalid cases - required', () => {
        expectValidate(schema, { DB_CONNECTION: 'mysql' }).toContain(
          'is required',
        );
        expectValidate(schema, { DB_CONNECTION: 'sqlite' }).toContain(
          'is required',
        );

        expectValidate(schema, {
          DB_LOGGING: 'some value',
        }).toContain('"DB_LOGGING" must be a boolean');
      });

      test('valid cases', () => {
        const arrange = [true, false];

        arrange.forEach((item) => {
          expectValidate(schema, {
            DB_LOGGING: item,
          }).not.toContain('DB_LOGGING');
        });
      });
    });
    describe('DB AUTO LOAD MODELS', () => {
      it('invalid cases - required', () => {
        expectValidate(schema, { DB_CONNECTION: 'mysql' }).toContain(
          'is required',
        );
        expectValidate(schema, { DB_CONNECTION: 'sqlite' }).toContain(
          'is required',
        );

        expectValidate(schema, {
          DB_AUTO_LOAD_MODELS: 'some value',
        }).toContain('"DB_AUTO_LOAD_MODELS" must be a boolean');
      });

      test('valid cases', () => {
        const arrange = [true, false];

        arrange.forEach((item) => {
          expectValidate(schema, {
            DB_AUTO_LOAD_MODELS: item,
          }).not.toContain('DB_AUTO_LOAD_MODELS');
        });
      });
    });
  });
});

describe('config module unit test', () => {
  it('should throw an error when env vars are invalid', () => {
    try {
      Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            envFilePath: join(__dirname, '.env.fake'),
          }),
        ],
      });
      fail('ConfigModule should throw an error when env vars are invalid');
    } catch (e) {}
  });

  it('should be valid', () => {
    const module = Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
    });

    expect(module).toBeDefined();
  });
});
