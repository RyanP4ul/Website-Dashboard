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

import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
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
import axios from 'axios';
import { Label } from "@radix-ui/react-label"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faPlus} from '@fortawesome/free-solid-svg-icons';
import { z } from "zod"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import type { Item } from "@/types/item.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Separator} from "@/components/ui/separator.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";

const schema = z.object({
    id: z.int().min(1),
    Name: z.string().min(4).max(20),
    Description: z.string().nonempty().max(255),
    Type: z.string().nonempty(),
    Element: z.string().nonempty().max(20),
    File: z.string().max(60),
    Link: z.string().max(60),
    Icon: z.string().max(60),
    Equipment: z.string().max(60),
    Level: z.int().min(1),
    DPS: z.int().max(1000),
    Range: z.int().min(0),
    Rarity: z.int().min(1),
    Quantity: z.int().min(0).max(999),
    Stack: z.int().min(0).max(9999),
    Cost: z.int().min(0).min(0),

    Silver: z.boolean(),
    Gold: z.boolean(),
    Sell: z.boolean(),
    Temporary: z.boolean(),
    Upgrade: z.boolean(),
    Staff: z.boolean(),

    EnhID: z.int().min(1),
    FactionID: z.int(),
    TitleID: z.int(),
    ReqReputation: z.int(),
    ReqClassID: z.int(),
    ReqClassPoints: z.int(),
    ReqTrackQuest: z.int(),
    Meta: z.string()
})

