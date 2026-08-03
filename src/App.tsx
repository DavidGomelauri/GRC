import React, { useState, useMemo } from 'react';
import { SubControl, NistControl, CorporateAsset, VendorProfile, BusinessProcess, AuditLogEvent } from './types';

const initialVendors: VendorProfile[] = [
  { id: 'vnd-1', name: 'Okta Inc.', serviceProvided: 'Identity & Access Management (IdP)', tier: 'TIER_1_CRITICAL', soc2Status: 'VERIFIED', inherentRiskScore: 4, contactEmail: 'security@okta.com' },
  { id: 'vnd-2', name: 'Amazon Web Services (AWS)', serviceProvided: 'Cloud Infrastructure & Encryption', tier: 'TIER_1_CRITICAL', soc2Status: 'VERIFIED', inherentRiskScore: 5, contactEmail: 'compliance@aws.amazon.com' },
  { id: 'vnd-3', name: 'CrowdStrike Holdings', serviceProvided: 'Endpoint Detection & Threat Telemetry', tier: 'TIER_2_HIGH', soc2Status: 'VERIFIED', inherentRiskScore: 3, contactEmail: 'trust@crowdstrike.com' },
  { id: 'vnd-4', name: 'Legacy Data Center Ltd.', serviceProvided: 'Co-location Physical Hosting', tier: 'TIER_2_HIGH', soc2Status: 'EXPIRED', inherentRiskScore: 4, contactEmail: 'audit@legacyhost.com' },
];

const initialCorporateAssets: CorporateAsset[] = [
  { id: 'ast-1', name: 'AWS Production Kubernetes Cluster', category: 'CLOUD_INFRA', environment: 'PROD', criticalityScore: 5, owner: 'DevOps Team', ipOrDomain: 'k8s.prod.company.internal' },
  { id: 'ast-2', name: 'Core PostgreSQL Customer DB', category: 'DATABASE', environment: 'PROD', criticalityScore: 5, owner: 'Data Engineering', ipOrDomain: '10.0.4.150' },
  { id: 'ast-3', name: 'Okta Enterprise Identity Provider', category: 'SAAS_APP', environment: 'PROD', criticalityScore: 5, owner: 'SecOps Team', ipOrDomain: 'company.okta.com' },
];

const initialBusinessProcesses: BusinessProcess[] = [
  { id: 'bp-1', name: 'Online Core Banking & Payments Gateway', department: 'Operations', rtoHours: 1, rpoHours: 0, financialLossPerHour: 50000, criticalityTier: 'TIER_1_MISSION_CRITICAL', linkedAssetIds: ['ast-1', 'ast-2'] },
  { id: 'bp-2', name: 'Employee Single Sign-On & Authentication', department: 'IT & Security', rtoHours: 2, rpoHours: 1, financialLossPerHour: 15000, criticalityTier: 'TIER_1_MISSION_CRITICAL', linkedAssetIds: ['ast-3'] },
];

