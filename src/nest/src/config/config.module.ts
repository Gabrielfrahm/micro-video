import { DynamicModule, Module } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigModuleOptions,
  ConfigService,
} from '@nestjs/config';
import { join } from 'path';
import * as Joi from 'joi';

export type DB_SCHEMA_TYPE = {
  DB_CONNECTION: 'mysql' | 'sqlite';
  DB_HOST: string;
  DB_DATABASE: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: number;
  DB_LOGGING: boolean;
  DB_AUTO_LOAD_MODELS: boolean;
};

export const CONFIG_DB_SCHEMA: Joi.StrictSchemaMap<DB_SCHEMA_TYPE> = {
  DB_CONNECTION: Joi.string().required().valid('mysql', 'sqlite'),
  DB_HOST: Joi.string().required(),
  DB_DATABASE: Joi.string().when('DB_CONNECTION', {
    is: 'mysql',
    then: Joi.required(),
  }),
  DB_USER: Joi.string().when('DB_CONNECTION', {
    is: 'mysql',
    then: Joi.required(),
  }),
  DB_PASSWORD: Joi.string().when('DB_CONNECTION', {
    is: 'mysql',
    then: Joi.required(),
  }),
  DB_PORT: Joi.number().when('DB_CONNECTION', {
    is: 'mysql',
    then: Joi.required(),
  }),
  DB_LOGGING: Joi.boolean().required(),
  DB_AUTO_LOAD_MODELS: Joi.boolean().required(),
};

export type CONFIG_SCHEMA_TYPE = DB_SCHEMA_TYPE;

@Module({})
export class ConfigModule extends NestConfigModule {
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    return super.forRoot({
      envFilePath: [
        ...(Array.isArray(options.envFilePath)
          ? options.envFilePath
          : [options.envFilePath]),
        join(__dirname, `../envs/.env.${process.env.NODE_ENV}`),
        join(__dirname, '../envs/.env'),
      ],
      validationSchema: Joi.object({
        ...CONFIG_DB_SCHEMA,
      }),
      ...options,
    });
  }
}
