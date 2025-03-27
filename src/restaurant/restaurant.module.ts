import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { PrismaService } from 'prisma/prisma.service';
import { FiltersModule } from './filter/filters.module';

@Module({
  imports: [FiltersModule],
  controllers: [RestaurantController],
  providers: [RestaurantService, PrismaService],
})
export class RestaurantModule {}
