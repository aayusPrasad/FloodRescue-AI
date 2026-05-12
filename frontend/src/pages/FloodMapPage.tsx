import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'

const floodLocations = [
  {
    id: 1,
    name: 'Kolkata Flood Zone',
    latitude: 22.5726,
    longitude: 88.3639,
    severity: 'Moderate Flood',
    flood_area: 27.4
  },

  {
    id: 2,
    name: 'Howrah Critical Zone',
    latitude: 22.5958,
    longitude: 88.2636,
    severity: 'Severe Flood',
    flood_area: 46.8
  },

  {
    id: 3,
    name: 'Salt Lake Survey',
    latitude: 22.5867,
    longitude: 88.4172,
    severity: 'Mild Flood',
    flood_area: 11.5
  }
]

const getSeverityColor = (severity: string) => {
  if (severity === 'Severe Flood') return 'red'
  if (severity === 'Moderate Flood') return 'orange'
  return 'green'
}

export default function FloodMapPage() {
  return (
    <div className="page-container py-10">

      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-teal">
          Geo Intelligence Dashboard
        </p>

        <h1 className="mt-2 text-3xl font-bold text-brand-ocean">
          Interactive Flood Disaster Map
        </h1>

        <p className="mt-3 max-w-3xl text-slate-600">
          Visualize AI-detected flood zones, drone survey locations,
          and severity-based rescue priority areas in real time.
        </p>
      </div>

      <div className="glass-card overflow-hidden p-4">

        <MapContainer
          center={[22.5726, 88.3639]}
          zoom={11}
          style={{
            height: '650px',
            width: '100%',
            borderRadius: '24px'
          }}
        >

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {floodLocations.map((location) => (

            <CircleMarker
              key={location.id}
              center={[location.latitude, location.longitude]}
              radius={18}
              pathOptions={{
                color: getSeverityColor(location.severity),
                fillColor: getSeverityColor(location.severity),
                fillOpacity: 0.5
              }}
            >

              <Popup>

                <div className="space-y-2">

                  <h2 className="text-lg font-bold">
                    {location.name}
                  </h2>

                  <p>
                    <strong>Severity:</strong>{' '}
                    {location.severity}
                  </p>

                  <p>
                    <strong>Flood Area:</strong>{' '}
                    {location.flood_area}%
                  </p>

                  <p>
                    <strong>Latitude:</strong>{' '}
                    {location.latitude}
                  </p>

                  <p>
                    <strong>Longitude:</strong>{' '}
                    {location.longitude}
                  </p>

                </div>

              </Popup>

            </CircleMarker>

          ))}

        </MapContainer>

      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">

        <div className="glass-card p-5">
          <div className="mb-3 h-4 w-4 rounded-full bg-green-500"></div>

          <h3 className="text-lg font-bold text-brand-ocean">
            Mild Flood
          </h3>

          <p className="mt-2 text-slate-600">
            Low-risk areas with limited flood spread.
          </p>
        </div>

        <div className="glass-card p-5">
          <div className="mb-3 h-4 w-4 rounded-full bg-orange-500"></div>

          <h3 className="text-lg font-bold text-brand-ocean">
            Moderate Flood
          </h3>

          <p className="mt-2 text-slate-600">
            Medium-risk areas requiring monitoring.
          </p>
        </div>

        <div className="glass-card p-5">
          <div className="mb-3 h-4 w-4 rounded-full bg-red-500"></div>

          <h3 className="text-lg font-bold text-brand-ocean">
            Severe Flood
          </h3>

          <p className="mt-2 text-slate-600">
            Critical flood zones requiring immediate rescue response.
          </p>
        </div>

      </div>

    </div>
  )
}