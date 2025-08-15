import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Folder,
  Users,
  FileText,
  Calendar,
  MessageSquare,
  FileText as FileIcon,
} from "lucide-react";
import { AppSidebar, type SidebarItem, type SearchResult } from "./component";
import { expect, within, fn } from "storybook/test";

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
    onSearch: fn(),
    onHomeClick: fn(),
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
  play: async ({ canvasElement, args, userEvent }) => {
    const canvas = within(canvasElement);

    // Check that all expected elements are visible
    await expect(canvas.getByText("Search...")).toBeInTheDocument();
    await expect(canvas.getByText("Home")).toBeInTheDocument();
    await expect(canvas.getByText("Private")).toBeInTheDocument();
    await expect(canvas.getByText("Team")).toBeInTheDocument();
    await expect(canvas.getByText("Example Private Item")).toBeInTheDocument();
    await expect(canvas.getByText("Another Example")).toBeInTheDocument();
    await expect(canvas.getByText("Example Team Item")).toBeInTheDocument();
    await expect(canvas.getByText("Team Calendar")).toBeInTheDocument();

    // Test Home button click
    const homeButton = canvas.getByText("Home");
    await userEvent.click(homeButton);
    await expect(args.onHomeClick).toHaveBeenCalled();

    // Test private item clicks
    const privateItem1 = canvas.getByText("Example Private Item");
    const privateItem2 = canvas.getByText("Another Example");
    await userEvent.click(privateItem1);
    await userEvent.click(privateItem2);

    // Test team item clicks
    const teamItem1 = canvas.getByText("Example Team Item");
    const teamItem2 = canvas.getByText("Team Calendar");
    await userEvent.click(teamItem1);
    await userEvent.click(teamItem2);

    // Test search functionality
    const searchButton = canvas.getByText("Search...");
    await userEvent.click(searchButton);

    // Wait for modal to open and check search results
    const searchModal = await within(document.body).findByRole("dialog");
    await expect(searchModal).toBeInTheDocument();

    const searchInput = within(searchModal).getByPlaceholderText(
      "Type a command or search..."
    );
    await userEvent.type(searchInput, "test query");
    await expect(args.onSearch).toHaveBeenCalledWith("test query");

    // Test search result clicks
    const chatResult = within(searchModal).getByText(
      "Chat about React components"
    );
    await userEvent.click(chatResult);
  },
};

export const WithActiveItems: Story = {
  args: {
    privateItems: [
      { ...mockPrivateItems[0], isActive: true },
      mockPrivateItems[1],
    ],
    teamItems: [mockTeamItems[0], { ...mockTeamItems[1], isActive: true }],
    onSearch: fn(),
    onHomeClick: fn(),
    searchResults: mockSearchResults,
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    // Check that all expected elements are visible
    await expect(canvas.getByText("Search...")).toBeInTheDocument();
    await expect(canvas.getByText("Home")).toBeInTheDocument();
    await expect(canvas.getByText("Private")).toBeInTheDocument();
    await expect(canvas.getByText("Team")).toBeInTheDocument();
    await expect(canvas.getByText("Example Private Item")).toBeInTheDocument();
    await expect(canvas.getByText("Another Example")).toBeInTheDocument();
    await expect(canvas.getByText("Example Team Item")).toBeInTheDocument();
    await expect(canvas.getByText("Team Calendar")).toBeInTheDocument();

    // Check that active items are present and clickable
    const activePrivateItem = canvas.getByText("Example Private Item");
    const activeTeamItem = canvas.getByText("Team Calendar");
    await expect(activePrivateItem).toBeInTheDocument();
    await expect(activeTeamItem).toBeInTheDocument();

    // Test clicks on active items
    await userEvent.click(activePrivateItem);
    await userEvent.click(activeTeamItem);
  },
};

