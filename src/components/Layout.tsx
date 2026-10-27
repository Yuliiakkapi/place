import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function Layout() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <main className="mx-auto min-h-screen max-w-md px-5 pb-32">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
