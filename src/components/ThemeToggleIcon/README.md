# ThemeToggle Component

A theme toggle component that allows users to switch between light, dark, and system themes.

## Usage

```tsx
import { ThemeToggle } from "@/components/ThemeToggle/component";

function Header() {
  return (
    <header>
      <ThemeToggle />
    </header>
  );
}
```

## Features

- Dropdown menu with three theme options: Light, Dark, and System
- Automatic system preference detection
- Theme persistence using localStorage
- Smooth icon transitions between themes
- Accessible with proper ARIA labels

## Theme Options

- **Light**: Forces light theme
- **Dark**: Forces dark theme
- **System**: Automatically follows user's system preference

## Dependencies

- Requires `ThemeProvider` to be wrapped around the component
- Uses shadcn/ui components: Button, DropdownMenu
- Uses Lucide React icons: Sun, Moon, Monitor

## Styling

The component uses Tailwind CSS classes and automatically adapts to the current theme using CSS variables defined in the global styles.
