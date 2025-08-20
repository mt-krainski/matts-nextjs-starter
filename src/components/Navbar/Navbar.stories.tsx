import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Navbar, type Workspace } from "./component";
import { expect, within, fn } from "storybook/test";
import { withDropdown } from "@/test-utils/storybook";
import { ThemeProvider } from "../ThemeProvider/component";

const meta: Meta<typeof Navbar> = {
  title: "Components/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="h-16 w-full">
          <Story />
        </div>
      </ThemeProvider>
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
    onWorkspaceChange: fn(),
    onAccountClick: fn(),
    onSettingsClick: fn(),
    onLogoutClick: fn(),
  },
  play: async ({ canvasElement, args, userEvent }) => {
    const canvas = within(canvasElement);

    // Check that all expected elements are visible
    await expect(canvas.getByText("Personal Workspace")).toBeInTheDocument();
    await expect(canvas.getByText("John Doe")).toBeInTheDocument();

    // Workspace dropdown
    await withDropdown(
      canvas.getByText("Personal Workspace"),
      userEvent,
      async (menu) => {
        await userEvent.click(within(menu).getByText("Acme Corp"));
        await expect(args.onWorkspaceChange).toHaveBeenCalledWith("team-1");
      }
    );

    // Test user menu click
    const userButton = canvas.getByText("John Doe");
    await withDropdown(userButton, userEvent, async (menu) => {
      await userEvent.click(within(menu).getByText("Account"));
      await expect(args.onAccountClick).toHaveBeenCalled();
    });

    // Reopen user menu for settings test
    await withDropdown(userButton, userEvent, async (menu) => {
      const settingsOption = within(menu).getByText("Settings");
      await userEvent.click(settingsOption);
      await expect(args.onSettingsClick).toHaveBeenCalled();
    });

    // Reopen user menu for logout test
    await withDropdown(userButton, userEvent, async (menu) => {
      const logoutOption = within(menu).getByText("Log out");
      await userEvent.click(logoutOption);
      await expect(args.onLogoutClick).toHaveBeenCalled();
    });
  },
};

export const WithTeamWorkspace: Story = {
  args: {
    workspaces: mockWorkspaces,
    selectedWorkspaceId: "team-1",
    user: mockUser,
    onWorkspaceChange: fn(),
    onAccountClick: fn(),
    onSettingsClick: fn(),
    onLogoutClick: fn(),
  },
  play: async ({ canvasElement, args, userEvent }) => {
    const canvas = within(canvasElement);

    // Check that team workspace is selected
    await expect(canvas.getByText("Acme Corp")).toBeInTheDocument();
    await expect(canvas.getByText("John Doe")).toBeInTheDocument();

    // Test workspace selector click
    const workspaceButton = canvas.getByText("Acme Corp");
    await userEvent.click(workspaceButton);

    // Wait for dropdown to open and check workspace options
    const workspaceDropdown = await within(document.body).findByRole("menu");
    await expect(workspaceDropdown).toBeInTheDocument();

    // Test switching to personal workspace
    const personalWorkspace =
      within(workspaceDropdown).getByText("Personal Workspace");
    await userEvent.click(personalWorkspace);
    await expect(args.onWorkspaceChange).toHaveBeenCalledWith("personal");
  },
};

export const WithoutWorkspaces: Story = {
  args: {
    user: mockUser,
    onAccountClick: fn(),
    onSettingsClick: fn(),
    onLogoutClick: fn(),
  },
  play: async ({ canvasElement, args, userEvent }) => {
    const canvas = within(canvasElement);

    // Check that user is visible but workspace selector is not
    await expect(canvas.getByText("John Doe")).toBeInTheDocument();
    await expect(
      canvas.queryByText("Personal Workspace")
    ).not.toBeInTheDocument();
    await expect(canvas.queryByText("Acme Corp")).not.toBeInTheDocument();

    // Test user menu functionality
    const userButton = canvas.getByText("John Doe");
    await userEvent.click(userButton);

    // Wait for user dropdown to open
    const userDropdown = await within(document.body).findByRole("menu");
    await expect(userDropdown).toBeInTheDocument();

    // Test user menu options
    const accountOption = within(userDropdown).getByText("Account");
    await userEvent.click(accountOption);
    await expect(args.onAccountClick).toHaveBeenCalled();
  },
};

export const WithoutUser: Story = {
  args: {
    workspaces: mockWorkspaces,
    selectedWorkspaceId: "personal",
    onWorkspaceChange: fn(),
  },
  play: async ({ canvasElement, args, userEvent }) => {
    const canvas = within(canvasElement);

    // Check that workspace selector is visible but user menu is not
    await expect(canvas.getByText("Personal Workspace")).toBeInTheDocument();
    await expect(canvas.queryByText("John Doe")).not.toBeInTheDocument();

    // Test workspace selector functionality
    const workspaceButton = canvas.getByText("Personal Workspace");
    await userEvent.click(workspaceButton);

    // Wait for dropdown to open
    const workspaceDropdown = await within(document.body).findByRole("menu");
    await expect(workspaceDropdown).toBeInTheDocument();

    // Test workspace selection
    const teamWorkspace = within(workspaceDropdown).getByText("Acme Corp");
    await userEvent.click(teamWorkspace);
    await expect(args.onWorkspaceChange).toHaveBeenCalledWith("team-1");
  },
};

export const Empty: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check that no interactive elements are visible
    await expect(
      canvas.queryByText("Personal Workspace")
    ).not.toBeInTheDocument();
    await expect(canvas.queryByText("John Doe")).not.toBeInTheDocument();
    await expect(canvas.queryByText("Acme Corp")).not.toBeInTheDocument();

    // Logo component should still be visible (check for the company name text)
    await expect(canvas.getByTestId("logo")).toBeInTheDocument();
  },
};
