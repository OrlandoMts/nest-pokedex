export interface ConfigItf {
  environment: string;
  mongodb: string;
  port: number;
  defaultLimit: number;
}

export const EnvConfiguration = (): ConfigItf => ({
  environment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB,
  port: +process.env.PORT || 3000,
  defaultLimit: +process.env.DEFAULT_LIMIT || 20,
});
