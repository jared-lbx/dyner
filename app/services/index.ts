import { db } from "~/utils/db.server";

export const getProfiles = async () => {
  return await db.profile.findMany();
};

export const getProfileById = async (profileId: string | number) => {
  let id = typeof profileId === "number" ? profileId : parseInt(profileId);
  return await db.profile.findUnique({ where: { id } });
};

export const getProfileByFirstLast = async (first: string, last: string) => {
  return await db.profile.findFirst({
    where: { firstname: first, lastname: last },
  });
};

export const getMealById = async (mealId: string | number) => {
  let id = typeof mealId === "number" ? mealId : parseInt(mealId);
  return await db.meal.findUnique({ where: { id } });
};

export const addReviewToMeal = async ({
  reviewBody,
  numStars,
  mealId,
  profileId,
}: {
  reviewBody: string;
  numStars: number;
  mealId: string | number;
  profileId: string | number;
}) => {
  let profileIdParsed =
    typeof profileId === "number" ? profileId : parseInt(profileId);
  let mealIdParsed = typeof mealId === "number" ? mealId : parseInt(mealId);
  return await db.review.create({
    data: {
      profileId: profileIdParsed,
      numStars,
      reviewBody,
      mealId: mealIdParsed,
    },
  });
};

export const createMealByRestaurant = async (
  name: string,
  description: string,
  restaurantId: string | number
) => {
  let id =
    typeof restaurantId === "number" ? restaurantId : parseInt(restaurantId);
  return await db.meal.create({
    data: { description, name, restaurantId: id },
  });
};

export const deleteProfileById = async (profileId: string | number) => {
  let id = typeof profileId === "number" ? profileId : parseInt(profileId);
  return await db.profile.delete({ where: { id } });
};

export const getRestaurants = async () => {
  return await db.restaurant.findMany({
    include: { meals: { include: { Review: true } } },
  });
};
export const getRestaurantById = async (restaurantId: string) => {
  let id =
    typeof restaurantId === "number" ? restaurantId : parseInt(restaurantId);
  return await db.restaurant.findUnique({
    where: { id },
    include: { meals: { include: { Review: true } } },
  });
};

export const getReviewsByProfile = async (profileId: string | number) => {
  let id = typeof profileId === "number" ? profileId : parseInt(profileId);
  return await db.review.findMany({
    where: { profileId: id },
    include: { meal: { include: { restaurant: true } } },
  });
};

export const getReviewsByMeal = async (mealId: string | number) => {
  let id = typeof mealId === "number" ? mealId : parseInt(mealId);
  return await db.review.findMany({ where: { mealId: id } });
};

export const createProfile = async ({
  firstname,
  lastname,
  position,
}: {
  firstname: string;
  lastname: string;
  position: string;
}) => {
  const exists = await db.profile.findFirst({ where: { firstname, lastname } });
  if (exists) throw new Error("profile already exists");
  return await db.profile.create({ data: { firstname, lastname, position } });
};

export const createRestaurant = async ({
  name,
  cuisine,
  city,
}: {
  name: string;
  cuisine: string;
  city: string;
}) => {
  const restaurant = await db.restaurant.create({
    data: {
      cuisine,
      name,
      city,
    },
  });
  return restaurant;
};

export const createReview = async ({
  profileId,
  mealId,
  reviewBody,
  numStars,
}: {
  profileId: number | string;
  mealId: number | string;
  reviewBody: string;
  numStars: number | string;
}) => {
  let id = typeof mealId === "number" ? mealId : parseInt(mealId);
  let profileIdParsed =
    typeof profileId === "number" ? profileId : parseInt(profileId);
  let mealIdParsed = typeof mealId === "number" ? mealId : parseInt(mealId);
  let numStarsParsed =
    typeof numStars === "number" ? numStars : parseInt(numStars);
  const review = await db.review.create({
    data: {
      reviewBody,
      numStars: typeof numStars === "number" ? numStars : parseInt(numStars),
      mealId: mealIdParsed,
      profileId: profileIdParsed,
    },
  });

  // await db.profile.update({
  //   data: {
  //     reviews: { connect: { id: review.id } },
  //   },
  // });
  return review;
};

export const getReviews = async () => {
  return await db.review.findMany({
    include: { meal: { include: { restaurant: true } }, profile: true },
  });
};
