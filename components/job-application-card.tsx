"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Building2,
  Edit2,
  ExternalLink,
  MapPin,
  MoreVertical,
  Trash2,
  WalletCards,
} from "lucide-react";

import type {
  Column,
  JobApplication,
} from "@/lib/models/models.types";

import {
  deleteJobApplication,
  updateJobApplication,
} from "@/lib/actions/job-applications";

import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface JobApplicationCardProps {
  job: JobApplication;
  columns: Column[];
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

export default function JobApplicationCard({
  job,
  columns,
  dragHandleProps,
}: JobApplicationCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    company: job.company,
    position: job.position,
    location: job.location || "",
    notes: job.notes || "",
    salary: job.salary || "",
    jobUrl: job.jobUrl || "",
    columnId: job.columnId || "",
    tags: job.tags?.join(", ") || "",
    description: job.description || "",
  });

  const availableColumns = columns.filter(
    (column) => column._id !== job.columnId
  );

  async function handleUpdate(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      const result = await updateJobApplication(job._id, {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });

      if (result.error) {
        console.error(
          "Failed to update job application:",
          result.error
        );
        return;
      }

      setIsEditing(false);
    } catch (error) {
      console.error(
        "Failed to update job application:",
        error
      );
    }
  }

  async function handleDelete() {
    try {
      const result = await deleteJobApplication(job._id);

      if (result.error) {
        console.error(
          "Failed to delete job application:",
          result.error
        );
      }
    } catch (error) {
      console.error(
        "Failed to delete job application:",
        error
      );
    }
  }

  async function handleMove(newColumnId: string) {
    try {
      const result = await updateJobApplication(job._id, {
        columnId: newColumnId,
      });

      if (result.error) {
        console.error(
          "Failed to move job application:",
          result.error
        );
      }
    } catch (error) {
      console.error(
        "Failed to move job application:",
        error
      );
    }
  }

  return (
    <>
      <Card
        className="group relative overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"
        {...dragHandleProps}
      >
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary via-primary/70 to-primary/30" />

        <CardContent className="p-3.5">
          <div className="flex items-start gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold leading-5 text-foreground">
                    {job.position}
                  </h3>

                  <p className="truncate text-xs font-medium text-muted-foreground">
                    {job.company}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0 rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                      >
                        <MoreVertical className="h-4 w-4" />

                        <span className="sr-only">
                          Open job menu
                        </span>
                      </Button>
                    }
                  />

                  <DropdownMenuContent
                    align="end"
                    sideOffset={6}
                    className="w-56 rounded-xl border border-border bg-popover p-1.5 shadow-xl"
                  >
                    <div className="px-2 py-1.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Actions
                      </p>
                    </div>

                    <DropdownMenuItem
                      onClick={() => setIsEditing(true)}
                      className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 focus:bg-primary/10"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Edit2 className="h-3.5 w-3.5" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-medium">
                          Edit application
                        </p>

                        <p className="text-[11px] text-muted-foreground">
                          Update job details
                        </p>
                      </div>
                    </DropdownMenuItem>

                    {availableColumns.length > 0 && (
                      <>
                        <div className="my-1.5 h-px bg-border" />

                        <div className="px-2 py-1">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Move to
                          </p>
                        </div>

                        <div className="max-h-44 overflow-y-auto">
                          {availableColumns.map((column) => (
                            <DropdownMenuItem
                              key={column._id}
                              onClick={() =>
                                handleMove(column._id)
                              }
                              className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 focus:bg-muted"
                            >
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                <ArrowRight className="h-3.5 w-3.5" />
                              </div>

                              <span className="min-w-0 truncate text-sm font-medium">
                                {column.name}
                              </span>
                            </DropdownMenuItem>
                          ))}
                        </div>
                      </>
                    )}

                    <div className="my-1.5 h-px bg-border" />

                    <DropdownMenuItem
                      variant="destructive"
                      onClick={handleDelete}
                      className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-medium">
                          Delete application
                        </p>

                        <p className="text-[11px] text-destructive/70">
                          Permanently remove
                        </p>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {(job.location || job.salary) && (
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5">
                  {job.location && (
                    <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />

                      <span className="max-w-36 truncate">
                        {job.location}
                      </span>
                    </div>
                  )}

                  {job.salary && (
                    <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground">
                      <WalletCards className="h-3 w-3 shrink-0" />

                      <span className="max-w-36 truncate">
                        {job.salary}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {job.description && (
                <p className="mt-2 line-clamp-2 text-xs leading-4.5 text-muted-foreground">
                  {job.description}
                </p>
              )}

              {job.tags && job.tags.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {job.tags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="max-w-full truncate rounded-md border border-primary/10 bg-primary/5 px-1.5 py-0.5 text-[10px] font-medium text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {job.jobUrl && (
                <div className="mt-2.5 border-t border-border/60 pt-2.5">
                  <a
                    href={job.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  >
                    View job posting

                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={isEditing}
        onOpenChange={setIsEditing}
      >
        <DialogContent className="max-h-[90dvh] w-[calc(100%-1.5rem)] max-w-2xl overflow-y-auto rounded-xl p-4 sm:p-6">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-lg sm:text-xl">
              Edit Job Application
            </DialogTitle>

            <DialogDescription className="text-xs sm:text-sm">
              Update the details of this job application.
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={handleUpdate}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label
                  htmlFor={`company-${job._id}`}
                  className="text-xs"
                >
                  Company *
                </Label>

                <Input
                  id={`company-${job._id}`}
                  required
                  value={formData.company}
                  className="h-9"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      company: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor={`position-${job._id}`}
                  className="text-xs"
                >
                  Position *
                </Label>

                <Input
                  id={`position-${job._id}`}
                  required
                  value={formData.position}
                  className="h-9"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      position: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor={`location-${job._id}`}
                  className="text-xs"
                >
                  Location
                </Label>

                <Input
                  id={`location-${job._id}`}
                  value={formData.location}
                  className="h-9"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      location: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor={`salary-${job._id}`}
                  className="text-xs"
                >
                  Salary
                </Label>

                <Input
                  id={`salary-${job._id}`}
                  placeholder="e.g., $100k - $150k"
                  value={formData.salary}
                  className="h-9"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      salary: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor={`job-url-${job._id}`}
                className="text-xs"
              >
                Job URL
              </Label>

              <Input
                id={`job-url-${job._id}`}
                type="url"
                placeholder="https://..."
                value={formData.jobUrl}
                className="h-9"
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    jobUrl: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor={`tags-${job._id}`}
                className="text-xs"
              >
                Tags
              </Label>

              <Input
                id={`tags-${job._id}`}
                placeholder="React, Tailwind, High Pay"
                value={formData.tags}
                className="h-9"
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    tags: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor={`description-${job._id}`}
                className="text-xs"
              >
                Description
              </Label>

              <Textarea
                id={`description-${job._id}`}
                rows={3}
                placeholder="Brief description of the role..."
                value={formData.description}
                className="min-h-20 resize-y"
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor={`notes-${job._id}`}
                className="text-xs"
              >
                Notes
              </Label>

              <Textarea
                id={`notes-${job._id}`}
                rows={3}
                value={formData.notes}
                className="min-h-20 resize-y"
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    notes: event.target.value,
                  }))
                }
              />
            </div>

            <DialogFooter className="flex-col-reverse gap-2 pt-1 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="w-full sm:w-auto"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}