const generateAllNistControls = (): NistControl[] => {
  const definitions = [
    { code: 'PR.AA-01', cat: 'Identity Management', fn: 'PROTECT' as const, title: 'Identities and credentials managed', desc: 'Identities and credentials for authorized users, services, and devices are managed.', isoCode: 'A.5.15', isoTitle: 'Access Control Policy', soc2Code: 'CC6.1', soc2Title: 'Logical Access Control' },
    { code: 'PR.DS-01', cat: 'Data Security', fn: 'PROTECT' as const, title: 'Data-at-rest protection', desc: 'Data-at-rest is protected using encryption and appropriate safeguards.', isoCode: 'A.8.24', isoTitle: 'Cryptography Standards', soc2Code: 'CC6.6', soc2Title: 'Data Encryption' },
    { code: 'GV.SC-01', cat: 'Supply Chain Risk', fn: 'GOVERN' as const, title: 'Supply chain risk management program', desc: 'Cybersecurity supply chain risk management processes are established and executed.', isoCode: 'A.5.19', isoTitle: 'Supplier Security', soc2Code: 'CC9.2', soc2Title: 'Vendor Risk Management' },
    { code: 'ID.AM-01', cat: 'Asset Management', fn: 'IDENTIFY' as const, title: 'Inventories of physical assets', desc: 'Inventories of physical devices and systems within the organization are maintained.', isoCode: 'A.5.9', isoTitle: 'Inventory of Assets', soc2Code: 'CC6.8', soc2Title: 'Asset Tracking' },
    { code: 'DE.CM-01', cat: 'Continuous Monitoring', fn: 'DETECT' as const, title: 'Network monitoring for anomalies', desc: 'The network and environmental boundaries are monitored to detect potential events.', isoCode: 'A.8.16', isoTitle: 'Monitoring Activities', soc2Code: 'CC7.2', soc2Title: 'Anomaly Detection' },
    { code: 'RS.MA-01', cat: 'Incident Response', fn: 'RESPOND' as const, title: 'Incident response plan executed', desc: 'Incident response plan is executed during or after a detected cybersecurity event.', isoCode: 'A.5.24', isoTitle: 'Incident Management', soc2Code: 'CC7.4', soc2Title: 'Incident Remediation' },
    { code: 'RC.RP-01', cat: 'Recovery Execution', fn: 'RECOVER' as const, title: 'Recovery plan execution', desc: 'Recovery plans are executed during or after a cybersecurity incident.', isoCode: 'A.5.29', isoTitle: 'Business Continuity', soc2Code: 'A1.2', soc2Title: 'Disaster Recovery' },
  ];

  return definitions.map((def, idx) => {
    let seedSubControls = [];

    if (def.code === 'PR.AA-01') {
      seedSubControls = [
        {
          id: 'sc-okta',
          name: 'Okta Enterprise SSO & MFA Engine',
          linkedAssetId: 'ast-3',
          linkedVendorId: 'vnd-1',
          linkedProcessId: 'bp-2',
          type: 'TECHNOLOGICAL' as const,
          isGatekeeper: true,
          designScore: 90,
          coverageScore: 95,
          executionScore: 90,
          rawWeight: 5,
          evidences: [{ id: 'ev-1', filename: 'Okta_MFA_Enforcement.pdf', uploadedAt: '2026-07-15', size: '1.4 MB' }],
          auditLogs: [{ id: 'log-1', timestamp: '2026-07-15 10:30', author: 'David (GRC Lead)', action: 'Score Update', details: 'Coverage score set to 95%.' }]
        },
        {
          id: 'sc-pass',
          name: 'Corporate Password Standard',
          type: 'GOVERNANCE' as const,
          isGatekeeper: false,
          designScore: 100,
          coverageScore: 100,
          executionScore: 80,
          rawWeight: 2,
          evidences: [],
          auditLogs: []
        }
      ];
    } else {
      seedSubControls = [
        {
          id: `sc-def-${idx}`,
          name: `${def.title} Baseline Sub-Control`,
          type: 'GOVERNANCE' as const,
          isGatekeeper: false,
          designScore: 85,
          coverageScore: 80,
          executionScore: 85,
          rawWeight: 2,
          evidences: [],
          auditLogs: []
        }
      ];
    }

    return {
      code: def.code,
      category: def.cat,
      function: def.fn,
      title: def.title,
      description: def.desc,
      mapping: { iso27001Code: def.isoCode, iso27001Title: def.isoTitle, soc2Code: def.soc2Code, soc2Title: def.soc2Title },
      subControls: seedSubControls,
    };
  });
};

