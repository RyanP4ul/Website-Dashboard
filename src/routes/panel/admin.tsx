import { createFileRoute } from "@tanstack/react-router";
import PanelLayout from "../../features/panel/components/panel-layout.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import {
  Edit,
  MoreHorizontal,
  SettingsIcon,
  Trash2,
  DoorClosedIcon,
  DotIcon,
} from "lucide-react";
import React, { useEffect } from "react";
import axios from "axios";
import TestDB from "@/features/panel/testdt.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { AccessLevels } from "@/constants/accessLevel.ts";

export const Route = createFileRoute("/panel/admin")({
  component: RouteComponent,
});

const renderRooms = () => {
  const [data, setData] = React.useState([]);
  // const rooms = getRooms();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/admin/rooms"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <>
      <Card className="bg-card/50 backdrop-blur-sm border border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Room Management
          </CardTitle>
          <CardDescription>
            Manage game rooms and their settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <TestDB
            data={data}
            columns={[
              {
                id: "select",
                header: ({ table }) => (
                  <Checkbox
                    checked={
                      table.getIsAllPageRowsSelected() ||
                      (table.getIsSomePageRowsSelected() && "indeterminate")
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
                accessorKey: "name",
                header: () => "name",
                cell: ({ row }) => (
                  <div className="Capitalized">{row.getValue("name")}</div>
                ),
              },
              {
                accessorKey: "maxPlayers",
                header: () => "Max Players",
                cell: ({ row }) => (
                  <div className="Capitalized">
                    {row.getValue("maxPlayers")}
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
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <DoorClosedIcon className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
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
                    //         console.log("Edit item");
                    //         // setId(item.id);
                    //         // setAction("edit");
                    //         // setIsOpen(true);
                    //       }}
                    //     >
                    //       Edit
                    //     </DropdownMenuItem>
                    //   </DropdownMenuContent>
                    // </DropdownMenu>
                  );
                },
              },
            ]}
            handleAddNewItem={() => {
              // setAction("insert");
              // setIsOpen(true);
            }}
          />
        </CardContent>
      </Card>
    </>
  );
};

function RouteComponent() {
  const [loading, setLoading] = React.useState(false);

  axios
    .get("http://localhost:3000/api/admin/status")
    .then((response) => {
      setLoading(response.data.status === "Ok");
    })
    .catch((error) => {
      setLoading(false);
    });

  return (
    <PanelLayout title="Admin" accessLevel={AccessLevels.ADMIN}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">
              Configure server and application settings
            </p>
          </div>
          <div className="flex space-x-2 p-5">
            {loading ? (
              <div className="flex items-center">
                <DotIcon className="h-15 w-15" color="green" />
                <span className="text-muted-foreground">
                  Emulator Connected
                </span>
              </div>
            ) : (
              <div className="flex items-center">
                <DotIcon className="h-15 w-15" color="red" />
                <span className="text-muted-foreground">
                  Emulator Not Connected
                </span>
              </div>
            )}
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="server">Server</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="bg-card/50 backdrop-blur-sm border border-border shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>Basic server configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="serverName">Server Name</label>
                    <Input id="serverName" value="Suck Melator" />
                  </div>
                  <div>
                    <label htmlFor="maxPlayers">Max Players</label>
                    <Input id="maxPlayers" type="number" value={5} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="enableRegistration">
                        Enable Registration
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Allow new users to register accounts
                      </p>
                    </div>
                    <Switch id="enableRegistration" checked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="maintenanceMode">Maintenance Mode</label>
                      <p className="text-sm text-muted-foreground">
                        Temporarily disable access to the server
                      </p>
                    </div>
                    <Switch id="maintenanceMode" checked={true} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline">Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="server"></TabsContent>
          <TabsContent value="rooms">{renderRooms()}</TabsContent>
        </Tabs>
      </div>
    </PanelLayout>
  );
}
