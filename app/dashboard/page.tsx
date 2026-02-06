'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FormEndpoint {
  id: string;
  name: string;
  email: string;
  createdAt: number;
  submissionCount: number;
}

interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, string | number | boolean>;
  timestamp: number;
}

export default function Dashboard() {
  const [endpoints, setEndpoints] = useState<FormEndpoint[]>([]);
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadEndpoints();
  }, []);

  useEffect(() => {
    if (selectedForm) {
      loadSubmissions(selectedForm);
    }
  }, [selectedForm]);

  const loadEndpoints = async () => {
    const res = await fetch('/api/endpoints');
    const data = await res.json();
    setEndpoints(data);
  };

  const loadSubmissions = async (formId: string) => {
    const res = await fetch(`/api/submissions/${formId}`);
    const data = await res.json();
    setSubmissions(data);
  };

  const createEndpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/endpoints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: formName, email: formEmail }),
    });
    if (res.ok) {
      setFormName('');
      setFormEmail('');
      setShowCreateModal(false);
      loadEndpoints();
    }
  };

  const deleteEndpoint = async (id: string) => {
    if (!confirm('Delete this form endpoint? All submissions will be lost.')) return;
    const res = await fetch(`/api/endpoints/${id}`, { method: 'DELETE' });
    if (res.ok) {
      if (selectedForm === id) {
        setSelectedForm(null);
        setSubmissions([]);
      }
      loadEndpoints();
    }
  };

  const copyToClipboard = (id: string) => {
    const url = `${window.location.origin}/api/submit/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-blue-800/30 bg-gray-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-xl font-bold text-white">FormForge</span>
          </Link>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            + New Form
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>

        {/* Form Endpoints */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Your Form Endpoints</h2>
          {endpoints.length === 0 ? (
            <div className="bg-gray-800/30 backdrop-blur rounded-xl p-12 border border-blue-800/20 text-center">
              <p className="text-gray-400 mb-4">No form endpoints yet. Create your first one!</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Create Form Endpoint
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {endpoints.map((endpoint) => (
                <div
                  key={endpoint.id}
                  className={`bg-gray-800/30 backdrop-blur rounded-xl p-6 border transition cursor-pointer ${
                    selectedForm === endpoint.id
                      ? 'border-blue-500'
                      : 'border-blue-800/20 hover:border-blue-700/50'
                  }`}
                  onClick={() => setSelectedForm(endpoint.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-white">{endpoint.name}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEndpoint(endpoint.id);
                      }}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{endpoint.email}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {endpoint.submissionCount} submissions
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(endpoint.id);
                      }}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {copiedId === endpoint.id ? 'Copied!' : 'Copy URL'}
                    </button>
                  </div>
                  <div className="mt-3 p-2 bg-gray-900/50 rounded text-xs text-gray-400 break-all">
                    /api/submit/{endpoint.id}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submissions */}
        {selectedForm && (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Submissions for {endpoints.find((e) => e.id === selectedForm)?.name}
            </h2>
            {submissions.length === 0 ? (
              <div className="bg-gray-800/30 backdrop-blur rounded-xl p-8 border border-blue-800/20 text-center">
                <p className="text-gray-400">No submissions yet.</p>
              </div>
            ) : (
              <div className="bg-gray-800/30 backdrop-blur rounded-xl border border-blue-800/20 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-900/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Data
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {submissions.map((submission) => (
                        <tr key={submission.id} className="hover:bg-gray-900/30">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {formatDate(submission.timestamp)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            <div className="space-y-1">
                              {Object.entries(submission.data).map(([key, value]) => (
                                <div key={key}>
                                  <span className="text-blue-400 font-medium">{key}:</span>{' '}
                                  <span>{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full border border-blue-800/30">
            <h2 className="text-2xl font-bold text-white mb-6">Create Form Endpoint</h2>
            <form onSubmit={createEndpoint}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Form Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Contact Form"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Notification Email</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