export default function App() {
  const [nistControls, setNistControls] = useState<NistControl[]>(generateAllNistControls);
  const [corporateAssets] = useState<CorporateAsset[]>(initialCorporateAssets);
  const [vendors] = useState<VendorProfile[]>(initialVendors);
  const [businessProcesses] = useState<BusinessProcess[]>(initialBusinessProcesses);

  const [mainView, setMainView] = useState<'DASHBOARD' | 'CONTROLS' | 'ASSETS' | 'TPRM' | 'BIA'>('DASHBOARD');
  const [activeCode, setActiveCode] = useState<string>('PR.AA-01');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const calculateSubControlEfficiency = (item: SubControl): number => {
    return Math.round((item.designScore + item.coverageScore + item.executionScore) / 3);
  };

  const calculateControlScore = (ctrl: NistControl): number => {
    const totalRaw = ctrl.subControls.reduce((sum, sc) => sum + sc.rawWeight, 0);
    if (totalRaw === 0) return 0;

    const isVeto = ctrl.subControls.some((sc) => sc.isGatekeeper && calculateSubControlEfficiency(sc) < 50);
    const agg = ctrl.subControls.reduce((acc, sc) => acc + calculateSubControlEfficiency(sc) * (sc.rawWeight / totalRaw), 0);

    return isVeto ? Math.min(Math.round(agg), 40) : Math.round(agg);
  };

  const overallAssuranceScore = useMemo(() => {
    const scores = nistControls.map((c) => calculateControlScore(c));
    return Math.round(scores.reduce((a, b) => a + b, 0) / (scores.length || 1));
  }, [nistControls]);

  const vetoedCount = useMemo(() => {
    return nistControls.filter((c) => c.subControls.some((sc) => sc.isGatekeeper && calculateSubControlEfficiency(sc) < 50)).length;
  }, [nistControls]);

  const activeControl = nistControls.find((c) => c.code === activeCode) || nistControls[0];
  const isVetoTriggered = activeControl.subControls.some((item) => item.isGatekeeper && calculateSubControlEfficiency(item) < 50);
  const finalMainScore = calculateControlScore(activeControl);

  const handleScoreChange = (subControlId: string, field: keyof SubControl, value: any) => {
    setNistControls((prev) =>
      prev.map((ctrl) => {
        if (ctrl.code !== activeCode) return ctrl;
        return {
          ...ctrl,
          subControls: ctrl.subControls.map((sc) => {
            if (sc.id !== subControlId) return sc;
            const newLog: AuditLogEvent = {
              id: `log-${Date.now()}`,
              timestamp: new Date().toISOString().substring(0, 16).replace('T', ' '),
              author: 'David (GRC Lead)',
              action: `Updated ${String(field)}`,
              details: `Set ${String(field)} to ${value}`,
            };
            return { ...sc, [field]: value, auditLogs: [newLog, ...sc.auditLogs] };
          }),
        };
      })
    );
  };

  const handleSimulateTelemetryDrop = () => {
    handleScoreChange('sc-okta', 'executionScore', 30);
    alert('⚡ Telemetry Event: Okta API flagged policy breach! Execution score reduced to 30% (Gatekeeper Veto Triggered).');
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '24px', backgroundColor: '#f1f5f9', minHeight: '100vh', color: '#0f172a' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', backgroundColor: '#ffffff', padding: '16px 24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div>
            <h1 style={{ fontSize: '20px', margin: 0 }}>🛡️ Enterprise GRC Command Hub</h1>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>Unified NIST CSF 2.0 / ISO 27001 / SOC 2 Suite</p>
          </div>

          <div style={{ display: 'flex', gap: '6px', background: '#f8fafc', padding: '4px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <button onClick={() => setMainView('DASHBOARD')} style={{ padding: '8px 12px', borderRadius: '6px', border: 'none', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: mainView === 'DASHBOARD' ? '#0f172a' : 'transparent', color: mainView === 'DASHBOARD' ? '#fff' : '#64748b' }}>📊 Dashboard</button>
            <button onClick={() => setMainView('CONTROLS')} style={{ padding: '8px 12px', borderRadius: '6px', border: 'none', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: mainView === 'CONTROLS' ? '#0f172a' : 'transparent', color: mainView === 'CONTROLS' ? '#fff' : '#64748b' }}>📋 Controls ({nistControls.length})</button>
            <button onClick={() => setMainView('ASSETS')} style={{ padding: '8px 12px', borderRadius: '6px', border: 'none', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: mainView === 'ASSETS' ? '#0f172a' : 'transparent', color: mainView === 'ASSETS' ? '#fff' : '#64748b' }}>🖥️ Assets ({corporateAssets.length})</button>
            <button onClick={() => setMainView('TPRM')} style={{ padding: '8px 12px', borderRadius: '6px', border: 'none', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: mainView === 'TPRM' ? '#0f172a' : 'transparent', color: mainView === 'TPRM' ? '#fff' : '#64748b' }}>🏢 Vendors ({vendors.length})</button>
            <button onClick={() => setMainView('BIA')} style={{ padding: '8px 12px', borderRadius: '6px', border: 'none', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: mainView === 'BIA' ? '#0f172a' : 'transparent', color: mainView === 'BIA' ? '#fff' : '#64748b' }}>📈 BIA Impact ({businessProcesses.length})</button>
          </div>

          <button onClick={handleSimulateTelemetryDrop} style={{ backgroundColor: '#dc2626', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>⚡ Simulate Telemetry Drop</button>
        </div>

        {/* Dashboard View */}
        {mainView === 'DASHBOARD' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>OVERALL ASSURANCE</span>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: overallAssuranceScore >= 80 ? '#16a34a' : '#d97706' }}>{overallAssuranceScore}%</div>
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>CRITICAL VETO ALERTS</span>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: vetoedCount > 0 ? '#dc2626' : '#16a34a' }}>{vetoedCount}</div>
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>CRITICAL VENDORS</span>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>{vendors.filter(v => v.tier === 'TIER_1_CRITICAL').length}</div>
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>HOURLY DOWNTIME LOSS</span>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#dc2626' }}>${businessProcesses.reduce((a, b) => a + b.financialLossPerHour, 0).toLocaleString()}</div>
            </div>
          </div>
        )}

        {/* Controls Workspace View */}
        {mainView === 'CONTROLS' && (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <input type="text" placeholder="Search controls..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', marginBottom: '12px' }} />
              {nistControls.map((ctrl) => (
                <div key={ctrl.code} onClick={() => setActiveCode(ctrl.code)} style={{ padding: '10px', borderRadius: '8px', marginBottom: '6px', cursor: 'pointer', backgroundColor: ctrl.code === activeCode ? '#f0f9ff' : 'transparent', border: ctrl.code === activeCode ? '1px solid #bae6fd' : '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{ctrl.code}</span>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: calculateControlScore(ctrl) < 50 ? '#dc2626' : '#16a34a' }}>{calculateControlScore(ctrl)}%</span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '2px' }}>{ctrl.title}</div>
                </div>
              ))}
            </div>

            <div>
              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ backgroundColor: '#e0e7ff', color: '#4338ca', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>{activeControl.function}</span>
                    <h2 style={{ margin: '8px 0 4px 0', fontSize: '18px' }}>{activeControl.code}: {activeControl.title}</h2>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>{activeControl.description}</p>
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: isVetoTriggered ? '#dc2626' : finalMainScore >= 80 ? '#16a34a' : '#d97706' }}>{finalMainScore}%</div>
                </div>
              </div>

              {activeControl.subControls.map((sc) => {
                const eff = calculateSubControlEfficiency(sc);
                return (
                  <div key={sc.id} style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', marginBottom: '16px', border: sc.isGatekeeper && eff < 50 ? '2px solid #ef4444' : '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <strong>{sc.name}</strong>
                      <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{eff}%</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                      <div><label style={{ fontSize: '11px' }}>Design: {sc.designScore}%</label><input type="range" min="0" max="100" value={sc.designScore} onChange={(e) => handleScoreChange(sc.id, 'designScore', Number(e.target.value))} style={{ width: '100%' }} /></div>
                      <div><label style={{ fontSize: '11px' }}>Coverage: {sc.coverageScore}%</label><input type="range" min="0" max="100" value={sc.coverageScore} onChange={(e) => handleScoreChange(sc.id, 'coverageScore', Number(e.target.value))} style={{ width: '100%' }} /></div>
                      <div><label style={{ fontSize: '11px' }}>Execution: {sc.executionScore}%</label><input type="range" min="0" max="100" value={sc.executionScore} onChange={(e) => handleScoreChange(sc.id, 'executionScore', Number(e.target.value))} style={{ width: '100%' }} /></div>
                      <div><label style={{ fontSize: '11px' }}>Raw Weight</label><input type="number" min="1" max="10" value={sc.rawWeight} onChange={(e) => handleScoreChange(sc.id, 'rawWeight', Number(e.target.value))} style={{ width: '80%' }} /></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}