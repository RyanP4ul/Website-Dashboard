"use client"

import * as React from "react"
import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
    type VisibilityState,
} from "@tanstack/react-table"

import {ChevronDown, Loader2Icon, MoreHorizontal, AlertCircleIcon, CheckCircle2Icon } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Checkbox } from "@/components/ui/checkbox.tsx"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import { Input } from "@/components/ui/input.tsx"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import axios from 'axios';
import { Label } from "@radix-ui/react-label"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faPlus} from '@fortawesome/free-solid-svg-icons';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";

import {useState} from "react";
import { z } from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Separator} from "@/components/ui/separator.tsx";

type Faction = {
    id: number
    Name: string
}

type Props = {
    mode: "insert" | "edit"
    defaultValues?: Partial<z.infer<typeof schema>>
    onSubmit: (data: z.infer<typeof schema>) => Promise<void>
}

type FormData = z.infer<typeof schema>

const schema = z.object({
    id: z.coerce.number().int().min(1),
    Name: z.string().min(4).max(20),
});

export function FactionForm({ mode, defaultValues, onSubmit } : Props ) {

    const [loading, setLoading] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(schema) as any,
        defaultValues: defaultValues
    })

    const handleSubmit = async (data: z.infer<typeof schema>) => {
        try {
            setLoading(true);
            console.log("Submitting form with data:", data);
            await onSubmit(data);
            // form.reset(); // Reset form on successful submission
        } catch (error: any) {
            const serverErrors = error.response?.data?.errors
            if (serverErrors) {
                for (const key in serverErrors) {
                    form.setError(key as keyof FormData, {
                        type: "server",
                        message: serverErrors[key]
                    })
                }
            } else {
                form.setError("root", {
                    type: "server",

                    message: error.response?.data?.msg || "An unexpected error occurred. Please try again."
                });
            }
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    };

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                >

                    {form.formState.errors.root && (
                        <>
                            {form.formState.errors.root.type === "server" ? (
                                <Alert variant="destructive">
                                    <AlertCircleIcon />
                                    <AlertTitle>Error!</AlertTitle>
                                    <AlertDescription>
                                    {form.formState.errors.root.message}
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <Alert>
                                    <CheckCircle2Icon  />
                                    <AlertTitle>Success!</AlertTitle>
                                    <AlertDescription>
                                        {form.formState.errors.root.message}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </>
                    )}

                    <Separator className="mb-5"/>

                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-6">
                            <FormField
                                control={form.control}
                                name='id'
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Id</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder='Id' {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="col-span-12 md:col-span-6">
                            <FormField
                                control={form.control}
                                name='Name'
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Name' {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <Separator className="mt-8 mb-5"/>

                    <div className="flex justify-end">
                        <Button variant="default" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2Icon className="mr-2 animate-spin h-4 w-4" />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    {mode === "edit" ? "Update" : "Create"}
                                </>
                            )}
                        </Button>
                    </div>

                </form>

            </Form>
        </>
    );
}

