import type { Meta, StoryObj } from "@storybook/react";
import { Navbar, type Workspace } from "./component";

const meta: Meta<typeof Navbar> = {
  title: "Components/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="h-16 w-full">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Navbar>;

const mockWorkspaces: Workspace[] = [
  { id: "personal", name: "Personal Workspace", type: "personal" },
  { id: "team-1", name: "Acme Corp", type: "team" },
  { id: "team-2", name: "Startup Inc", type: "team" },
];

const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://github.com/shadcn.png",
};

export const Default: Story = {
  args: {
    workspaces: mockWorkspaces,
    selectedWorkspaceId: "personal",
    user: mockUser,
    onWorkspaceChange: (workspaceId) =>
      console.log("Workspace changed:", workspaceId),
    onAccountClick: () => console.log("Account clicked"),
    onSettingsClick: () => console.log("Settings clicked"),
    onLogoutClick: () => console.log("Logout clicked"),
  },
};

export const WithTeamWorkspace: Story = {
  args: {
    ...Default.args,
    selectedWorkspaceId: "team-1",
  },
};

export const WithoutWorkspaces: Story = {
  args: {
    user: mockUser,
    onAccountClick: () => console.log("Account clicked"),
    onSettingsClick: () => console.log("Settings clicked"),
    onLogoutClick: () => console.log("Logout clicked"),
  },
};

export const WithoutUser: Story = {
  args: {
    workspaces: mockWorkspaces,
    selectedWorkspaceId: "personal",
    onWorkspaceChange: (workspaceId) =>
      console.log("Workspace changed:", workspaceId),
  },
};

export const Empty: Story = {
  args: {},
};
