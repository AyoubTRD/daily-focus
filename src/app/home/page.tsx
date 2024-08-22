import { CreateTask } from "./_components/CreateTask";
import { TaskList } from "./_components/TaskList";

export default async function HomePage() {
  return (
    <div className="container mx-auto flex flex-col gap-8 px-4 py-8 md:px-0">
      <CreateTask />

      <TaskList />
    </div>
  );
}
