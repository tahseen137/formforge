// Input validation utilities

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateFormName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Form name is required' };
  }
  if (name.length > 100) {
    return { valid: false, error: 'Form name must be less than 100 characters' };
  }
  if (/<script|javascript:|onerror=/i.test(name)) {
    return { valid: false, error: 'Invalid characters in form name' };
  }
  return { valid: true };
}

export function validateFormData(data: Record<string, any>): { valid: boolean; error?: string } {
  // Check for excessively large payloads
  const jsonSize = JSON.stringify(data).length;
  if (jsonSize > 50000) { // 50KB limit
    return { valid: false, error: 'Form data too large (max 50KB)' };
  }

  // Check field count
  const fieldCount = Object.keys(data).length;
  if (fieldCount > 100) {
    return { valid: false, error: 'Too many form fields (max 100)' };
  }

  // Check for suspicious content
  for (const [key, value] of Object.entries(data)) {
    const strValue = String(value);
    
    // XSS check
    if (/<script|javascript:|onerror=|onclick=/i.test(strValue)) {
      return { valid: false, error: 'Invalid content detected' };
    }

    // Check individual field size
    if (strValue.length > 10000) {
      return { valid: false, error: `Field "${key}" is too large (max 10KB per field)` };
    }
  }

  return { valid: true };
}

export function sanitizeFormData(data: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    // Skip internal fields
    if (key.startsWith('_') && key !== '_redirect') {
      continue;
    }
    
    // Convert value to string and trim
    let strValue = String(value).trim();
    
    // Remove null bytes
    strValue = strValue.replace(/\0/g, '');
    
    sanitized[key] = strValue;
  }
  
  return sanitized;
}

export function isSpam(data: Record<string, any>): { isSpam: boolean; reason?: string } {
  // Honeypot check
  if (data._gotcha || data.honeypot || data.bot_field) {
    return { isSpam: true, reason: 'Honeypot triggered' };
  }

  // Check for spam keywords
  const spamKeywords = [
    'viagra', 'cialis', 'casino', 'poker', 'lottery',
    'click here', 'buy now', 'limited time', 'act now',
    'winner', 'congratulations', 'prize', 'million dollars'
  ];

  const allText = Object.values(data).join(' ').toLowerCase();
  
  for (const keyword of spamKeywords) {
    if (allText.includes(keyword)) {
      return { isSpam: true, reason: `Spam keyword detected: ${keyword}` };
    }
  }

  // Check for excessive links
  const linkCount = (allText.match(/https?:\/\//g) || []).length;
  if (linkCount > 5) {
    return { isSpam: true, reason: 'Too many links' };
  }

  // Check for repeated characters
  if (/(.)\1{10,}/.test(allText)) {
    return { isSpam: true, reason: 'Suspicious repeated characters' };
  }

  return { isSpam: false };
}

export function validateRedirectUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Only allow http and https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }
    // Block localhost and internal IPs in production
    if (process.env.NODE_ENV === 'production') {
      const hostname = parsed.hostname.toLowerCase();
      if (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.startsWith('172.')
      ) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}
