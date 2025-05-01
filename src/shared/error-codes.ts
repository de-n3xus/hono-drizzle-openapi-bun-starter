export const ErrorCodes = {
	internalError: 'INTERNAL_ERROR',
	notFound: 'NOT_FOUND',
	validationError: 'VALIDATION_ERROR',
	unauthorized: 'UNAUTHORIZED',

	auth: {
		invalidEmailOrPassword: 'INVALID_EMAIL_OR_PASSWORD',
	},
} as const
