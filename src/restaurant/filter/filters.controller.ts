import { Controller, Get } from '@nestjs/common';
import { FiltersService } from './filters.service';

@Controller('restaurant/filters')
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Get('cuisine-types')
  async getCuisineTypes() {
    const cuisineTypes = await this.filtersService.getCuisineTypes();
    return { cuisineTypes };
  }
}
