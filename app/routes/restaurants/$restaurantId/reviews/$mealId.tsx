import { Combobox } from "@headlessui/react";
import { Profile } from "@prisma/client";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { useActionData, useLoaderData, useParams } from "@remix-run/react";
import React from "react";
import {
  createReview,
  getMealById,
  getProfileByFirstLast,
  getProfiles,
  getRestaurantById,
} from "~/services";

type ActionData =
  | {
      reviewBody: null | string;
      numStars: null | string;
      meal: null | string;
      profile: null | string;
    }
  | undefined;
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const vals = formData.values();
  const entries = formData.entries();
  for (let value of vals) console.log("value " + value);
  for (let entry of entries) console.log("entry " + entry);
  const reviewBody = formData.get("reviewBody") as string;
  const numStars = formData.get("numStars") as string;
  const mealId = formData.get("mealId") as string;
  const profileId = formData.get("profileId") as string;

  console.log({
    reviewBody,
    numStars,
    mealId,
    profileId,
  });

  const errors: ActionData = {
    reviewBody: reviewBody ? null : "The review is required",
    numStars: numStars ? null : "The number of stars is required",
    meal: mealId ? null : "The meal to be reviewed is required",
    profile: profileId ? null : "YOU are required!!",
  };

  const hasErrors = Object.values(errors).some((emsg) => emsg);

  if (hasErrors) {
    return json<ActionData>(errors);
  }

  await createReview({
    reviewBody,
    numStars,
    mealId,
    profileId,
  });

  return redirect("/");
};

type LoaderData = {
  meal: Awaited<ReturnType<typeof getMealById>>;
  restaurant: Awaited<ReturnType<typeof getRestaurantById>>;
  me: Awaited<ReturnType<typeof getProfileByFirstLast>>;
  people: Awaited<ReturnType<typeof getProfiles>>;
};
export const loader: LoaderFunction = async ({ params }) => {
  const { mealId } = params;
  const meal = await getMealById(mealId as string);
  const me = await getProfileByFirstLast("Jared", "Jewell");
  const people = await getProfiles();
  const restaurant = await getRestaurantById(meal!.restaurantId);
  return json<LoaderData>({ meal, restaurant, me, people });
};

export default function NewReview() {
  const errors = useActionData() as ActionData;
  const { meal, restaurant, me, people } = useLoaderData() as LoaderData;
  return (
    <div className="text-gray-700">
      <div className="md:grid md:grid-cols-4 md:gap-6">
        <div className="md:col-span-1"></div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium pb-2 leading-6 text-gray-900">
              Add your review
            </h3>
          </div>
          <form action="#" method="POST">
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-3 sm:col-span-2">
                    {errors?.profile && (
                      <em className="text-red-600">{errors.profile}</em>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="restaurant"
                    className="block text-md font-medium text-gray-700"
                  >
                    Restaurant
                  </label>
                  <div className="mt-1">
                    <input
                      id="restaurantName"
                      disabled={true}
                      // type="hidden"
                      value={`${restaurant?.name} - ${restaurant?.city}`}
                      className="shadow-sm px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mt-1">
                    <input
                      id="restaurantId"
                      type="hidden"
                      name="restaurantId"
                      value={restaurant?.id}
                      className="shadow-sm px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder={`${restaurant?.name} - ${restaurant?.city}`}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="mealName"
                    className="block text-md font-medium text-gray-700"
                  >
                    {errors?.meal && (
                      <em className="text-red-600">{errors.meal}</em>
                    )}
                    Meal
                  </label>
                  <div className="mt-1">
                    <input
                      id="mealName"
                      disabled={true}
                      name="mealName"
                      value={meal?.name}
                      className="shadow-sm px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder="Tacos"
                      defaultValue={""}
                    />
                    <input
                      id="mealId"
                      type="hidden"
                      name="mealId"
                      value={meal?.id}
                      className="shadow-sm px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="mt-1 flex-col rounded-md shadow-sm">
                  <label
                    htmlFor="restaurant"
                    className="block text-md font-medium text-gray-700"
                  >
                    Reviewer
                  </label>
                  <input
                    type="text"
                    name="profileId"
                    id="profileId"
                    list="peopleList"
                    className={
                      "shadow-sm px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                    }
                  />
                  <datalist id="peopleList">
                    {people.map(({ id, firstname, lastname }) => (
                      <option
                        key={id}
                        value={id}
                        label={`${firstname} ${lastname}`}
                      >
                        `${firstname} ${lastname}`
                      </option>
                    ))}
                  </datalist>

                  {/* <input */}
                  {/*   type="hidden" */}
                  {/*   name="profileId" */}
                  {/*   id="profileId" */}
                  {/*   value={me?.id} */}
                  {/*   className="focus:ring-indigo-500 focus:border-indigo-500 px-2  py-1 flex-1 block w-full rounded-md rounded-r-md sm:text-sm border-gray-300" */}
                  {/*   placeholder="McDevitt Taco Supply" */}
                  {/* /> */}
                </div>
                <div>
                  <label
                    htmlFor="reviewBody"
                    className="block text-md font-medium text-gray-700"
                  >
                    {errors?.reviewBody && (
                      <em className="text-red-600">{errors.reviewBody}</em>
                    )}
                    Review
                  </label>
                  <div className="mt-1">
                    <input
                      id="reviewBody"
                      name="reviewBody"
                      className="shadow-sm px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder="It was just so good!!!!"
                      defaultValue={""}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="numStars"
                    className="block text-md font-medium text-gray-700"
                  >
                    {errors?.numStars && (
                      <em className="text-red-600">{errors.numStars}</em>
                    )}
                    Number of Stars
                  </label>
                  <div className="mt-1">
                    <input
                      id="numStars"
                      name="numStars"
                      className="shadow-sm px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                      type="number"
                      min="1"
                      max="5"
                    />
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 sm:px-6">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