export const WithoutPrivateItems: Story = {
  args: {
    teamItems: mockTeamItems,
    onSearch: fn(),
    onHomeClick: fn(),
  },
  play: async ({ canvasElement, args, userEvent }) => {
    const canvas = within(canvasElement);

    // Check that expected elements are visible
    await expect(canvas.getByText("Search...")).toBeInTheDocument();
    await expect(canvas.getByText("Home")).toBeInTheDocument();
    await expect(canvas.getByText("Team")).toBeInTheDocument();
    await expect(canvas.getByText("Example Team Item")).toBeInTheDocument();
    await expect(canvas.getByText("Team Calendar")).toBeInTheDocument();

    // Check that private section is NOT visible
    await expect(canvas.queryByText("Private")).not.toBeInTheDocument();
    await expect(
      canvas.queryByText("Example Private Item")
    ).not.toBeInTheDocument();
    await expect(canvas.queryByText("Another Example")).not.toBeInTheDocument();

    // Test Home button click
    const homeButton = canvas.getByText("Home");
    await userEvent.click(homeButton);
    await expect(args.onHomeClick).toHaveBeenCalled();

    // Test team item clicks
    const teamItem1 = canvas.getByText("Example Team Item");
    const teamItem2 = canvas.getByText("Team Calendar");
    await userEvent.click(teamItem1);
    await userEvent.click(teamItem2);
  },
};

export const WithoutTeamItems: Story = {
  args: {
    privateItems: mockPrivateItems,
    onSearch: fn(),
    onHomeClick: fn(),
  },
  play: async ({ canvasElement, args, userEvent }) => {
    const canvas = within(canvasElement);

    // Check that expected elements are visible
    await expect(canvas.getByText("Search...")).toBeInTheDocument();
    await expect(canvas.getByText("Home")).toBeInTheDocument();
    await expect(canvas.getByText("Private")).toBeInTheDocument();
    await expect(canvas.getByText("Example Private Item")).toBeInTheDocument();
    await expect(canvas.getByText("Another Example")).toBeInTheDocument();

    // Check that team section is NOT visible
    await expect(canvas.queryByText("Team")).not.toBeInTheDocument();
    await expect(
      canvas.queryByText("Example Team Item")
    ).not.toBeInTheDocument();
    await expect(canvas.queryByText("Team Calendar")).not.toBeInTheDocument();

    // Test Home button click
    const homeButton = canvas.getByText("Home");
    await userEvent.click(homeButton);
    await expect(args.onHomeClick).toHaveBeenCalled();

    // Test private item clicks
    const privateItem1 = canvas.getByText("Example Private Item");
    const privateItem2 = canvas.getByText("Another Example");
    await userEvent.click(privateItem1);
    await userEvent.click(privateItem2);
  },
};

export const Empty: Story = {
  args: {
    onSearch: fn(),
    onHomeClick: fn(),
  },
  play: async ({ canvasElement, args, userEvent }) => {
    const canvas = within(canvasElement);

    // Check that only basic elements are visible
    await expect(canvas.getByText("Search...")).toBeInTheDocument();
    await expect(canvas.getByText("Home")).toBeInTheDocument();

    // Check that no sections are visible
    await expect(canvas.queryByText("Private")).not.toBeInTheDocument();
    await expect(canvas.queryByText("Team")).not.toBeInTheDocument();
    await expect(
      canvas.queryByText("Example Private Item")
    ).not.toBeInTheDocument();
    await expect(
      canvas.queryByText("Example Team Item")
    ).not.toBeInTheDocument();

    // Test Home button click
    const homeButton = canvas.getByText("Home");
    await userEvent.click(homeButton);
    await expect(args.onHomeClick).toHaveBeenCalled();

    // Test search functionality
    const searchButton = canvas.getByText("Search...");
    await userEvent.click(searchButton);

    // Wait for modal to open
    const searchModal = await within(document.body).findByRole("dialog");
    await expect(searchModal).toBeInTheDocument();

    const searchInput = within(searchModal).getByPlaceholderText(
      "Type a command or search..."
    );
    await userEvent.type(searchInput, "test query");
    await expect(args.onSearch).toHaveBeenCalledWith("test query");
  },
};
