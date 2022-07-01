import { ActionFunction, json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { createRestaurant } from "~/services";

type ActionData =
  | {
      name: null | string;
      cuisine: null | string;
      city: null | string;
    }
  | undefined;
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const cuisine = formData.get("cuisine") as string;
  const city = formData.get("city") as string;

  const errors: ActionData = {
    name: name ? null : "Name is required",
    cuisine: cuisine ? null : "Cuisine is required",
    city: city ? null : "City is required",
  };

  const hasErrors = Object.values(errors).some((emsg) => emsg);

  if (hasErrors) {
    return json<ActionData>(errors);
  }

  await createRestaurant({ name, cuisine, city });

  return redirect("/restaurants");
};

export default function NewRestaurant() {
  const inputClassName = `w-full rounded border bg-gray-800 border-gray-500 px-2 py-1 text-md`;
  const errors = useActionData() as ActionData;
  return (
    <div>
      <div className="md:grid md:grid-cols-4 md:gap-6">
        <div className="md:col-span-1"></div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium pb-2 leading-6 text-gray-900">
              New Restaurant
            </h3>
          </div>
          <form action="#" method="POST">
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-3 sm:col-span-2">
                    <label
                      htmlFor="name"
                      className="block text-md font-medium text-gray-700"
                    >
                      {errors?.name && (
                        <em className="text-red-600">{errors.name}</em>
                      )}
                      Name
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="focus:ring-indigo-500 focus:border-indigo-500 px-2  py-1 flex-1 block w-full rounded-md rounded-r-md sm:text-sm border-gray-300"
                        placeholder="McDevitt Taco Supply"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="cuisine"
                    className="block text-md font-medium text-gray-700"
                  >
                    {errors?.cuisine && (
                      <em className="text-red-600">{errors.cuisine}</em>
                    )}
                    Cuisine
                  </label>
                  <div className="mt-1">
                    <input
                      id="cuisine"
                      name="cuisine"
                      className="shadow-sm px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder="Tacos"
                      defaultValue={""}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="block text-md font-medium text-gray-700"
                  >
                    {errors?.city && (
                      <em className="text-red-600">{errors.city}</em>
                    )}
                    City
                  </label>
                  <div className="mt-1">
                    <input
                      id="city"
                      name="city"
                      className="shadow-sm px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder="Boulder"
                      defaultValue={""}
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
