"use client";

import { EntityManager } from "../components/base-panel.tsx";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { schema } from "@light/shared/validations/panel/areaValidator.ts";

type Area = {
  id: number;
  Name: string;
  File: string;
  MaxPlayers: number;
  ReqLevel: number;
  ReqParty: boolean;
  Upgrade: boolean;
  Staff: boolean;
  PvP: boolean;
  Timeline: boolean;
  Floor: boolean;
  Dungeon: boolean;
  DamageMultiplier: number;
  GuildLevel: number;
};

export function Page() {
  const columns = [
    {
      accessorKey: "id",
      header: () => "ID",
      cell: ({ row }: { row: { getValue: (key: string) => unknown } }) =>
        row.getValue("id"),
    },
    {
      accessorKey: "Name",
      header: () => "Name",
      cell: ({ row }: { row: any }) => (
        <>
          <div className="capitalize mr-3">
            {String(row.getValue("Name"))}

          </div>
          {row["original"]["Upgrade"] && (
              <Badge
                variant="outline"
                className="text-xs bg-blue-900 text-blue-100 mr-2"
              >
                Upgrade
              </Badge>
            )}
            {row["original"]["ReqParty"] && (
              <Badge
                variant="outline"
                className="text-xs bg-pink-900 text-pink-100 mr-2"
              >
                Party
              </Badge>
            )}
            {row["original"]["Staff"] && (
              <Badge
                variant="outline"
                className="text-xs bg-green-900 text-green-100 mr-2"
              >
                Staff
              </Badge>
            )}
            {row["original"]["PvP"] && (
              <Badge
                variant="outline"
                className="text-xs bg-red-900 text-red-100 mr-2"
              >
                PvP
              </Badge>
            )}
            {row["original"]["Timeline"] && (
              <Badge
                variant="outline"
                className="text-xs bg-yellow-900 text-yellow-100 mr-2"
              >
                Timeline
              </Badge>
            )}
            {row["original"]["Floor"] && (
              <Badge
                variant="outline"
                className="text-xs bg-purple-900 text-purple-100 mr-2"
              >
                Floor
              </Badge>
            )}
            {row["original"]["Dungeon"] && (
              <Badge
                variant="outline"
                className="text-xs bg-gray-900 text-gray-100 mr-2"
              >
                Dungeon
              </Badge>
            )}
        </>
      ),
    },
    {
      accessorKey: "MaxPlayers",
      header: () => "Max Players",
      cell: ({ row }: { row: { getValue: (key: string) => unknown } }) => row.getValue("MaxPlayers"),
    },
    {
      accessorKey: "ReqLevel",
      header: () => "Required Level",
      cell: ({ row }: { row: { getValue: (key: string) => unknown } }) => row.getValue("ReqLevel"),
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
      <div className="col-span-12 md:col-span-6">
        <FormField
          control={form.control}
          name="File"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input placeholder="File" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-12 md:col-span-6">
        <FormField
          control={form.control}
          name="MaxPlayers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Players</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Max Players" defaultValue="10" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-12 md:col-span-4">
        <FormField
          control={form.control}
          name="ReqLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required Level</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Required Level" defaultValue="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-12 md:col-span-4">
        <FormField
          control={form.control}
          name="DamageMultiplier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Damage Multiplier</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Damage Multiplier"
                  defaultValue="1.00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-12 md:col-span-4">
        <FormField
          control={form.control}
          name="GuildLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Guild Level</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Guild Level" defaultValue="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-12 md:col-span-12">
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: "ReqParty", label: "Requires Party" },
            { key: "Upgrade", label: "Upgrade Area" },
            { key: "Staff", label: "Staff Only" },
            { key: "PvP", label: "PvP Enabled" },
            { key: "Timeline", label: "Timeline Area" },
            { key: "Floor", label: "Floor Area" },
            { key: "Dungeon", label: "Dungeon" },
          ].map(({ key, label }) => (
      <FormField
        key={key}
        control={form.control}
        name={key}
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                id={key}
              />
            </FormControl>
            <FormLabel htmlFor={key} className="text-sm font-normal">
              {label}
            </FormLabel>
          </FormItem>
        )}
      />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <EntityManager<Area>
      entityName="Area"
      apiBaseUrl="http://localhost:3000/api/panel/areas"
      schema={schema}
      columns={columns}
      renderFormFields={renderFormFields}
    />
  );
}
