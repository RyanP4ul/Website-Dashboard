"use client";

import { EntityManager } from "../components/base-panel.tsx";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input";
import { schema } from "@light/shared/validations/panel/factionValidator.ts";

type Faction = {
  id: number
  Name: string
}

export function Page() {
  const columns = [
    {
      accessorKey: "id",
      header: () => "ID",
      cell: ({ row }: { row: { getValue: (key: string) => unknown } }) => row.getValue("id"),
    },
    {
      accessorKey: "Name",
      header: () => "Name",
      cell: ({ row }: { row: { getValue: (key: string) => unknown } }) => (
        <div className="Capitalized">
          {String(row.getValue("Name"))}
        </div>
      ),
    },
  ];

  const renderFormFields = (form: any) => (
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
  );

  return (
    <EntityManager<Faction>
      entityName="Faction"
      apiBaseUrl="http://localhost:3000/api/panel/factions"
      schema={schema}
      columns={columns}
      renderFormFields={renderFormFields}
    />
  );
}