export function DataTable() {

    const [action, setAction] = React.useState<"none" | "edit" | "insert">("none");
    const [id, setId] = React.useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = React.useState<any>("");
    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState<Faction[]>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState({pageIndex: 0, pageSize: 10 })
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const columns: ColumnDef<Faction>[] = [
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
        {
            accessorKey: "id",
            header: () => "ID",
            cell: ({ row }) => row.getValue("id"),
        },
        {
            accessorKey: "Name",
            header: () => "Name",
            cell: ({ row }) => <div className="Capitalized">{row.getValue("Name")}</div>,
        },
        {
            id: "actions",
            header: () => "Action",
            enableHiding: false,
            cell: ({ row }) => {
                const item = row.original

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
                            <DropdownMenuItem onClick={() => {
                                console.log(`EDIT ITEM ${item.Name}`)

                                setId(item.id)
                                setAction("edit")
                                setIsOpen(true)
                            }}>Edit</DropdownMenuItem>
                            <DropdownMenuItem variant="destructive" onClick={() => {
                                data.splice(data.findIndex(x => x.id === item.id), 1)
                                setData([...data])
                            }}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
    })

    const fetchData = React.useCallback(() => {
        axios.get('http://127.0.0.1/panel/factions')
            .then(res => {
                setData(res.data)
                setIsLoading(false)
            })
            .catch(err => {
                setError(err)
                console.error('Error fetching users:', err)
            });
    }, []);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const renderTable = () => {
        return(
            <>
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Search..."
                        value={(table.getColumn("Name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("Name")?.setFilterValue(event.target.value)}
                        className="max-w-lg"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="outline" size="sm" className="ml-2" onClick={() => {
                        setAction("insert")
                        setIsOpen(true)
                    }}>
                        <FontAwesomeIcon icon={faPlus}/>
                        Add New Items
                    </Button>

                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader className="bg-muted sticky top-0 z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        {isLoading ? "Loading..." : "No Resulsts"}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-between px-4">
                    <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="flex w-full items-center gap-8 lg:w-fit mt-5">
                        <div className="hidden items-center gap-2 lg:flex">
                            <Label htmlFor="rows-per-page" className="text-sm font-medium">
                                Rows per page
                            </Label>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value))
                                }}
                            >
                                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                    <SelectValue
                                        placeholder={table.getState().pagination.pageSize}
                                    />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-fit items-center justify-center text-sm font-medium">
                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-12 p-0 lg:flex"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to first page</span>
                                <div className="absolute">
                                    <FontAwesomeIcon icon={faChevronLeft}/>
                                    <FontAwesomeIcon icon={faChevronLeft}/>
                                </div>
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <FontAwesomeIcon icon={faChevronLeft}/>
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to next page</span>
                                <FontAwesomeIcon icon={faChevronRight}/>
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 w-12 lg:flex"
                                size="icon"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to last page</span>
                                <div className="absolute">
                                    <FontAwesomeIcon icon={faChevronRight}/>
                                    <FontAwesomeIcon icon={faChevronRight}/>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    const renderEdit = () => {
        return(
            <FactionForm
                mode="edit"
                defaultValues={data.find(x => x.id === id) ?? {}}
                onSubmit={async (data) => {
                    console.log("Edit Submitted", data)
                }}
            />
        );
    }

    const renderUInsert = () => {
        return(
            <FactionForm
                mode="insert"
                onSubmit={async (data) => {
                    await axios.post("http://127.0.0.1/panel/factions/insert", data, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        }
                    });

                    setData(prevData => [...prevData, data]);
                    setIsOpen(false);
                }}
            />
        );
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <Card className="flex">
                    <CardHeader className='flex flex-row items-center justify-between'>
                        <CardTitle className='text-lg font-medium'>Factions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full">
                            {error ? (
                                <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
                                    <span className='font-medium'>{error.code}</span>
                                    <p className='text-muted-foreground text-center'>{error.stack}</p>
                                </div>
                            ) : (
                                <>
                                    {renderTable()}
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
                        ) : (
                            <>
                                <DialogTitle>Edit item</DialogTitle>
                                <DialogDescription>
                                    Modify the details of the item.
                                </DialogDescription>
                            </>
                        )}
                    </DialogHeader>

                    {{
                        none: "",
                        edit: renderEdit(),
                        insert: renderUInsert()
                    }[action]}

                    {/*<div className="flex items-center gap-2">*/}
                    {/*    <div className="grid flex-1 gap-2">*/}
                    {/*        <Label htmlFor="link" className="sr-only">*/}
                    {/*            Link*/}
                    {/*        </Label>*/}
                    {/*        <Input*/}
                    {/*            id="link"*/}
                    {/*            defaultValue="https://ui.shadcn.com/docs/installation"*/}
                    {/*            readOnly*/}
                    {/*        />*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*<DialogFooter className="sm:justify-start">*/}
                    {/*    <DialogClose asChild>*/}
                    {/*        <Button type="button" variant="secondary">*/}
                    {/*            Close*/}
                    {/*        </Button>*/}
                    {/*    </DialogClose>*/}
                    {/*</DialogFooter>*/}
                </DialogContent>
            </Dialog>
        </>
    )
}
