import { Text, Tooltip } from '@radix-ui/themes'
import { NavLink } from 'react-router-dom'

export function SidebarItem({ item, isCollapsed }) {
  const Icon = item.icon

  const link = (
    <NavLink
      to={item.href}
      aria-label={item.label}
      className={({ isActive }) =>
        `group flex items-center rounded-lg transition-all duration-200 w-full h-10 ${
          isCollapsed ? 'justify-center px-0' : 'justify-start px-3'
        } ${
          isActive
            ? 'bg-white/20 text-white shadow-sm'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`
      }
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {!isCollapsed && (
        <Text size="2" className="truncate ml-3">
          {item.label}
        </Text>
      )}
    </NavLink>
  )

  if (isCollapsed) {
    return (
      <Tooltip content={item.label} side="right">
        {link}
      </Tooltip>
    )
  }

  return link
}
