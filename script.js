
const BUILD = {
  version: '3.0.4',
  label: 'v3.0.4 REAL MAP MARKER CARDS'
};

const config = window.COPILOT_SECURITY_CONFIG || {};
const supabase = new window.CoPilotSupabaseClient(config);
const app = document.getElementById('app');

const state = {
  booting: true,
  publicView: 'login',
  profile: null,
  role: null,
  view: 'dashboard',
  status: 'Ready',
  settings: [],
  guards: [],
  clients: [],
  guardSignups: [],
  clientSignups: [],
  properties: [],
  patrolRequests: [],
  proofItems: [],
  patrolReports: [],
  notifications: [],
  patrolActivity: [],
  messageThreads: [],
  messages: [],
  selectedThreadId: '',
  thanks: null
};;
const liveGps = {
  online: false,
  watchId: null,
  guardLat: null,
  guardLng: null,
  accuracy: null,
  currentAddress: 'Location not active',
  lastUpdate: null,
  propertyLat: null,
  propertyLng: null,
  propertyAddress: '',
  routePoints: [],
  routeDistanceMiles: null,
  routeEtaMin: null,
  geocodeBusy: false,
  routeBusy: false,
  selectedMapCard: null,
  gpsMode: 'idle',
  leafletMap: null,
  leafletLayer: null,
  mapNotice: 'Go Online to start live GPS tracking.'
}

const NAV = {
  admin: [
    ['dashboard', '⌂', 'Dashboard'],
    ['dispatch-board', '▤', 'Dispatch Board'],
    ['live-gps', '⌖', 'Live GPS'],
    ['pending-dispatch', '⏳', 'Pending Dispatch'],
    ['scheduled-queue', '☷', 'Scheduled Queue'],
    ['messages', '☵', 'Messages'],
    ['notifications', '♧', 'Notifications'],
    ['heading', '', 'Operations'],
    ['guards', '◎', 'Guards'],
    ['guard-approvals', '✓', 'Guard Approvals'],
    ['clients', '◌', 'Clients'],
    ['activity-log', '▦', 'Activity Log'],
    ['proof-review', '⬆', 'Proof Review'],
    ['report-builder', '▣', 'Report Builder'],
    ['report-archive', '☰', 'Report Archive'],
    ['heading', '', 'Account'],
    ['settings', '⚙', 'Settings']
  ],
  guard: [
    ['dashboard', '⌂', 'Dashboard'],
    ['active-job', '▤', 'Active Job'],
    ['route-gps', '⌖', 'Route / GPS'],
    ['upload-proof', '⬆', 'Upload Proof'],
    ['messages', '☵', 'Messages'],
    ['notifications', '♧', 'Notifications'],
    ['heading', '', 'Account'],
    ['settings', '⚙', 'Settings']
  ],
  client: [
    ['dashboard', '⌂', 'Dashboard'],
    ['properties', '⌂', 'Properties'],
    ['patrol-requests', '▤', 'Patrol Requests'],
    ['reports', '▣', 'Reports'],
    ['messages', '☵', 'Messages'],
    ['notifications', '♧', 'Notifications'],
    ['heading', '', 'Account'],
    ['settings', '⚙', 'Settings']
  ]
};

