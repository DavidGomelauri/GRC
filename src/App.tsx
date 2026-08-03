import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Users, 
  BarChart3, 
  Plus, 
  TrendingUp 
} from 'lucide-react';
import { RiskItem, ComplianceControl, VendorAssessment, RiskSeverity } from './types';

// საწყისი მონაცემები რეალური GRC სცენარებისთვის
const initialRisks: RiskItem[] = [
  {
    id: 'RSK-001',
    title: 'Unauthenticated API Endpoint Access',
    category: 'Application Security',
    impact: 5,
    likelihood: 4,
    score: 20,
    severity: 'Critical',
    owner: 'AppSec Team',
    mitigationPlan: 'Enforce OAuth2.0 and API Gateway rate-limiting.'
  },
  {
    id: 'RSK-002',
    title: 'Third-Party Vendor Data Leak',
    category: 'Vendor Risk',
    impact: 4,
    likelihood: 3,
    score: 12,
    severity: 'High',
    owner: 'GRC Lead',
    mitigationPlan: 'Require annual ISO 27001 / SOC 2 Type II re-assessments.'
  },
  {
    id: 'RSK-003',
    title: 'Inadequate Access Review Cycles',
    category: 'Identity & Access',
    impact: 3,
    likelihood: 2,
    score: 6,
    severity: 'Medium',
    owner: 'IAM Manager',
    mitigationPlan: 'Automate quarterly Access Recertification in Okta.'
  }
];

const initialControls: ComplianceControl[] = [
  {
    id: 'CTL-01',
    framework: 'ISO 27001',
    code: 'A.5.15',
    title: 'Access Control Policy Implementation',
    status: 'Implemented',
    owner: 'Security Lead',
    lastAuditDate: '2026-05-15'
  },
  {
    id: 'CTL-02',
    framework: 'SOC 2',
    code: 'CC6.1',
    title: 'Logical Access Security & Encryption at Rest',
    status: 'Implemented',
    owner: 'Infrastructure',
    lastAuditDate: '2026-06-10'
  },
  {
    id: 'CTL-03',
    framework: 'NIST CSF',
    code: 'PR.DS-1',
    title: 'Data-at-rest Protection Mechanisms',
    status: 'In Progress',
    owner: 'DevOps',
    lastAuditDate: '2026-07-01'
  }
];

