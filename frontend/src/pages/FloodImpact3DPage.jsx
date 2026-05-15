import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'

function Buildings() {
  const buildingPositions = [
    [-4, 1, -2],
    [-2, 1.5, 1],
    [0, 2, -1],
    [2, 1.2, 2],
    [4, 2.5, 0],
  ]

  return (
    <>
      {buildingPositions.map((pos, index) => (
        <mesh key={index} position={pos}>
          <boxGeometry args={[1, pos[1] * 2, 1]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      ))}
    </>
  )
}

function FloodWater({ severity }) {
  let waterHeight = 0.3
  let waterColor = '#38bdf8'

  if (severity === 'Moderate Flood') {
    waterHeight = 0.8
    waterColor = '#0ea5e9'
  }

  if (severity === 'Severe Flood') {
    waterHeight = 1.5
    waterColor = '#0369a1'
  }

  return (
    <mesh position={[0, waterHeight / 2, 0]}>
      <boxGeometry args={[20, waterHeight, 20]} />
      <meshStandardMaterial
        color={waterColor}
        transparent
        opacity={0.65}
      />
    </mesh>
  )
}

export default function FloodImpact3DPage() {

  // later this can come dynamically from dashboard/backend
  const severity = 'Moderate Flood'

  return (
    <div className="page-container py-10">

      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-teal">
          3D Disaster Intelligence
        </p>

        <h1 className="mt-2 text-3xl font-bold text-brand-ocean">
          3D Flood Impact Viewer
        </h1>

        <p className="mt-3 max-w-3xl text-slate-600">
          Visualize simulated flood impact zones in an interactive
          3D disaster environment powered by AI severity analysis.
        </p>
      </div>

      <div className="glass-card overflow-hidden p-4">

        <div className="h-[700px] w-full rounded-2xl overflow-hidden">

          <Canvas camera={{ position: [8, 8, 8], fov: 50 }}>

            <ambientLight intensity={0.7} />

            <directionalLight
              position={[10, 10, 5]}
              intensity={1.5}
            />

            <Environment preset="city" />

            <OrbitControls />

            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[30, 30]} />
              <meshStandardMaterial color="#d1fae5" />
            </mesh>

            {/* Buildings */}
            <Buildings />

            {/* Flood Water */}
            <FloodWater severity={severity} />

          </Canvas>

        </div>

      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">

        <div className="glass-card p-5">
          <h3 className="text-lg font-bold text-brand-ocean">
            Current Severity
          </h3>

          <p className="mt-2 text-slate-600">
            {severity}
          </p>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-lg font-bold text-brand-ocean">
            Simulation Type
          </h3>

          <p className="mt-2 text-slate-600">
            AI-Based Flood Visualization
          </p>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-lg font-bold text-brand-ocean">
            Rescue Status
          </h3>

          <p className="mt-2 text-slate-600">
            Monitoring Active Zones
          </p>
        </div>

      </div>

    </div>
  )
}