import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import 'reflect-metadata';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import winston from 'winston';
import TransformInterceptor from '@common/interceptors/transform.interceptor';
import { ConfigService } from '@nestjs/config';
import CloudWatchTransport from 'winston-cloudwatch'; // NOTE : CLOUD WATCH LOGGING
import { IAppEnv, ILogEnv } from '@config/index';
import GlobalExceptionFilter from '@common/filters/global_exception.filter';

process.env.PACKAGE_NAME = process.env.npm_package_name || 'ql.gl';
process.env.PACKAGE_DESCRIPTION = process.env.npm_package_description || 'https://ql.gl';
process.env.NODE_ENV = (process.env.NODE_ENV || 'development').trim().toLowerCase();
process.env.TZ = 'Asia/Seoul';
process.env.VERSION = `v${process.env.npm_package_version || process.env.APP_VERSION || '0.0.0'}`;
process.on('SIGINT', () => {
  console.warn('\nGracefully shutting down from SIGINT (Ctrl-C)');
  process.exit(0);
})

const IS_PRODUCTION: boolean = process.env.NODE_ENV === 'production';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  const config = app.get(ConfigService);

  const appConfig = config.get<IAppEnv>('app')!;
  const logConfig = config.get<ILogEnv>('log')!;


  const transports: [winston.transport] = [
    new winston.transports.Console({
      level: logConfig.level,
      format: winston.format.combine(
        winston.format.timestamp({ format: 'MM-DD HH:mm:ss' }),
        winston.format.ms(),
        winston.format.uncolorize(),
        nestWinstonModuleUtilities.format.nestLike(
          process.env.PACKAGE_NAME || 'ql.gl',
          {
            colors: true,
            prettyPrint: true,
          }
        ),
      ),
    }),
  ];
  // NOTE : LOGGER TRANSPORTS

  if (logConfig.cloudwatch.enabled) {
    transports.push(new CloudWatchTransport({
      name: logConfig.cloudwatch.loggerName,
      level: logConfig.cloudwatch.logStreamName,
      logGroupName: logConfig.cloudwatch.awsAccessKeyId,
      logStreamName: logConfig.cloudwatch.logGroupName,
      awsAccessKeyId: logConfig.cloudwatch.awsAccessKeyId,
      awsSecretKey: logConfig.cloudwatch.awsSecretKey,
      awsRegion: 'ap-northeast-2',
      messageFormatter: (item: any) => (`${item.level}:  ${item.message} ${JSON.stringify(item.meta)}`),
    }));
    // NOTE : CLOUD WATCH LOGGING
  }

  const logger = WinstonModule.createLogger({
    format: winston.format.uncolorize(),
    transports,
  });

  app.useLogger(logger);

  app.enableShutdownHooks();
  app.enableCors({
    origin: appConfig.corsOrigin,
    credentials: true,
    methods: 'GET,POST,PATCH,DELETE,HEAD,OPTIONS',
  });
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
  app.use(cookieParser());

  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalInterceptors(new TransformInterceptor(config));
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: IS_PRODUCTION, // NOTE : disable Error When Production
    })
  );

  const documentSetting = new DocumentBuilder()
    .setTitle(appConfig.packageName)
    .setDescription(appConfig.packageDescription)
    .setVersion(process.env.VERSION || '0.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, documentSetting);
  SwaggerModule.setup('docs', app, document);


  Logger.log(`Server is running on ${appConfig.corsOrigin}`, 'Bootstrap');
  await app.listen(appConfig.port);
}

bootstrap();
