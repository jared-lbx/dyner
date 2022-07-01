import { TrashIcon } from "@heroicons/react/outline";
import { StarIcon } from "@heroicons/react/solid";
import { Meal, Profile, Review } from "@prisma/client";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { MdEmojiFoodBeverage } from "react-icons/md";
import invariant from "tiny-invariant";
import {
  deleteProfileById,
  getProfileById,
  getReviewsByProfile,
} from "~/services";

type LoaderData = {
  profile: Awaited<ReturnType<typeof getProfileById>>;
  reviews: Awaited<ReturnType<typeof getReviewsByProfile>>;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { profileId } = params;
  invariant(profileId !== undefined, "must pass profileId");
  invariant(typeof profileId === "string", "must pass profileId");
  const profile = await getProfileById(profileId);
  const reviews = await getReviewsByProfile(profileId).then((rs) =>
    rs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  );
  if (!profile) throw new Error("couldn't find that profile");
  return json<LoaderData>({ profile, reviews });
};

export const action: ActionFunction = async ({ params, request }) => {
  const formData = await request.formData();
  const profileId = formData.get("profileId");
  invariant(profileId !== undefined, "must pass profileId");
  invariant(typeof profileId === "string", "must pass profileId");
  await deleteProfileById(profileId);
  return redirect("/profiles");
};

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SpecificProfile() {
  const { profile, reviews } = useLoaderData() as LoaderData;
  const { firstname, lastname, position } = profile as Profile;
  return (
    <div className="flex flex-col">
      <div className="flex flex-row place-items-center gap-1">
        <h2 className="text-indigo-500 text-lg font-bold">
          {firstname} {lastname}
        </h2>
        <h3 className="text-gray-800 text-sm"> - {position}</h3>
        <Form className="inline-flex place-items-center" method="delete">
          <button
            className="hover:text-red-500 animate transition-all"
            name="profileId"
            value={profile?.id}
          >
            <TrashIcon className="h-6 w-4 text-gray-700" />
          </button>
        </Form>
      </div>
      {!reviews.length ? (
        <h3 className="text-gray-500 text-md italic">
          This user hasn't added any reviews yet. Scoundrel!
        </h3>
      ) : (
        <>
          <h2 className="pt-4 text-md text-gray-800">Reviews</h2>
          <div className="grid grid-cols-1 gap-2 pb-4">
            {reviews.map((review, ind) => (
              <li
                key={review.id}
                className="rounded-md list-none relative bg-white py-5 px-4 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
              >
                <div className="flex justify-between space-x-3">
                  <div className="min-w-0 flex-1">
                    <span className="block focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm  text-gray-900 truncate inline-flex gap-1">
                        <span className="font-bold">{review.meal?.name}</span>
                        <span>from</span>
                        <Link
                          to={`/restaurants/${review.meal.restaurant.id}`}
                          className="italic text-indigo-700"
                        >
                          {review.meal?.restaurant.name}
                        </Link>
                      </p>
                      <div className="flex flex-row justify-start items-center">
                        {getStars(review.numStars).map((s) => s)}
                      </div>
                    </span>
                  </div>
                  <time
                    dateTime={new Date(review.createdAt).toLocaleString()}
                    className="flex-shrink-0 whitespace-nowrap text-xs text-gray-500"
                  >
                    {new Date(review.createdAt).toLocaleString()}
                  </time>
                </div>
                <div className="mt-1">
                  <p className="line-clamp-2 text-sm text-gray-600">
                    {review.reviewBody}
                  </p>
                </div>
              </li>
            ))}
          </div>
          <h2 className="pt-5 text-md text-gray-800">Restaurants Visited</h2>
          <div className="grid grid-cols-2">
            {reviews.map((review, ind) => (
              <li
                key={ind}
                className="bg-white flex flex-col items-start justify-start flex-shrink max-w-xs rounded-md p-4"
              >
                <div className="flex flex-row justify-center items-center gap-2">
                  <h3 className="text-gray-900 text-md font-medium truncate">
                    {review.meal?.restaurant.name}
                  </h3>
                  <h3 className="text-gray-700 text-sm truncate">
                    {review.meal?.restaurant.city}
                  </h3>
                </div>
                <span className="flex-shrink-0 inline-block px-1 py-0.5 text-indigo-800 text-xs font-medium bg-indigo-100 rounded-full">
                  {review.meal?.restaurant.cuisine}
                </span>
              </li>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
function getStars(numStars: number) {
  let stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push(<StarIcon className="w-4 h-4 text-yellow-600" />);
  }
  return stars;
}