function esc(value = '') {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}
function initials(value = '') {
  const parts = String(value || '').trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || 'C') + (parts[1]?.[0] || '')).toUpperCase();
}
function fmtTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  return isNaN(d.getTime()) ? '—' : d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}
function fmtDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  return isNaN(d.getTime()) ? '—' : d.toLocaleString();
}
function timeAgo(value) {
  if (!value) return '—';
  const d = new Date(value).getTime();
  if (!Number.isFinite(d)) return '—';
  const mins = Math.max(0, Math.floor((Date.now() - d) / 60000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
function roleLabel(role = '') {
  if (role === 'admin') return 'Dispatch';
  if (role === 'guard') return 'Guard';
  if (role === 'client') return 'Client';
  return 'User';
}
function toast(message, type = 'error') {
  document.querySelectorAll('.toast').forEach(el => el.remove());
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.style.cssText = 'position:fixed;right:18px;bottom:66px;z-index:999999;padding:13px 16px;border-radius:10px;border:1px solid rgba(114,171,233,.24);background:rgba(5,16,29,.96);color:#edf7ff;box-shadow:0 18px 45px rgba(0,0,0,.32);max-width:380px;';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 5600);
}
function friendly(err) {
  const raw = String(err?.message || err || 'Unknown error');
  if (raw.includes('Failed to fetch')) return 'Connection failed. Check Supabase URL/key and network.';
  return raw;
}
function ensureBadge() {
  let badge = document.querySelector('.cp-build-badge');
  if (!badge) {
    badge = document.createElement('div');
    badge.className = 'cp-build-badge';
    document.body.appendChild(badge);
  }
  badge.textContent = BUILD.label;
}

function avatar(name = '', url = '') {
  const safe = String(url || '').trim();
  return safe ? `<div class="avatar"><img src="${esc(safe)}" alt="${esc(name)}"></div>` : `<div class="avatar">${esc(initials(name))}</div>`;
}
function statusText(status = '') {
  return ({
    pending_dispatch: 'Pending Dispatch',
    assigned: 'Assigned',
    accepted: 'Accepted',
    in_progress: 'In Progress',
    completed: 'Completed'
  })[status] || String(status || 'Unknown').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
function statusChip(status = 'pending_dispatch') {
  const s = String(status || 'pending_dispatch');
  const color = s === 'completed' ? '#b05cff' : s === 'in_progress' ? '#37dc72' : s === 'pending_dispatch' ? '#2e7dff' : '#ffb53d';
  return `<span style="display:inline-flex;align-items:center;border:1px solid ${color}55;background:${color}22;color:#fff;border-radius:999px;padding:6px 10px;font-weight:900;font-size:12px;">${esc(statusText(s))}</span>`;
}

function propertyById(id) { return state.properties.find(item => String(item.id) === String(id)) || {}; }
function guardById(id) { return state.guards.find(item => String(item.id) === String(id)) || {}; }
function clientById(id) { return state.clients.find(item => String(item.id) === String(id)) || {}; }
function requestById(id) { return state.patrolRequests.find(item => String(item.id) === String(id)) || null; }
function reportByRequestId(id) { return state.patrolReports.find(item => String(item.request_id) === String(id)) || null; }
function proofForRequest(id) { return state.proofItems.filter(item => String(item.request_id) === String(id)); }
function requestTitle(req = {}) { return `Request #${String(req.request_number || req.id || '').slice(0, 8)}`; }
function propertyLabel(req = {}) {
  const p = propertyById(req.property_id);
  return p.label || p.name || req.property_name || 'Property';
}
function propertyAddress(req = {}) {
  const p = propertyById(req.property_id);
  return [p.address || p.address_line1, p.city, p.state, p.zip_code].filter(Boolean).join(', ') || 'Address unavailable';
}
function requestClientName(req = {}) {
  const c = clientById(req.client_id);
  return c.name || c.display_name || c.email || 'Client';
}
function requestGuardName(req = {}) {
  const g = guardById(req.guard_id || req.assigned_guard_id);
  return g.name || g.display_name || g.email || 'Unassigned';
}
function requestElapsed(req = {}) {
  const base = req.started_at || req.accepted_at || req.assigned_at || req.created_at;
  if (!base) return '00:00';
  const mins = Math.max(0, Math.floor((Date.now() - new Date(base).getTime()) / 60000));
  return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
}

function pendingRequests() { return state.patrolRequests.filter(r => String(r.status) === 'pending_dispatch'); }
function activeRequests() { return state.patrolRequests.filter(r => ['assigned', 'accepted', 'in_progress'].includes(String(r.status))); }
function completedRequests() { return state.patrolRequests.filter(r => String(r.status) === 'completed'); }
function scheduledRequests() { return state.patrolRequests.filter(r => r.scheduled_for || r.requested_for || r.scheduled_at); }
function proofWaiting() { return state.proofItems.filter(p => !p.report_selected); }
function reportsReady() { return completedRequests().filter(r => !reportByRequestId(r.id)?.released_at); }
function guardApprovals() { return state.guardSignups.filter(g => !g.status || String(g.status) === 'pending'); }
function clientApprovals() { return state.clientSignups.filter(c => !c.status || String(c.status) === 'pending'); }
function unreadMessagesCount() { return state.messageThreads.filter(t => Number(t.unread_count || 0) > 0).length; }
function unreadNotificationsCount() { return state.notifications.filter(n => !n.read_at).length; }
function activeAlertCount() {
  const alertNotes = state.notifications.filter(n => /alert|alarm|urgent|priority|incident|battery/i.test(`${n.title || ''} ${n.message || ''}`));
  return alertNotes.length || activeRequests().filter(r => /high|urgent/i.test(String(r.priority || ''))).length;
}

async function loadData() {
  const data = await supabase.rpc('cp_get_app_data', {});
  if (!data?.ok) throw new Error(data?.message || 'No approved profile found for this login.');
  state.profile = data.profile;
  state.role = data.profile?.role;
  state.settings = data.settings || [];
  state.guards = data.guards || [];
  state.clients = data.clients || [];
  state.guardSignups = data.guardSignups || [];
  state.clientSignups = data.clientSignups || [];
  state.properties = data.properties || [];
  state.patrolRequests = data.patrolRequests || [];
  state.proofItems = data.proofItems || [];
  state.patrolReports = data.patrolReports || [];
  state.notifications = data.notifications || [];
  state.patrolActivity = data.patrolActivity || [];
  state.messageThreads = data.messageThreads || [];
  state.messages = data.messages || [];
  state.status = 'Connected';
  if (!state.view) state.view = 'dashboard';
}

async function login(form) {
  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value;
  const expected = form.role.value;
  await supabase.signIn(email, password);
  await loadData();
  if (state.role !== expected) {
    await supabase.signOut();
    state.profile = null;
    state.role = null;
    throw new Error(`This account is approved as ${roleLabel(state.role)}, not ${roleLabel(expected)}.`);
  }
  state.view = 'dashboard';
  render();
  toast(`Logged in as ${roleLabel(state.role)}.`, 'success');
}

async function ownerSetup(form) {
  const business = form.business.value.trim();
  const name = form.name.value.trim();
  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value;
  try {
    const result = await supabase.signUp(email, password, { role: 'admin', display_name: name });
    if (!result?.access_token) await supabase.signIn(email, password);
  } catch (err) {
    const msg = String(err.message || '').toLowerCase();
    if (!(msg.includes('already') || msg.includes('registered') || msg.includes('exists'))) throw err;
    await supabase.signIn(email, password);
  }
  await supabase.rpc('cp_bootstrap_owner_admin', {
    p_email: email,
    p_display_name: name,
    p_business_name: business
  });
  await loadData();
  state.view = 'dashboard';
  render();
  toast('Dispatch account ready.', 'success');
}

async function submitGuardSignup(form) {
  const name = form.name.value.trim();
  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value;
  const phone = form.phone.value.trim();
  let uid = null;
  try {
    const result = await supabase.signUp(email, password, { role: 'guard', display_name: name, phone });
    uid = result?.user?.id || result?.id || null;
  } catch (err) {
    const msg = String(err.message || '').toLowerCase();
    if (!(msg.includes('already') || msg.includes('registered') || msg.includes('exists'))) throw err;
  }
  await supabase.rpc('cp_submit_guard_signup', {
    p_auth_user_id: uid,
    p_name: name,
    p_email: email,
    p_phone: phone,
    p_vehicle: form.vehicle.value.trim(),
    p_license_plate: form.license_plate.value.trim(),
    p_work_card_number: form.work_card_number.value.trim()
  });
  state.publicView = 'thanks';
  state.thanks = { type: 'guard', email };
  render();
}

async function submitClientSignup(form) {
  const name = form.name.value.trim();
  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value;
  const phone = form.phone.value.trim();
  let uid = null;
  try {
    const result = await supabase.signUp(email, password, { role: 'client', display_name: name, phone });
    uid = result?.user?.id || result?.id || null;
  } catch (err) {
    const msg = String(err.message || '').toLowerCase();
    if (!(msg.includes('already') || msg.includes('registered') || msg.includes('exists'))) throw err;
  }
  await supabase.rpc('cp_submit_client_signup', {
    p_auth_user_id: uid,
    p_name: name,
    p_email: email,
    p_phone: phone,
    p_notes: form.notes.value.trim()
  });
  state.publicView = 'thanks';
  state.thanks = { type: 'client', email };
  render();
}

async function logout() {
  await supabase.signOut();
  state.profile = null;
  state.role = null;
  state.view = 'dashboard';
  state.publicView = 'login';
  render();
}

async function approveSignup(kind, id) {
  await supabase.rpc(kind === 'guard' ? 'cp_approve_guard_signup' : 'cp_approve_client_signup', { p_signup_id: id });
  await loadData();
  render();
  toast(`${kind === 'guard' ? 'Guard' : 'Client'} approved.`, 'success');
}

async function rejectSignup(kind, id) {
  await supabase.rpc(kind === 'guard' ? 'cp_reject_guard_signup' : 'cp_reject_client_signup', { p_signup_id: id });
  await loadData();
  render();
  toast(`${kind === 'guard' ? 'Guard' : 'Client'} rejected.`, 'success');
}

async function uploadProof(form) {
  const requestId = form.request_id.value;
  const files = [...(form.proof_files.files || [])];
  const note = form.note.value.trim();
  if (!requestId) throw new Error('Choose a patrol request.');
  if (!files.length) throw new Error('Choose at least one photo or video.');

  for (const file of files) {
    const kind = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : '';
    if (!kind) throw new Error('Only photo or video files are allowed.');
    const safe = String(file.name || 'proof').replace(/[^a-zA-Z0-9._-]/g, '_').slice(-90);
    const objectPath = `${requestId}/${Date.now()}-${Math.random().toString(16).slice(2)}-${safe}`;
    await supabase.uploadStorageObject('patrol-proof', objectPath, file, { upsert: false });
    const publicUrl = supabase.getPublicUrl('patrol-proof', objectPath);
    await supabase.rpc('cp_guard_register_patrol_proof', {
      p_request_id: requestId,
      p_bucket_id: 'patrol-proof',
      p_object_path: objectPath,
      p_file_name: safe,
      p_file_type: file.type || kind,
      p_file_size: file.size || 0,
      p_public_url: publicUrl,
      p_note: note
    });
  }

  await loadData();
  state.view = state.role === 'guard' ? 'upload-proof' : 'proof-review';
  render();
  toast('Proof uploaded.', 'success');
}

function renderLoading() {
  app.innerHTML = `<div class="auth-shell"><div class="auth-card"><section class="auth-hero"><div class="brand-row"><div class="logo-box">CP</div><div><strong>Co Pilot</strong><small>Security</small></div></div><h1>Loading Command Center</h1><p>Connecting to Supabase.</p></section><section class="auth-panel"><div class="auth-box"><p class="eyebrow">Loading</p><h2>Preparing app</h2><p class="auth-note">Loading your role, patrol data, messages, notifications, and reports.</p></div></section></div></div>`;
  ensureBadge();
  scheduleGuardLeafletMap();
}

function renderPublic() {
  const tab = state.publicView;
  let content = '';

  if (tab === 'login') {
    content = `<p class="eyebrow">Secure Login</p><h2>Security Login</h2><p class="auth-note">Login after your account is approved. Guards and clients sign up first, then Dispatch approves them.</p>
      <form class="form-grid" data-form="login">
        <label>Login As<select name="role" required><option value="guard">Guard</option><option value="client">Client</option><option value="admin">Dispatch</option></select></label>
        <label>Email<input type="email" name="email" required placeholder="name@email.com"></label>
        <label>Password<input type="password" name="password" required placeholder="Password"></label>
        <div class="button-row"><button class="btn" type="submit">Continue Securely</button></div>
      </form>`;
  } else if (tab === 'guard-signup') {
    content = `<p class="eyebrow">Guard Application</p><h2>Guard Sign Up</h2><p class="auth-note">Create a guard login. Dispatch approves the account before access.</p>
      <form class="form-grid" data-form="guard-signup">
        <label>Full Name<input name="name" required placeholder="Guard name"></label>
        <label>Email<input name="email" type="email" required placeholder="guard@email.com"></label>
        <label>Create Password<input name="password" type="password" minlength="6" required></label>
        <label>Phone<input name="phone" placeholder="(702) 555-0000"></label>
        <div class="form-row"><label>Vehicle<input name="vehicle" placeholder="Patrol unit"></label><label>License Plate<input name="license_plate" placeholder="Plate #"></label></div>
        <label>Work Card<input name="work_card_number" placeholder="Optional"></label>
        <div class="button-row"><button class="btn success" type="submit">Submit Guard Application</button></div>
      </form>`;
  } else if (tab === 'client-signup') {
    content = `<p class="eyebrow">Client Application</p><h2>Client Sign Up</h2><p class="auth-note">Create a client login. Dispatch approves the account before access.</p>
      <form class="form-grid" data-form="client-signup">
        <label>Full Name<input name="name" required placeholder="Client name"></label>
        <label>Email<input name="email" type="email" required placeholder="client@email.com"></label>
        <label>Create Password<input name="password" type="password" minlength="6" required></label>
        <label>Phone<input name="phone" placeholder="(702) 555-0000"></label>
        <label>Notes<textarea name="notes" placeholder="Optional notes for Dispatch"></textarea></label>
        <div class="button-row"><button class="btn success" type="submit">Submit Client Application</button></div>
      </form>`;
  } else if (tab === 'owner-setup') {
    content = `<p class="eyebrow">Dispatch Setup</p><h2>Create Dispatch</h2><p class="auth-note">Use this for the initial owner/admin account.</p>
      <form class="form-grid" data-form="owner-setup">
        <label>Business Name<input name="business" required placeholder="Co Pilot Security"></label>
        <label>Owner / Dispatch Name<input name="name" required placeholder="Owner Admin"></label>
        <label>Email<input name="email" type="email" required placeholder="dispatch@email.com"></label>
        <label>Create Password<input name="password" type="password" minlength="6" required></label>
        <div class="button-row"><button class="btn success" type="submit">Create Dispatch Account</button></div>
      </form>`;
  } else {
    content = `<p class="eyebrow">Application Received</p><h2>Submitted</h2><p class="auth-note">Your ${esc(state.thanks?.type || 'account')} application for ${esc(state.thanks?.email || '')} has been submitted. Dispatch must approve your account.</p><div class="button-row"><button class="btn secondary" data-public-view="login">Back To Login</button></div>`;
  }

  app.innerHTML = `<div class="auth-shell">
    <div class="auth-card">
      <section class="auth-hero">
        <div>
          <div class="brand-row"><div class="logo-box">CP</div><div><strong>Co Pilot</strong><small>Security</small></div></div>
          <h1>Modern command-center layout.</h1>
          <p>This is the clean rebuild package coded around the exact dashboard grid: left sidebar, KPI row, wide main canvas, right rail, command map, activity table, and bottom-right badge.</p>
          <div class="auth-hero-grid">
            <div class="auth-point"><i>01</i><div><strong>Exact grid foundation</strong><span>220px sidebar, 1fr main, 340px right rail, and nested dashboard grids.</span></div></div>
            <div class="auth-point"><i>02</i><div><strong>No legacy layout files</strong><span>Fresh Bolt package with clean CSS and render logic.</span></div></div>
            <div class="auth-point"><i>03</i><div><strong>Same Supabase</strong><span>Existing auth, app data, signups, proof, reports, messages, and notifications remain connected.</span></div></div>
          </div>
        </div>
        <span class="version-mini">${esc(BUILD.label)}</span>
      </section>
      <section class="auth-panel">
        <div class="auth-tabs">
          <button class="auth-tab ${tab === 'login' ? 'active' : ''}" data-public-view="login">Login</button>
          <button class="auth-tab ${tab === 'guard-signup' ? 'active' : ''}" data-public-view="guard-signup">Guard Sign Up</button>
          <button class="auth-tab ${tab === 'client-signup' ? 'active' : ''}" data-public-view="client-signup">Client Sign Up</button>
          <button class="auth-tab ${tab === 'owner-setup' ? 'active' : ''}" data-public-view="owner-setup">Create Dispatch</button>
        </div>
        <div class="auth-box">${content}</div>
      </section>
    </div>
  </div>`;
  ensureBadge();
}

function navBadge(view) {
  if (view === 'messages') return unreadMessagesCount();
  if (view === 'notifications') return unreadNotificationsCount();
  if (view === 'pending-dispatch') return pendingRequests().length;
  if (view === 'guard-approvals') return guardApprovals().length;
  if (view === 'proof-review') return proofWaiting().length;
  return '';
}

function renderSidebar() {
  const role = state.role || 'admin';
  const name = state.profile?.display_name || state.profile?.name || state.profile?.email || 'Owner Admin';
  const photo = state.profile?.avatar_url || state.profile?.profile_photo_url || '';
  return `<aside class="sidebar">
    <div class="sidebar-brand"><div class="logo-box">CP</div><div><strong>Co Pilot</strong><small>Security</small></div></div>
    <div class="profile-card">${avatar(name, photo)}<div><strong>${esc(name)}</strong><span>${esc(roleLabel(role))} • <b>Online</b></span></div><i>⌄</i></div>
    <div class="nav-scroll">
      ${(NAV[role] || NAV.admin).map(item => {
        if (item[0] === 'heading') return `<div class="nav-heading">${esc(item[2])}</div>`;
        const badge = navBadge(item[0]);
        return `<button class="nav-item ${state.view === item[0] ? 'active' : ''}" data-view="${esc(item[0])}"><i>${esc(item[1])}</i><span>${esc(item[2])}</span>${badge ? `<b>${esc(badge)}</b>` : ''}</button>`;
      }).join('')}
    </div>
    <div class="sidebar-footer">
      <button class="nav-item logout-item" data-action="logout"><i>↪</i><span>Logout</span></button>
      <span class="version-mini">v3.0.1</span>
    </div>
  </aside>`;
}

function kpiCard(icon, title, value, sub, color) {
  return `<button class="kpi-card" style="--accent:${esc(color)}" data-kpi="${esc(title)}">
    <div class="kpi-icon">${esc(icon)}</div>
    <div><strong>${esc(title)}</strong><b>${esc(value)}</b><span>${esc(sub)}</span></div>
  </button>`;
}
function overviewCell(icon, title, value, action, view, color) {
  return `<button class="overview-cell" style="--accent:${esc(color)}" data-view="${esc(view)}">
    <div class="overview-icon">${esc(icon)}</div>
    <div><strong>${esc(title)}</strong><b>${esc(value)}</b><span>${esc(action)} →</span></div>
  </button>`;
}
function priorityRow(title, level, count, color, view) {
  return `<button class="priority-row" style="--tone:${esc(color)}" data-view="${esc(view)}">
    <i class="priority-dot"></i><span>${esc(title)}</span><em>${esc(level)}</em><b>${esc(count)}</b>
  </button>`;
}
function patrolRow(req) {
  return `<button class="patrol-row" data-view="live-gps">
    <i class="patrol-dot"></i>
    <span><strong>${esc(propertyLabel(req))}</strong><small>${esc(requestGuardName(req))}</small></span>
    <em>${esc(requestElapsed(req))}</em>
    <span class="signal"><i></i><i></i><i></i></span>
  </button>`;
}
function mapArea() {
  const active = activeRequests();
  const markers = active.length ? active.slice(0, 5).map((req, idx) => {
    const pos = [
      ['18%', '70%', 'green', '4'],
      ['35%', '42%', 'green', '3'],
      ['58%', '54%', 'blue', ''],
      ['74%', '38%', 'red', '△'],
      ['86%', '62%', 'green', '2']
    ][idx] || ['50%', '50%', 'blue', ''];
    return `<div class="marker ${pos[2]}" style="left:${pos[0]};top:${pos[1]}">${esc(pos[3])}</div>`;
  }).join('') : `
    <div class="marker green" style="left:24%;top:67%">4</div>
    <div class="marker green" style="left:40%;top:40%">3</div>
    <div class="marker blue" style="left:58%;top:55%">⌖</div>
    <div class="marker red" style="left:75%;top:38%">△</div>
    <div class="marker green" style="left:86%;top:62%">2</div>
  `;
  return `<div class="map-area">
    <div class="road one"></div><div class="road two"></div><div class="road three"></div><div class="road four"></div>
    <div class="map-controls"><button>＋</button><button>−</button><button>▰</button></div>
    ${markers}
    <div class="map-legend"><span><i style="--dot:#37dc72"></i>Active Patrol</span><span><i style="--dot:#2e7dff"></i>Guard</span><span><i style="--dot:#ff5973"></i>Alert</span></div>
  </div>`;
}

function feedRow(icon, title, body, time, iconClass = '') {
  return `<button class="feed-row">
    <i class="${iconClass ? `feed-icon ${iconClass}` : 'feed-avatar'}">${esc(icon)}</i>
    <span><strong>${esc(title)}</strong><small>${esc(body)}</small></span>
    <em>${esc(time)}</em>
  </button>`;
}

function adminDashboard() {
  const pending = pendingRequests();
  const active = activeRequests();
  const unread = unreadMessagesCount();
  const alerts = activeAlertCount();

  return `<div class="dashboard">
    <header class="dashboard-header">
      <div class="title-block"><h1>Dispatch Dashboard</h1><p>Real-time overview of your operations</p></div>
      <div class="header-actions"><span class="system-pill"><i></i>System Operational</span><button class="header-button">🔔${unreadNotificationsCount() ? `<b>${esc(unreadNotificationsCount())}</b>` : ''}</button><button class="header-button">☷</button></div>
    </header>

    <section class="kpi-row">
      ${kpiCard('☑', 'Pending Dispatch', pending.length, `${Math.max(pending.length, 0)} need assignment`, '#2f83ff')}
      ${kpiCard('●', 'Active Patrols', active.length, `${Math.max(active.length, 0)} on duty`, '#37dc72')}
      ${kpiCard('☵', 'Unread Messages', unread, unread ? `${unread} new` : 'All caught up', '#b05cff')}
      ${kpiCard('⚠', 'Active Alerts', alerts, alerts ? `${alerts} high priority` : 'No high priority', '#ffb53d')}
    </section>

    <section class="dashboard-grid">
      <div class="dashboard-left">
        <div class="top-panel-grid">
          <section class="panel panel-pad">
            <div class="panel-head"><div><h2>Dispatch Overview</h2><p>Operational readiness at a glance</p></div></div>
            <div class="overview-grid">
              ${overviewCell('●', 'Patrols Needing Assignment', pending.length, 'View queue', 'pending-dispatch', '#2f83ff')}
              ${overviewCell('▣', 'Proof Waiting Review', proofWaiting().length, 'Review now', 'proof-review', '#b05cff')}
              ${overviewCell('▤', 'Reports Ready', reportsReady().length, 'Release reports', 'report-builder', '#37dc72')}
              ${overviewCell('◎', 'Guard Approvals', guardApprovals().length, 'Review approvals', 'guard-approvals', '#ffb53d')}
            </div>
          </section>

          <section class="panel panel-pad">
            <div class="panel-head"><div><h2>Priority Queue</h2><p>Next actions</p></div><button class="ghost-button" data-view="dispatch-board">View all</button></div>
            <div class="priority-list">
              ${priorityRow(`Assign ${pending.length} pending patrols`, 'High', pending.length, '#ff5973', 'pending-dispatch')}
              ${priorityRow(`Review ${proofWaiting().length} proofs`, 'Medium', proofWaiting().length, '#ffb53d', 'proof-review')}
              ${priorityRow(`Release ${reportsReady().length} completed reports`, 'Medium', reportsReady().length, '#ffb53d', 'report-builder')}
              ${priorityRow(`${guardApprovals().length} guard approvals`, 'Low', guardApprovals().length, '#37dc72', 'guard-approvals')}
            </div>
          </section>
        </div>

        <section class="panel map-card">
          <div class="panel-head"><div><h2>Dispatch Command Map</h2><p>Live view of patrols and incidents</p></div><div class="map-head-actions"><button class="ghost-button" data-view="dispatch-board">Open Dispatch Board</button><button class="primary-button" data-view="live-gps">Live GPS</button><button class="ghost-button">⛶</button></div></div>
          ${mapArea()}
        </section>

        <section class="panel panel-pad">
          <div class="panel-head"><div><h2>Recent Activity</h2></div><button class="ghost-button" data-view="activity-log">View all</button></div>
          <div class="activity-table">
            <div class="activity-head"><span>Event</span><span>Details</span><span>Guard / Client</span><span>Time</span></div>
            ${(state.patrolActivity.slice(0,4).map(item => {
              const req = requestById(item.request_id) || {};
              return `<div class="activity-row"><strong><span class="event-pill">✓</span>${esc(item.title || item.event_type || 'Activity')}</strong><span>${esc(item.details || item.message || propertyLabel(req))}</span><span>${esc(requestGuardName(req) || requestClientName(req))}</span><span>${esc(timeAgo(item.created_at))}</span></div>`;
            }).join('')) || `<div class="activity-row"><strong><span class="event-pill">✓</span>Patrol started</strong><span>Site A - Building Perimeter Patrol</span><span>Tony Smith</span><span>2 min ago</span></div><div class="activity-row"><strong><span class="event-pill">▣</span>Proof submitted</strong><span>Site B - Main Entrance Check</span><span>Maria Garcia</span><span>8 min ago</span></div><div class="activity-row"><strong><span class="event-pill">!</span>Incident reported</strong><span>Site C - Late Gate Found Open</span><span>James Lee</span><span>15 min ago</span></div><div class="activity-row"><strong><span class="event-pill">✓</span>Report completed</strong><span>Site D - Night Patrol Report</span><span>Alex Johnson</span><span>22 min ago</span></div>`}
          </div>
        </section>
      </div>

      <aside class="dashboard-right">
        <section class="panel panel-pad">
          <div class="panel-head"><div><h2>Active Patrols (${esc(active.length)})</h2><p>Field units</p></div><button class="ghost-button" data-view="live-gps">View all</button></div>
          <div class="rail-list">${active.length ? active.slice(0,4).map(patrolRow).join('') : `<div class="empty">No active patrols right now.</div>`}</div>
        </section>

        <section class="panel panel-pad">
          <div class="panel-head"><div><h2>Messages</h2><p>Dispatch inbox</p></div><button class="ghost-button" data-view="messages">View all</button></div>
          <div class="feed-list">${state.messageThreads.length ? state.messageThreads.slice(0,3).map(t => feedRow(initials(t.subject || t.title || 'D'), t.subject || t.title || 'Conversation', t.last_message_preview || 'No messages yet', fmtTime(t.updated_at || t.created_at))).join('') : `${feedRow('T', 'Tony Smith', 'All clear at north gate.', '2m ago')}${feedRow('M', 'Maria Garcia', 'Need assistance at Site B.', '6m ago')}${feedRow('D', 'Dispatch Team', 'New post orders available.', '12m ago')}`}</div>
        </section>

        <section class="panel panel-pad">
          <div class="panel-head"><div><h2>Notifications</h2><p>Alerts and updates</p></div><button class="ghost-button" data-view="notifications">View all</button></div>
          <div class="feed-list">${state.notifications.length ? state.notifications.slice(0,3).map(n => feedRow((n.title || 'N').slice(0,1), n.title || n.event_type || 'Notification', n.message || n.details || '', timeAgo(n.created_at), /alarm|alert|urgent/i.test(n.title || '') ? 'red' : 'blue')).join('') : `${feedRow('!', 'Gate alarm triggered', 'Site C - North Gate', '5m ago', 'red')}${feedRow('!', 'Low battery', 'Guard device - Tony Smith', '18m ago', 'amber')}${feedRow('▣', 'New report ready', 'Site D - Night Patrol', '22m ago', 'blue')}`}</div>
        </section>

        <section class="panel panel-pad">
          <div class="panel-head"><div><h2>System Status</h2></div><button class="ghost-button">All Good</button></div>
          <div class="system-grid">
            <div class="system-item"><i>⌖</i><strong>GPS</strong><span>Online</span></div>
            <div class="system-item"><i>▤</i><strong>Server</strong><span>Online</span></div>
            <div class="system-item"><i>●</i><strong>Database</strong><span>Online</span></div>
            <div class="system-item"><i>♧</i><strong>Notifications</strong><span>Online</span></div>
          </div>
        </section>
      </aside>
    </section>
  </div>`;
}


function guardCurrentRequest() {
  return activeRequests()[0] || state.patrolRequests[0] || null;
}

function guardJobFlow(req) {
  const proof = req ? proofForRequest(req.id)[0] : null;
  const steps = req ? [
    ['Accepted', req.accepted_at || req.assigned_at, ['accepted','in_progress','completed'].includes(String(req.status)), '✓'],
    ['On The Way', req.accepted_at || req.assigned_at, ['accepted','in_progress','completed'].includes(String(req.status)), '➜'],
    ['Share GPS', req.started_at || req.accepted_at, ['accepted','in_progress','completed'].includes(String(req.status)), '⌖'],
    ['Arrived', req.started_at, ['in_progress','completed'].includes(String(req.status)), '⌾'],
    ['Checking', req.started_at, String(req.status) === 'in_progress' || String(req.status) === 'completed', '◫'],
    ['Upload Proof', proof?.created_at || proof?.uploaded_at, Boolean(proof), '⬆'],
    ['Complete', req.completed_at, String(req.status) === 'completed', '✓']
  ] : [];
  return `<section class="panel panel-pad guard-flow-panel">
    <div class="panel-head"><div><h2>Job Flow</h2><p>Field workflow status</p></div></div>
    ${steps.length ? `<div class="guard-flow">
      ${steps.map(([label,time,done,icon], idx) => {
        const current = !done && steps.slice(0, idx).every(s => s[2]);
        return `<div class="guard-step ${done ? 'done' : current ? 'current' : 'wait'}"><i>${esc(icon)}</i><strong>${esc(label)}</strong><small>${esc(fmtTime(time))}</small></div>`;
      }).join('')}
    </div>
    <div class="guard-flow-footer"><span><i></i>Status: ${esc(statusText(req.status))}</span><small>Updated ${esc(timeAgo(req.updated_at || req.created_at))}</small></div>` : `<div class="empty">No active workflow yet.</div>`}
  </section>`;
}

function guardCurrentAssignment(req) {
  if (!req) {
    return `<section class="panel panel-pad guard-current-card"><div class="empty"><strong>No Current Assignment</strong><br>When Dispatch assigns a patrol, it will appear here.</div></section>`;
  }
  return `<section class="panel panel-pad guard-current-card">
    <div class="panel-head"><div><h2>Current Assignment</h2><p>${esc(requestTitle(req))}</p></div>${statusChip(req.status)}</div>
    <div class="guard-current-main">
      <div class="guard-shield">🛡</div>
      <div>
        <h3>${esc(propertyLabel(req))}</h3>
        <p>${esc(propertyAddress(req))}</p>
        <span>${esc(requestClientName(req))}</span>
      </div>
    </div>
    <div class="guard-tags">
      <span>Since ${esc(fmtTime(req.assigned_at || req.accepted_at || req.created_at))}</span>
      <span>${esc(req.priority || 'Normal')}</span>
      <span>${esc(req.patrol_type || 'Standard')}</span>
    </div>
    <div class="guard-actions">
      <button class="primary-button" data-view="active-job">Open Active Job</button>
      <button class="ghost-button" data-view="route-gps">Open Route / GPS</button>
      <button class="ghost-button" data-view="upload-proof">Upload Proof</button>
    </div>
  </section>`;
}

function guardActivityTable(req) {
  const activity = req ? state.patrolActivity.filter(item => String(item.request_id) === String(req.id)).slice(0, 4) : [];
  const fallback = req ? [
    { title:'Assignment Opened', details:`${propertyLabel(req)} patrol ready`, created_at:req.created_at },
    { title:'Guard Assigned', details:`${requestGuardName(req)} assigned to request`, created_at:req.assigned_at || req.created_at },
    { title:'GPS Ready', details:'Route and proof workflow available', created_at:req.updated_at || req.created_at }
  ] : [];
  const rows = activity.length ? activity : fallback;
  return `<section class="panel panel-pad">
    <div class="panel-head"><div><h2>Today’s Activity</h2><p>Latest guard timeline</p></div><button class="ghost-button" data-view="activity-log">View all</button></div>
    <div class="activity-table">
      <div class="activity-head"><span>Event</span><span>Details</span><span>Person</span><span>Time</span></div>
      ${rows.length ? rows.map(item => `<div class="activity-row"><strong><span class="event-pill">✓</span>${esc(item.title || item.event_type || 'Activity')}</strong><span>${esc(item.details || item.message || '')}</span><span>${esc(requestGuardName(req || {}))}</span><span>${esc(timeAgo(item.created_at))}</span></div>`).join('') : `<div class="activity-row"><strong><span class="event-pill">✓</span>Dashboard loaded</strong><span>Guard grid active</span><span>Guard</span><span>Now</span></div>`}
    </div>
  </section>`;
}

function guardRightRail(req) {
  const messages = state.messageThreads.slice(0, 3);
  const notes = state.notifications.slice(0, 3);
  return `<aside class="dashboard-right">
    <section class="panel panel-pad">
      <div class="panel-head"><div><h2>Open Job</h2><p>Current patrol focus</p></div><button class="ghost-button" data-view="active-job">View</button></div>
      ${req ? `<div class="open-job-box"><strong>${esc(requestTitle(req))}</strong><p>${esc(propertyLabel(req))}</p><span>${esc(statusText(req.status))}</span><button class="primary-button" data-view="active-job">Continue Job</button></div>` : `<div class="empty">No open job.</div>`}
    </section>

    <section class="panel panel-pad">
      <div class="panel-head"><div><h2>Messages</h2><p>Dispatch communication</p></div><button class="ghost-button" data-view="messages">View all</button></div>
      <div class="feed-list">${messages.length ? messages.map(t => feedRow(initials(t.subject || t.title || 'D'), t.subject || t.title || 'Conversation', t.last_message_preview || 'No messages yet', fmtTime(t.updated_at || t.created_at))).join('') : `<div class="empty">No messages yet.</div>`}</div>
    </section>

    <section class="panel panel-pad">
      <div class="panel-head"><div><h2>Notifications</h2><p>New assignments and updates</p></div><button class="ghost-button" data-view="notifications">View all</button></div>
      <div class="feed-list">${notes.length ? notes.map(n => feedRow((n.title || 'N').slice(0,1), n.title || n.event_type || 'Notification', n.message || n.details || '', timeAgo(n.created_at), 'blue')).join('') : `<div class="empty">No notifications.</div>`}</div>
    </section>

    <section class="panel panel-pad">
      <div class="panel-head"><div><h2>Status</h2><p>All systems operational</p></div><button class="ghost-button">Refresh</button></div>
      <div class="guard-status-grid">
        <div><strong>${esc(activeRequests().length)}</strong><span>Open Jobs</span></div>
        <div><strong>0</strong><span>Incidents</span></div>
        <div class="ring"><strong>100%</strong><span>GPS</span></div>
      </div>
    </section>
  </aside>`;
}

function guardDashboardExact() {
  const req = guardCurrentRequest();
  const active = activeRequests();
  const inProgress = state.patrolRequests.filter(r => String(r.status) === 'in_progress');
  return `<div class="dashboard guard-dashboard-exact">
    <header class="dashboard-header">
      <div class="title-block"><h1>Guard Dashboard</h1><p>Real-time overview of your assignments, patrols, and communications.</p></div>
      <div class="header-actions"><span class="system-pill"><i></i>System Operational</span><button class="header-button">🔔${unreadNotificationsCount() ? `<b>${esc(unreadNotificationsCount())}</b>` : ''}</button><button class="header-button">☷</button></div>
    </header>

    <section class="kpi-row">
      ${kpiCard('▤', 'Open Assignments', active.length, active.length ? 'Current field jobs' : 'No pending assignments', '#2f83ff')}
      ${kpiCard('●', 'In Progress', inProgress.length, 'Patrols in motion', '#37dc72')}
      ${kpiCard('☵', 'Unread Messages', unreadMessagesCount(), 'Dispatch conversations', '#b05cff')}
      ${kpiCard('▣', 'Proof Uploaded', state.proofItems.length, 'Guard uploads available', '#ffb53d')}
    </section>

    <section class="dashboard-grid">
      <div class="dashboard-left">
        <div class="top-panel-grid guard-top-grid">
          ${guardCurrentAssignment(req)}
          ${guardJobFlow(req)}
        </div>

        <section class="panel map-card">
          <div class="panel-head"><div><h2>Route / GPS</h2><p>Live view of patrol route and location.</p></div><div class="map-head-actions"><button class="ghost-button" data-view="active-job">Open Active Job</button><button class="primary-button" data-view="route-gps">Route / GPS</button><button class="ghost-button">⛶</button></div></div>
          ${mapArea()}
        </section>

        ${guardActivityTable(req)}
      </div>

      ${guardRightRail(req)}
    </section>
  </div>`;
}



function milesBetween(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const toRad = n => n * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
function getPropertyCoords(req) {
  const p = propertyById(req?.property_id);
  const lat = Number(p.latitude ?? p.lat ?? p.property_latitude ?? p.geo_lat ?? req?.property_latitude ?? req?.latitude);
  const lng = Number(p.longitude ?? p.lng ?? p.lon ?? p.property_longitude ?? p.geo_lng ?? req?.property_longitude ?? req?.longitude);
  if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
  return null;
}
function getPropertyPhotoUrl(req) {
  const p = propertyById(req?.property_id);
  return p.photo_url || p.image_url || p.property_photo_url || p.reference_photo_url || p.logo_url || '';
}
function propertyOwnerName(req) {
  const p = propertyById(req?.property_id);
  return p.owner_name || p.contact_name || p.client_name || requestClientName(req) || 'Owner / Client';
}
function propertyCardAddress(req) {
  return liveGps.propertyAddress || propertyAddress(req) || 'Property address unavailable';
}
function getGuardPhotoUrl() {
  return state.profile?.avatar_url || state.profile?.profile_photo_url || state.profile?.photo_url || '';
}
function activeGuardName() {
  return state.profile?.display_name || state.profile?.name || state.profile?.email || 'Guard';
}
function activeGuardEmail() {
  return state.profile?.email || '';
}
function estimateEtaMinutes(distanceMiles) {
  if (!Number.isFinite(distanceMiles)) return null;
  const averageCityMph = 28;
  return Math.max(1, Math.round((distanceMiles / averageCityMph) * 60));
}
function mapPercentForPoint(lat, lng, bounds) {
  if (!bounds || !Number.isFinite(lat) || !Number.isFinite(lng)) return { x: 50, y: 50 };
  const lngSpan = bounds.maxLng - bounds.minLng || .01;
  const latSpan = bounds.maxLat - bounds.minLat || .01;
  return {
    x: Math.max(4, Math.min(96, ((lng - bounds.minLng) / lngSpan) * 100)),
    y: Math.max(4, Math.min(96, (1 - ((lat - bounds.minLat) / latSpan)) * 100))
  };
}
function currentMapBounds() {
  const points = [];
  if (Number.isFinite(liveGps.guardLat) && Number.isFinite(liveGps.guardLng)) points.push([liveGps.guardLat, liveGps.guardLng]);
  if (Number.isFinite(liveGps.propertyLat) && Number.isFinite(liveGps.propertyLng)) points.push([liveGps.propertyLat, liveGps.propertyLng]);
  for (const p of liveGps.routePoints || []) {
    if (Number.isFinite(p.lat) && Number.isFinite(p.lng)) points.push([p.lat, p.lng]);
  }
  if (!points.length) {
    return { minLat: 36.07, maxLat: 36.20, minLng: -115.30, maxLng: -115.08 };
  }
  let minLat = Math.min(...points.map(p => p[0]));
  let maxLat = Math.max(...points.map(p => p[0]));
  let minLng = Math.min(...points.map(p => p[1]));
  let maxLng = Math.max(...points.map(p => p[1]));
  const latPad = Math.max(.006, (maxLat - minLat) * .35);
  const lngPad = Math.max(.006, (maxLng - minLng) * .35);
  return { minLat: minLat - latPad, maxLat: maxLat + latPad, minLng: minLng - lngPad, maxLng: maxLng + lngPad };
}
function routeSvgPath(bounds) {
  const route = liveGps.routePoints && liveGps.routePoints.length ? liveGps.routePoints : [];
  if (route.length >= 2) {
    return route.map((pt, idx) => {
      const p = mapPercentForPoint(pt.lat, pt.lng, bounds);
      return `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
    }).join(' ');
  }
  if (Number.isFinite(liveGps.guardLat) && Number.isFinite(liveGps.propertyLat)) {
    const g = mapPercentForPoint(liveGps.guardLat, liveGps.guardLng, bounds);
    const p = mapPercentForPoint(liveGps.propertyLat, liveGps.propertyLng, bounds);
    const midX = (g.x + p.x) / 2;
    const midY = (g.y + p.y) / 2;
    return `M ${g.x.toFixed(2)} ${g.y.toFixed(2)} C ${(midX - 10).toFixed(2)} ${(midY + 16).toFixed(2)}, ${(midX + 12).toFixed(2)} ${(midY - 14).toFixed(2)}, ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  }
  return '';
}
async function reverseGeocodeGuard(lat, lng) {
  try {
    const key = `cp_reverse_${lat.toFixed(4)}_${lng.toFixed(4)}`;
    const cached = sessionStorage.getItem(key);
    if (cached) {
      liveGps.currentAddress = cached;
      return cached;
    }
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&zoom=18&addressdetails=1`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error('Reverse geocode failed');
    const data = await res.json();
    const address = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    liveGps.currentAddress = address;
    sessionStorage.setItem(key, address);
    return address;
  } catch (err) {
    liveGps.currentAddress = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    return liveGps.currentAddress;
  }
}
async function geocodePropertyIfNeeded(req) {
  const existing = getPropertyCoords(req);
  if (existing) {
    liveGps.propertyLat = existing.lat;
    liveGps.propertyLng = existing.lng;
    liveGps.propertyAddress = propertyAddress(req);
    return existing;
  }
  const addr = propertyAddress(req);
  if (!addr || addr === 'Address unavailable') return null;
  if (liveGps.geocodeBusy) return null;
  liveGps.geocodeBusy = true;
  try {
    const key = `cp_geo_${addr.toLowerCase()}`;
    const cached = sessionStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      liveGps.propertyLat = parsed.lat;
      liveGps.propertyLng = parsed.lng;
      liveGps.propertyAddress = addr;
      return parsed;
    }
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(addr)}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error('Geocode failed');
    const data = await res.json();
    const item = data[0];
    if (!item) throw new Error('Property not geocoded');
    const coords = { lat: Number(item.lat), lng: Number(item.lon) };
    if (Number.isFinite(coords.lat) && Number.isFinite(coords.lng)) {
      sessionStorage.setItem(key, JSON.stringify(coords));
      liveGps.propertyLat = coords.lat;
      liveGps.propertyLng = coords.lng;
      liveGps.propertyAddress = addr;
      return coords;
    }
  } catch (err) {
    liveGps.mapNotice = 'Property address could not be geocoded yet.';
  } finally {
    liveGps.geocodeBusy = false;
  }
  return null;
}
async function fetchRouteIfPossible() {
  if (!Number.isFinite(liveGps.guardLat) || !Number.isFinite(liveGps.propertyLat)) return;
  if (liveGps.routeBusy) return;
  liveGps.routeBusy = true;
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${liveGps.guardLng},${liveGps.guardLat};${liveGps.propertyLng},${liveGps.propertyLat}?overview=full&geometries=geojson&steps=false`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Route service failed');
    const data = await res.json();
    const route = data?.routes?.[0];
    const coords = route?.geometry?.coordinates || [];
    if (coords.length >= 2) {
      liveGps.routePoints = coords.map(([lng, lat]) => ({ lat, lng }));
      liveGps.routeDistanceMiles = route.distance ? route.distance / 1609.344 : milesBetween(liveGps.guardLat, liveGps.guardLng, liveGps.propertyLat, liveGps.propertyLng);
      liveGps.routeEtaMin = route.duration ? Math.max(1, Math.round(route.duration / 60)) : estimateEtaMinutes(liveGps.routeDistanceMiles);
      liveGps.mapNotice = 'Live route active. ETA updates as guard location changes.';
    }
  } catch (err) {
    const miles = milesBetween(liveGps.guardLat, liveGps.guardLng, liveGps.propertyLat, liveGps.propertyLng);
    liveGps.routeDistanceMiles = miles;
    liveGps.routeEtaMin = estimateEtaMinutes(miles);
    liveGps.routePoints = [];
    liveGps.mapNotice = 'Route service unavailable; showing estimated path and ETA.';
  } finally {
    liveGps.routeBusy = false;
  }
}
async function syncGpsForCurrentJob() {
  const req = guard302CurrentRequest();
  if (req) await geocodePropertyIfNeeded(req);
  if (Number.isFinite(liveGps.guardLat) && Number.isFinite(liveGps.propertyLat)) {
    await fetchRouteIfPossible();
  }
  render();
}
function setGuardOnline() {
  if (!navigator.geolocation) {
    liveGps.mapNotice = 'This browser does not support location tracking.';
    render();
    return;
  }
  if (liveGps.watchId !== null) navigator.geolocation.clearWatch(liveGps.watchId);
  liveGps.online = true;
  liveGps.gpsMode = 'online';
  liveGps.selectedMapCard = null;
  liveGps.mapNotice = 'Waiting for live GPS permission/location...';
  render();
  liveGps.watchId = navigator.geolocation.watchPosition(async position => {
    liveGps.guardLat = position.coords.latitude;
    liveGps.guardLng = position.coords.longitude;
    liveGps.accuracy = position.coords.accuracy;
    liveGps.lastUpdate = new Date().toISOString();
    liveGps.online = true;
    liveGps.gpsMode = 'online';
    await reverseGeocodeGuard(liveGps.guardLat, liveGps.guardLng);
    await syncGpsForCurrentJob();
  }, error => {
    liveGps.online = false;
    liveGps.gpsMode = 'offline';
    liveGps.selectedMapCard = null;
    liveGps.mapNotice = error?.message || 'Location permission denied or unavailable.';
    render();
  }, {
    enableHighAccuracy: true,
    maximumAge: 5000,
    timeout: 15000
  });
}
function setGuardOffline() {
  if (liveGps.watchId !== null) {
    navigator.geolocation.clearWatch(liveGps.watchId);
    liveGps.watchId = null;
  }
  liveGps.online = false;
  liveGps.gpsMode = 'offline';
  liveGps.selectedMapCard = null;
  liveGps.routePoints = [];
  liveGps.mapNotice = 'Guard is offline. Live location tracking stopped.';
  render();
}
function openMapCard(type) {
  liveGps.selectedMapCard = type;
  render();
}
function closeMapCard() {
  liveGps.selectedMapCard = null;
  render();
}

function guard302CurrentRequest() {
  return activeRequests()[0] || state.patrolRequests[0] || null;
}

function guard302Flow(req) {
  const proof = req ? proofForRequest(req.id)[0] : null;
  const status = String(req?.status || 'assigned');
  const steps = req ? [
    ['Accepted', req.accepted_at || req.assigned_at || req.created_at, ['accepted','in_progress','completed','assigned'].includes(status), '✓'],
    ['On The Way', req.accepted_at || req.assigned_at, ['accepted','in_progress','completed'].includes(status), '➜'],
    ['Share GPS', req.started_at || req.accepted_at, ['accepted','in_progress','completed'].includes(status), '⌖'],
    ['Arrived', req.started_at, ['in_progress','completed'].includes(status), '⌾'],
    ['Checking', req.started_at, ['in_progress','completed'].includes(status), '◫'],
    ['Upload Proof', proof?.created_at || proof?.uploaded_at, Boolean(proof), '⬆'],
    ['Complete', req.completed_at, status === 'completed', '✓']
  ] : [];
  return `<section class="panel panel-pad guard302-flow-card">
    <div class="guard302-card-head"><div><h2>Job Flow</h2><p>Field workflow status</p></div></div>
    ${steps.length ? `<div class="guard302-flow">
      ${steps.map(([label,time,done,icon], idx) => {
        const current = !done && steps.slice(0, idx).every(s => s[2]);
        return `<div class="guard302-step ${done ? 'done' : current ? 'current' : 'wait'}"><i>${esc(icon)}</i><strong>${esc(label)}</strong><small>${esc(fmtTime(time))}</small></div>`;
      }).join('')}
    </div>
    <div class="guard302-flow-footer"><span><i></i>Status: ${esc(statusText(req.status))}</span><small>Updated ${esc(timeAgo(req.updated_at || req.created_at))} ⟳</small></div>` : `<div class="empty">No active workflow yet.</div>`}
  </section>`;
}

function guard302CurrentAssignment(req) {
  if (!req) {
    return `<section class="panel panel-pad guard302-current"><div class="empty"><strong>No Current Assignment</strong><br>When Dispatch assigns a patrol, it will appear here.</div></section>`;
  }
  return `<section class="panel panel-pad guard302-current">
    <div class="guard302-card-head"><div><h2>Current Assignment</h2></div></div>
    <div class="guard302-assignment-main">
      <div class="guard302-shield">🛡</div>
      <div>
        <h3>${esc(requestTitle(req))} <span>${esc(liveGps.online ? 'Online' : statusText(req.status))}</span></h3>
        <strong>${esc(propertyLabel(req))}</strong>
        <p>${esc(propertyAddress(req))}</p>
      </div>
    </div>
    <div class="guard302-tags">
      <span>◴ ${liveGps.online ? 'GPS Live' : 'GPS Offline'}</span>
      <span>ETA: ${esc(liveGps.routeEtaMin ? liveGps.routeEtaMin + ' min' : '—')}</span>
      <span>Distance: ${esc(liveGps.routeDistanceMiles ? liveGps.routeDistanceMiles.toFixed(1) + ' mi' : '—')}</span>
    </div>
    <div class="guard302-assignment-actions">
      <button type="button" class="guard302-online ${liveGps.gpsMode === 'online' ? 'active' : ''}" data-action="guard-online">Go Online</button>
      <button type="button" class="guard302-offline ${liveGps.gpsMode === 'offline' ? 'active' : ''}" data-action="guard-offline">Go Offline</button>
      <button type="button" class="guard302-primary" data-view="active-job">Open Active Job <b>›</b></button>
    </div>
  </section>`;
}

function guard302Map(req) {
  const hasGuard = liveGps.online && Number.isFinite(liveGps.guardLat) && Number.isFinite(liveGps.guardLng);
  const hasProperty = Number.isFinite(liveGps.propertyLat) && Number.isFinite(liveGps.propertyLng);
  return `<section class="panel panel-pad guard302-map-card">
    <div class="guard302-card-head"><div><h2>Route / GPS <span class="guard302-live ${liveGps.online ? 'on' : ''}">${liveGps.online ? 'Live' : 'Offline'}</span></h2></div></div>
    <div class="guard302-leaflet-wrap">
      <div id="guard302-live-leaflet-map" class="guard302-leaflet-map" data-online="${liveGps.online ? '1' : '0'}"></div>
      ${!window.L ? `<div class="guard302-map-fallback">Loading real street map layer...</div>` : ''}
      ${liveGps.selectedMapCard === 'guard' && hasGuard ? guard302GuardCard(req) : ''}
      ${liveGps.selectedMapCard === 'property' && hasProperty ? guard302PropertyCard(req) : ''}
      <div class="guard302-map-status">${esc(liveGps.mapNotice)} ${liveGps.lastUpdate ? 'Last update ' + timeAgo(liveGps.lastUpdate) + '.' : ''}</div>
    </div>
    <div class="guard302-map-stats">
      <div><small>ETA to Property</small><strong>${esc(liveGps.routeEtaMin ? liveGps.routeEtaMin + ' min' : '—')}</strong></div>
      <div><small>Distance</small><strong>${esc(liveGps.routeDistanceMiles ? liveGps.routeDistanceMiles.toFixed(1) + ' mi' : '—')}</strong></div>
      <div><small>Accuracy</small><strong>${esc(liveGps.accuracy ? '±' + Math.round(liveGps.accuracy) + ' ft' : '—')} <i></i></strong></div>
    </div>
    <div class="guard302-map-actions">
      <button type="button" data-action="guard-online">Share My Location <span>⌁</span></button>
      <button type="button" data-action="map-card" data-card="guard">Guard Card <span>▣</span></button>
      <button type="button" data-action="map-card" data-card="property">Property Card <span>⌂</span></button>
    </div>
  </section>`;
}
function guard302GuardCard(req) {
  const photo = getGuardPhotoUrl();
  const name = activeGuardName();
  return `<div class="guard302-live-card">
    <button type="button" class="guard302-card-close" data-action="close-map-card">×</button>
    <div>${avatar(name, photo)}</div>
    <div>
      <strong>${esc(name)}</strong>
      <small>${esc(activeGuardEmail())}</small>
      <p>${esc(liveGps.currentAddress || 'Waiting for live GPS address...')}</p>
      <span>${liveGps.online ? 'Online · Live GPS' : 'Offline'}${liveGps.accuracy ? ' · Accuracy ±' + Math.round(liveGps.accuracy) + ' ft' : ''}</span>
    </div>
  </div>`;
}
function guard302PropertyCard(req) {
  const photo = getPropertyPhotoUrl(req);
  const owner = propertyOwnerName(req);
  const label = propertyLabel(req);
  const fallbackLogo = `<div class="avatar">${esc(initials(label || owner))}</div>`;
  const img = photo ? `<div class="avatar"><img src="${esc(photo)}" alt="${esc(label)}"></div>` : fallbackLogo;
  return `<div class="guard302-live-card property">
    <button type="button" class="guard302-card-close" data-action="close-map-card">×</button>
    <div>${img}</div>
    <div>
      <strong>${esc(label)}</strong>
      <small>Owner / Client: ${esc(owner)}</small>
      <p>${esc(propertyCardAddress(req))}</p>
      <span>Active job property · Red pulse marker</span>
    </div>
  </div>`;
}


function guard302Activity(req) {
  const activity = req ? state.patrolActivity.filter(item => String(item.request_id) === String(req.id)).slice(0, 5) : [];
  const fallback = req ? [
    { created_at: req.started_at, title: 'Arrived on Site', details: `${propertyLabel(req)} · Check-in confirmed` },
    { created_at: req.accepted_at || req.assigned_at, title: 'Shared GPS', details: 'Location shared · Accuracy: 28 ft' },
    { created_at: req.assigned_at || req.created_at, title: 'Job Accepted', details: `${requestTitle(req)} · Routine Patrol` },
    { created_at: req.created_at, title: 'Dispatch Assigned', details: 'By Dispatch · Officer assigned' }
  ] : [];
  const rows = activity.length ? activity : fallback;
  return `<section class="panel panel-pad guard302-activity">
    <div class="guard302-card-head"><div><h2>Today’s Activity</h2></div><button class="ghost-button" data-view="activity-log">View All</button></div>
    <div class="guard302-activity-table">
      <div class="guard302-activity-head"><span>Time</span><span>Event</span><span>Location / Details</span><span></span></div>
      ${rows.length ? rows.map(item => `<div class="guard302-activity-row"><span>${esc(fmtTime(item.created_at))}</span><strong>${esc(item.title || item.event_type || 'Patrol Event')}</strong><p>${esc(item.details || item.message || '')}</p><em>—</em></div>`).join('') : `<div class="empty">No activity yet.</div>`}
    </div>
  </section>`;
}

function guard302Rail(req) {
  const messages = state.messageThreads.slice(0, 2);
  const notes = state.notifications.slice(0, 3);
  return `<aside class="guard302-right">
    <section class="panel panel-pad guard302-open-job">
      <div class="guard302-card-head"><div><h2>Open Job</h2></div><button class="ghost-button" data-view="active-job">View</button></div>
      ${req ? `<div class="guard302-open-box"><strong>${esc(requestTitle(req))}</strong><p>${esc(propertyLabel(req))}</p><span>Started: ${esc(fmtTime(req.started_at || req.accepted_at || req.assigned_at || req.created_at))}</span><button type="button" class="guard302-primary" data-view="active-job">Continue Job</button></div>` : `<div class="empty">No open job.</div>`}
    </section>

    <section class="panel panel-pad">
      <div class="guard302-card-head"><div><h2>Messages</h2></div><button class="ghost-button" data-view="messages">View All</button></div>
      <div class="guard302-feed">${messages.length ? messages.map(t => `<button type="button" data-view="messages"><i></i><span><strong>${esc(t.subject || t.title || 'Dispatch')}</strong><small>${esc(t.last_message_preview || 'No messages yet')}</small></span><em>${esc(fmtTime(t.updated_at || t.created_at))}</em></button>`).join('') : `<div class="empty">No messages yet.</div>`}</div>
    </section>

    <section class="panel panel-pad">
      <div class="guard302-card-head"><div><h2>Notifications</h2></div><button class="ghost-button" data-view="notifications">View All</button></div>
      <div class="guard302-feed">${notes.length ? notes.map(n => `<button type="button" data-view="notifications"><i class="green"></i><span><strong>${esc(n.title || n.event_type || 'Notification')}</strong><small>${esc(n.message || n.details || '')}</small></span><em>${esc(fmtTime(n.created_at))}</em></button>`).join('') : `<div class="empty">No notifications yet.</div>`}</div>
    </section>

    <section class="panel panel-pad guard302-status">
      <div class="guard302-card-head"><div><h2>Status</h2></div><button class="ghost-button">Refresh</button></div>
      <div class="guard302-status-grid">
        <div><strong>${esc(activeRequests().length)}</strong><span>Open Jobs</span></div>
        <div><strong>0</strong><span>Incidents</span></div>
        <div class="ring"><strong>100%</strong><span>GPS Signal</span></div>
      </div>
      <p>Last Sync: ${esc(new Date().toLocaleTimeString([], {hour:'numeric', minute:'2-digit'}))}</p>
      <p>All Systems Operational <b>✓</b></p>
    </section>
  </aside>`;
}

function guard302QuickActions() {
  return `<section class="panel panel-pad guard302-quick">
    <div class="guard302-card-head"><div><h2>Quick Actions</h2></div></div>
    <div class="guard302-quick-grid">
      <button type="button" data-view="active-job"><i>▤</i><strong>Open Active Job</strong><span>›</span></button>
      <button type="button" class="teal" data-view="upload-proof"><i>⇧</i><strong>Upload Proof</strong><span>›</span></button>
      <button type="button" class="purple" data-view="messages"><i>☵</i><strong>Message Dispatch</strong><span>›</span></button>
      <button type="button" class="ghost" data-view="route-gps"><i>⌖</i><strong>Share My Location</strong><span>›</span></button>
    </div>
  </section>`;
}

function guardDashboardMockup302() {
  const req = guard302CurrentRequest();
  const open = activeRequests();
  const inProgress = state.patrolRequests.filter(r => String(r.status) === 'in_progress');
  return `<div class="dashboard guard302-dashboard">
    <header class="guard302-header">
      <div class="title-block"><h1>Guard Dashboard</h1><p>Real-time overview of your assignments, patrols, and communications.</p></div>
      <div class="guard302-header-actions">
        <span class="system-pill"><i></i>Supabase Connected</span>
        <button class="guard302-mode">🛡 Guard Mode</button>
        <button class="header-button">🔔${unreadNotificationsCount() ? `<b>${esc(unreadNotificationsCount())}</b>` : ''}</button>
        <button class="guard302-logout" data-action="logout">Logout</button>
      </div>
    </header>

    <section class="guard302-kpis">
      ${kpiCard('▤', 'Open Assignments', open.length, open.length ? 'Current field jobs' : 'No pending assignments', '#2f83ff')}
      ${kpiCard('〽', 'In Progress', inProgress.length, inProgress.length ? 'Patrol active now' : 'Nothing in progress', '#15d1c4')}
      ${kpiCard('☵', 'Unread Messages', unreadMessagesCount(), unreadMessagesCount() ? 'Needs response' : 'All caught up', '#b05cff')}
      ${kpiCard('⇧', 'Proof Uploaded', state.proofItems.length, 'Today', '#ff9b38')}
    </section>

    <section class="guard302-body">
      <div class="guard302-left">${guard302CurrentAssignment(req)}${guard302Map(req)}</div>
      <div class="guard302-middle">${guard302Flow(req)}${guard302Activity(req)}</div>
      ${guard302Rail(req)}
      <div class="guard302-quick-wrap">${guard302QuickActions()}</div>
    </section>
  </div>`;
}

function compactDashboard(role) {
  const active = activeRequests();
  return `<div class="dashboard">
    <header class="dashboard-header">
      <div class="title-block"><h1>${esc(roleLabel(role))} Dashboard</h1><p>Modern grid foundation using the same exact dashboard shell.</p></div>
      <div class="header-actions"><span class="system-pill"><i></i>System Operational</span><button class="header-button">🔔</button><button class="header-button">☷</button></div>
    </header>
    <section class="kpi-row">
      ${kpiCard('▤', role === 'guard' ? 'Open Assignments' : 'Properties', role === 'guard' ? active.length : state.properties.length, 'Current records', '#2f83ff')}
      ${kpiCard('●', 'Active Patrols', active.length, 'In motion', '#37dc72')}
      ${kpiCard('☵', 'Unread Messages', unreadMessagesCount(), 'Inbox', '#b05cff')}
      ${kpiCard('▣', role === 'guard' ? 'Proof Uploaded' : 'Reports Ready', role === 'guard' ? state.proofItems.length : reportsReady().length, 'Available', '#ffb53d')}
    </section>
    <section class="dashboard-grid">
      <div class="dashboard-left">
        <section class="panel map-card"><div class="panel-head"><div><h2>${role === 'guard' ? 'Route / GPS' : 'Client Patrol Map'}</h2><p>Live view of patrol status and route.</p></div><button class="primary-button" data-view="${role === 'guard' ? 'route-gps' : 'patrol-requests'}">Open</button></div>${mapArea()}</section>
        <section class="panel panel-pad"><div class="panel-head"><div><h2>Activity</h2><p>Latest updates</p></div></div><div class="activity-table"><div class="activity-head"><span>Event</span><span>Details</span><span>Person</span><span>Time</span></div><div class="activity-row"><strong><span class="event-pill">✓</span>Dashboard loaded</strong><span>Clean v3 grid shell active</span><span>${esc(roleLabel(role))}</span><span>Now</span></div></div></section>
      </div>
      <aside class="dashboard-right">
        <section class="panel panel-pad"><div class="panel-head"><div><h2>Messages</h2><p>Inbox</p></div><button class="ghost-button" data-view="messages">View all</button></div><div class="feed-list">${state.messageThreads.slice(0,3).map(t => feedRow(initials(t.subject || 'D'), t.subject || 'Conversation', t.last_message_preview || 'No messages yet', fmtTime(t.updated_at || t.created_at))).join('') || '<div class="empty">No messages yet.</div>'}</div></section>
        <section class="panel panel-pad"><div class="panel-head"><div><h2>Notifications</h2><p>Alerts and updates</p></div><button class="ghost-button" data-view="notifications">View all</button></div><div class="feed-list">${state.notifications.slice(0,3).map(n => feedRow((n.title || 'N').slice(0,1), n.title || 'Notification', n.message || '', timeAgo(n.created_at), 'blue')).join('') || '<div class="empty">No notifications.</div>'}</div></section>
      </aside>
    </section>
  </div>`;
}

function rowsForRequests(rows) {
  return rows.map(req => `<tr><td><strong>${esc(requestTitle(req))}</strong><br><span style="color:var(--muted)">${esc(propertyLabel(req))}</span></td><td>${esc(requestClientName(req))}</td><td>${esc(requestGuardName(req))}</td><td>${statusChip(req.status)}</td><td>${esc(fmtDate(req.created_at))}</td><td>${esc(proofForRequest(req.id).length)}</td></tr>`).join('');
}

function tableView(title, subtitle, rows) {
  return `<div class="dashboard"><header class="dashboard-header"><div class="title-block"><h1>${esc(title)}</h1><p>${esc(subtitle)}</p></div><div class="header-actions"><span class="system-pill"><i></i>System Operational</span></div></header><section class="page-panel"><table class="table"><thead><tr><th>Request</th><th>Client</th><th>Guard</th><th>Status</th><th>Created</th><th>Proof</th></tr></thead><tbody>${rows.length ? rowsForRequests(rows) : '<tr><td colspan="6"><div class="empty">No records found.</div></td></tr>'}</tbody></table></section></div>`;
}

function cardsView(title, subtitle, rows, type = 'person') {
  return `<div class="dashboard"><header class="dashboard-header"><div class="title-block"><h1>${esc(title)}</h1><p>${esc(subtitle)}</p></div><div class="header-actions"><span class="system-pill"><i></i>System Operational</span></div></header><section class="page-panel"><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;">${rows.length ? rows.map(item => `<article class="panel panel-pad"><div class="panel-head"><div><h2>${esc(item.name || item.display_name || item.email || item.title || 'Record')}</h2><p>${esc(item.email || item.phone || item.message || item.notes || '')}</p></div>${type === 'signup' ? `<div class="button-row"><button class="btn success" data-approve="${esc(item.kind)}" data-id="${esc(item.id)}">Approve</button><button class="btn secondary" data-reject="${esc(item.kind)}" data-id="${esc(item.id)}">Reject</button></div>` : ''}</div></article>`).join('') : '<div class="empty">No records found.</div>'}</div></section></div>`;
}

function messagesView() {
  return cardsView('Messages', 'Dispatch inbox and conversations.', state.messageThreads.map(t => ({ title: t.subject || t.title || 'Conversation', message: t.last_message_preview || 'No messages yet' })), 'message');
}
function notificationsView() {
  return cardsView('Notifications', 'Alerts and updates.', state.notifications.map(n => ({ title: n.title || n.event_type || 'Notification', message: n.message || n.details || '' })), 'notification');
}

function proofUploadView() {
  const eligible = state.patrolRequests.filter(r => ['assigned', 'accepted', 'in_progress', 'completed'].includes(String(r.status)));
  return `<div class="dashboard"><header class="dashboard-header"><div class="title-block"><h1>Upload Proof</h1><p>Upload photo or video proof for patrol work.</p></div></header><section class="page-panel">${eligible.length ? `<form class="form-grid" data-form="proof-upload"><label>Patrol Request<select name="request_id">${eligible.map(r => `<option value="${esc(r.id)}">${esc(requestTitle(r))} · ${esc(propertyLabel(r))} · ${esc(statusText(r.status))}</option>`).join('')}</select></label><label>Proof Files<input type="file" name="proof_files" accept="image/*,video/*" multiple required></label><label>Note<textarea name="note" placeholder="Optional note"></textarea></label><div class="button-row"><button class="btn success" type="submit">Upload Proof</button></div></form>` : '<div class="empty">No assignments available for proof upload.</div>'}</section></div>`;
}

function settingsView() {
  const name = state.profile?.display_name || state.profile?.name || state.profile?.email || 'User';
  return `<div class="dashboard"><header class="dashboard-header"><div class="title-block"><h1>Settings</h1><p>Account and app status.</p></div></header><section class="page-panel"><div class="top-panel-grid"><div><p class="eyebrow">Account</p><h2>${esc(name)}</h2><p style="color:var(--muted)">${esc(state.profile?.email || '')}</p><p>${statusChip(state.role)}</p></div><div><p class="eyebrow">Build</p><h2>${esc(BUILD.label)}</h2><p style="color:var(--muted)">Bottom-right badge is hard coded and refreshed after every render.</p></div></div></section></div>`;
}

function renderRoleView() {
  if (state.role === 'admin') {
    if (state.view === 'dashboard') return adminDashboard();
    if (state.view === 'dispatch-board') return tableView('Dispatch Board', 'All patrol requests.', state.patrolRequests);
    if (state.view === 'live-gps') return tableView('Live GPS', 'Active patrol GPS list.', activeRequests());
    if (state.view === 'pending-dispatch') return tableView('Pending Dispatch', 'Requests waiting for assignment.', pendingRequests());
    if (state.view === 'scheduled-queue') return tableView('Scheduled Queue', 'Scheduled patrol requests.', scheduledRequests());
    if (state.view === 'guards') return cardsView('Guards', 'Approved guard roster.', state.guards);
    if (state.view === 'guard-approvals') return cardsView('Guard Approvals', 'Pending guard applications.', guardApprovals().map(x => ({ ...x, kind: 'guard' })), 'signup');
    if (state.view === 'clients') return cardsView('Clients', 'Approved client roster.', state.clients);
    if (state.view === 'activity-log') return cardsView('Activity Log', 'Patrol activity events.', state.patrolActivity.map(x => ({ title: x.title || x.event_type, message: x.details || x.message })));
    if (state.view === 'proof-review') return cardsView('Proof Review', 'Proof uploaded by guards.', state.proofItems.map(x => ({ title: x.file_name || 'Proof item', message: x.note || x.file_type })));
    if (state.view === 'report-builder') return tableView('Report Builder', 'Completed patrols ready for reports.', completedRequests());
    if (state.view === 'report-archive') return cardsView('Report Archive', 'Released report records.', state.patrolReports);
  }
  if (state.role === 'guard') {
    if (state.view === 'dashboard') return guardDashboardMockup302();
    if (state.view === 'active-job') return tableView('Active Job', 'Current guard assignments.', state.patrolRequests);
    if (state.view === 'route-gps') return compactDashboard('guard');
    if (state.view === 'upload-proof') return proofUploadView();
  }
  if (state.role === 'client') {
    if (state.view === 'dashboard') return compactDashboard('client');
    if (state.view === 'properties') return cardsView('Properties', 'Client properties.', state.properties);
    if (state.view === 'patrol-requests') return tableView('Patrol Requests', 'Client patrol request history.', state.patrolRequests);
    if (state.view === 'reports') return cardsView('Reports', 'Released client reports.', state.patrolReports);
  }
  if (state.view === 'messages') return messagesView();
  if (state.view === 'notifications') return notificationsView();
  if (state.view === 'settings') return settingsView();
  return state.role === 'admin' ? adminDashboard() : compactDashboard(state.role);
}

function renderAppShell() {
  app.innerHTML = `<div class="app-shell">${renderSidebar()}<main class="main-area">${renderRoleView()}</main></div>`;
  ensureBadge();
}


function scheduleGuardLeafletMap() {
  if (state.role === 'guard' && state.view === 'dashboard') {
    setTimeout(initGuardLeafletMap, 60);
  }
}
function leafletDivIcon(cls, html = '') {
  return L.divIcon({
    className: cls,
    html,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
}
function initGuardLeafletMap() {
  const el = document.getElementById('guard302-live-leaflet-map');
  if (!el || !window.L) return;
  const req = guard302CurrentRequest();
  const hasGuard = liveGps.online && Number.isFinite(liveGps.guardLat) && Number.isFinite(liveGps.guardLng);
  const hasProperty = Number.isFinite(liveGps.propertyLat) && Number.isFinite(liveGps.propertyLng);
  const center = hasGuard ? [liveGps.guardLat, liveGps.guardLng] : hasProperty ? [liveGps.propertyLat, liveGps.propertyLng] : [36.1699, -115.1398];

  if (liveGps.leafletMap) {
    try { liveGps.leafletMap.remove(); } catch {}
    liveGps.leafletMap = null;
    liveGps.leafletLayer = null;
  }

  const map = L.map(el, {
    zoomControl: true,
    attributionControl: false,
    dragging: true,
    scrollWheelZoom: true
  }).setView(center, hasGuard || hasProperty ? 14 : 11);

  liveGps.leafletMap = map;

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    crossOrigin: true
  }).addTo(map);

  const markerGroup = L.featureGroup().addTo(map);
  let routeLayer = null;

  if (hasProperty) {
    const propertyMarker = L.marker([liveGps.propertyLat, liveGps.propertyLng], {
      icon: leafletDivIcon('leaflet-property-pulse-icon', '<span></span>')
    }).addTo(markerGroup);
    propertyMarker.on('click', () => openMapCard('property'));
  }

  if (hasGuard) {
    const guardMarker = L.marker([liveGps.guardLat, liveGps.guardLng], {
      icon: leafletDivIcon('leaflet-guard-pulse-icon', '<span></span>')
    }).addTo(markerGroup);
    guardMarker.on('click', () => openMapCard('guard'));
  }

  if (hasGuard && hasProperty) {
    const coords = (liveGps.routePoints && liveGps.routePoints.length >= 2)
      ? liveGps.routePoints.map(p => [p.lat, p.lng])
      : [[liveGps.guardLat, liveGps.guardLng], [(liveGps.guardLat + liveGps.propertyLat) / 2 + 0.003, (liveGps.guardLng + liveGps.propertyLng) / 2 - 0.003], [liveGps.propertyLat, liveGps.propertyLng]];
    routeLayer = L.polyline(coords, {
      color: '#2e88ff',
      weight: 5,
      opacity: .88,
      dashArray: '10 8',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(markerGroup);
  }

  if (markerGroup.getLayers().length > 0) {
    try {
      map.fitBounds(markerGroup.getBounds(), { padding: [36, 36], maxZoom: 15 });
    } catch {}
  }

  setTimeout(() => {
    try { map.invalidateSize(); } catch {}
  }, 100);
}


function render() {
  if (state.booting) renderLoading();
  else if (!state.profile) renderPublic();
  else renderAppShell();
  ensureBadge();
}

async function initialize() {
  render();
  try {
    if (supabase.accessToken) {
      await loadData();
      state.view = 'dashboard';
    }
  } catch (err) {
    await supabase.signOut();
    state.profile = null;
    state.role = null;
    toast(friendly(err));
  } finally {
    state.booting = false;
    render();
  }
}

document.addEventListener('click', async event => {
  const button = event.target.closest('button');
  if (!button) return;
  try {
    if (button.dataset.publicView) {
      state.publicView = button.dataset.publicView;
      render();
      return;
    }
    if (button.dataset.view) {
      state.view = button.dataset.view;
      render();
      return;
    }
    if (button.dataset.action === 'guard-online') {
      setGuardOnline();
      return;
    }
    if (button.dataset.action === 'guard-offline') {
      setGuardOffline();
      return;
    }
    if (button.dataset.action === 'map-card') {
      openMapCard(button.dataset.card || 'guard');
      return;
    }
    if (button.dataset.action === 'close-map-card') {
      closeMapCard();
      return;
    }
    if (button.dataset.action === 'logout') {
      await logout();
      return;
    }
    if (button.dataset.approve) {
      await approveSignup(button.dataset.approve, button.dataset.id);
      return;
    }
    if (button.dataset.reject) {
      await rejectSignup(button.dataset.reject, button.dataset.id);
      return;
    }
  } catch (err) {
    toast(friendly(err));
  }
});

document.addEventListener('submit', async event => {
  const form = event.target;
  if (!form.dataset.form) return;
  event.preventDefault();
  try {
    if (form.dataset.form === 'login') await login(form);
    if (form.dataset.form === 'owner-setup') await ownerSetup(form);
    if (form.dataset.form === 'guard-signup') await submitGuardSignup(form);
    if (form.dataset.form === 'client-signup') await submitClientSignup(form);
    if (form.dataset.form === 'proof-upload') await uploadProof(form);
  } catch (err) {
    toast(friendly(err));
  }
});

setInterval(ensureBadge, 1000);
initialize();
