import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowDown,
  ArrowUpRight,
  Bell,
  Check,
  ChevronDown,
  CircleAlert,
  Clock3,
  Cloud,
  Download,
  FileKey2,
  Fingerprint,
  Globe2,
  Layers3,
  LockKeyhole,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Server,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TerminalSquare,
  X,
} from 'lucide-react'
import './App.css'

type Certificate = {
  id: string
  domain: string
  issuer: string
  environment: string
  endpoint: string
  expiresOn: string
  daysRemaining: number
  lastRotated: string
  fingerprint: string
  renewalPending: boolean
}

type AuditEvent = {
  id: number
  action: string
  detail: string
  time: string
  tone: 'green' | 'amber' | 'blue'
}

type Filter = 'All' | 'Critical' | 'Expiring soon' | 'Healthy' | 'Renewal pending'

const initialCertificates: Certificate[] = [
  { id: 'cert-01', domain: 'api.kripya.example', issuer: "Let's Encrypt R11", environment: 'Production', endpoint: 'api-gateway-01', expiresOn: 'Nov 27, 2026', daysRemaining: 2, lastRotated: 'Aug 29, 2026', fingerprint: 'A4:2C:91:7F:38:BD:0A:66', renewalPending: false },
  { id: 'cert-02', domain: '*.portal.kripya.example', issuer: 'DigiCert TLS RSA SHA256 2020 CA1', environment: 'Production', endpoint: 'edge-lb-east', expiresOn: 'Nov 30, 2026', daysRemaining: 5, lastRotated: 'Sep 01, 2026', fingerprint: '7D:10:4A:88:C3:52:FE:19', renewalPending: false },
  { id: 'cert-03', domain: 'auth.kripya.example', issuer: "Let's Encrypt R11", environment: 'Production', endpoint: 'identity-service', expiresOn: 'Dec 08, 2026', daysRemaining: 13, lastRotated: 'Sep 09, 2026', fingerprint: 'C2:6B:83:4D:0E:91:2A:5F', renewalPending: false },
  { id: 'cert-04', domain: 'billing.kripya.example', issuer: 'Google Trust Services WE1', environment: 'Staging', endpoint: 'billing-api-02', expiresOn: 'Dec 14, 2026', daysRemaining: 19, lastRotated: 'Sep 15, 2026', fingerprint: '8F:11:6E:BC:73:49:DA:04', renewalPending: false },
  { id: 'cert-05', domain: 'files.kripya.example', issuer: "Let's Encrypt R11", environment: 'Production', endpoint: 'files-web-01', expiresOn: 'Dec 22, 2026', daysRemaining: 27, lastRotated: 'Sep 23, 2026', fingerprint: '51:8D:20:6C:AB:15:77:3E', renewalPending: false },
  { id: 'cert-06', domain: 'status.kripya.example', issuer: 'DigiCert TLS RSA SHA256 2020 CA1', environment: 'Production', endpoint: 'status-page', expiresOn: 'Jan 18, 2027', daysRemaining: 54, lastRotated: 'Oct 20, 2026', fingerprint: '3B:AA:92:48:0D:66:F5:12', renewalPending: false },
  { id: 'cert-07', domain: 'docs.kripya.example', issuer: 'Google Trust Services WE1', environment: 'Development', endpoint: 'docs-web-01', expiresOn: 'Feb 04, 2027', daysRemaining: 71, lastRotated: 'Nov 06, 2026', fingerprint: 'E9:0F:4D:82:2B:AA:19:60', renewalPending: false },
  { id: 'cert-08', domain: 'vpn.kripya.example', issuer: 'DigiCert TLS RSA SHA256 2020 CA1', environment: 'Production', endpoint: 'vpn-gateway', expiresOn: 'Mar 02, 2027', daysRemaining: 97, lastRotated: 'Nov 21, 2026', fingerprint: '6A:1E:55:90:CB:2D:74:08', renewalPending: false },
]

const initialEvents: AuditEvent[] = [
  { id: 1, action: 'Discovery completed', detail: '8 certificates scanned across 4 endpoints', time: '12:42 PM', tone: 'blue' },
  { id: 2, action: 'Certificate renewed', detail: 'vpn.kripya.example · production', time: '11:18 AM', tone: 'green' },
  { id: 3, action: 'Expiry warning sent', detail: 'api.kripya.example · 7 day threshold', time: '10:06 AM', tone: 'amber' },
]

function statusOf(certificate: Certificate) {
  if (certificate.renewalPending) return 'Renewal pending'
  if (certificate.daysRemaining <= 7) return 'Critical'
  if (certificate.daysRemaining <= 30) return 'Expiring soon'
  return 'Healthy'
}

