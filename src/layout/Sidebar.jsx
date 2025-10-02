import { useSidebar } from '../contexts/SidebarContext'
import { menuSections } from '../config/menuData'
import { SidebarHeader } from './SidebarHeader'
import { SidebarSection } from './SidebarSection'
import { SidebarFooter } from './SidebarFooter'

export function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar()

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-gradient-to-b from-[#476EAE] to-[#3A5A98] shadow-xl transition-all duration-300 ease-in-out z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        <SidebarHeader isCollapsed={isCollapsed} onToggle={toggleSidebar} />
        
        <div className="flex-1 p-3 space-y-4 overflow-y-auto scrollbar-hide">
          {menuSections.map((section) => (
            <SidebarSection key={section.title} section={section} isCollapsed={isCollapsed} />
          ))}
        </div>

        <SidebarFooter isCollapsed={isCollapsed} />
      </div>
    </div>
  )
}
