"use client";

import { api } from "~/trpc/react";

import { useCallback, useMemo, useState } from "react";
import { EmptyState } from "~/app/_components/EmptyState";
import moment from "moment";
import { TaskListItem } from "./TaskListItem";


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