const initialVendors: VendorAssessment[] = [
  {
    id: 'VND-101',
    vendorName: 'CloudInfrastructure Corp',
    serviceProvided: 'Primary Cloud Hosting',
    riskLevel: 'Critical',
    dueDiligenceStatus: 'Completed',
    lastReviewed: '2026-06-20'
  },
  {
    id: 'VND-102',
    vendorName: 'AnalyticsEngine Inc',
    serviceProvided: 'Customer Data Processing',
    riskLevel: 'High',
    dueDiligenceStatus: 'Pending Review',
    lastReviewed: '2026-04-12'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'risks' | 'controls' | 'vendors'>('dashboard');
  const [risks, setRisks] = useState<RiskItem[]>(initialRisks);
  const [controls] = useState<ComplianceControl[]>(initialControls);
  const [vendors] = useState<VendorAssessment[]>(initialVendors);

  // ახალი რისკის დამატების მარტივი ფორმა
  const [newRiskTitle, setNewRiskTitle] = useState('');
  const [newRiskCategory, setNewRiskCategory] = useState('Security');
  const [newRiskImpact, setNewRiskImpact] = useState(3);
  const [newRiskLikelihood, setNewRiskLikelihood] = useState(3);

  const handleAddRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRiskTitle) return;

    const score = newRiskImpact * newRiskLikelihood;
    let severity: RiskSeverity = 'Low';
    if (score >= 15) severity = 'Critical';
    else if (score >= 10) severity = 'High';
    else if (score >= 5) severity = 'Medium';

    const newRisk: RiskItem = {
      id: `RSK-00${risks.length + 1}`,
      title: newRiskTitle,
      category: newRiskCategory,
      impact: newRiskImpact,
      likelihood: newRiskLikelihood,
      score,
      severity,
      owner: 'Unassigned',
      mitigationPlan: 'Pending mitigation plan drafting.'
    };

    setRisks([newRisk, ...risks]);
    setNewRiskTitle('');
  };

  const getSeverityBadge = (severity: RiskSeverity) => {
    switch (severity) {
      case 'Critical':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-900/40 text-red-400 border border-red-700/50">Critical</span>;
      case 'High':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-900/40 text-orange-400 border border-orange-700/50">High</span>;
      case 'Medium':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-900/40 text-yellow-400 border border-yellow-700/50">Medium</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-900/40 text-emerald-400 border border-emerald-700/50">Low</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600/20 rounded-lg border border-indigo-500/30">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Enterprise GRC Command Hub</h1>
              <p className="text-xs text-slate-400">Governance, Risk & Compliance Operating Framework</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
              Audit-Ready Status
            </span>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-6 flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-4 px-1 inline-flex items-center text-sm font-medium border-b-2 ${
              activeTab === 'dashboard'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('risks')}
            className={`py-4 px-1 inline-flex items-center text-sm font-medium border-b-2 ${
              activeTab === 'risks'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Risk Register
          </button>
          <button
            onClick={() => setActiveTab('controls')}
            className={`py-4 px-1 inline-flex items-center text-sm font-medium border-b-2 ${
              activeTab === 'controls'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Compliance Controls
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`py-4 px-1 inline-flex items-center text-sm font-medium border-b-2 ${
              activeTab === 'vendors'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Vendor Governance
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {/* DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Total Active Risks</p>
                    <h3 className="text-2xl font-bold mt-1">{risks.length}</h3>
                  </div>
                  <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  {risks.filter(r => r.severity === 'Critical' || r.severity === 'High').length} Requires Immediate Action
                </p>
              </div>

              <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Compliance Rate</p>
                    <h3 className="text-2xl font-bold mt-1">88%</h3>
                  </div>
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-emerald-400 mt-3 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" /> +4% vs last quarter
                </p>
              </div>

              <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Mapped Frameworks</p>
                    <h3 className="text-2xl font-bold mt-1">3</h3>
                  </div>
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3">ISO 27001, SOC 2, NIST CSF</p>
              </div>

              <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Vendor Assessments</p>
                    <h3 className="text-2xl font-bold mt-1">{vendors.length}</h3>
                  </div>
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3">1 Assessment Pending Review</p>
              </div>
            </div>

            {/* Risk Overview Table */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 text-white">Top High-Priority Risks</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs">
                    <tr>
                      <th className="py-3 px-4">Risk ID</th>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Score</th>
                      <th className="py-3 px-4">Severity</th>
                      <th className="py-3 px-4">Owner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {risks.map((risk) => (
                      <tr key={risk.id} className="hover:bg-slate-800/30">
                        <td className="py-3.5 px-4 font-mono text-xs text-slate-400">{risk.id}</td>
                        <td className="py-3.5 px-4 font-medium text-white">{risk.title}</td>
                        <td className="py-3.5 px-4 text-slate-400">{risk.category}</td>
                        <td className="py-3.5 px-4 font-bold">{risk.score}</td>
                        <td className="py-3.5 px-4">{getSeverityBadge(risk.severity)}</td>
                        <td className="py-3.5 px-4 text-slate-400">{risk.owner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* RISK REGISTER VIEW */}
        {activeTab === 'risks' && (
          <div className="space-y-8">
            {/* Add New Risk Form */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 text-white flex items-center">
                <Plus className="w-5 h-5 mr-2 text-indigo-400" /> Log New Security Risk
              </h2>
              <form onSubmit={handleAddRisk} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">Risk Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Unencrypted S3 Bucket Backup"
                    value={newRiskTitle}
                    onChange={(e) => setNewRiskTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Category</label>
                  <select
                    value={newRiskCategory}
                    onChange={(e) => setNewRiskCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Cloud Security">Cloud Security</option>
                    <option value="Application Security">Application Security</option>
                    <option value="Compliance & Privacy">Compliance & Privacy</option>
                    <option value="Identity & Access">Identity & Access</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Impact (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newRiskImpact}
                    onChange={(e) => setNewRiskImpact(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg text-sm transition"
                  >
                    Add Risk
                  </button>
                </div>
              </form>
            </div>

            {/* Risk List */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 text-white">Active Risk Register</h2>
              <div className="space-y-4">
                {risks.map((risk) => (
                  <div key={risk.id} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-lg flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-xs text-slate-500">{risk.id}</span>
                        <h4 className="font-semibold text-white">{risk.title}</h4>
                        {getSeverityBadge(risk.severity)}
                      </div>
                      <p className="text-xs text-slate-400">
                        Category: <span className="text-slate-300">{risk.category}</span> | Impact: {risk.impact} | Likelihood: {risk.likelihood}
                      </p>
                      <p className="text-xs text-slate-400 pt-2">
                        <strong className="text-indigo-400">Mitigation:</strong> {risk.mitigationPlan}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-slate-200">{risk.score}</span>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Risk Score</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COMPLIANCE CONTROLS VIEW */}
        {activeTab === 'controls' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-white">Framework Controls Matrix</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {controls.map((control) => (
                <div key={control.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-indigo-400">{control.framework}</span>
                    <span className="text-xs text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">{control.status}</span>
                  </div>
                  <h4 className="font-medium text-white text-sm mb-1">{control.code}: {control.title}</h4>
                  <div className="text-xs text-slate-500 mt-4 flex justify-between">
                    <span>Owner: {control.owner}</span>
                    <span>Last Audit: {control.lastAuditDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VENDORS VIEW */}
        {activeTab === 'vendors' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-white">Third-Party Vendor Risk Evaluations</h2>
            <div className="space-y-3">
              {vendors.map((vendor) => (
                <div key={vendor.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-white">{vendor.vendorName}</h4>
                    <p className="text-xs text-slate-400">{vendor.serviceProvided}</p>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div>{getSeverityBadge(vendor.riskLevel)}</div>
                    <span className="text-xs text-slate-300 bg-slate-800 px-3 py-1 rounded-md">{vendor.dueDiligenceStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}