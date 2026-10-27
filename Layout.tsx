import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
export function Layout(){return <div className="min-h-screen bg-[#f4efe7] text-[#292722]"><main className="mx-auto min-h-screen max-w-md px-5 pb-28"> <Outlet/></main><BottomNav/></div>}
