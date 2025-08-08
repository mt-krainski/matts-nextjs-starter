import { expect, within, waitFor } from "@storybook/test";

type StorybookUserEvent = typeof import("@storybook/test").userEvent;

export async function withDropdown(
  triggerElement: HTMLElement,
  userEvent: StorybookUserEvent,
  onOpen: (menuEl: HTMLElement) => Promise<void> | void,
  options?: { role?: string; root?: HTMLElement }
) {
  const role = options?.role ?? "menu";
  const root = options?.root ?? document.body;

  await userEvent.click(triggerElement);

  const menuEl = await within(root).findByRole(role);
  await expect(menuEl).toBeInTheDocument();

  await onOpen(menuEl);

  await waitFor(() => {
    expect(menuEl).not.toBeInTheDocument();
  });
}
