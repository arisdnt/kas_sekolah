import { Text } from '@radix-ui/themes'
import { SidebarItem } from './SidebarItem'

export function SidebarSection({ section, isCollapsed }) {
  return (
    <div className="space-y-1">
      {!isCollapsed && (
        <Text size="1" className="text-white/50 uppercase tracking-wider font-medium px-2">
          {section.title}
        </Text>
      )}
      {section.items.map((item) => (
        <SidebarItem key={item.href} item={item} isCollapsed={isCollapsed} />
      ))}
    </div>
  )
}
