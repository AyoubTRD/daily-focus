import clsx from "clsx";
import {
  MoreVertical,
  Clock,
  Check,
  X,
  BadgeInfo,
  CalendarClock,
} from "lucide-react";
import moment from "moment";
import React from "react";
import { toast } from "react-toastify";
import { api } from "~/trpc/react";

export const TaskListItem: React.FC<{
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

  const { mutate: changeDate, isPending: isChangingDate } =
    api.task.changeDate.useMutation({
      onSuccess() {
        toast("Task rescheduled for tomorrow", {
          type: "success",
        });

        void utils.task.getAll.invalidate();
      },
      onError() {
        toast("Failed to change the date", {
          type: "error",
        });
      },
    });

  const handleScheduleForTomorrow = () => {
    changeDate({
      taskId: props.id,
      newDate: moment().add(1, "days").toDate(),
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
        <div className="tooltip" data-tip="Set time">
          <button className="btn btn-ghost btn-sm">
            <Clock className="w-4" />
          </button>
        </div>

        <div className="tooltip" data-tip="Till tomorrow">
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleScheduleForTomorrow}
          >
            {isChangingDate ? (
              <div className="loading loading-spinner loading-xs"></div>
            ) : (
              <CalendarClock className="w-4" />
            )}
          </button>
        </div>

        {!props.isDone && (
          <div className="tooltip" data-tip="Mark as done">
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleStatusChange}
            >
              {isChangingStatus && (
                <div className="loading loading-spinner loading-xs"></div>
              )}
              {!isChangingStatus && (
                <>
                  <Check className="w-4" />
                </>
              )}
            </button>
          </div>
        )}

        {props.isDone && (
          <button className="btn btn-ghost btn-sm" onClick={handleStatusChange}>
            {isChangingStatus && (
              <div className="loading loading-spinner loading-xs"></div>
            )}
            {!isChangingStatus && (
              <>
                <X className="w-4" /> Move back
              </>
            )}
          </button>
        )}

        {!props.isDone && (
          <button className="btn btn-ghost btn-sm">
            <BadgeInfo className="w-4" /> Details
          </button>
        )}
      </div>
    </div>
  );
};
