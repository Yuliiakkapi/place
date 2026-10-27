import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AddPlace } from './pages/AddPlace'
import { MapPage } from './pages/MapPage'
import { Onboarding } from './pages/Onboarding'
import { People } from './pages/People'
import { PlaceDetail } from './pages/PlaceDetail'
import { Profile } from './pages/Profile'
import { SettingsPage } from './pages/SettingsPage'
import { Today } from './pages/Today'
import { profileStore } from './services/store'

export default function App() {
  const profile = profileStore.use()
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route element={profile ? <Layout /> : <Navigate to="/onboarding" replace />}>
          <Route path="/today" element={<Today />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/place/:id" element={<PlaceDetail />} />
          <Route path="/add-place" element={<AddPlace />} />
          <Route path="/people" element={<People />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to={profile ? '/today' : '/onboarding'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
