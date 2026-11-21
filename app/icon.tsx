import { ImageResponse } from 'next/og'

export const size = { width: 192, height: 192 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1E3A2F',
        borderRadius: '40px',
        fontSize: 116,
        lineHeight: 1,
        color: '#CDF23E',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      C
    </div>,
    { width: 192, height: 192 }
  )
}
