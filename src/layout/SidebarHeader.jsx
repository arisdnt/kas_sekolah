import { Button, Text } from '@radix-ui/themes'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function SidebarHeader({ isCollapsed, onToggle }) {
  return (
    <div className="h-12 bg-gradient-to-r from-[#476EAE] to-[#5A7FC7] flex items-center px-3">
      <Button
        variant="ghost"
        onClick={onToggle}
        className="w-full h-8 p-1 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <div className="flex items-center justify-between w-full">
            <Text size="2" weight="medium" className="text-white/90">
              Menu
            </Text>
            <ChevronLeft className="h-4 w-4" />
          </div>
        )}
      </Button>
    </div>
  )
}
