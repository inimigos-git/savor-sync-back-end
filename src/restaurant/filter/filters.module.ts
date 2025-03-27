import { Module } from '@nestjs/common';
import { FiltersService } from './filters.service';
import { FiltersController } from './filters.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [FiltersService, PrismaService],
  controllers: [FiltersController],
  exports: [FiltersService],
})
export class FiltersModule {}
