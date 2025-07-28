import * as React from "react";
import { useState, useCallback, type JSX } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";
import { Form} from "@/components/ui/form.tsx";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2Icon, ServerCrash, Edit, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import type { ColumnDef } from "@tanstack/react-table";
import TestDB from "../DataTable";

type EntityManagerProps<T> = {
  entityName: string;
  apiBaseUrl: string;
  schema: z.ZodObject<any>;
  columns: ColumnDef<T>[];
  defaultValues?: Partial<T>;
  renderFormFields: (form: any) => JSX.Element;
};

export function EntityManager<T>({
  entityName,
  apiBaseUrl,
  schema,
  columns,
  defaultValues = {},
  renderFormFields,
}: EntityManagerProps<T>) {

  const [action, setAction] = useState<"none" | "edit" | "insert" | "delete">("none");
  const [id, setId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T[]>([]);

  const fetchData = useCallback(() => {
    axios
      .get(`${apiBaseUrl}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        setError(err);
      });
  }, [apiBaseUrl]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  type FormValues = z.infer<typeof schema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const handleSubmit = async (data: FormValues) => {
    // const [loading, setLoading] = useState(false);
    try {
      setIsLoading(true);
      if (action === "edit" && id !== null) {
        await axios.put(`${apiBaseUrl}/${id}`, data, {
          headers: { "Content-Type": "application/json" },
        });
        setData((prevData) => prevData.map((item: any) => (item.id === id ? data : item)));
        toast.success(`${entityName} updated successfully`, {
          description: `The ${entityName.toLowerCase()} has been updated.`,
        });
      } else if (action === "insert") {
        await axios.post(apiBaseUrl, data, {
          headers: { "Content-Type": "application/json" },
        });
        setData((prevData) => [...prevData, data as T]);
        toast.success(`${entityName} created successfully`, {
          description: `The new ${entityName.toLowerCase()} has been added.`,
        });
      }

      setIsOpen(false);
    } catch (error: any) {
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        for (const key in serverErrors) {
          form.setError(key as any, {
            type: "server",
            message: serverErrors[key],
          });
        }
      } else {
        toast.error(`An error occurred while ${action === "edit" ? "updating" : "creating"} the ${entityName.toLowerCase()}`, {
          description: error?.response?.data?.msg || "Please try again later.",
        });
      }
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleDelete = async () => {
    try {
      if (id !== null) {
        await axios.delete(`${apiBaseUrl}/${id}`, {
          headers: { "Content-Type": "application/json" },
          data: { id },
        });
        setData((prevData) => prevData.filter((item: any) => item.id !== id));
        toast.success(`${entityName} deleted successfully`, {
          description: `The ${entityName.toLowerCase()} has been removed.`,
        });
      }
    } catch (error: any) {
      toast.error(`An error occurred while deleting the ${entityName.toLowerCase()}`, {
        description: error?.response?.data?.msg || "Please try again later.",
      });
    } finally {
      setIsOpen(false);
    }
  };

  const renderForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Separator className="mb-5" />
        {renderFormFields(form)}
        <Separator className="mt-8 mb-5" />
        <div className="flex justify-end">
          <Button variant="outline" className="cursor-pointer" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2Icon className="mr-2 animate-spin h-4 w-4" />
                Loading...
              </>
            ) : (
              <>{action === "edit" ? "Update" : "Create"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

  const renderDelete = () => (
    <div className="flex justify-end">
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Card className="flex">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">{entityName}s</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            {error ? (
              <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
                <ServerCrash className="h-12 w-12" />
                <span className="font-medium">{error.code}</span>
                <p className="text-muted-foreground text-center">{error.stack}</p>
              </div>
            ) : (
              <TestDB
                data={data || []}
                columns={[
                  {
                    id: "select",
                    header: ({ table }) => (
                      <Checkbox
                        checked={
                          table.getIsAllPageRowsSelected() ||
                          (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                      />
                    ),
                    cell: ({ row }) => (
                      <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                      />
                    ),
                    enableSorting: false,
                    enableHiding: false,
                  },
                  ...columns,
                  {
                    id: "actions",
                    header: () => "Action",
                    enableHiding: false,
                    cell: ({ row }) => {
                      const item = row.original as any;
                      return (
                                            <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => {
                        setId(item.id);
                        setAction("edit");
                        setIsOpen(true);
                        form.reset(item);
                      }}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer text-destructive hover:text-destructive"
                        onClick={() => {
                          setId(item.id);
                          setAction("delete");
                          setIsOpen(true);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                        // <DropdownMenu>
                        //   <DropdownMenuTrigger asChild>
                        //     <Button variant="ghost" className="h-8 w-8 p-0">
                        //       <span className="sr-only">Open menu</span>
                        //       <MoreHorizontal />
                        //     </Button>
                        //   </DropdownMenuTrigger>
                        //   <DropdownMenuContent align="end">
                        //     <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        //     <DropdownMenuItem
                        //       onClick={() => {
                        //         setId(item.id);
                        //         setAction("edit");
                        //         setIsOpen(true);
                        //         form.reset(item);
                        //       }}
                        //     >
                        //       Edit
                        //     </DropdownMenuItem>
                        //     <DropdownMenuItem
                        //       variant="destructive"
                        //       onClick={() => {
                        //         setId(item.id);
                        //         setAction("delete");
                        //         setIsOpen(true);
                        //       }}
                        //     >
                        //       Delete
                        //     </DropdownMenuItem>
                        //   </DropdownMenuContent>
                        // </DropdownMenu>
                      );
                    },
                  },
                ]}
                handleAddNewItem={() => {
                  setAction("insert");
                  setIsOpen(true);
                  form.reset(defaultValues);
                }}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <DialogContent className="min-w-2xl overflow-y-auto">
        <DialogHeader>
          {action === "insert" ? (
            <>
              <DialogTitle>Create new {entityName.toLowerCase()}</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new {entityName.toLowerCase()}.
              </DialogDescription>
            </>
          ) : action === "delete" ? (
            <>
              <DialogTitle>Delete {entityName.toLowerCase()}</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this {entityName.toLowerCase()}?
              </DialogDescription>
            </>
          ) : (
            <>
              <DialogTitle>Edit {entityName.toLowerCase()}</DialogTitle>
              <DialogDescription>
                Modify the details of the {entityName.toLowerCase()}.
              </DialogDescription>
            </>
          )}
        </DialogHeader>
        {
          {
            none: "",
            edit: renderForm(),
            insert: renderForm(),
            delete: renderDelete(),
          }[action]
        }
      </DialogContent>
    </Dialog>
  );
}