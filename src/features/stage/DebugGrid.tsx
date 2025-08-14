interface Props {
  visible: boolean
}

export const DebugGrid = ({ visible }: Props) => {
  if (!visible) return null

  return (
    <gridHelper args={[20, 20, '#888888', '#444444']} position={[0, -1, 0]} />
  )
}