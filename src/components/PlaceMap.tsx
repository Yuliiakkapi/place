import 'maplibre-gl/dist/maplibre-gl.css'
import { forwardRef, useEffect, useState, type ReactNode } from 'react'
import Map, { AttributionControl, type MapLayerMouseEvent, type MapRef } from 'react-map-gl/maplibre'
import type { StyleSpecification } from 'maplibre-gl'
import { AARHUS, userById } from '../data/seed'
import type { Place } from '../types'
import { placeStyle } from './category'
import { loadPlaceMapStyle } from './mapStyle'

interface Props {
  children?: ReactNode
  zoom?: number
  onClick?: (e: MapLayerMouseEvent) => void
  onLoad?: () => void
}

export const PlaceMap = forwardRef<MapRef, Props>(function PlaceMap({ children, zoom = 13, onClick, onLoad }, ref) {
  const [style, setStyle] = useState<StyleSpecification | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true
    loadPlaceMapStyle().then(s => active && setStyle(s), () => active && setFailed(true))
    return () => { active = false }
  }, [])

  if (!style) {
    return (
      <div role="status" className={`flex h-full w-full items-center justify-center bg-[#ece5d8] text-sm text-muted ${failed ? '' : 'animate-pulse'}`}>
        {failed ? 'The map couldn’t load. Check your connection.' : 'Loading map…'}
      </div>
    )
  }

  return (
    <Map
      ref={ref}
      initialViewState={{ latitude: AARHUS[0], longitude: AARHUS[1], zoom }}
      mapStyle={style}
      style={{ width: '100%', height: '100%' }}
      attributionControl={false}
      dragRotate={false}
      pitchWithRotate={false}
      touchPitch={false}
      onClick={onClick}
      onLoad={e => {
        e.target.getContainer().querySelector('.maplibregl-ctrl-attrib')?.classList.remove('maplibregl-compact-show')
        onLoad?.()
      }}
    >
      <AttributionControl compact position="bottom-right" />
      {children}
    </Map>
  )
})

export function Pin({ place, selected }: { place: Place; selected?: boolean }) {
  const { color, icon: Icon } = placeStyle(place)
  const contributor = place.addedBy && place.addedBy !== 'me' ? userById(place.addedBy)?.name : place.addedBy === 'me' ? 'You' : undefined

  if (selected && place.image) {
    return (
      <span className="pin-pop flex flex-col items-center float-drop">
        <span className="relative block h-[68px] w-[68px] rounded-md bg-card p-1">
          <img src={place.image} alt="" className="h-full w-full rounded-[16px] object-cover" />
          <span className="absolute -bottom-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-white" style={{ background: color }}>
            <Icon size={12} strokeWidth={2.4} />
          </span>
        </span>
        <span className="-mt-px h-0 w-0 border-x-[7px] border-t-[9px] border-x-transparent border-t-card" />
      </span>
    )
  }

  const size = selected ? 40 : 30
  return (
    <span className="relative block cursor-pointer">
      <span
        style={{ width: size, height: size, background: color }}
        className="flex items-center justify-center rounded-full border-[2.5px] border-card text-white float-shadow"
      >
        <Icon size={size * 0.48} strokeWidth={2.3} />
      </span>
      {contributor && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border-[1.5px] border-card bg-ink text-xs font-semibold text-white">
          {contributor[0]}
        </span>
      )}
    </span>
  )
}
