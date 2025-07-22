import {
  faDashboard,
  faFlag,
  faFile,
  faCode,
} from "@fortawesome/free-solid-svg-icons";

export default function navigation() {
  return [
    {
      title: "Main",
      items: [
        {
          title: "Dashboard",
          url: "/panel",
          icon: faDashboard,
        },
      ],
    },
    {
      title: "Game Data",
      items: [
        {
          title: "Factions",
          url: "/panel/factions",
          icon: faFlag,
        },
        {
          title: "Subs",
          url: "#",
          icon: faFile,
          subs: [
            { title: "Factions", url: "/panel/factions", icon: faFlag }
          ],
        },
      ],
    },
    {
      title: "Others",
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
        },
      ],
    },
  ];
}
