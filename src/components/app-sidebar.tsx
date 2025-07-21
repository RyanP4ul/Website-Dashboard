import * as React from "react"

import { SearchForm } from "@/components/search-form"
import { VersionSwitcher } from "@/components/version-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDashboard, faFlag, faFile, faCode } from '@fortawesome/free-solid-svg-icons';

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  nav: [
    {
      title: "Main",
      url: "#",
      items: [
        {
          title: "Dashboard",
          url: "#",
          icon: faDashboard,
          isActive: true,
        }
      ],
    },
    {
      title: "Tables",
      url: "#",
      items: [
        {
          title: "Factions",
          url: "/panel/factions",
          icon: faFlag,
        }
      ],
    },
    {
      title: "Others",
      url: "#",
      items: [
        {
          title: "Upload Files",
          url: "#",
          icon: faFile,
        },
        {
          title: "Functions",
          url: "#",
          icon: faCode,
        }
      ],
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {data.nav.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                        <a href={item.url}>
                          <FontAwesomeIcon icon={item.icon}/>
                          <span>{item.title}</span>
                        </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
