import { Module , NestModule , MiddlewareConsumer} from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import {ConfigModule, ConfigService}from '@nestjs/config';
import {TypeOrmModule}from '@nestjs/typeorm';

import {IpInfoModule}from './ip-info/ip-info.module';


import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject:[ConfigService],
      useFactory: (config : ConfigService) => ([{
        ttl: 60000, // 1 minute
        limit : 20 , // 20 requests per minute
      }]) ,
     }) ,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true, 
      synchronize: true,  
    }),
    IpInfoModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule implements NestModule{
  configure(consumer : MiddlewareConsumer){
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
