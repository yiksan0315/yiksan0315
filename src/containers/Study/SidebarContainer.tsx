'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SidebarContainer({
  sidebarNav, // 👈 layout.tsx에서 전달받은 <FileTreeNav />
}: {
  sidebarNav: React.ReactNode;
}) {
  // [Req 2] 사이드바 열고 닫기 상태 (클라이언트에서만 관리)
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  return (
    <div className='flex min-h-screen'>
      {/* 1. 데스크탑 사이드바 (토글 가능) */}
      <aside
        className={cn(
          'hidden lg:block bg-muted/40 border-r transition-all duration-300',
          isDesktopSidebarOpen ? 'w-72' : 'w-0'
        )}
      >
        <div
          className={cn(
            'p-4 h-full overflow-y-auto transition-opacity duration-200',
            isDesktopSidebarOpen ? 'opacity-100' : 'opacity-0'
          )}
        >
          {sidebarNav} {/* 👈 여기에 서버 렌더링된 네비게이션이 들어옴 */}
        </div>
      </aside>

      {/* 2. 메인 콘텐츠 영역 */}
      <div className='flex flex-col flex-1'>
        <header className='sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6'>
          {/* 모바일 사이드바 (Sheet) */}
          <div className='lg:hidden'>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='outline' size='icon'>
                  <Menu className='h-5 w-5' />
                </Button>
              </SheetTrigger>
              <SheetContent side='left' className='w-[300px] p-4 overflow-y-auto'>
                {sidebarNav} {/* 👈 동일한 네비게이션 재사용 */}
              </SheetContent>
            </Sheet>
          </div>

          {/* 데스크탑 토글 버튼 */}
          <Button
            variant='outline'
            size='icon'
            className='hidden lg:flex'
            onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
          >
            {isDesktopSidebarOpen ? <PanelLeftClose className='h-5 w-5' /> : <PanelLeftOpen className='h-5 w-5' />}
          </Button>

          {/* (TODO: 여기에 검색창이나 다른 헤더 요소를 추가할 수 있습니다) */}
        </header>
      </div>
    </div>
  );
}
