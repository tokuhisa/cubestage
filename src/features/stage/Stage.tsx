import { useMemo, type JSX } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, Html, OrbitControls, Box, Plane } from '@react-three/drei'

// プレゼンテーション会場のセットアップ
function PresentationHall() {
  // 椅子を配置するための関数
  const chairs = useMemo(() => {
    const chairPositions = []
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 8; col++) {
        chairPositions.push([
          (col - 3.5) * 1.5, // x座標
          -0.8, // y座標（床より少し上）
          2 + row * 1.2 // z座標（スクリーンから離れて）
        ])
      }
    }
    return chairPositions
  }, [])

  return (
    <>
      {/* 床 */}
      <Plane args={[20, 15]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <meshStandardMaterial color="#2a2a2a" />
      </Plane>

      {/* 天井 */}
      <Plane args={[20, 15]} rotation={[Math.PI / 2, 0, 0]} position={[0, 10, 0]}>
        <meshStandardMaterial color="#f0f0f0" />
      </Plane>

      {/* 後ろの壁（プロジェクション用） */}
      <Plane args={[20, 11]} position={[0, 4.5, -7]}>
        <meshStandardMaterial color="#f5f5f5" roughness={0.8} metalness={0.1} />
      </Plane>

      {/* 左右の壁 */}
      <Plane args={[15, 11]} rotation={[0, Math.PI / 2, 0]} position={[-10, 4.5, 0]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Plane>
      <Plane args={[15, 11]} rotation={[0, -Math.PI / 2, 0]} position={[10, 4.5, 0]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Plane>

      {/* スクリーンフレーム */}
      <Box args={[15.5, 8.5, 0.1]} position={[0, 4.5, -6.85]}>
        <meshStandardMaterial color="#2a2a2a" />
      </Box>

      {/* 椅子 */}
      {chairs.map((position, index) => (
        <group key={index} position={[position[0], position[1], position[2]]}>
          {/* 座面 */}
          <Box args={[0.5, 0.1, 0.5]} position={[0, 0.3, 0]}>
            <meshStandardMaterial color="#4a4a4a" />
          </Box>
          {/* 背もたれ（スクリーン側に向ける） */}
          <Box args={[0.5, 0.8, 0.1]} position={[0, 0.7, 0.2]}>
            <meshStandardMaterial color="#4a4a4a" />
          </Box>
          {/* 脚（座面の下に配置し、重複を避ける） */}
          <Box args={[0.08, 0.55, 0.08]} position={[-0.18, 0.025, -0.18]}>
            <meshStandardMaterial color="#333333" />
          </Box>
          <Box args={[0.08, 0.55, 0.08]} position={[0.18, 0.025, -0.18]}>
            <meshStandardMaterial color="#333333" />
          </Box>
          <Box args={[0.08, 0.55, 0.08]} position={[-0.18, 0.025, 0.18]}>
            <meshStandardMaterial color="#333333" />
          </Box>
          <Box args={[0.08, 0.55, 0.08]} position={[0.18, 0.025, 0.18]}>
            <meshStandardMaterial color="#333333" />
          </Box>
        </group>
      ))}

      {/* プロジェクター（天井近くに配置） */}
      <Box args={[0.6, 0.3, 1]} position={[0, 9.5, 3]}>
        <meshStandardMaterial color="#2a2a2a" />
      </Box>

      {/* 演台（スクリーン前の右端に配置、床に接触） */}
      <Box args={[1.2, 1.5, 0.8]} position={[6, -0.25, -4.5]}>
        <meshStandardMaterial color="#8b4513" />
      </Box>
    </>
  )
}

export interface Props {
  children?: JSX.Element | JSX.Element[];
}

export const Stage = (props: Props) => {
  return (
    <Canvas camera={{ position: [0, 4, 8], fov: 75 }}>
      {/* 照明設定（プロジェクター風） */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 15, 5]} intensity={0.6} />
      <pointLight position={[0, 8, 0]} intensity={0.4} />
      {/* プロジェクター光源（天井近くのプロジェクターに合わせる） */}
      <spotLight 
        position={[0, 9.5, 3]} 
        target-position={[0, 4.5, -6.8]}
        intensity={1.5}
        angle={0.35}
        penumbra={0.2}
        color="#ffffff"
      />
      
      {/* プレゼンテーション会場 */}
      <PresentationHall />
      
      {/* スライド（MarkdownView）を壁に投影風に表示 */}
      <Html
        position={[0, 4.5, -6.75]}
        transform
        occlude="blending"
        style={{
          width: '600px',
          height: '320px',
          background: 'rgba(255,255,255,0.95)',
          border: 'none',
          boxShadow: '0 0 40px rgba(255,255,255,0.6), 0 0 80px rgba(200,200,255,0.3)',
          overflow: 'auto',
          backdropFilter: 'blur(1px)'
        }}
      >
        {props.children}
      </Html>
      
      {/* 環境と影 */}
      <Environment preset="warehouse" />
      <ContactShadows position={[0, -0.99, 0]} opacity={0.4} scale={15} blur={2} far={20} />
      
      {/* カメラコントロール */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minDistance={3}
        maxDistance={15}
        target={[0, 1, -2]}
      />
    </Canvas>
  )
}
