import { createClient } from '@/lib/supabase/server';

export interface FormEndpoint {
  id: string;
  user_id: string;
  name: string;
  endpoint_id: string;
  email: string;
  settings: Record<string, any>;
  submission_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormSubmission {
  id: string;
  form_id: string;
  data: Record<string, string | number | boolean>;
  ip_address?: string;
  user_agent?: string;
  is_spam: boolean;
  spam_reason?: string;
  created_at: string;
}

export interface EmailLog {
  id: string;
  submission_id: string;
  recipient: string;
  subject: string;
  status: 'pending' | 'sent' | 'failed' | 'bounced';
  error_message?: string;
  sent_at?: string;
  created_at: string;
}

export class DatabaseStorage {
  // Form Endpoints
  async createEndpoint(
    userId: string,
    name: string,
    email: string,
    settings: Record<string, any> = {}
  ): Promise<FormEndpoint | null> {
    try {
      const supabase = await createClient();
      const endpointId = this.generateId();

      const { data, error } = await supabase
        .from('forms')
        .insert({
          user_id: userId,
          name,
          endpoint_id: endpointId,
          email,
          settings,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating endpoint:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating endpoint:', error);
      return null;
    }
  }

  async getEndpoint(endpointId: string): Promise<FormEndpoint | null> {
    try {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('endpoint_id', endpointId)
        .eq('is_active', true)
        .single();

      if (error) {
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting endpoint:', error);
      return null;
    }
  }

  async getEndpointById(id: string): Promise<FormEndpoint | null> {
    try {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting endpoint by ID:', error);
      return null;
    }
  }

  async getAllEndpoints(userId: string): Promise<FormEndpoint[]> {
    try {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting endpoints:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting endpoints:', error);
      return [];
    }
  }

  async deleteEndpoint(userId: string, id: string): Promise<boolean> {
    try {
      const supabase = await createClient();

      const { error } = await supabase
        .from('forms')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      return !error;
    } catch (error) {
      console.error('Error deleting endpoint:', error);
      return false;
    }
  }

  // Submissions
  async addSubmission(
    endpointId: string,
    data: Record<string, string | number | boolean>,
    ipAddress?: string,
    userAgent?: string,
    isSpam: boolean = false,
    spamReason?: string
  ): Promise<FormSubmission | null> {
    try {
      const supabase = await createClient();

      // Get form by endpoint_id
      const form = await this.getEndpoint(endpointId);
      if (!form) {
        console.error('Form not found for endpoint:', endpointId);
        return null;
      }

      const { data: submission, error } = await supabase
        .from('submissions')
        .insert({
          form_id: form.id,
          data,
          ip_address: ipAddress,
          user_agent: userAgent,
          is_spam: isSpam,
          spam_reason: spamReason,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding submission:', error);
        return null;
      }

      return submission;
    } catch (error) {
      console.error('Error adding submission:', error);
      return null;
    }
  }

  async getSubmissions(formId: string, userId: string): Promise<FormSubmission[]> {
    try {
      const supabase = await createClient();

      // Verify user owns this form
      const form = await this.getEndpointById(formId);
      if (!form || form.user_id !== userId) {
        return [];
      }

      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('form_id', formId)
        .eq('is_spam', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting submissions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting submissions:', error);
      return [];
    }
  }

  async getSubmissionsByEndpointId(
    endpointId: string,
    userId: string
  ): Promise<FormSubmission[]> {
    try {
      const form = await this.getEndpoint(endpointId);
      if (!form) {
        return [];
      }

      return this.getSubmissions(form.id, userId);
    } catch (error) {
      console.error('Error getting submissions:', error);
      return [];
    }
  }

  // Email Logs
  async logEmail(
    submissionId: string,
    recipient: string,
    subject: string,
    status: 'pending' | 'sent' | 'failed' | 'bounced',
    errorMessage?: string
  ): Promise<EmailLog | null> {
    try {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from('email_logs')
        .insert({
          submission_id: submissionId,
          recipient,
          subject,
          status,
          error_message: errorMessage,
          sent_at: status === 'sent' ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error logging email:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error logging email:', error);
      return null;
    }
  }

  async updateEmailStatus(
    logId: string,
    status: 'pending' | 'sent' | 'failed' | 'bounced',
    errorMessage?: string
  ): Promise<boolean> {
    try {
      const supabase = await createClient();

      const { error } = await supabase
        .from('email_logs')
        .update({
          status,
          error_message: errorMessage,
          sent_at: status === 'sent' ? new Date().toISOString() : null,
        })
        .eq('id', logId);

      return !error;
    } catch (error) {
      console.error('Error updating email status:', error);
      return false;
    }
  }

  // Utility
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}

// Singleton instance
export const dbStorage = new DatabaseStorage();
