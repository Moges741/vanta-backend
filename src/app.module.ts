import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { EventImagesModule } from './events/event-images/event-images.module';
import { EventStepsModule } from './events/event-steps/event-steps.module';
import { UploadsModule } from './uploads/uploads.module';
import { CategoriesModule } from './categories/categories.module';
import { AmenitiesModule } from './amenities/amenities.module';
import { LikesModule } from './likes/likes.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { CommentsModule } from './comments/comments.module';
import { RatingsModule } from './ratings/ratings.module';
import { StatsModule } from './stats/stats.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { RolesGuard } from './common/guards/roles.guard';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    EventsModule,
    EventImagesModule,
    EventStepsModule,
    UploadsModule,
    AdminModule,
    RatingsModule,
    CommentsModule,
    LikesModule,
    BookmarksModule,
    CategoriesModule,
    AmenitiesModule,
    LikesModule,
    BookmarksModule,
    CommentsModule,
    RatingsModule,
    StatsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, RolesGuard],
})
export class AppModule {}