-- DropForeignKey
ALTER TABLE "MenuItems" DROP CONSTRAINT "MenuItems_restaurantsId_fkey";

-- DropForeignKey
ALTER TABLE "RestaurantPhotos" DROP CONSTRAINT "RestaurantPhotos_restaurantsId_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_restaurantsId_fkey";

-- DropForeignKey
ALTER TABLE "restaurantAdmins" DROP CONSTRAINT "restaurantAdmins_restaurantsId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_restaurantsId_fkey";

-- DropForeignKey
ALTER TABLE "tables" DROP CONSTRAINT "tables_restaurantsId_fkey";

-- AddForeignKey
ALTER TABLE "tables" ADD CONSTRAINT "tables_restaurantsId_fkey" FOREIGN KEY ("restaurantsId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_restaurantsId_fkey" FOREIGN KEY ("restaurantsId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_restaurantsId_fkey" FOREIGN KEY ("restaurantsId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurantAdmins" ADD CONSTRAINT "restaurantAdmins_restaurantsId_fkey" FOREIGN KEY ("restaurantsId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItems" ADD CONSTRAINT "MenuItems_restaurantsId_fkey" FOREIGN KEY ("restaurantsId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantPhotos" ADD CONSTRAINT "RestaurantPhotos_restaurantsId_fkey" FOREIGN KEY ("restaurantsId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
