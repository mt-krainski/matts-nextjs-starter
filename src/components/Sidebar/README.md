# Sidebar Component

A focused sidebar component for application navigation and search functionality.

## Features

- **Search**: Built-in search functionality with form submission
- **Navigation**: Home button and organized sections for private and team items
- **Responsive**: Adapts to different content and user states
- **Accessible**: Proper ARIA labels and keyboard navigation

## Usage

```tsx
import { Sidebar } from "@/components/Sidebar";
import { Folder, Users } from "lucide-react";

const privateItems = [
  {
    id: "private-1",
    label: "My Documents",
    icon: Folder,
    onClick: () => console.log("Private item clicked"),
  },
];

const teamItems = [
  {
    id: "team-1",
    label: "Team Projects",
    icon: Users,
    onClick: () => console.log("Team item clicked"),
  },
];

function App() {
  return (
    <Sidebar
      privateItems={privateItems}
      teamItems={teamItems}
      onSearch={(query) => console.log("Search:", query)}
      onHomeClick={() => console.log("Home clicked")}
    />
  );
}
```

## Props

### SidebarProps

| Prop           | Type                      | Default | Description                       |
| -------------- | ------------------------- | ------- | --------------------------------- |
| `privateItems` | `SidebarItem[]`           | `[]`    | Items in the private section      |
| `teamItems`    | `SidebarItem[]`           | `[]`    | Items in the team section         |
| `onSearch`     | `(query: string) => void` | -       | Callback when search is submitted |
| `onHomeClick`  | `() => void`              | -       | Callback when home is clicked     |
| `className`    | `string`                  | -       | Additional CSS classes            |

### SidebarItem

| Prop       | Type                  | Description                      |
| ---------- | --------------------- | -------------------------------- |
| `id`       | `string`              | Unique identifier                |
| `label`    | `string`              | Display text                     |
| `icon`     | `React.ComponentType` | Optional icon component          |
| `href`     | `string`              | Optional link URL                |
| `onClick`  | `() => void`          | Click handler                    |
| `isActive` | `boolean`             | Whether item is currently active |

## Layout

The sidebar has a fixed width of 256px (`w-64`) and uses a vertical layout:

- **Search Bar**: At the top for global search functionality
- **Navigation**: Home button and organized sections for private and team items
- **Scrollable Content**: Navigation items can scroll if they exceed the available height

## Styling

The component uses Tailwind CSS classes and follows the design system patterns:

- Fixed width of 256px (`w-64`)
- Full height (`h-full`)
- Responsive borders and spacing
- Consistent button styling with shadcn/ui
- Proper focus states and accessibility

## Accessibility

- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management for search input
- Screen reader friendly structure
