
const BUILD = {
  version: '3.0.0',
  label: 'v3.0.0 EXACT DASHBOARD GRID REBUILD'
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
};

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
    ['report-archive', '☰', 'Report Archive']
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
      <button class="nav-item" data-view="settings"><i>⚙</i><span>Settings</span></button>
      <button class="nav-item" data-action="logout"><i>↪</i><span>Logout</span></button>
      <span class="version-mini">v3.0.0</span>
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
    if (state.view === 'dashboard') return compactDashboard('guard');
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
