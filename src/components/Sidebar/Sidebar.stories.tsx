import type { Meta, StoryObj } from "@storybook/react";
import {
  Folder,
  Users,
  FileText,
  Calendar,
  MessageSquare,
  FileText as FileIcon,
} from "lucide-react";
import { AppSidebar, type SidebarItem, type SearchResult } from "./component";

const meta: Meta<typeof AppSidebar> = {
  title: "Components/Sidebar",
  component: AppSidebar,
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
type Story = StoryObj<typeof AppSidebar>;

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

const mockSearchResults: SearchResult[] = [
  {
    id: "result-1",
    title: "Chat about React components",
    content:
      "Discussion about building reusable UI components with React and TypeScript",
    icon: MessageSquare,
    onClick: () => console.log("Chat result clicked"),
  },
  {
    id: "result-2",
    title: "Project documentation",
    content:
      "Complete documentation for the current project setup and architecture",
    icon: FileIcon,
    onClick: () => console.log("Documentation result clicked"),
  },
  {
    id: "result-3",
    title: "API integration guide",
    content:
      "Step-by-step guide for integrating external APIs into the application",
    icon: FileIcon,
    onClick: () => console.log("API guide result clicked"),
  },
];

export const Default: Story = {
  args: {
    privateItems: mockPrivateItems,
    teamItems: mockTeamItems,
    onSearch: (query) => console.log("Search:", query),
    onHomeClick: () => console.log("Home clicked"),
    searchResults: mockSearchResults,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Click on the search input to open the search modal with search results.",
      },
    },
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
