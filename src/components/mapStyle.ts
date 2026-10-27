import type { StyleSpecification } from 'maplibre-gl'

const BASE_STYLE = 'https://tiles.openfreemap.org/styles/positron'

const fills: Record<string, string> = {
  background: '#f1ebe0',
  landuse_residential: '#ece5d8',
  park: '#dbe2c6',
  landcover_wood: '#cdd8b6',
  water: '#cfdbe5',
  building: '#e6dccb',
  road_area_pier: '#f1ebe0',
  'aeroway-area': '#e9e1d2',
}

const lines: Record<string, string> = {
  waterway: '#b4c7d7',
  road_pier: '#f1ebe0',
  highway_path: '#ddd2bf',
  highway_minor: '#fbf8f2',
  highway_major_casing: '#e2d5c0',
  highway_major_inner: '#fdfbf6',
  highway_major_subtle: '#e7dccb',
  highway_motorway_casing: '#ecd0b8',
  highway_motorway_inner: '#faeadd',
  highway_motorway_subtle: '#f3d5bf',
  highway_motorway_bridge_casing: '#ecd0b8',
  highway_motorway_bridge_inner: '#faeadd',
  tunnel_motorway_casing: '#ead0bb',
  tunnel_motorway_inner: '#f7e7da',
  railway: '#d8ccb8',
  railway_transit: '#d8ccb8',
  railway_service: '#d8ccb8',
  railway_dashline: '#f1ebe0',
  railway_transit_dashline: '#f1ebe0',
  railway_service_dashline: '#f1ebe0',
}

const hidden = /shield|aeroway-(taxiway|runway)|boundary|highway-name-path|airport/

function restyle(style: StyleSpecification): StyleSpecification {
  const layers = style.layers.flatMap(layer => {
    if (hidden.test(layer.id)) return []
    const paint = { ...(layer.paint as Record<string, unknown> | undefined) }
    if (layer.type === 'background') paint['background-color'] = fills.background
    if (layer.type === 'fill' && fills[layer.id]) {
      paint['fill-color'] = fills[layer.id]
      if (layer.id === 'building') paint['fill-outline-color'] = '#dccfba'
    }
    if (layer.type === 'line' && lines[layer.id]) paint['line-color'] = lines[layer.id]
    if (layer.type === 'symbol') {
      const isPlace = layer.id.startsWith('label_')
      const isWater = layer.id.startsWith('water')
      paint['text-color'] = isWater ? '#5f7894' : isPlace ? '#3d2a20' : '#8c8677'
      paint['text-halo-color'] = '#f6f1e8'
      paint['text-halo-width'] = 1.4
    }
    return [{ ...layer, paint } as typeof layer]
  })
  return { ...style, layers }
}

let cached: Promise<StyleSpecification> | null = null

export function loadPlaceMapStyle() {
  cached ??= fetch(BASE_STYLE)
    .then(r => {
      if (!r.ok) throw new Error(`Map style failed: ${r.status}`)
      return r.json() as Promise<StyleSpecification>
    })
    .then(restyle)
    .catch(err => {
      cached = null
      throw err
    })
  return cached
}
