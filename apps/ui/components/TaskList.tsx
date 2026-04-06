"use client";

import { useState, useEffect, useRef } from "react";
import { Task } from "@/data/roadmap";
import { getTasksV1, createTaskV1, patchTaskV1 } from "@/lib/api";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const [taskState, setTaskState] = useState<Record<string, boolean>>({});
  // Maps local task.id → API UUID for updates
  const apiIdMap = useRef<Record<string, string>>({});

  useEffect(() => {
    async function load() {
      const remote = await getTasksV1();
      if (remote !== null) {
        const state: Record<string, boolean> = {};
        const idMap: Record<string, string> = {};
        for (const t of remote) {
          if (t.phase_id) {
            state[t.phase_id] = t.completed;
            idMap[t.phase_id] = t.id;
          }
        }
        apiIdMap.current = idMap;
        // Merge with defaults for any tasks not yet in API
        const merged = tasks.reduce(
          (acc, task) => ({ ...acc, [task.id]: task.completed, ...state }),
          {} as Record<string, boolean>
        );
        setTaskState(merged);
        localStorage.setItem("task-state", JSON.stringify(merged));
        return;
      }
      const saved = localStorage.getItem("task-state");
      if (saved) {
        try {
          setTaskState(JSON.parse(saved));
          return;
        } catch {
          // fall through to default
        }
      }
      setTaskState(
        tasks.reduce((acc, task) => ({ ...acc, [task.id]: task.completed }), {})
      );
    }
    load();
  }, [tasks]);

  const toggleTask = async (id: string) => {
    const newCompleted = !taskState[id];
    const newState = { ...taskState, [id]: newCompleted };
    setTaskState(newState);
    localStorage.setItem("task-state", JSON.stringify(newState));

    const apiId = apiIdMap.current[id];
    if (apiId) {
      patchTaskV1(apiId, { completed: newCompleted });
    } else {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        const created = await createTaskV1({ title: task.label });
        if (created) {
          apiIdMap.current[id] = created.id;
          patchTaskV1(created.id, { completed: newCompleted });
        }
      }
    }
  };

  const completedCount = Object.values(taskState).filter(Boolean).length;
  const totalCount = tasks.length;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          ✅ Tasks
        </h2>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
          {completedCount}/{totalCount}
        </span>
      </div>
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-start">
            <input
              type="checkbox"
              id={task.id}
              checked={taskState[task.id] || false}
              onChange={() => toggleTask(task.id)}
              className="mt-1 h-5 w-5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800"
            />
            <label
              htmlFor={task.id}
              className={`ml-3 ${taskState[task.id] ? "line-through text-zinc-500" : "text-zinc-800 dark:text-zinc-200"}`}
            >
              {task.label}
            </label>
          </li>
        ))}
      </ul>
      <div className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
        Check off tasks as you complete them. Progress syncs to API when configured.
      </div>
    </div>
  );
}