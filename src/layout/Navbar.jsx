import {
  Avatar,
  Badge,
  Button,
  DropdownMenu,
  Flex,
  IconButton,
  Separator,
  Text,
  Tooltip,
} from '@radix-ui/themes'
import {
  ExitIcon,
  GearIcon,
  BellIcon,
  HamburgerMenuIcon,
  ChevronDownIcon,
} from '@radix-ui/react-icons'
import { User, UserCircle, GraduationCap, Wallet } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { menuSections } from '../config/menuData'

// Icon mapping untuk setiap section
const sectionIcons = {
  'Akademik': GraduationCap,
  'Keuangan': Wallet,
}

// Warna icon untuk setiap section
const sectionIconColors = {
  'Utama': 'text-blue-300',
  'Akademik': 'text-green-300',
  'Keuangan': 'text-amber-300',
}

export function Navbar({ realtimeStatus = 'disconnected' }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  const isActive = (href) => location.pathname === href

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-[#476EAE] to-[#5A7FC7] shadow-lg"
    >
      <div className="px-6">
        <div className="flex h-12 items-center justify-between">
          {/* Left section - Logo and Navigation */}
          <div className="flex items-center space-x-8 flex-1">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
                <svg
                  className="h-5 w-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                </svg>
              </div>
              <div className="hidden sm:block">
                <Text size="4" weight="bold" className="text-white">
                  Sekolah Digital
                </Text>
              </div>
            </div>

            {/* Navigation Menu Dropdowns */}
            <div className="hidden md:flex items-center gap-4">
              {menuSections.map((section, index) => {
                // Single item sections (like Dashboard) render as button
                if (section.items.length === 1) {
                  const item = section.items[0]
                  const Icon = item.icon
                  const active = isActive(item.href)
                  const iconColor = sectionIconColors[section.title] || 'text-white'
                  
                  return (
                    <div key={section.title} className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="2"
                        onClick={() => navigate(item.href)}
                        className={`text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer font-medium ${
                          active ? 'bg-white/20 text-white' : ''
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${iconColor}`} />
                        {item.label}
                      </Button>
                      {index < menuSections.length - 1 && (
                        <Separator orientation="vertical" size="1" className="h-6 bg-white/20" />
                      )}
                    </div>
                  )
                }

                // Multiple items render as dropdown
                const SectionIcon = sectionIcons[section.title]
                const iconColor = sectionIconColors[section.title] || 'text-white'
                
                return (
                  <div key={section.title} className="flex items-center gap-4">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <Button
                          variant="ghost"
                          size="2"
                          className="text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer font-medium"
                        >
                          {SectionIcon && <SectionIcon className={`h-4 w-4 ${iconColor}`} />}
                          {section.title}
                          <ChevronDownIcon className="h-4 w-4 ml-1" />
                        </Button>
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Content 
                        className="min-w-[200px] mt-1 p-1 bg-white border border-slate-200 shadow-lg" 
                        style={{ borderRadius: 0 }}
                      >
                        {section.items.map((item) => {
                          const Icon = item.icon
                          const active = isActive(item.href)
                          
                          return (
                            <DropdownMenu.Item
                              key={item.href}
                              onClick={() => navigate(item.href)}
                              className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${
                                active ? 'bg-blue-50' : ''
                              }`}
                            >
                              <Icon className={`h-4 w-4 ${iconColor}`} />
                              <span>{item.label}</span>
                            </DropdownMenu.Item>
                          )
                        })}
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                    {index < menuSections.length - 1 && (
                      <Separator orientation="vertical" size="1" className="h-6 bg-white/20" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>


          {/* Right section - Status, Notifications, User Menu */}
          <div className="flex items-center space-x-4">
            {/* Realtime Status */}
            <div className="hidden sm:block">
              <Badge
                color={realtimeStatus === 'connected' ? 'green' : 'amber'}
                variant="soft"
                className="text-xs bg-white/10 text-white border-white/20"
              >
                <div className={`mr-1 h-2 w-2 rounded-full ${
                  realtimeStatus === 'connected' ? 'bg-green-400' : 'bg-amber-400'
                } animate-pulse`} />
                {realtimeStatus === 'connected' ? 'Online' : 'Offline'}
              </Badge>
            </div>

            {/* Notifications */}
            <Tooltip content="Notifications">
              <IconButton
                variant="ghost"
                size="2"
                className="text-white/80 hover:text-white hover:bg-white/10 relative"
              >
                <BellIcon />
                <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                  3
                </div>
              </IconButton>
            </Tooltip>

            {/* Separator */}
            <Separator orientation="vertical" size="2" className="h-6 bg-white/20" />

            {/* User Menu */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="ghost" className="flex items-center space-x-3 hover:bg-white/10 p-2 rounded-lg">
                  <UserCircle className="h-8 w-8 text-white" />
                  <div className="hidden sm:block text-left">
                    <Text size="2" weight="medium" className="text-white block">
                      {user?.email?.split('@')[0] || 'User'}
                    </Text>
                    <Text size="1" className="text-white/70 block">
                      Administrator
                    </Text>
                  </div>
                </Button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content className="w-56 mt-2" align="end">
                <DropdownMenu.Item className="flex items-center space-x-2 p-3">
                  <User className="h-4 w-4" />
                  <div>
                    <div className="font-medium">{user?.email?.split('@')[0] || 'User'}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                </DropdownMenu.Item>

                <DropdownMenu.Separator />

                <DropdownMenu.Item 
                  className="flex items-center space-x-2 p-2 cursor-pointer"
                  onClick={() => navigate('/pengaturan')}
                >
                  <GearIcon className="h-4 w-4" />
                  <span>Pengaturan</span>
                </DropdownMenu.Item>

                <DropdownMenu.Separator />

                <DropdownMenu.Item
                  className="flex items-center space-x-2 p-2 text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                >
                  <ExitIcon className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <IconButton
                variant="ghost"
                size="2"
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <HamburgerMenuIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}