import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ThemeToggleIcon } from "./component";
import { ThemeProvider } from "../ThemeProvider/component";
import { expect, userEvent, within } from "storybook/test";
import { withDropdown } from "@/test-utils/storybook";

const meta: Meta<typeof ThemeToggleIcon> = {
  title: "Components/ThemeToggleIcon",
  component: ThemeToggleIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ThemeToggleIcon>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          "A theme toggle component that allows switching between light, dark, and system themes.",
      },
    },
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    // Check that the theme toggle button exists
    const toggleButton = canvas.getByTestId("theme-toggle");
    await expect(toggleButton).toBeInTheDocument();

    // Check that there are sun and moon icons
    const sunIcon = canvasElement.querySelector('[class*="sun"]');
    const moonIcon = canvasElement.querySelector('[class*="moon"]');
    await expect(sunIcon).toBeInTheDocument();
    await expect(moonIcon).toBeInTheDocument();

    await withDropdown(toggleButton, userEvent, async (menu) => {
      await expect(
        within(menu).getByRole("menuitem", { name: "Light" })
      ).toBeInTheDocument();
      await expect(
        within(menu).getByRole("menuitem", { name: "Dark" })
      ).toBeInTheDocument();
      await expect(
        within(menu).getByRole("menuitem", { name: "System" })
      ).toBeInTheDocument();

      // Test switching to dark theme
      await userEvent.click(
        within(menu).getByRole("menuitem", { name: "Dark" })
      );

      // Verify dark theme is applied by checking if html element has dark class
      await expect(document.documentElement).toHaveClass("dark");
      await expect(document.documentElement).not.toHaveClass("light");
    });

    // Reopen dropdown to test light theme
    await withDropdown(toggleButton, userEvent, async (menu2) => {
      await userEvent.click(
        within(menu2).getByRole("menuitem", { name: "Light" })
      );

      // Verify light theme is applied by checking if html element has light class
      await expect(document.documentElement).toHaveClass("light");
      await expect(document.documentElement).not.toHaveClass("dark");
    });
  },
};
