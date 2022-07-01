import { ActionFunction, json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { createMealByRestaurant, createRestaurant } from "~/services";

type ActionData =
  | {
      name: null | string;
      description: null | string;
    }
  | undefined;
export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const { restaurantId } = params;

  const errors: ActionData = {
    name: name ? null : "Name is required",
    description: description ? null : "Description is required",
  };

  const hasErrors = Object.values(errors).some((emsg) => emsg);

  if (hasErrors) {
    return json<ActionData>(errors);
  }

  await createMealByRestaurant(name, description, restaurantId as string);

  return redirect(`/restaurants/${restaurantId}`);
};

export default function NewRestaurant() {
  const inputClassName = `w-full rounded border bg-gray-800 border-gray-500 px-2 py-1 text-md`;
  const errors = useActionData() as ActionData;
  return (
    <div className="text-gray-800">
      <div className="md:grid md:grid-cols-4 md:gap-6">
        <div className="md:col-span-1"></div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium pb-2 leading-6 text-gray-900">
              New Meal
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
                        className="shadow-sm px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                        placeholder="Slork Taco"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-md font-medium text-gray-700"
                  >
                    {errors?.description && (
                      <em className="text-red-600">{errors.description}</em>
                    )}
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      className="shadow-sm px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder="I mean. Gosh. It was just good. What can I say."
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
