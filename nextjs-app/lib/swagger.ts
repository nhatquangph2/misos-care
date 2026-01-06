/**
 * Swagger/OpenAPI Configuration for MisosCare API
 */
export const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MisosCare API',
            version: '1.0.0',
            description: `
MisosCare API provides comprehensive mental health and personality assessment services.

## Features
- DASS-21 Mental Health Assessment
- Big Five (BFI-2) Personality Testing  
- VIA Character Strengths
- MBTI Type Indicator
- MISO V3 Meta-Analysis Engine
- AI Consultant Integration

## Authentication
All protected endpoints require Supabase authentication. Include the authorization header:
\`Authorization: Bearer <token>\`
      `,
            contact: {
                name: 'MisosCare Support',
                email: 'support@misoscare.vn',
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT',
            },
        },
        servers: [
            {
                url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
                description: 'Current environment',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Supabase authentication token',
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                        message: { type: 'string' },
                    },
                },
                DASSProfile: {
                    type: 'object',
                    properties: {
                        D: { type: 'number', description: 'Depression score (0-42)' },
                        A: { type: 'number', description: 'Anxiety score (0-42)' },
                        S: { type: 'number', description: 'Stress score (0-42)' },
                    },
                },
                Big5Profile: {
                    type: 'object',
                    properties: {
                        N: { type: 'number', description: 'Neuroticism percentile (0-100)' },
                        E: { type: 'number', description: 'Extraversion percentile (0-100)' },
                        O: { type: 'number', description: 'Openness percentile (0-100)' },
                        A: { type: 'number', description: 'Agreeableness percentile (0-100)' },
                        C: { type: 'number', description: 'Conscientiousness percentile (0-100)' },
                    },
                },
                MISOAnalysis: {
                    type: 'object',
                    properties: {
                        BVS: { type: 'number', description: 'Base Vulnerability Score' },
                        RCS: { type: 'number', description: 'Resilience Capacity Score' },
                        riskLevel: { type: 'string', enum: ['VERY_LOW', 'LOW', 'MODERATE', 'HIGH', 'VERY_HIGH'] },
                        interventions: { type: 'array', items: { type: 'object' } },
                    },
                },
            },
        },
        tags: [
            { name: 'Tests', description: 'Mental health and personality tests' },
            { name: 'Analysis', description: 'MISO analysis and insights' },
            { name: 'AI', description: 'AI consultant endpoints' },
            { name: 'User', description: 'User profile and data' },
            { name: 'Debug', description: 'Debug and diagnostic endpoints' },
        ],
    },
    apiFolder: 'app/api',
}

export default swaggerOptions
