// CORS configuration for form submissions

export function getCorsHeaders(origin: string | null): Record<string, string> {
  // In production, you might want to restrict this to specific domains
  const allowedOrigin = origin || '*';
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
}

export function handleCorsPreflightforget(request: Request): Response {
  const origin = request.headers.get('origin');
  const headers = getCorsHeaders(origin);
  
  return new Response(null, {
    status: 204,
    headers
  });
}
