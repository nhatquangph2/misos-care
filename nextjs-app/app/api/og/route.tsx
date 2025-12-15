/**
 * Open Graph Image Generator
 * Generates dynamic social media preview images
 */

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get('title') || 'MisosCare';
    const description = searchParams.get('description') || 'Khám phá tính cách và sức khỏe tinh thần';
    const type = searchParams.get('type') || 'default';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)',
              backgroundSize: '100px 100px',
              opacity: 0.3,
            }}
          />

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              zIndex: 1,
            }}
          >
            {/* Logo/Icon */}
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '64px',
                marginBottom: '32px',
              }}
            >
              🐬
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: '60px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                marginBottom: '20px',
                textAlign: 'center',
                maxWidth: '900px',
              }}
            >
              {title}
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: '30px',
                color: '#4a5568',
                textAlign: 'center',
                maxWidth: '800px',
                marginBottom: '40px',
              }}
            >
              {description}
            </div>

            {/* Badge */}
            {type !== 'default' && (
              <div
                style={{
                  padding: '12px 32px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50px',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: '600',
                }}
              >
                {type.toUpperCase()}
              </div>
            )}

            {/* Footer */}
            <div
              style={{
                position: 'absolute',
                bottom: '40px',
                left: '40px',
                right: '40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '20px',
                color: '#718096',
              }}
            >
              <div>MisosCare</div>
              <div>misos-care.vercel.app</div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error('OG Image generation error:', e);
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    });
  }
}
