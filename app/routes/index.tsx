import { ChatAltIcon, PlusIcon } from "@heroicons/react/outline";
import { GiFruitBowl } from "react-icons/gi";
import { json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { getReviews } from "~/services";
import { StarIcon } from "@heroicons/react/solid";

type LoaderData = {
  reviews: Awaited<ReturnType<typeof getReviews>>;
};

export const loader: LoaderFunction = async () => {
  const reviews = await getReviews().then((rs) => {
    return rs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  });

  return json<LoaderData>({ reviews });
};

/*
 * forgive me
 */
function getAgo(d: Date) {
  let ago =
    parseInt(
      DateTime.fromJSDate(new Date(d)).diffNow("hours").hours.toPrecision(2)
    ) * -1;
  console.log(ago);
  if (ago < 1) {
    let ago =
      parseInt(
        DateTime.fromJSDate(new Date(d))
          .diffNow("minutes")
          .minutes.toPrecision(2)
      ) * -1;
    return `${ago} minutes ago`;
  } else {
    let ago =
      parseInt(
        DateTime.fromJSDate(new Date(d)).diffNow("hours").hours.toPrecision(2)
      ) * -1;
    if (ago < 24) {
      return `${ago} hour${ago > 1 ? "s" : ""} ago`;
    } else {
      let ago =
        parseInt(
          DateTime.fromJSDate(new Date(d)).diffNow("hours").days.toPrecision(2)
        ) * -1;
      return `${ago} days ago`;
    }
  }
}

export default function Index() {
  const { reviews } = useLoaderData() as LoaderData;

  return (
    <div className="flow-root p-4">
      <h1 className="inline-flex place-items-center text-xl text-indigo-400 font-bold gap-1">
        <GiFruitBowl />
        Feed
      </h1>
      {!reviews.length && (
        <h3 className="text-gray-300">
          No reviews have been posted yet. Go change that!
        </h3>
      )}
      <ul className="-mb-8 py-2">
        {reviews.map((review, reviewIndex) => (
          <li key={review.id}>
            <div className="relative pb-8">
              {reviewIndex !== reviews.length - 1 ? (
                <span
                  className="absolute top-7 left-5 -ml-px pb-2 h-5/6 w-0.5 bg-indigo-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3 mt-4">
                <>
                  <ChatAltIcon
                    className="h-6 w-6 text-indigo-400"
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm">
                        <Link
                          to={`/profiles/${review.profile.id}`}
                          className="font-medium text-indigo-400 text-md"
                        >
                          {`${review.profile.firstname} ${review.profile.lastname}`}
                        </Link>
                      </div>
                      <div className="text-sm inline-flex gap-1 place-items-end">
                        <span className="text-indigo-200">
                          {review.meal?.name}
                        </span>
                        -
                        <span className="text-xs italic">
                          <Link
                            to={`/restaurants/${review.meal?.restaurant.id}`}
                          >
                            {review.meal?.restaurant.name},{" "}
                            {review.meal?.restaurant.city}
                          </Link>
                        </span>{" "}
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500 flex flex-row">
                        {getStars(review.numStars).map((s) => s)}left{" "}
                        {getAgo(review.createdAt)}
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-200 italic">
                      <p>"{review.reviewBody}"</p>
                    </div>
                  </div>
                </>
              </div>
            </div>
          </li>
        ))}
      </ul>
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
