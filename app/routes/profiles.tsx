import { PlusIcon } from "@heroicons/react/outline";
import { json, LoaderFunction } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { MdOutlineHdrPlus, MdPerson } from "react-icons/md";
import { GiChefToque } from "react-icons/gi";
import { getProfiles } from "~/services";
import type { Profile } from "~/utils/db.server";

type LoaderData = { profiles: Array<Profile> };

export const loader: LoaderFunction = async () => {
  const profiles = await getProfiles().then((ps) =>
    ps.sort((a, b) => -1 * a.lastname.localeCompare(b.lastname))
  );
  return json<LoaderData>({ profiles });
};

export default function Profiles() {
  const { profiles } = useLoaderData() as LoaderData;
  if (!profiles.length) {
    return <h3>Nobody has made a profile yet.</h3>;
  }
  return (
    <div className=" grid grid-cols-7 h-full overflow-hidden justify-start items-start gap-2">
      <div className="px-2 col-span-2 h-full justify-start items-start border-r-2 border-r-gray-400">
        <h2 className="text-2xl font-bold text-indigo-500 inline-flex place-items-center">
          <GiChefToque />
          <span className="text-gray-700">Connoisseurs</span>
        </h2>
        <ul className="mt-1 grid grid-cols-1 gap-2">
          {profiles.map((profile) => (
            <NavLink
              to={`${profile.id}`}
              key={profile.id}
              className="relative rounded-lg  bg-white pl-3 pr-5 py-2 shadow-md flex items-center justify-start space-x-3 group focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-pink-500 animate transition-all hover:-translate-y-1"
            >
              <div className="flex-shrink-0 bg-indigo-400">
                <MdPerson className="h-5 w-5 rounded-full" />
              </div>
              <div>
                <h3 className="text-sm font-normal text-gray-900 group-hover:text-indigo-700">
                  {profile.firstname} {profile.lastname}
                </h3>
                <p className="text-xs truncate text-gray-500">
                  {profile.position}
                </p>
              </div>
            </NavLink>
          ))}
          <NavLink
            to={`new`}
            className="relative rounded-lg  bg-white pl-3 pr-5 py-2 shadow-md flex items-center justify-start space-x-3 hover:bg-gray-100 group focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-pink-500 animate transition-all hover:-translate-y-1"
          >
            <div className="flex-shrink-0 bg-indigo-l00">
              <PlusIcon className="h-5 w-5 rounded-full" />
            </div>
            <div>
              <h3 className="text-sm font-normal text-gray-900 group-hover:text-indigo-400">
                Create a new profile
              </h3>
              <p className="text-xs truncate text-gray-500"></p>
            </div>
          </NavLink>
        </ul>
      </div>
      <div className="border-gray-600 px-4 col-span-5 flex items-start justify-start">
        <Outlet />
      </div>
    </div>
  );
}
