"use client";

import * as React from "react";

import { Loader2Icon, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { toast } from "sonner";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import TestDB from "../testdt";

type Faction = {
  id: number;
  Name: string;
};

type Props = {
  mode: "insert" | "edit";
  defaultValues?: Partial<z.infer<typeof schema>>;
  onSubmit: (data: z.infer<typeof schema>) => Promise<void>;
};

type FormData = z.infer<typeof schema>;

const schema = z.object({
  id: z.coerce.number().int().min(1),
  Name: z.string().min(4).max(20),
});

export function FactionForm({ mode, defaultValues, onSubmit }: Props) {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: defaultValues,
  });

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    try {
      setLoading(true);
      await onSubmit(data);
    } catch (error: any) {
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        for (const key in serverErrors) {
          form.setError(key as keyof FormData, {
            type: "server",
            message: serverErrors[key],
          });
        }
      } else {
        const res = error.response?.data;

        if (res == null || res.msg == null || res.status == null) {
          toast.error("An unexpected error occurred. Please try again later.");
          return;
        }

        if (res.status === "success") {
          toast.success(res.msg || "Operation completed successfully.");
        } else {
          toast.error(
            res.msg || "An unexpected error occurred. Please try again later."
          );
        }
      }
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Separator className="mb-5" />

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Id</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Id" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-12 md:col-span-6">
              <FormField
                control={form.control}
                name="Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator className="mt-8 mb-5" />

          <div className="flex justify-end">
            <Button variant="default" disabled={loading}>
              {loading ? (
                <>
                  <Loader2Icon className="mr-2 animate-spin h-4 w-4" />
                  Loading...
                </>
              ) : (
                <>{mode === "edit" ? "Update" : "Create"}</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

export function Page() {
  const [action, setAction] = React.useState<"none" | "edit" | "insert" | "delete">("none");
  const [id, setId] = React.useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = React.useState<any>("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState<Faction[]>([]);

  const fetchData = React.useCallback(() => {
    axios
      .get("http://localhost:3000/api/panel/factions")
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        console.error("Error fetching users:", err);
      });
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderEdit = () => {
    return (
      <FactionForm
        mode="edit"
        defaultValues={data.find((x) => x.id === id) ?? {}}
        onSubmit={async (data) => {
          await axios.put(
            `http://localhost:3000/api/panel/factions/${id}`,
            data,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          setData((prevData) =>
            prevData.map((item) => (item.id === id ? data : item))
          );
          setIsOpen(false);
          toast.success("Item updated successfully", {
            description: "The item has been updated.",
          });
        }}
      />
    );
  };

  const renderUInsert = () => {
    return (
      <FactionForm
        mode="insert"
        onSubmit={async (data) => {
          await axios.post("http://localhost:3000/api/panel/factions", data, {
            headers: {
              "Content-Type": "application/json",
            },
          });

          setData((prevData) => [...prevData, data]);
          setIsOpen(false);
          toast.success("Item created successfully", {
            description: "The new item has been added.",
          });
        }}
      />
    );
  };

  const renderDelete = () => {
    return (
      <>
        <div className="flex justify-end">
          <Button
            variant="destructive"
            onClick={async () => {
              await axios
                .delete(`http://localhost:3000/api/panel/factions/${id}`, {
                  headers: {
                    "Content-Type": "application/json",
                  },
                  data: { id: id },
                })
                .then((_) => {
                  setData((prevData) =>
                    prevData.filter((item) => item.id !== id)
                  );
                  toast.success("Item deleted successfully", {
                    description: "The item has been removed.",
                  });
                })
                .catch((error) => {
                  toast.error("An error occurred while deleting the item", {
                    description:
                      error?.response?.data.msg || "Please try again later.",
                  });
                })
                .finally(() => {
                  setIsOpen(false);
                });
            }}
          >
            Delete
          </Button>
        </div>
      </>
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Card className="flex">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">Factions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              {error ? (
                <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
                  <span className="font-medium">{error.code}</span>
                  <p className="text-muted-foreground text-center">
                    {error.stack}
                  </p>
                </div>
              ) : (
                <>
                  <TestDB
                    data={data}
                    columns={[
                      {
                        id: "select",
                        header: ({ table }) => (
                          <Checkbox
                            checked={
                              table.getIsAllPageRowsSelected() ||
                              (table.getIsSomePageRowsSelected() &&
                                "indeterminate")
                            }
                            onCheckedChange={(value) =>
                              table.toggleAllPageRowsSelected(!!value)
                            }
                            aria-label="Select all"
                          />
                        ),
                        cell: ({ row }) => (
                          <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) =>
                              row.toggleSelected(!!value)
                            }
                            aria-label="Select row"
                          />
                        ),
                        enableSorting: false,
                        enableHiding: false,
                      },
                      {
                        accessorKey: "id",
                        header: () => "ID",
                        cell: ({ row }) => row.getValue("id"),
                      },
                      {
                        accessorKey: "Name",
                        header: () => "Name",
                        cell: ({ row }) => (
                          <div className="Capitalized">
                            {row.getValue("Name")}
                          </div>
                        ),
                      },
                      {
                        id: "actions",
                        header: () => "Action",
                        enableHiding: false,
                        cell: ({ row }) => {
                          const item = row.original;

                          return (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setId(item.id);
                                    setAction("edit");
                                    setIsOpen(true);
                                  }}
                                >
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  variant="destructive"
                                  onClick={() => {
                                    setId(item.id);
                                    setAction("delete");
                                    setIsOpen(true);
                                  }}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          );
                        },
                      },
                    ]}
                    handleAddNewItem={() => {
                      setAction("insert");
                      setIsOpen(true);
                    }}
                  />
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <DialogContent className="min-w-2xl overflow-y-auto">
          <DialogHeader>
            {action === "insert" ? (
              <>
                <DialogTitle>Create new item</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new item.
                </DialogDescription>
              </>
            ) : action === "delete" ? (
              <>
                <DialogTitle>Delete item</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this item?
                </DialogDescription>
              </>
            ) : (
              <>
                <DialogTitle>Edit item</DialogTitle>
                <DialogDescription>
                  Modify the details of the item.
                </DialogDescription>
              </>
            )}
          </DialogHeader>

          {
            {
              none: "",
              edit: renderEdit(),
              insert: renderUInsert(),
              delete: renderDelete(),
            }[action]
          }
        </DialogContent>
      </Dialog>
    </>
  );
}
