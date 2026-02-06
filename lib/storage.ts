// In-memory storage for MVP
export interface FormEndpoint {
  id: string;
  name: string;
  email: string;
  createdAt: number;
  submissionCount: number;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, string | number | boolean>;
  timestamp: number;
}

class InMemoryStorage {
  private endpoints: Map<string, FormEndpoint> = new Map();
  private submissions: Map<string, FormSubmission[]> = new Map();

  // Form Endpoints
  createEndpoint(name: string, email: string): FormEndpoint {
    const id = this.generateId();
    const endpoint: FormEndpoint = {
      id,
      name,
      email,
      createdAt: Date.now(),
      submissionCount: 0,
    };
    this.endpoints.set(id, endpoint);
    this.submissions.set(id, []);
    return endpoint;
  }

  getEndpoint(id: string): FormEndpoint | undefined {
    return this.endpoints.get(id);
  }

  getAllEndpoints(): FormEndpoint[] {
    return Array.from(this.endpoints.values());
  }

  deleteEndpoint(id: string): boolean {
    this.submissions.delete(id);
    return this.endpoints.delete(id);
  }

  // Submissions
  addSubmission(formId: string, data: Record<string, string | number | boolean>): FormSubmission | null {
    const endpoint = this.endpoints.get(formId);
    if (!endpoint) return null;

    const submission: FormSubmission = {
      id: this.generateId(),
      formId,
      data,
      timestamp: Date.now(),
    };

    const formSubmissions = this.submissions.get(formId) || [];
    formSubmissions.push(submission);
    this.submissions.set(formId, formSubmissions);

    endpoint.submissionCount++;
    this.endpoints.set(formId, endpoint);

    return submission;
  }

  getSubmissions(formId: string): FormSubmission[] {
    return this.submissions.get(formId) || [];
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}

// Singleton instance
export const storage = new InMemoryStorage();
