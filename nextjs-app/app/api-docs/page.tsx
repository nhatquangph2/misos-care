'use client'

import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

/**
 * API Documentation Page
 * Renders interactive Swagger UI for exploring the MisosCare API
 */
export default function ApiDocsPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto">
                <SwaggerUI
                    url="/api/docs"
                    docExpansion="list"
                    defaultModelsExpandDepth={-1}
                    displayOperationId={false}
                    filter={true}
                    showExtensions={false}
                    showCommonExtensions={false}
                />
            </div>
        </div>
    )
}
