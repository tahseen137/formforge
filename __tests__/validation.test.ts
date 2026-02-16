// Basic tests for validation functions
import { 
  validateEmail, 
  validateFormName, 
  validateFormData,
  isSpam,
  validateRedirectUrl 
} from '../lib/validation';

describe('Validation', () => {
  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user+tag@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validateFormName', () => {
    it('should validate correct form names', () => {
      expect(validateFormName('Contact Form').valid).toBe(true);
      expect(validateFormName('Newsletter Signup').valid).toBe(true);
    });

    it('should reject empty names', () => {
      expect(validateFormName('').valid).toBe(false);
      expect(validateFormName('   ').valid).toBe(false);
    });

    it('should reject XSS attempts', () => {
      expect(validateFormName('<script>alert("xss")</script>').valid).toBe(false);
      expect(validateFormName('form" onerror="alert(1)"').valid).toBe(false);
    });

    it('should reject overly long names', () => {
      const longName = 'a'.repeat(101);
      expect(validateFormName(longName).valid).toBe(false);
    });
  });

  describe('validateFormData', () => {
    it('should validate correct form data', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello world'
      };
      expect(validateFormData(data).valid).toBe(true);
    });

    it('should reject too many fields', () => {
      const data: Record<string, string> = {};
      for (let i = 0; i < 101; i++) {
        data[`field${i}`] = 'value';
      }
      expect(validateFormData(data).valid).toBe(false);
    });

    it('should reject overly large payloads', () => {
      const data = {
        huge: 'a'.repeat(51000)
      };
      expect(validateFormData(data).valid).toBe(false);
    });

    it('should reject XSS attempts', () => {
      const data = {
        name: '<script>alert("xss")</script>',
        message: 'Hello'
      };
      expect(validateFormData(data).valid).toBe(false);
    });
  });

  describe('isSpam', () => {
    it('should not flag legitimate submissions', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'I have a question about your product'
      };
      expect(isSpam(data).isSpam).toBe(false);
    });

    it('should detect honeypot', () => {
      const data = {
        name: 'Spammer',
        _gotcha: 'filled',
        message: 'Spam'
      };
      expect(isSpam(data).isSpam).toBe(true);
    });

    it('should detect spam keywords', () => {
      const data = {
        name: 'Spammer',
        message: 'Buy viagra now!'
      };
      expect(isSpam(data).isSpam).toBe(true);
    });

    it('should detect excessive links', () => {
      const data = {
        message: 'Check out https://spam1.com and https://spam2.com and https://spam3.com and https://spam4.com and https://spam5.com and https://spam6.com'
      };
      expect(isSpam(data).isSpam).toBe(true);
    });
  });

  describe('validateRedirectUrl', () => {
    it('should validate legitimate URLs', () => {
      expect(validateRedirectUrl('https://example.com/thanks')).toBe(true);
      expect(validateRedirectUrl('http://example.com/success')).toBe(true);
    });

    it('should reject invalid protocols', () => {
      expect(validateRedirectUrl('javascript:alert(1)')).toBe(false);
      expect(validateRedirectUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
      expect(validateRedirectUrl('file:///etc/passwd')).toBe(false);
    });

    it('should reject malformed URLs', () => {
      expect(validateRedirectUrl('not a url')).toBe(false);
      expect(validateRedirectUrl('')).toBe(false);
    });
  });
});
