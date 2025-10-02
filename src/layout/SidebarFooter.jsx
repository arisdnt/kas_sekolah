import { Text, Tooltip } from '@radix-ui/themes'
import { Code } from 'lucide-react'
import { APP_INFO, getMakerTrademark, getAppVersion } from '../config/appInfo'

export function SidebarFooter({ isCollapsed }) {
  if (isCollapsed) {
    return (
      <div className="p-3 border-t border-white/10 bg-black/10">
        <Tooltip content={`${APP_INFO.name} v${getAppVersion()}\n${getMakerTrademark()}`} side="right">
          <div className="flex justify-center">
            <Code className="h-4 w-4 text-white/60" />
          </div>
        </Tooltip>
      </div>
    )
  }

  return (
    <div className="p-3 border-t border-white/10 bg-black/10">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Code className="h-3 w-3 text-white/60" />
          <Text size="1" className="text-white/70 font-medium">
            {APP_INFO.name}
          </Text>
        </div>
        <div className="space-y-1">
          <Text size="1" className="text-white/50 block">
            v{getAppVersion()}
          </Text>
          <Text size="1" className="text-white/50 block">
            {getMakerTrademark()}
          </Text>
          <Text size="1" className="text-white/40 block">
            {APP_INFO.copyright.notice}
          </Text>
        </div>
      </div>
    </div>
  )
}
