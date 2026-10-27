import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Journal } from './pages/Journal'
import { MapPage } from './pages/MapPage'
import { Onboarding } from './pages/Onboarding'
import { People } from './pages/People'
import { PlaceDetail } from './pages/PlaceDetail'
import { SettingsPage } from './pages/SettingsPage'
import { Today } from './pages/Today'

export default function App() { return <BrowserRouter><Routes><Route path="/onboarding" element={<Onboarding/>}/><Route element={<Layout/>}><Route path="/today" element={<Today/>}/><Route path="/map" element={<MapPage/>}/><Route path="/place/:id" element={<PlaceDetail/>}/><Route path="/people" element={<People/>}/><Route path="/journal" element={<Journal/>}/><Route path="/settings" element={<SettingsPage/>}/></Route><Route path="*" element={<Navigate to="/onboarding" replace/>}/></Routes></BrowserRouter> }
