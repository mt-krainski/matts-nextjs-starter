import type { Meta, StoryObj } from "@storybook/react";
import { Folder, Users, FileText, Calendar } from "lucide-react";
import { Sidebar, type SidebarItem } from "./component";

const meta: Meta<typeof Sidebar> = {
  title: "Components/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="h-screen w-64">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

const mockPrivateItems: SidebarItem[] = [
  {
    id: "private-1",
    label: "Example Private Item",
    icon: Folder,
    onClick: () => console.log("Private item clicked"),
  },
  {
    id: "private-2",
    label: "Another Example",
    icon: FileText,
    onClick: () => console.log("Another private item clicked"),
  },
];

const mockTeamItems: SidebarItem[] = [
  {
    id: "team-1",
    label: "Example Team Item",
    icon: Users,
    onClick: () => console.log("Team item clicked"),
  },
  {
    id: "team-2",
    label: "Team Calendar",
    icon: Calendar,
    onClick: () => console.log("Team calendar clicked"),
  },
];

export const Default: Story = {
  args: {
    privateItems: mockPrivateItems,
    teamItems: mockTeamItems,
    onSearch: (query) => console.log("Search:", query),
    onHomeClick: () => console.log("Home clicked"),
  },
};

export const WithActiveItems: Story = {
  args: {
    ...Default.args,
    privateItems: [
      { ...mockPrivateItems[0], isActive: true },
      mockPrivateItems[1],
    ],
    teamItems: [mockTeamItems[0], { ...mockTeamItems[1], isActive: true }],
  },
};

export const WithoutPrivateItems: Story = {
  args: {
    teamItems: mockTeamItems,
    onSearch: (query) => console.log("Search:", query),
    onHomeClick: () => console.log("Home clicked"),
  },
};

export const WithoutTeamItems: Story = {
  args: {
    privateItems: mockPrivateItems,
    onSearch: (query) => console.log("Search:", query),
    onHomeClick: () => console.log("Home clicked"),
  },
};

export const Empty: Story = {
  args: {
    onSearch: (query) => console.log("Search:", query),
    onHomeClick: () => console.log("Home clicked"),
  },
};
