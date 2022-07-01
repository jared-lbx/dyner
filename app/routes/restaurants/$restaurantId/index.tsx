import { StarIcon } from "@heroicons/react/solid";
import { StarIcon as StarIconOpen } from "@heroicons/react/outline";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import React from "react";
import invariant from "tiny-invariant";
import { getRestaurantById } from "~/services";

type LoaderData = {
  restaurant: Awaited<ReturnType<typeof getRestaurantById>>;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { restaurantId } = params;
  invariant(restaurantId !== undefined, "must pass profileId");
  invariant(typeof restaurantId === "string", "must pass profileId");
  const restaurant = await getRestaurantById(restaurantId);
  if (!restaurant) throw new Error("couldn't find that restaurant");
  return json<LoaderData>({ restaurant });
};

// todo: add meal creation
// export const action: ActionFunction = async ({ params, request }) => {
//   const formData = await request.formData();
//   const profileId = formData.get("profileId");
//   invariant(profileId !== undefined, "must pass profileId");
//   invariant(typeof profileId === "string", "must pass profileId");
//   await deleteProfileById(profileId);
//   console.log("deleted");
//   return redirect("/profiles");
// };

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SpecificRestaurant() {
  const { restaurant } = useLoaderData() as LoaderData;
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <div className="grid grid-cols-6 h-full">
        <div className="col-span-1"></div>
        <div className="col-span-4">
          <div className="container">
            <div className="flex flex-col">
              <div className="inline-flex place-items-center gap-1">
                <h1 className="text-indigo-500 text-lg font-bold">
                  {restaurant?.name}
                </h1>
                <h3 className="text-md">- {restaurant?.city}</h3>
              </div>
              <div className="inline-flex justify-start items-center gap-2">
                <span className="flex-shrink-0 inline-block px-2 pt-0.5 text-indigo-800 text-xs font-medium bg-indigo-100 rounded-full items-center justify-center">
                  {restaurant?.cuisine}
                </span>
              </div>
            </div>
            {!restaurant?.meals.length ? (
              <h3 className="py-4">
                No meals have been added for this restaurant yet.
              </h3>
            ) : (
              <>
                <h3 className="text-md pt-4">Meals</h3>
                <ul className=" mt-2">
                  {restaurant.meals.map((meal, ind) => {
                    const avg = meal.Review.length
                      ? meal.Review.reduce((p, c) => p + c.numStars, 0) /
                        restaurant.meals.length
                      : null;
                    let stars = [];
                    if (avg) {
                      for (let i = 0; i < avg; i++) {
                        stars.push(
                          <StarIcon className="w-4 h-4 text-yellow-600" />
                        );
                      }
                    }
                    return (
                      <Link
                        to={`reviews/${meal.id}`}
                        key={ind}
                        className=" pl-2 py-4 my-2 group animate transition-all"
                      >
                        <div className="inline-flex flex-grow place-items-end justify-start items-center h-full py-4 gap-3 w-full">
                          <h3 className="text-sm group-hover:text-indigo-600 animate transition-all w-32">
                            {meal.name}
                          </h3>
                          {/* <p>|</p> */}
                          <p className="text-xs text-gray-400 italic w-64 pl-2 border-l-2 h-full">
                            {meal.description}
                          </p>
                          {stars.length ? (
                            <span className="inline-flex">
                              {stars.map((s) => s)}
                            </span>
                          ) : (
                            <div className="justify-self-end">
                              {
                                <span className="inline-flex place-items-center">
                                  <StarIconOpen className="w-4 h-4 text-gray-900" />
                                  <StarIconOpen className="w-4 h-4 text-gray-900" />
                                  <StarIconOpen className="w-4 h-4 text-gray-900" />
                                  <StarIconOpen className="w-4 h-4 text-gray-900" />
                                  <StarIconOpen className="w-4 h-4 text-gray-900" />
                                </span>
                              }
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </ul>
              </>
            )}
            <Link
              to="meal/new"
              className="text-sm  mt-2 py-1 px-1 bg-indigo-600 rounded-md flex w-24 justify-center items-center place-items-center"
            >
              Add a meal
            </Link>
          </div>
        </div>
        <div className="col-span-1"></div>
      </div>
    </>
  );
}
