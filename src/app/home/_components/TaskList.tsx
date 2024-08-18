"use client";

import { api } from "~/trpc/react";

import { BadgeInfo, Check, Clock, MoreVertical, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { EmptyState } from "~/app/_components/EmptyState";
import clsx from "clsx";
import moment from "moment";

const TaskListItem: React.FC<{
  title: string;
  isDone: boolean;
  id: number;
}> = (props) => {
  const utils = api.useUtils();
  const { mutate: changeStatus, isPending: isChangingStatus } =
    api.task.changeStatus.useMutation({
      async onSuccess() {
        await utils.task.getAll.invalidate();
      },

      onError() {
        toast("Failed to change the status", {
          type: "error",
        });
      },
    });
  const { mutate: deleteTask, isPending: isDeleting } =
    api.task.delete.useMutation({
      async onSuccess() {
        await utils.task.getAll.invalidate();
      },

      onError() {
        toast("Failed to delete the task", {
          type: "error",
        });
      },
    });

  const handleStatusChange = () => {
    changeStatus({
      id: props.id,
      isDone: !props.isDone,
    });
  };

  const handleDelete = () => {
    deleteTask({
      id: props.id,
      isDone: !props.isDone,
    });
  };

  return (
    <div
      className={clsx(
        "flex flex-col gap-2 rounded-box p-4",
        props.isDone ? "bg-base-200" : "bg-neutral text-neutral-content",
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className="min-w-24 font-semibold focus:outline-none"
          contentEditable
        >
          {props.title}
        </span>

        <details className="dropdown">
          <summary className="btn btn-ghost btn-sm m-1 -translate-y-1">
            <MoreVertical className="w-4" />
          </summary>
          <ul className="menu dropdown-content z-10 w-52 -translate-x-1/2 rounded-box bg-base-100 p-2 text-base-content shadow">
            <li>
              <button
                disabled={isDeleting}
                className="text-error"
                onClick={handleDelete}
              >
                {isDeleting ? (
                  <div className="loading loading-spinner loading-sm"></div>
                ) : (
                  "Delete"
                )}
              </button>
            </li>
          </ul>
        </details>
      </div>

      <div className="flex justify-end gap-2">
        <button className="btn btn-ghost btn-sm">
          <Clock className="w-4" />
        </button>
        <button className="btn btn-ghost btn-sm" onClick={handleStatusChange}>
          {isChangingStatus && (
            <div className="loading loading-spinner loading-xs"></div>
          )}
          {!isChangingStatus &&
            (!props.isDone ? (
              <>
                <Check className="w-4" />
              </>
            ) : (
              <>
                <X className="w-4" /> Move back
              </>
            ))}
        </button>
        {!props.isDone && (
          <button className="btn btn-ghost btn-sm">
            <BadgeInfo className="w-4" /> Details
          </button>
        )}
      </div>
    </div>
  );
};

export const TaskList: React.FC = () => {
  const startDate = useMemo(() => {
    let day = moment();
    if (moment().hour() < 4) {
      day = moment().subtract(1, "days");
    }
    return day.startOf("day").add(4, "hours").toDate();
  }, []);
  const endDate = useMemo(() => {
    let day = moment();
    if (moment().hour() < 4) {
      day = moment().subtract(1, "days");
    }
    return day.endOf("day").add(4, "hours").toDate();
  }, []);

  const { status, data, error } = api.task.getAll.useQuery({
    startDate,
    endDate,
  });

  const [showDone, setShowDone] = useState(false);
  const toggleShowDone = useCallback(
    () => setShowDone(!showDone),
    [setShowDone, showDone],
  );

  const doneTasks = useMemo(
    () => data?.filter((task) => task.isDone) ?? [],
    [data],
  );
  const pendingTasks = useMemo(
    () => data?.filter((task) => !task.isDone) ?? [],
    [data],
  );

  return (
    <div className="flex flex-col gap-2">
      {status === "pending" && <div>Loading...</div>}
      {status === "error" && <div>An error has ocurred: {error.message}</div>}
      {status === "success" && (
        <>
          {pendingTasks.length === 0 ? (
            <EmptyState
              title="No tasks"
              text="Get started by creating a new task."
            />
          ) : (
            pendingTasks.map((task) => (
              <TaskListItem
                key={task.id}
                id={task.id}
                title={task.title}
                isDone={task.isDone ?? false}
              />
            ))
          )}

          <button
            className="btn btn-ghost btn-sm w-fit"
            onClick={toggleShowDone}
          >
            {showDone ? "Hide done" : "Show done"}
          </button>
          {showDone &&
            (doneTasks.length === 0 ? (
              <EmptyState
                title="No done tasks"
                text="Start by getting some work done"
              />
            ) : (
              doneTasks.map((task) => (
                <TaskListItem
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  isDone={task.isDone ?? false}
                />
              ))
            ))}
        </>
      )}
    </div>
  );
};
