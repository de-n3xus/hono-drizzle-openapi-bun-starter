import { OpenAPIV3 } from 'openapi-types'
import { ResolverResult } from 'hono-openapi'

export type OpenapiResponse = (
	(OpenAPIV3.ResponseObject & {
		content?: {
			[key: string]: Omit<OpenAPIV3.MediaTypeObject, 'schema'> & {
				schema?: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | ResolverResult
			}
		}
	})
	| OpenAPIV3.ReferenceObject
)
