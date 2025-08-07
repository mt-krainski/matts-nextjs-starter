import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from "./component";

const meta: Meta<typeof Logo> = {
  title: "Components/Logo",
  component: Logo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: "The default logo component with company name and pencil icon.",
      },
    },
  },
};
