import { NextResponse } from 'next/server'
import { createSwaggerSpec } from 'next-swagger-doc'
import swaggerOptions from '@/lib/swagger'

/**
 * @swagger
 * /api/docs:
 *   get:
 *     tags:
 *       - Debug
 *     summary: Get OpenAPI specification
 *     description: Returns the OpenAPI/Swagger specification for the MisosCare API
 *     responses:
 *       200:
 *         description: OpenAPI specification in JSON format
 */
export async function GET() {
    const spec = createSwaggerSpec(swaggerOptions)

    return NextResponse.json(spec, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
    })
}
