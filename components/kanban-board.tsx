"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  Award,
  Calendar,
  CheckCircle2,
  Mic,
  MoreVertical,
  Trash2,
  XCircle,
} from "lucide-react";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type {
  Board,
  Column,
  JobApplication,
} from "@/lib/models/models.types";
import { useBoard } from "@/lib/hooks/useBoards";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import CreateJobApplicationDialog from "./create-job-dialog";
import JobApplicationCard from "./job-application-card";

interface KanbanBoardProps {
  board: Board;
  userId: string;
}

interface ColConfig {
  color: string;
  icon: ReactNode;
}

const COLUMN_CONFIG: ColConfig[] = [
  {
    color: "bg-cyan-500",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    color: "bg-purple-500",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  {
    color: "bg-green-500",
    icon: <Mic className="h-4 w-4" />,
  },
  {
    color: "bg-yellow-500",
    icon: <Award className="h-4 w-4" />,
  },
  {
    color: "bg-red-500",
    icon: <XCircle className="h-4 w-4" />,
  },
];

function sortJobs(jobs: JobApplication[] | undefined) {
  return [...(jobs ?? [])].sort((a, b) => a.order - b.order);
}

function DroppableColumn({
  column,
  config,
  boardId,
  sortedColumns,
}: {
  column: Column;
  config: ColConfig;
  boardId: string;
  sortedColumns: Column[];
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column._id,
    data: {
      type: "column",
      columnId: column._id,
    },
  });

  const sortedJobs = sortJobs(column.jobApplications);

  return (
    <Card className="min-w-[300px] flex-shrink-0 p-0 shadow-md">
      <CardHeader
        className={`${config.color} rounded-t-lg pb-3 pt-3 text-white`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.icon}

            <CardTitle className="text-base font-semibold text-white">
              {column.name}
            </CardTitle>
          </div>

          
        </div>
      </CardHeader>

      <CardContent
        ref={setNodeRef}
        className={`min-h-[400px] space-y-2 rounded-b-lg bg-gray-50/50 pt-4 ${
          isOver ? "ring-2 ring-blue-500" : ""
        }`}
      >
        <SortableContext
          items={sortedJobs.map((job) => job._id)}
          strategy={verticalListSortingStrategy}
        >
          {sortedJobs.map((job) => (
            <SortableJobCard
              key={job._id}
              job={{
                ...job,
                columnId: job.columnId || column._id,
              }}
              columns={sortedColumns}
            />
          ))}
        </SortableContext>

        <CreateJobApplicationDialog
          columnId={column._id}
          boardId={boardId}
        />
      </CardContent>
    </Card>
  );
}

function SortableJobCard({
  job,
  columns,
}: {
  job: JobApplication;
  columns: Column[];
}) {
  const {
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    setNodeRef,
  } = useSortable({
    id: job._id,
    data: {
      type: "job",
      job,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <JobApplicationCard
        job={job}
        columns={columns}
        dragHandleProps={{
          ...attributes,
          ...listeners,
        }}
      />
    </div>
  );
}

export default function KanbanBoard({
  board,
  userId: _userId,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { columns, moveJob } = useBoard(board);

  const sortedColumns = [...(columns ?? [])].sort(
    (a, b) => a.order - b.order
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveId(null);

    if (!over || !board._id) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    let draggedJob: JobApplication | null = null;
    let sourceColumn: Column | null = null;
    let sourceIndex = -1;

    for (const column of sortedColumns) {
      const jobs = sortJobs(column.jobApplications);
      const jobIndex = jobs.findIndex((job) => job._id === activeId);

      if (jobIndex !== -1) {
        draggedJob = jobs[jobIndex];
        sourceColumn = column;
        sourceIndex = jobIndex;
        break;
      }
    }

    if (!draggedJob || !sourceColumn) {
      return;
    }

    const targetColumn = sortedColumns.find(
      (column) => column._id === overId
    );

    const targetJob = sortedColumns
      .flatMap((column) => column.jobApplications ?? [])
      .find((job) => job._id === overId);

    let targetColumnId = "";
    let newOrder = 0;

    if (targetColumn) {
      targetColumnId = targetColumn._id;

      const jobsInTarget = sortJobs(
        targetColumn.jobApplications?.filter(
          (job) => job._id !== activeId
        )
      );

      newOrder = jobsInTarget.length;
    } else if (targetJob) {
      const targetJobColumn = sortedColumns.find((column) =>
        (column.jobApplications ?? []).some(
          (job) => job._id === targetJob._id
        )
      );

      targetColumnId =
        targetJob.columnId || targetJobColumn?._id || "";

      if (!targetColumnId) {
        return;
      }

      const targetColumnObject = sortedColumns.find(
        (column) => column._id === targetColumnId
      );

      if (!targetColumnObject) {
        return;
      }

      const originalTargetJobs = sortJobs(
        targetColumnObject.jobApplications
      );

      const filteredTargetJobs = originalTargetJobs.filter(
        (job) => job._id !== activeId
      );

      const targetIndexInOriginal = originalTargetJobs.findIndex(
        (job) => job._id === overId
      );

      const targetIndexInFiltered = filteredTargetJobs.findIndex(
        (job) => job._id === overId
      );

      if (targetIndexInFiltered === -1) {
        newOrder = filteredTargetJobs.length;
      } else if (
        sourceColumn._id === targetColumnId &&
        sourceIndex < targetIndexInOriginal
      ) {
        newOrder = targetIndexInFiltered + 1;
      } else {
        newOrder = targetIndexInFiltered;
      }
    } else {
      return;
    }

    await moveJob(activeId, targetColumnId, newOrder);
  }

  const activeJob = sortedColumns
    .flatMap((column) => column.jobApplications ?? [])
    .find((job) => job._id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {sortedColumns.map((column, index) => {
            const config = COLUMN_CONFIG[index] ?? {
              color: "bg-gray-500",
              icon: <Calendar className="h-4 w-4" />,
            };

            return (
              <DroppableColumn
                key={column._id}
                column={column}
                config={config}
                boardId={board._id}
                sortedColumns={sortedColumns}
              />
            );
          })}
        </div>
      </div>

      <DragOverlay>
        {activeJob ? (
          <div className="opacity-50">
            <JobApplicationCard
              job={activeJob}
              columns={sortedColumns}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}