export function DataTable() {

    const [action, setAction] = React.useState<"table" | "edit" | "insert">("table");
    const [error, setError] = React.useState<any>("");
    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState<Item[]>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState({pageIndex: 0, pageSize: 15 })
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            id: 1,
            Type: "none",
            Level: 1,
            DPS: 10,
            Range: 50,
            Rarity: 1,

            Quantity: 1,
            Stack: 1,
            Cost: 1,
            Silver: false,
            Gold: false,
            Sell: true,
            Temporary: false,
            Upgrade: false,
            Staff: false,

            EnhID: 1
        }
    })

    function onSubmit(data: z.infer<typeof schema>) {
        console.log(data)
    }

    const columns: ColumnDef<Item>[] = [
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
            accessorKey: "Equipment",
            header: "Equipment",
            cell: ({ row }) => (
                <div className="lowercase">{row.getValue("Equipment")}</div>
            ),
        },
        {
            accessorKey: "Name",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Name
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="Capitalized">{row.getValue("Name")}</div>,
        },
        {
            accessorKey: "Level",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Level
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="font-medium">{row.getValue("Level")}</div>,
        },
        {
            accessorKey: "Cost",
            header: () => <div className="text-right">Cost</div>,
            cell: ({ row }) => {
                const Cost = parseFloat(row.getValue("Cost"))
                return <div className="text-right font-medium">{Cost}</div>
            },
        },
        {
            id: "actions",
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
                                setAction("edit")
                                // setEditing(true)
                            }}>Edit</DropdownMenuItem>
                            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
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

    React.useEffect(() => {
        axios.get('http://127.0.0.1/panel/items')
            .then(res => {
                setData(res.data)
                setIsLoading(false)
            })
            .catch(err => {
                setError(err)
                console.error('Error fetching users:', err)
            });
    }, []);

    const renderTable = () => {
        return(
            <>
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Search..."
                        value={(table.getColumn("Name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("Name")?.setFilterValue(event.target.value)}
                        className="max-w-sm"
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
                    <div className="flex w-full items-center gap-8 lg:w-fit">
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
            <>
                <Form {...form}>

                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                    >

                        <Separator className="mb-5"/>

                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12 md:col-span-10">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-12 md:col-span-2">
                                        <FormField
                                            control={form.control}
                                            name='id'
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Id</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Id' {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
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
                                    <div className="col-span-12 md:col-span-3">
                                        <FormField
                                            name='Type'
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Type</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Type' {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-3">
                                        <FormField
                                            name='Element'
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Element</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Element' {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-12">
                                        <FormField
                                            name='Description'
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Description</FormLabel>
                                                    <FormControl>
                                                        {/*<Input placeholder='Description' {...field} />*/}
                                                        <Textarea placeholder="Description" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                        <FormField
                                            name='File'
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>File</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='File' {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                        <FormField
                                            name='Link'
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Link</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Link' {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                        <FormField
                                            name='Icon'
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Icon</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Icon' {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="col-span-12 md:col-span-4">
                                        <FormField
                                            name='Equipment'
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Equipment</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Equipment' {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                        <FormField
                                            name='Level'
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Level</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Level' {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                        <FormField
                                            name='DPS'
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>DPS</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='DPS' {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                        <FormField
                                            name='Range'
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Range</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Range' {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                        <FormField
                                            name='Rarity'
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Rarity</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Rarity' {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                        <FormField
                                            name='Quantity'
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Quantity</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Quantity' {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                        <FormField
                                            name='Stack'
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Stack</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Stack' {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                        <FormField
                                            name='Cost'
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Cost</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Cost' {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                        <FormField
                                            name='EnhID'
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>EnhID</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='EnhID' {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                        <FormField
                                            name='Meta'
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Meta</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Meta' {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-12 md:col-span-2">

                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-12 md:col-span-6">
                                        <FormField
                                            name='Silver'
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Silver</FormLabel>
                                                    <Select onValueChange={field.onChange}
                                                            defaultValue={field.value ? "1" : "0"}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select"/>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="1">Yes</SelectItem>
                                                            <SelectItem value="0">No</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="col-span-12 md:col-span-6">
                                        <FormField
                                            name='Gold'
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Gold</FormLabel>
                                                    <Select onValueChange={field.onChange}
                                                            defaultValue={field.value ? "1" : "0"}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select"/>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="1">Yes</SelectItem>
                                                            <SelectItem value="0">No</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="col-span-12 md:col-span-6">
                                        <FormField
                                            name='Sell'
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Sell</FormLabel>
                                                    <Select onValueChange={field.onChange}
                                                            defaultValue={field.value ? "1" : "No"}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select"/>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="1">Yes</SelectItem>
                                                            <SelectItem value="0">No</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-6">
                                        <FormField
                                            name='Temporary'
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Temporary</FormLabel>
                                                    <Select onValueChange={field.onChange}
                                                            defaultValue={field.value ? "1" : "0"}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select"/>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="1">Yes</SelectItem>
                                                            <SelectItem value="0">No</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-6">
                                        <FormField
                                            name='Upgrade'
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Upgrade</FormLabel>
                                                    <Select onValueChange={field.onChange}
                                                            defaultValue={field.value ? "1" : "0"}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select"/>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="1">Yes</SelectItem>
                                                            <SelectItem value="0">No</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-6">
                                        <FormField
                                            name='Staff'
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Staff</FormLabel>
                                                    <Select onValueChange={field.onChange}
                                                            defaultValue={field.value ? "1" : "0"}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select"/>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="1">Yes</SelectItem>
                                                            <SelectItem value="0">No</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>

                        <Separator className="mt-8 mb-5"/>

                        <Button className='w-[150px] text-white bg-blue-400 font-semibold mt-5 hover:bg-blue-300'>Save</Button>
                    </form>

                </Form>
            </>
        );
    }

    return (
        <Card className="flex">
            <CardHeader className='flex flex-row items-center justify-between'>
                {action == "table" && (
                    <>
                        <CardTitle className='text-lg font-medium'>Factions</CardTitle>
                        <div>
                            <Button variant="outline" size="sm">
                                <FontAwesomeIcon
                                    icon={faPlus}/>
                                <span className="hidden lg:inline" onClick={() => setAction("insert")}>Add New Item</span>
                            </Button>
                        </div>
                    </>
                )}
                {(action == "edit" || action == "insert") && (
                    <>
                        <Button variant="ghost" size="sm" className="mr-2" onClick={() => setAction("table")}>
                            <FontAwesomeIcon icon={faChevronLeft}/>
                            <CardTitle className='text-lg font-medium'>Back</CardTitle>
                        </Button>
                    </>
                )}
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
                            {action == "table" && (
                                <>
                                    {renderTable()}
                                </>
                            )}
                            {action == "edit" && (
                                <>
                                    {renderEdit()}
                                </>
                            )}
                            {action == "insert" && (
                                <>
                                    <h1>INSERT!</h1>
                                </>
                            )}
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