function App() {
  const [certificates, setCertificates] = useState(initialCertificates)
  const [events, setEvents] = useState(initialEvents)
  const [selectedId, setSelectedId] = useState(initialCertificates[0].id)
  const [filter, setFilter] = useState<Filter>('All')
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')
  const [lastDiscovery, setLastDiscovery] = useState('Just now')

  const selected = certificates.find((certificate) => certificate.id === selectedId) ?? certificates[0]
  const filteredCertificates = useMemo(() => certificates.filter((certificate) => {
    const matchesFilter = filter === 'All' || statusOf(certificate) === filter
    const searchText = `${certificate.domain} ${certificate.endpoint} ${certificate.issuer}`.toLowerCase()
    return matchesFilter && searchText.includes(query.toLowerCase())
  }), [certificates, filter, query])
  const criticalCount = certificates.filter((certificate) => statusOf(certificate) === 'Critical').length
  const expiringCount = certificates.filter((certificate) => statusOf(certificate) === 'Expiring soon').length
  const healthyCount = certificates.filter((certificate) => statusOf(certificate) === 'Healthy').length
  const pendingCount = certificates.filter((certificate) => statusOf(certificate) === 'Renewal pending').length

  function addEvent(action: string, detail: string, tone: AuditEvent['tone']) {
    setEvents((current) => [{ id: Date.now(), action, detail, time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }), tone }, ...current])
  }

  function showNotice(message: string) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3600)
  }

  function runDiscovery() {
    setLastDiscovery('Just now')
    addEvent('Discovery completed', `${certificates.length} certificates scanned across 4 endpoints`, 'blue')
    showNotice('Discovery complete · 8 certificates scanned')
  }

  function renewCertificate(certificate: Certificate) {
    const expiry = new Date()
    expiry.setDate(expiry.getDate() + 90)
    const expiresOn = expiry.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    const rotatedOn = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    setCertificates((current) => current.map((item) => item.id === certificate.id
      ? { ...item, renewalPending: true, expiresOn, daysRemaining: 90, lastRotated: rotatedOn }
      : item))
    addEvent('Certificate renewed', `${certificate.domain} · awaiting deployment`, 'green')
    showNotice(`Certificate renewed · ${certificate.domain}`)
  }

  function deployCertificate(certificate: Certificate) {
    setCertificates((current) => current.map((item) => item.id === certificate.id ? { ...item, renewalPending: false } : item))
    addEvent('Certificate deployed', `${certificate.domain} → ${certificate.endpoint}`, 'green')
    showNotice(`Deployment complete · ${certificate.endpoint}`)
  }

  function selectFilter(nextFilter: Filter) {
    setFilter(nextFilter)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark"><ShieldCheck size={19} strokeWidth={2.2} /></div>
          <div><span className="brand-name">rotary</span><span className="brand-caption">CERTIFICATE CONTROL</span></div>
        </div>

        <div className="workspace-switcher">
          <div className="workspace-icon"><Layers3 size={16} /></div>
          <div className="workspace-copy"><span>Kripya Systems</span><small>Operations workspace</small></div>
          <ChevronDown size={15} />
        </div>

        <p className="nav-label">WORKSPACE</p>
        <nav className="primary-nav" aria-label="Primary navigation">
          <a className="nav-item active" href="#overview"><Activity size={17} /><span>Overview</span></a>
          <a className="nav-item" href="#inventory"><FileKey2 size={17} /><span>Certificates</span><span className="nav-count">{certificates.length}</span></a>
          <a className="nav-item" href="#inventory" onClick={() => selectFilter('Renewal pending')}><Cloud size={17} /><span>Deployments</span>{pendingCount > 0 && <span className="nav-count">{pendingCount}</span>}</a>
          <a className="nav-item" href="#audit"><Fingerprint size={17} /><span>Audit log</span></a>
        </nav>

        <p className="nav-label nav-label-spaced">MANAGE</p>
        <nav className="primary-nav" aria-label="Management navigation">
          <button className="nav-item" type="button" onClick={runDiscovery}><Globe2 size={17} /><span>Discovery sources</span><span className="nav-dot" /></button>
          <a className="nav-item" href="#settings"><SlidersHorizontal size={17} /><span>Settings</span></a>
        </nav>

        <div className="sidebar-bottom">
          <div className="side-status"><span className="pulse-dot" /><span>All systems operational</span></div>
          <div className="user-profile">
            <div className="avatar">SK</div>
            <div className="user-copy"><span>Surya K</span><small>Platform admin</small></div>
            <MoreHorizontal size={18} />
          </div>
        </div>
      </aside>

      <main className="main-area" id="overview">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>Overview</strong></div>
          <div className="topbar-actions">
            <span className="environment-pill"><span /> Demo environment</span>
            <button type="button" className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><i /></button>
            <div className="top-avatar">SK</div>
          </div>
        </header>

        <div className="page-content">
          <section className="page-heading">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> CERTIFICATE OPERATIONS <span className="eyebrow-date">WED, NOV 25</span></div>
              <h1>Good afternoon, Surya<span>.</span></h1>
              <p className="heading-subtitle">Here’s the current health of your certificate fleet.</p>
            </div>
            <div className="heading-actions">
              <button type="button" className="button button-secondary" onClick={() => showNotice('Export prepared · CSV is simulated in this prototype')}><Download size={16} /> Export</button>
              <button type="button" className="button button-primary" onClick={runDiscovery}><RefreshCw size={16} /> Run discovery</button>
            </div>
          </section>

          <section className="summary-grid" aria-label="Certificate summary">
            <article className="summary-card summary-total">
              <div className="summary-top"><span>Total certificates</span><span className="summary-icon blue-icon"><FileKey2 size={17} /></span></div>
              <div className="summary-value">{certificates.length}<span className="summary-unit">certificates</span></div>
              <div className="summary-foot"><span className="mini-bar"><i style={{ width: '76%' }} /></span><span>Across 4 endpoints</span></div>
            </article>
            <article className="summary-card summary-critical">
              <div className="summary-top"><span>Critical</span><span className="summary-icon red-icon"><CircleAlert size={17} /></span></div>
              <div className="summary-value">{criticalCount}<span className="summary-unit">need attention</span></div>
              <button type="button" className="summary-link red-link" onClick={() => selectFilter('Critical')}>View expiring <ArrowUpRight size={14} /></button>
            </article>
            <article className="summary-card summary-expiring">
              <div className="summary-top"><span>Expiring soon</span><span className="summary-icon amber-icon"><Clock3 size={17} /></span></div>
              <div className="summary-value">{expiringCount}<span className="summary-unit">in 30 days</span></div>
              <button type="button" className="summary-link amber-link" onClick={() => selectFilter('Expiring soon')}>Review schedule <ArrowUpRight size={14} /></button>
            </article>
            <article className="summary-card summary-healthy">
              <div className="summary-top"><span>Healthy</span><span className="summary-icon green-icon"><ShieldCheck size={17} /></span></div>
              <div className="summary-value">{healthyCount}<span className="summary-unit">certificates</span></div>
              <div className="health-progress"><span style={{ width: `${Math.round((healthyCount / certificates.length) * 100)}%` }} /></div>
              <span className="health-percent">{Math.round((healthyCount / certificates.length) * 100)}% fleet health</span>
            </article>
          </section>

          <section className="fleet-section" id="inventory">
            <div className="section-heading">
              <div><h2>Certificate inventory</h2><p>Discovered certificates across your connected endpoints</p></div>
              <button type="button" className="text-button" onClick={runDiscovery}><RefreshCw size={14} /> Sync now</button>
            </div>

            <div className="inventory-toolbar">
              <div className="filter-tabs" role="tablist" aria-label="Filter certificates">
                {(['All', 'Critical', 'Expiring soon', 'Healthy', 'Renewal pending'] as Filter[]).map((item) => (
                  <button type="button" role="tab" aria-selected={filter === item} key={item} className={`filter-tab ${filter === item ? 'selected' : ''}`} onClick={() => selectFilter(item)}>
                    {item}{item === 'Critical' && criticalCount > 0 && <span className="tab-count critical-tab-count">{criticalCount}</span>}{item === 'Renewal pending' && pendingCount > 0 && <span className="tab-count">{pendingCount}</span>}
                  </button>
                ))}
              </div>
              <div className="toolbar-tools">
                <label className="search-box"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search certificates" aria-label="Search certificates" />{query && <button aria-label="Clear search" type="button" onClick={() => setQuery('')}><X size={14} /></button>}</label>
                <button type="button" className="icon-button filter-button" aria-label="Filter options" onClick={() => showNotice('Showing all environments')}><SlidersHorizontal size={16} /></button>
              </div>
            </div>

            <div className="table-wrap">
              <table className="certificate-table">
                <thead><tr><th>DOMAIN <ArrowDown size={12} /></th><th>STATUS</th><th>ISSUER</th><th>ENVIRONMENT</th><th>EXPIRES IN</th><th aria-label="Select" /></tr></thead>
                <tbody>
                  {filteredCertificates.map((certificate) => {
                    const status = statusOf(certificate)
                    return <tr key={certificate.id} className={selectedId === certificate.id ? 'row-selected' : ''} onClick={() => setSelectedId(certificate.id)}>
                      <td><div className="domain-cell"><span className={`domain-mark ${status === 'Critical' ? 'mark-critical' : status === 'Renewal pending' ? 'mark-pending' : ''}`}><LockKeyhole size={14} /></span><span><strong>{certificate.domain}</strong><small>{certificate.endpoint}</small></span></div></td>
                      <td><span className={`status-badge ${status.toLowerCase().replaceAll(' ', '-')}`}><i />{status}</span></td>
                      <td className="issuer-cell">{certificate.issuer}</td>
                      <td><span className={`env-tag ${certificate.environment.toLowerCase()}`}>{certificate.environment}</span></td>
                      <td><span className={`expiry-cell ${certificate.daysRemaining <= 7 && !certificate.renewalPending ? 'expiry-critical' : ''}`}>{certificate.renewalPending ? 'Ready to deploy' : `${certificate.daysRemaining} days`}</span><small className="expiry-date">{certificate.expiresOn}</small></td>
                      <td><button type="button" className="row-open" aria-label={`View ${certificate.domain}`} onClick={(event) => { event.stopPropagation(); setSelectedId(certificate.id) }}><ArrowUpRight size={15} /></button></td>
                    </tr>
                  })}
                  {filteredCertificates.length === 0 && <tr><td className="empty-state" colSpan={6}><Search size={20} /><span>No certificates match this view.</span><button type="button" onClick={() => { setFilter('All'); setQuery('') }}>Clear filters</button></td></tr>}
                </tbody>
              </table>
            </div>
            <div className="table-footer"><span>Showing <strong>{filteredCertificates.length}</strong> of <strong>{certificates.length}</strong> certificates</span><span><span className="live-dot" /> Last discovery: {lastDiscovery}</span></div>
          </section>

          <section className="lower-grid">
            <article className="detail-panel">
              <div className="panel-heading"><div><span className="panel-kicker">SELECTED CERTIFICATE</span><button className="panel-more" type="button" aria-label="More certificate options"><MoreHorizontal size={18} /></button></div><h3>{selected.domain}</h3><span className={`status-badge ${statusOf(selected).toLowerCase().replaceAll(' ', '-')}`}><i />{statusOf(selected)}</span></div>
              <div className="detail-facts">
                <div><span>ENDPOINT</span><strong><Server size={14} />{selected.endpoint}</strong></div>
                <div><span>ISSUER</span><strong>{selected.issuer}</strong></div>
                <div><span>EXPIRES</span><strong>{selected.expiresOn} <small>({selected.daysRemaining} days)</small></strong></div>
                <div><span>LAST ROTATED</span><strong>{selected.lastRotated}</strong></div>
              </div>
              <div className="fingerprint"><Fingerprint size={15} /><span>SHA-256</span><code>{selected.fingerprint}</code><button type="button" aria-label="Copy fingerprint" onClick={() => showNotice('Fingerprint copied to clipboard')}><Plus size={14} /></button></div>
              <div className="panel-actions">
                <button type="button" className="button button-secondary" onClick={() => showNotice(`Certificate details · ${selected.domain}`)}><ArrowUpRight size={15} /> View details</button>
                {selected.renewalPending
                  ? <button type="button" className="button button-primary deploy-button" onClick={() => deployCertificate(selected)}><TerminalSquare size={15} /> Deploy certificate</button>
                  : <button type="button" className="button button-primary" onClick={() => renewCertificate(selected)}><RefreshCw size={15} /> Renew now</button>}
              </div>
            </article>

            <article className="activity-panel" id="audit">
              <div className="activity-heading"><div><h2>Recent activity</h2><p>Latest changes across your fleet</p></div><button type="button" className="icon-button" aria-label="Activity options"><MoreHorizontal size={18} /></button></div>
              <div className="activity-list">
                {events.slice(0, 4).map((event) => <div className="activity-item" key={event.id}><span className={`activity-icon ${event.tone}`}>{event.tone === 'green' ? <Check size={14} /> : event.tone === 'amber' ? <Clock3 size={14} /> : <RefreshCw size={14} />}</span><div className="activity-copy"><strong>{event.action}</strong><span>{event.detail}</span></div><time>{event.time}</time></div>)}
              </div>
              <button type="button" className="activity-link" onClick={() => showNotice('You are viewing the latest audit events')} >View full audit log <ArrowUpRight size={14} /></button>
            </article>
          </section>

          <footer className="page-footer"><span><Sparkles size={13} /> Rotation engine ready</span><span>Prototype build · v0.1.0</span></footer>
        </div>
      </main>
      {notice && <div className="toast" role="status"><Check size={16} />{notice}<button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')}><X size={14} /></button></div>}
    </div>
  )
}

export default App
