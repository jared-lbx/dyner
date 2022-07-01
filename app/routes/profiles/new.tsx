import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createProfile } from "~/services";

type ActionData =
  | {
      first: null | string;
      last: null | string;
      position: null | string;
    }
  | undefined;
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const firstname = formData.get("first") as string;
  const lastname = formData.get("last") as string;
  const position = formData.get("position") as string;

  const errors: ActionData = {
    first: firstname ? null : "First name is required",
    last: lastname ? null : "Last name is required",
    position: position ? null : "Position is required",
  };

  const hasErrors = Object.values(errors).some((emsg) => emsg);

  if (hasErrors) {
    return json<ActionData>(errors);
  }

  await createProfile({ firstname, lastname, position });

  return redirect("/profiles");
};

export default function NewUser() {
  const inputClassName = `w-full rounded border bg-white border-gray-500 px-2 text-black py-1 text-md`;
  const errors = useActionData() as ActionData;
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-lg font-medium text-indigo-700">Create a new user</h1>
      <Form
        method="post"
        className="flex flex-col items-start justify-start gap-2"
      >
        <div className="flex flex-row gap-1">
          <p>
            <label className="text-gray-800">
              First name
              {errors?.first && (
                <em className="text-red-600">{errors.first}</em>
              )}
              <input type="text" name="first" className={inputClassName} />
            </label>
          </p>
          <p>
            <label className="text-gray-800">
              Last name
              {errors?.last && <em className="text-red-600">{errors.last}</em>}
              <input type="text" name="last" className={inputClassName} />
            </label>
          </p>
        </div>
        <div className="flex flex-row gap-1">
          <p>
            <label className="text-gray-800">
              Position
              {errors?.position && (
                <em className="text-red-600">{errors.position}</em>
              )}
              <input type="text" name="position" className={inputClassName} />
            </label>
          </p>
        </div>
        <p className="text-right">
          <button
            type="submit"
            className="rounded bg-indigo-700 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          >
            Create Profile
          </button>
        </p>
      </Form>
    </div>
  );
}
