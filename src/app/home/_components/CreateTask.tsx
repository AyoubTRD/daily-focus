"use client";

import clsx from "clsx";
import { type FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { api } from "~/trpc/react";

export function CreateTask() {
  const [title, setTitle] = useState("");

  const utils = api.useUtils();

  const { mutate: createTask, isPending: isCreatingTask } =
    api.task.create.useMutation({
      onError(error) {
        toast("Failed to create the task " + error.message, {
          type: "error",
        });
      },
      async onSuccess() {
        setTitle("");

        await utils.task.getAll.invalidate();
      },
    });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!title) throw new Error("No title");

    createTask({
      title,
    });
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <label
        className={clsx(
          "label input input-bordered flex items-center gap-2",
          isCreatingTask && "input-disabled",
        )}
      >
        <input
          disabled={isCreatingTask}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="New task"
          className="grow"
        />

        <kbd className="kbd kbd-sm">N</kbd>
      </label>
    </form>
  );
}
