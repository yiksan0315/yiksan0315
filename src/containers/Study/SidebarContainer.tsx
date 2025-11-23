'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SidebarContainer({ sidebarNav }: { sidebarNav: React.ReactNode }) {
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  // Floating Action Button class
  const fabClass =
    'fixed bottom-6 left-6 z-50 h-12 w-12 rounded-full shadow-lg bg-background border hover:bg-muted transition-transform hover:scale-105 items-center justify-center';

  return (
    <>
      {/* sidebar wrapper : no width */}
      <div className='flex min-h-screen'>
        {/* 1. desktop sidebar */}
        <aside
          className={cn(
            'hidden lg:block border-r bg-muted/40 transition-all duration-300 ease-in-out sticky top-0 h-screen',
            isDesktopSidebarOpen ? 'w-72' : 'w-0 border-none overflow-hidden'
          )}
        >
          <div
            className={cn(
              'h-full overflow-y-auto p-4 transition-opacity duration-200',
              isDesktopSidebarOpen ? 'opacity-100' : 'opacity-0'
            )}
          >
            {sidebarNav}
          </div>
        </aside>
        {/* 2. mobile sidebar */}
        <aside className='lg:hidden'>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='outline' size='icon' className={fabClass}>
                <PanelLeftOpen className='h-6 w-6' />
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-[400px] p-4 overflow-y-auto'>
              <SheetTitle className='sr-only'>Menu</SheetTitle>
              {sidebarNav}
            </SheetContent>
          </Sheet>
        </aside>
      </div>

      <Button
        variant='outline'
        size='icon'
        className={cn('hidden lg:flex', fabClass)}
        onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
        title='Toggle Sidebar'
      >
        {isDesktopSidebarOpen ? <PanelLeftClose className='h-6 w-6' /> : <PanelLeftOpen className='h-6 w-6' />}
      </Button>
    </>
  );
}
