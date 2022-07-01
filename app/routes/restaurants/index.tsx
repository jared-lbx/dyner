import { GiFruitBowl, GiHouse } from "react-icons/gi";
import { json, LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { getRestaurants, getReviews } from "~/services";
import {
  ChevronRightIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/outline";

type LoaderData = {
  restaurants: Awaited<ReturnType<typeof getRestaurants>>;
};

export const loader: LoaderFunction = async () => {
  const restaurants = await getRestaurants();
  return json<LoaderData>({ restaurants });
};

export default function Index() {
  const { restaurants } = useLoaderData() as LoaderData;

  return (
    <>
      <Outlet />
      <div className="flow-root p-4">
        <h1 className="inline-flex place-items-center text-xl text-indigo-400 font-bold gap-1">
          <GiHouse />
          Restaurants
        </h1>
        <ul className="grid grid-cols-2 gap-6">
          {restaurants.map((restaurant, restaurantIndex) => (
            <li
              key={restaurant.id}
              className="col-span-1 bg-white rounded-lg group shadow divide-y divide-indigo-400 m-2 hover:scale-105 animate transition-all"
            >
              <Link to={`${restaurant.id}`} className="">
                <div className="w-full flex flex-col items-start justify-start p-6 gap-2">
                  <div className="flex-1 truncate">
                    <div className="flex flex-col justify-start items-start">
                      <h3 className="text-gray-900 text-md font-medium truncate group-hover:text-indigo-400 animate transition-all">
                        {restaurant.name}
                      </h3>
                      <h3 className="text-gray-700 text-sm font-medium truncate">
                        {restaurant.city}
                      </h3>
                    </div>
                  </div>
                  <span className="flex-shrink-0 inline-block px-2 py-1 text-indigo-800 text-xs font-medium bg-indigo-100 rounded-full group-hover:scale-105 animate transition-all">
                    {restaurant.cuisine}
                  </span>
                </div>
                <div>
                  <div className="-mt-px flex divide-x divide-gray-200">
                    <div className="w-0 flex-1 flex">
                      <div className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500 gap-2">
                        <span className="ml-3">View</span>
                        <ChevronRightIcon className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}

          <Link
            to={"new"}
            className="col-span-1 bg-white rounded-lg grid place-items-center shadow divide-y divide-indigo-400 m-2 group hover:scale-105 animate transition-all"
          >
            <li className="">
              <div className="flex flex-row">
                <PencilIcon
                  className="w-5 h-5 text-gray-800 group-hover:text-indigo-800 animate transition-all"
                  aria-hidden="true"
                />
                <p className="ml-3 text-gray-800 group-hover:text-indigo-800 animate transition-all">
                  Add a restaurant
                </p>
              </div>
            </li>
          </Link>
        </ul>
      </div>
    </>
  );
}
