import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthMiddleWare } from './middleware/auth.middleware';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models';

@Module({
  imports: [SequelizeModule.forFeature([User]), DatabaseModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleWare).forRoutes('*path')
  }
}
