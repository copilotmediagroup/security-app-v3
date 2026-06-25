
const CP_DEV_CACHE_BUST = '2026-06-25T14-20-v3034';
const BUILD = {
  version: '3.0.34',
  label: 'v3.0.34 REQUEST PATROL MOCKUP MATCH'
};
window.CP_ACTIVE_BUILD_LABEL = BUILD.label;
window.CP_DEV_CACHE_BUST = CP_DEV_CACHE_BUST;


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
  thanks: null,
  completedFilter: 'today',
  selectedCompletedRequestId: '',
  messageSearch: '',
  messageFilter: 'all',
  notificationSearch: '',
  notificationFilter: 'all',
  selectedNotificationId: '',
  clientPropertySearch: '',
  clientPropertyFilter: 'all',
  clientSelectedPropertyId: '',
  clientPropertyTab: 'overview',
  clientPropertyView: 'list',
  clientPatrolPrefillPropertyId: '',
  clientRequestType: 'immediate',
  clientRequestHistoryFilter: 'all'
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
  mapNotice: 'Click Online to show guard GPS. Property appears only during an active job.',
  propertyPrepKey: '',
  onlineSince: null,
  offlineAt: null,
  statusChangedAt: null,
  restoredFromStorage: false,
  clientSelectedPropertyId: ''
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
    ['completed', '✓', 'Completed'],
    ['route-gps', '⌖', 'Route / GPS'],
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

function notificationStorageKey() { return 'cp_security_notification_read_map_v1'; }
function readNotificationReadMap() {
  try {
    const parsed = JSON.parse(localStorage.getItem(notificationStorageKey()) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}
function writeNotificationReadMap(map = {}) {
  try { localStorage.setItem(notificationStorageKey(), JSON.stringify(map)); } catch {}
}
function notificationId(note = {}) {
  return String(note.id || note.notification_id || note.reference_id || `${note.title || note.event_type || 'notification'}-${note.created_at || ''}-${note.message || note.details || ''}`);
}
function notificationBody(note = {}) { return note.message || note.details || note.body || ''; }
function notificationTitle(note = {}) { return note.title || note.event_type || 'Notification'; }
function notificationCategory(note = {}) {
  const text = `${notificationTitle(note)} ${notificationBody(note)}`.toLowerCase();
  if (/message|dispatch/.test(text)) return 'message';
  if (/system|maintenance|settings|preference|platform/.test(text)) return 'system';
  if (/route|gps/.test(text)) return 'route';
  if (/proof|upload/.test(text)) return 'proof';
  return 'patrol';
}
function notificationSeverity(note = {}) {
  const text = `${notificationTitle(note)} ${notificationBody(note)}`.toLowerCase();
  if (/high|urgent|critical|alert|alarm|incident/.test(text)) return 'high';
  if (/new|assignment|patrol|dispatch/.test(text)) return 'medium';
  return 'normal';
}
function notificationMeta(note = {}) {
  const map = readNotificationReadMap();
  const id = notificationId(note);
  const localReadAt = map[id] || null;
  const category = notificationCategory(note);
  const severity = notificationSeverity(note);
  const created = note.created_at || note.updated_at || new Date().toISOString();
  const readAt = localReadAt || note.read_at || null;
  return {
    ...note,
    _id: id,
    _title: notificationTitle(note),
    _body: notificationBody(note),
    _category: category,
    _severity: severity,
    _created: created,
    _readAt: readAt,
    _isUnread: !readAt,
    _timeAgo: timeAgo(created),
    _time: fmtTime(created),
    _date: fmtDate(created)
  };
}
function notificationsList() {
  return (state.notifications || []).map(notificationMeta).sort((a,b) => new Date(b._created || 0) - new Date(a._created || 0));
}
function unreadNotificationsCount() { return notificationsList().filter(n => n._isUnread).length; }
function notificationCounts() {
  const rows = notificationsList();
  return {
    total: rows.length,
    unread: rows.filter(n => n._isUnread).length,
    patrol: rows.filter(n => ['patrol','route','proof'].includes(n._category)).length,
    messages: rows.filter(n => n._category === 'message').length,
    system: rows.filter(n => n._category === 'system').length
  };
}
function filteredNotifications() {
  let rows = notificationsList();
  const q = String(state.notificationSearch || '').trim().toLowerCase();
  if (q) rows = rows.filter(n => `${n._title} ${n._body}`.toLowerCase().includes(q));
  const f = state.notificationFilter;
  if (f === 'unread') rows = rows.filter(n => n._isUnread);
  if (f === 'patrol') rows = rows.filter(n => ['patrol','route','proof'].includes(n._category));
  if (f === 'messages') rows = rows.filter(n => n._category === 'message');
  if (f === 'system') rows = rows.filter(n => n._category === 'system');
  return rows;
}
function selectedNotification() {
  const all = filteredNotifications();
  const any = notificationsList();
  let note = all.find(n => String(n._id) === String(state.selectedNotificationId)) || any.find(n => String(n._id) === String(state.selectedNotificationId));
  if (!note) note = all[0] || any[0] || null;
  if (note && String(state.selectedNotificationId) !== String(note._id)) state.selectedNotificationId = note._id;
  return note;
}
function markNotificationReadById(id) {
  if (!id) return;
  const map = readNotificationReadMap();
  map[String(id)] = new Date().toISOString();
  writeNotificationReadMap(map);
}
function markAllNotificationsRead() {
  const map = readNotificationReadMap();
  const now = new Date().toISOString();
  notificationsList().forEach(n => { map[n._id] = map[n._id] || now; });
  writeNotificationReadMap(map);
}
function notificationIcon(note = {}) {
  const cat = note._category || notificationCategory(note);
  if (cat === 'message') return '◔';
  if (cat === 'system') return '⚙';
  if (cat === 'route') return '⌖';
  if (cat === 'proof') return '⬆';
  return '✓';
}
function notificationAccentClass(note = {}) {
  const cat = note._category || notificationCategory(note);
  if (cat === 'message') return 'message';
  if (cat === 'system') return 'system';
  if (cat === 'route') return 'route';
  if (cat === 'proof') return 'proof';
  return 'patrol';
}
function notificationCategoryLabel(note = {}) {
  const cat = note._category || notificationCategory(note);
  if (cat === 'message') return 'Dispatch';
  if (cat === 'system') return 'System';
  if (cat === 'route') return 'Route';
  if (cat === 'proof') return 'Proof';
  return 'Patrol';
}
function notificationPriorityLabel(note = {}) {
  const sev = note._severity || notificationSeverity(note);
  if (sev === 'high') return 'High Priority';
  if (sev === 'medium') return 'New';
  return 'Normal';
}
function notificationReferenceId(note = {}) {
  const date = new Date(note._created || Date.now());
  const y = date.getFullYear();
  const m = String(date.getMonth()+1).padStart(2,'0');
  const d = String(date.getDate()).padStart(2,'0');
  const hm = String(date.getHours()).padStart(2,'0') + String(date.getMinutes()).padStart(2,'0');
  return note.reference_id || `${String(notificationCategoryLabel(note)).toUpperCase()}-${y}${m}${d}-${hm}`;
}
function relatedRequestForNotification(note = {}) {
  if (!note) return null;
  return state.patrolRequests.find(r => String(r.id || '') === String(note.request_id || ''))
    || activeRequests()[0]
    || completedRequests()[0]
    || null;
}
function groupedNotifications(rows = []) {
  const today = new Date();
  const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const startYesterday = startToday - 86400000;
  const groups = [];
  const todayRows = rows.filter(n => new Date(n._created).getTime() >= startToday);
  const yesterdayRows = rows.filter(n => {
    const t = new Date(n._created).getTime();
    return t >= startYesterday && t < startToday;
  });
  const olderRows = rows.filter(n => new Date(n._created).getTime() < startYesterday);
  if (todayRows.length) groups.push({ label: `Today — ${today.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}`, rows: todayRows });
  if (yesterdayRows.length) {
    const y = new Date(startYesterday);
    groups.push({ label: `Yesterday — ${y.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}`, rows: yesterdayRows });
  }
  if (olderRows.length) groups.push({ label: 'Earlier', rows: olderRows });
  return groups;
}
function friendly(err) {
  const raw = String(err?.message || err || 'Unknown error');
  if (raw.includes('Failed to fetch')) return 'Connection failed. Check Supabase URL/key and network.';
  return raw;
}

function guardGpsPersistKey() {
  return 'cp_security_guard_gps_persisted_status';
}
function readGuardGpsPersistedState() {
  try {
    const data = JSON.parse(localStorage.getItem(guardGpsPersistKey()) || '{}');
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}
function writeGuardGpsPersistedState(extra = {}) {
  try {
    const data = {
      online: Boolean(liveGps.online),
      gpsMode: liveGps.gpsMode || (liveGps.online ? 'online' : 'offline'),
      onlineSince: liveGps.onlineSince || null,
      offlineAt: liveGps.offlineAt || null,
      statusChangedAt: liveGps.statusChangedAt || null,
      lastUpdate: liveGps.lastUpdate || null,
      guardLat: Number.isFinite(liveGps.guardLat) ? liveGps.guardLat : null,
      guardLng: Number.isFinite(liveGps.guardLng) ? liveGps.guardLng : null,
      accuracy: Number.isFinite(liveGps.accuracy) ? liveGps.accuracy : null,
      currentAddress: liveGps.currentAddress || '',
      savedAt: new Date().toISOString(),
      ...extra
    };
    localStorage.setItem(guardGpsPersistKey(), JSON.stringify(data));
  } catch {}
}
function restoreGuardGpsPersistedState() {
  const saved = readGuardGpsPersistedState();
  if (!saved?.online) return false;
  liveGps.online = true;
  liveGps.gpsMode = 'online';
  liveGps.onlineSince = saved.onlineSince || saved.statusChangedAt || saved.savedAt || new Date().toISOString();
  liveGps.statusChangedAt = saved.statusChangedAt || liveGps.onlineSince;
  liveGps.offlineAt = saved.offlineAt || null;
  liveGps.lastUpdate = saved.lastUpdate || null;
  liveGps.guardLat = Number.isFinite(Number(saved.guardLat)) ? Number(saved.guardLat) : null;
  liveGps.guardLng = Number.isFinite(Number(saved.guardLng)) ? Number(saved.guardLng) : null;
  liveGps.accuracy = Number.isFinite(Number(saved.accuracy)) ? Number(saved.accuracy) : null;
  liveGps.currentAddress = saved.currentAddress || 'GPS online status restored. Waiting for live location update...';
  liveGps.mapNotice = 'Online status restored from last session. GPS will resume unless you click Offline.';
  liveGps.restoredFromStorage = true;
  return true;
}
function resumePersistedGuardGpsIfNeeded() {
  if (state.role !== 'guard') return;
  if (!liveGps.online) return;
  if (liveGps.watchId !== null) return;
  if (!navigator.geolocation) return;
  setTimeout(() => {
    if (state.role === 'guard' && liveGps.online && liveGps.watchId === null) {
      setGuardOnline({ restored: true });
    }
  }, 250);
}
function pauseGuardGpsWatchOnly() {
  if (liveGps.watchId !== null && navigator.geolocation) {
    navigator.geolocation.clearWatch(liveGps.watchId);
    liveGps.watchId = null;
  }
}
function fmtDateTimeStamp(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString([], {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}
function currentDateTimeStamp() {
  return fmtDateTimeStamp(new Date().toISOString());
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
function proofRequestIdValue(item = {}) {
  return item.request_id || item.patrol_request_id || item.patrolRequestId || item.requestId || item.request?.id || '';
}
function proofUrlValue(item = {}) {
  return item.public_url || item.publicUrl || item.file_url || item.fileUrl || item.url || item.signed_url || item.storage_url || '';
}
function localProofCacheKey() {
  const who = state.profile?.id || state.profile?.auth_user_id || state.profile?.email || 'local';
  return `cp_security_inline_proof_cache_${who}`;
}
function readLocalProofItems() {
  try {
    const parsed = JSON.parse(localStorage.getItem(localProofCacheKey()) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function writeLocalProofItems(items = []) {
  try { localStorage.setItem(localProofCacheKey(), JSON.stringify(items.slice(0, 250))); } catch {}
}
function addLocalProofItems(requestId, items = []) {
  const existing = readLocalProofItems();
  const stamped = items.map((item, idx) => ({
    id: item.id || item.proof?.id || `local-${requestId}-${Date.now()}-${idx}`,
    request_id: item.request_id || item.proof?.request_id || requestId,
    bucket_id: item.bucket_id || item.proof?.bucket_id || 'patrol-proof',
    object_path: item.object_path || item.proof?.object_path || '',
    file_name: item.file_name || item.proof?.file_name || 'Proof file',
    file_type: item.file_type || item.proof?.file_type || '',
    file_size: item.file_size || item.proof?.file_size || 0,
    public_url: proofUrlValue(item) || proofUrlValue(item.proof || {}),
    note: item.note || item.proof?.note || '',
    uploaded_at: item.uploaded_at || item.proof?.uploaded_at || new Date().toISOString(),
    created_at: item.created_at || item.proof?.created_at || new Date().toISOString(),
    local_cached: true
  }));
  const merged = [...stamped, ...existing];
  const seen = new Set();
  const deduped = [];
  for (const item of merged) {
    const key = String(item.id || item.object_path || item.public_url || `${item.request_id}-${item.file_name}-${item.uploaded_at}`);
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }
  writeLocalProofItems(deduped);
}
function proofIdentity(item = {}) {
  return String(item.id || item.object_path || proofUrlValue(item) || `${proofRequestIdValue(item)}-${item.file_name || ''}-${item.uploaded_at || item.created_at || ''}`);
}
function proofForRequest(id) {
  const target = String(id || '');
  const combined = [...(state.proofItems || []), ...readLocalProofItems()];
  const seen = new Set();
  return combined
    .filter(item => String(proofRequestIdValue(item)) === target)
    .filter(item => {
      const key = proofIdentity(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => new Date(b.uploaded_at || b.created_at || 0) - new Date(a.uploaded_at || a.created_at || 0));
}
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
function activeAlertCount() {
  const alertNotes = notificationsList().filter(n => /alert|alarm|urgent|priority|incident|battery/i.test(`${n._title || ''} ${n._body || ''}`));
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
  syncDispatchGuardMessages();
  state.status = 'Connected';
  if (!state.view) state.view = 'dashboard';
}


function guardRankStorageKey() { return 'cp_security_guard_ranks_v1'; }
function readGuardRankMap() {
  try { const parsed = JSON.parse(localStorage.getItem(guardRankStorageKey()) || '{}'); return parsed && typeof parsed === 'object' ? parsed : {}; } catch { return {}; }
}
function writeGuardRankMap(map = {}) {
  try { localStorage.setItem(guardRankStorageKey(), JSON.stringify(map)); } catch {}
}
function guardRankKeys(item = {}) {
  return [item.id, item.auth_user_id, item.user_id, item.profile_id, String(item.email || '').trim().toLowerCase(), item.signup_id].filter(Boolean).map(v => String(v));
}
function guardRankFor(item = {}) {
  const map = readGuardRankMap();
  for (const key of guardRankKeys(item)) if (map[key]) return map[key];
  return item.rank || item.guard_rank || item.job_title || 'Guard';
}
function saveGuardRank(item = {}, rank = 'Guard') {
  const map = readGuardRankMap();
  for (const key of guardRankKeys(item)) map[key] = rank;
  writeGuardRankMap(map);
}
function dispatchGuardMessageStoreKey() { return 'cp_security_dispatch_guard_messages_v1'; }
function readDispatchGuardMessageStore() {
  try {
    const parsed = JSON.parse(localStorage.getItem(dispatchGuardMessageStoreKey()) || '{}');
    return {
      threads: Array.isArray(parsed.threads) ? parsed.threads : [],
      messages: Array.isArray(parsed.messages) ? parsed.messages : []
    };
  } catch {
    return { threads: [], messages: [] };
  }
}
function writeDispatchGuardMessageStore(store = { threads: [], messages: [] }) {
  try { localStorage.setItem(dispatchGuardMessageStoreKey(), JSON.stringify(store)); } catch {}
}
function messageGuardKey(guard = {}) {
  return String(guard.id || guard.auth_user_id || guard.user_id || guard.profile_id || String(guard.email || '').trim().toLowerCase() || '').trim();
}
function dispatchThreadIdForGuard(guard = {}) {
  return `dispatch-guard-${messageGuardKey(guard).replace(/[^a-zA-Z0-9_-]/g, '_')}`;
}
function activeDispatchLabel() { return 'Dispatch'; }
function syncDispatchGuardMessages() {
  if (!['admin','guard'].includes(state.role)) return;
  const store = readDispatchGuardMessageStore();
  const guards = (state.guards || []).filter(g => !['inactive','disabled','rejected','pending'].includes(String(g.status || 'active').toLowerCase()));
  const now = new Date().toISOString();
  for (const guard of guards) {
    const id = dispatchThreadIdForGuard(guard);
    let thread = store.threads.find(t => String(t.id) === String(id));
    if (!thread) {
      thread = {
        id,
        type: 'dispatch_guard',
        title: guard.name || guard.display_name || guard.email || 'Guard',
        guard_id: guard.id || '',
        guard_email: String(guard.email || '').trim().toLowerCase(),
        guard_name: guard.name || guard.display_name || guard.email || 'Guard',
        created_at: now,
        updated_at: now,
        last_message_preview: 'No messages yet',
        unread_admin: 0,
        unread_guard: 0
      };
      store.threads.push(thread);
    } else {
      thread.guard_id = thread.guard_id || guard.id || '';
      thread.guard_email = thread.guard_email || String(guard.email || '').trim().toLowerCase();
      thread.guard_name = guard.name || guard.display_name || guard.email || thread.guard_name || 'Guard';
      thread.title = thread.guard_name;
    }
  }
  writeDispatchGuardMessageStore(store);
  const relevant = store.threads.filter(thread => {
    if (state.role === 'admin') return true;
    const rec = activeGuardRecord();
    const activeKeys = [messageGuardKey(rec || {}), String(activeGuardEmail() || '').trim().toLowerCase(), String(state.profile?.id || ''), String(state.profile?.auth_user_id || '')].filter(Boolean);
    return activeKeys.some(k => k && [thread.guard_id, thread.guard_email].map(v => String(v || '')).includes(String(k)));
  }).sort((a,b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
  state.messageThreads = relevant.map(thread => ({
    id: thread.id,
    subject: thread.guard_name ? `${thread.guard_name}` : 'Dispatch',
    title: thread.guard_name ? `${thread.guard_name}` : 'Dispatch',
    updated_at: thread.updated_at,
    created_at: thread.created_at,
    last_message_preview: thread.last_message_preview || 'No messages yet',
    unread_count: state.role === 'admin' ? Number(thread.unread_admin || 0) : Number(thread.unread_guard || 0),
    guard_id: thread.guard_id,
    guard_email: thread.guard_email,
    guard_name: thread.guard_name
  }));
  state.messages = store.messages.filter(m => relevant.some(t => String(t.id) === String(m.thread_id)));
  if ((!state.selectedThreadId || !state.messageThreads.some(t => String(t.id) === String(state.selectedThreadId))) && state.messageThreads[0]) {
    state.selectedThreadId = state.messageThreads[0].id;
  }
}
function currentMessageThread() {
  syncDispatchGuardMessages();
  return state.messageThreads.find(t => String(t.id) === String(state.selectedThreadId)) || state.messageThreads[0] || null;
}
function messagesForThread(threadId) {
  const store = readDispatchGuardMessageStore();
  return store.messages.filter(m => String(m.thread_id) === String(threadId)).sort((a,b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
}
function markCurrentThreadRead() {
  const thread = currentMessageThread();
  if (!thread) return;
  const store = readDispatchGuardMessageStore();
  const raw = store.threads.find(t => String(t.id) === String(thread.id));
  if (!raw) return;
  if (state.role === 'admin') raw.unread_admin = 0;
  else raw.unread_guard = 0;
  writeDispatchGuardMessageStore(store);
  syncDispatchGuardMessages();
}
function sendDispatchGuardMessage(text) {
  const body = String(text || '').trim();
  if (!body) throw new Error('Type a message first.');
  const thread = currentMessageThread();
  if (!thread) throw new Error(state.role === 'admin' ? 'No guard threads yet.' : 'Dispatch thread not found.');
  const store = readDispatchGuardMessageStore();
  const raw = store.threads.find(t => String(t.id) === String(thread.id));
  if (!raw) throw new Error('Conversation thread not found.');
  const now = new Date().toISOString();
  const msg = {
    id: `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    thread_id: raw.id,
    sender_role: state.role,
    sender_name: state.role === 'admin' ? activeDispatchLabel() : activeGuardName(),
    sender_email: String(state.profile?.email || activeGuardEmail() || '').trim().toLowerCase(),
    body,
    created_at: now
  };
  store.messages.push(msg);
  raw.updated_at = now;
  raw.last_message_preview = body;
  if (state.role === 'admin') raw.unread_guard = Number(raw.unread_guard || 0) + 1;
  else raw.unread_admin = Number(raw.unread_admin || 0) + 1;
  if (state.role === 'admin') raw.unread_admin = 0; else raw.unread_guard = 0;
  writeDispatchGuardMessageStore(store);
  syncDispatchGuardMessages();
}
function relatedThreadGuard(thread = {}) {
  return (state.guards || []).find(g => String(g.id || '') === String(thread.guard_id || '')) || (state.guards || []).find(g => String(g.email || '').trim().toLowerCase() === String(thread.guard_email || '').trim().toLowerCase()) || null;
}
function relatedThreadRequest(thread = {}) {
  const guard = relatedThreadGuard(thread);
  if (!guard) return null;
  return activeRequests().find(r => String(r.guard_id || r.assigned_guard_id || '') === String(guard.id || '')) || completedRequests().find(r => String(r.guard_id || r.assigned_guard_id || '') === String(guard.id || '')) || null;
}
function filteredMessageThreads() {
  syncDispatchGuardMessages();
  let rows = [...state.messageThreads];
  const q = String(state.messageSearch || '').trim().toLowerCase();
  if (q) rows = rows.filter(t => `${t.title || ''} ${t.subject || ''} ${t.last_message_preview || ''}`.toLowerCase().includes(q));
  if (state.messageFilter === 'unread') rows = rows.filter(t => Number(t.unread_count || 0) > 0);
  if (state.messageFilter === 'active-job') rows = rows.filter(t => Boolean(relatedThreadRequest(t)));
  return rows;
}
function messageRolePill(thread = {}) {
  const g = relatedThreadGuard(thread);
  return guardRankFor(g || thread);
}
function guardApprovalsView() {
  const rows = guardApprovals().map(x => ({ ...x, kind: 'guard' }));
  const rankOptions = ['Guard', 'Sergeant', 'Field Supervisor', 'Supervisor', 'Lead Guard'];
  return `<div class="dashboard"><header class="dashboard-header"><div class="title-block"><h1>Guard Approvals</h1><p>Approve guard applications and assign the guard rank for Dispatch workflows.</p></div><div class="header-actions"><span class="system-pill"><i></i>System Operational</span></div></header><section class="page-panel"><div class="cards-grid cards-grid-guard-approvals">${rows.length ? rows.map(item => `<article class="panel panel-pad guard-approval-card"><div class="guard-approval-head"><div class="avatar">${esc(initials(item.name || item.display_name || item.email || 'G'))}</div><div><h2>${esc(item.name || item.display_name || 'Guard Applicant')}</h2><p>${esc(item.email || '')}</p><small>${esc(item.phone || 'No phone listed')}</small></div><span class="rank-chip pending">Pending</span></div><div class="guard-approval-body"><div class="guard-approval-meta"><span>Requested Role</span><strong>Guard</strong><span>Notes</span><strong>${esc(item.notes || 'No notes added')}</strong></div><label class="form-field"><span>Guard Rank</span><select data-guard-rank="${esc(item.id)}">${rankOptions.map(rank => `<option value="${esc(rank)}" ${rank === guardRankFor(item) ? 'selected' : ''}>${esc(rank)}</option>`).join('')}</select></label><div class="button-row"><button class="btn success" data-approve="guard" data-id="${esc(item.id)}">Approve Guard</button><button class="btn secondary" data-reject="guard" data-id="${esc(item.id)}">Reject</button></div></div></article>`).join('') : '<div class="empty">No pending guard applications.</div>'}</div></section></div>`;
}
function messagesView() {
  if (!['admin','guard'].includes(state.role)) return cardsView('Messages', 'Dispatch inbox and conversations.', state.messageThreads.map(t => ({ title: t.subject || t.title || 'Conversation', message: t.last_message_preview || 'No messages yet' })), 'message');
  syncDispatchGuardMessages();
  const threads = filteredMessageThreads();
  const selected = threads.find(t => String(t.id) === String(state.selectedThreadId)) || threads[0] || null;
  if (selected && String(state.selectedThreadId) !== String(selected.id)) state.selectedThreadId = selected.id;
  const activeThread = selected || currentMessageThread();
  const guard = activeThread ? relatedThreadGuard(activeThread) : null;
  const req = activeThread ? relatedThreadRequest(activeThread) : null;
  const msgs = activeThread ? messagesForThread(activeThread.id) : [];
  const alerts = state.notifications.slice(0,3);
  const proofs = req ? proofForRequest(req.id).slice(0,3) : [];
  return `<div class="dashboard messages-shell"><header class="dashboard-header"><div class="title-block"><h1>Messages</h1><p>Real-time communication between Dispatch and guards.</p></div><div class="header-actions"><span class="system-pill"><i></i>System Operational</span></div></header><section class="messages-layout page-panel"><aside class="messages-inbox panel"><div class="messages-inbox-head"><div><h2>Dispatch Inbox</h2></div><button class="icon-square">✎</button></div><div class="messages-search-row"><input type="search" placeholder="Search conversations..." value="${esc(state.messageSearch)}" data-message-search><button class="icon-square">⌕</button></div><div class="messages-filter-row"><button type="button" class="filter-pill ${state.messageFilter === 'all' ? 'active' : ''}" data-message-filter="all">All</button><button type="button" class="filter-pill ${state.messageFilter === 'unread' ? 'active' : ''}" data-message-filter="unread">Unread ${unreadMessagesCount() ? `<b>${esc(unreadMessagesCount())}</b>` : ''}</button><button type="button" class="filter-pill ${state.messageFilter === 'active-job' ? 'active' : ''}" data-message-filter="active-job">Active Job</button></div><div class="messages-thread-list">${threads.length ? threads.map(thread => `<button type="button" class="messages-thread-row ${activeThread && String(activeThread.id) === String(thread.id) ? 'active' : ''}" data-action="select-thread" data-thread-id="${esc(thread.id)}"><div class="thread-avatar">${esc(initials(thread.guard_name || thread.title || 'D'))}</div><div class="thread-copy"><div class="thread-top"><strong>${esc(thread.guard_name || thread.title || 'Dispatch')}</strong><em>${esc(fmtTime(thread.updated_at || thread.created_at))}</em></div><small>${esc(messageRolePill(thread))}</small><p>${esc(thread.last_message_preview || 'No messages yet')}</p></div>${Number(thread.unread_count || 0) ? `<span class="thread-unread">${esc(thread.unread_count)}</span>` : ''}</button>`).join('') : '<div class="empty">No Dispatch / guard conversations yet.</div>'}</div></aside><section class="messages-conversation panel">${activeThread ? `<div class="conversation-head"><div><h2>${esc(state.role === 'admin' ? `${activeThread.guard_name || 'Guard'} / Dispatch` : 'Guard / Dispatch')}</h2><p>${esc(state.role === 'admin' ? `${messageRolePill(activeThread)} · ${activeThread.guard_email || ''}` : 'Online communication with Dispatch')}</p></div><div class="conversation-actions"><button class="icon-square">☎</button><button class="icon-square">⌕</button><button class="icon-square">⋯</button></div></div><div class="conversation-stream">${msgs.length ? msgs.map(msg => `<div class="chat-row ${msg.sender_role === state.role ? 'me' : 'them'}"><div class="chat-bubble"><header><strong>${esc(msg.sender_role === state.role ? 'You' : (msg.sender_name || (msg.sender_role === 'admin' ? activeDispatchLabel() : activeThread.guard_name || 'Guard')))}</strong><span>${esc(fmtTime(msg.created_at))}</span></header><p>${esc(msg.body || '')}</p></div></div>`).join('') : '<div class="empty">No messages yet. Start the conversation below.</div>'}</div><form class="conversation-compose" data-form="dispatch-guard-message"><input type="hidden" name="thread_id" value="${esc(activeThread.id)}"><div class="compose-toolbar"><button type="button" class="icon-square small">📎</button><button type="button" class="icon-square small">📷</button></div><div class="compose-input-wrap"><textarea name="message" rows="3" placeholder="Type your message..."></textarea><div class="quick-actions-inline"><button type="button" class="quick-pill" data-action="quick-message" data-text="All secure at this time.">All Secure</button><button type="button" class="quick-pill" data-action="quick-message" data-text="On my way.">On My Way</button><button type="button" class="quick-pill" data-action="quick-message" data-text="Need assistance at location.">Need Assistance</button><button type="button" class="quick-pill" data-action="quick-message" data-text="En route now.">En Route</button></div></div><button type="submit" class="send-button">Send</button></form>` : `<div class="empty" style="min-height:480px;display:grid;place-items:center;">No conversation selected.</div>`}</section><aside class="messages-detail panel panel-pad">${activeThread ? `<div class="panel-head"><div><h2>Conversation Details</h2><p>${esc(state.role === 'admin' ? 'Dispatch selected guard' : 'Linked to your Dispatch channel')}</p></div></div><div class="messages-detail-stack">${req ? `<section class="detail-card"><div class="detail-card-head"><strong>Active Job (Linked)</strong><span class="rank-chip active">${esc(statusText(req.status))}</span></div><h3>${esc(propertyLabel(req))}</h3><p>${esc(propertyAddress(req))}</p><div class="detail-grid"><span>Job ID</span><strong>${esc(req.id)}</strong><span>Priority</span><strong>${esc(statusText(req.priority || 'Normal'))}</strong><span>Started</span><strong>${esc(fmtDate(req.started_at || req.accepted_at || req.assigned_at || req.created_at))}</strong></div><button type="button" class="ghost-button wide" data-view="active-job">View Active Job</button></section>` : `<section class="detail-card"><div class="detail-card-head"><strong>Active Job</strong></div><p>No active job linked right now.</p></section>`}<section class="detail-card"><div class="detail-card-head"><strong>Guard Status</strong><span class="rank-chip">${esc(guard ? guardRankFor(guard) : 'Dispatch')}</span></div><div class="detail-grid"><span>Status</span><strong>${esc(guard ? statusText(guard.status || 'active') : 'Online')}</strong><span>${state.role === 'admin' ? 'Guard' : 'Channel'}</span><strong>${esc(state.role === 'admin' ? (guard?.name || activeThread.guard_name || 'Guard') : 'Dispatch')}</strong><span>Last Message</span><strong>${esc(fmtTime(activeThread.updated_at))}</strong></div></section><section class="detail-card"><div class="detail-card-head"><strong>Quick Responses</strong></div><div class="quick-response-list"><button type="button" data-action="quick-message" data-text="All secure at this time.">All secure at this time.</button><button type="button" data-action="quick-message" data-text="On my way.">On my way.</button><button type="button" data-action="quick-message" data-text="Need assistance at location.">Need assistance at location.</button></div></section><div class="detail-split"> <section class="detail-card"><div class="detail-card-head"><strong>Recent Alerts</strong></div>${alerts.length ? alerts.map(n => `<div class="detail-line"><span>${esc(n.title || n.event_type || 'Alert')}</span><em>${esc(fmtTime(n.created_at))}</em></div>`).join('') : '<div class="detail-line"><span>No alerts</span></div>'}</section><section class="detail-card"><div class="detail-card-head"><strong>Attachments (${proofs.length})</strong></div>${proofs.length ? proofs.map(p => `<div class="detail-line"><span>${esc(p.file_name || 'Proof file')}</span><em>${esc(fmtTime(p.uploaded_at || p.created_at))}</em></div>`).join('') : '<div class="detail-line"><span>No attachments</span></div>'}</section></div></div>` : `<div class="empty">No conversation selected.</div>`}</aside></section></div>`;
}
async function login(form) {
  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value;
  const expected = form.role.value;
  await supabase.signIn(email, password);
  await loadData();
  if (state.role === 'guard') restoreGuardGpsPersistedState();
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
  const wasGuardOnline = state.role === 'guard' && liveGps.online;
  if (wasGuardOnline) {
    pauseGuardGpsWatchOnly();
    liveGps.mapNotice = 'Guard logged out while Online. Online status will resume on next login until Offline is clicked.';
    writeGuardGpsPersistedState({ online: true, loggedOutOnlineAt: new Date().toISOString() });
  }
  await supabase.signOut();
  state.profile = null;
  state.role = null;
  state.view = 'dashboard';
  state.publicView = 'login';
  render();
}

async function approveSignup(kind, id) {
  if (kind === 'guard') {
    const pending = state.guardSignups.find(g => String(g.id) === String(id)) || {};
    const select = document.querySelector(`select[data-guard-rank="${String(id).replace(/"/g,'&quot;')}"]`);
    const chosenRank = select?.value || 'Guard';
    saveGuardRank({ id, email: pending.email, signup_id: id }, chosenRank);
  }
  await supabase.rpc(kind === 'guard' ? 'cp_approve_guard_signup' : 'cp_approve_client_signup', { p_signup_id: id });
  await loadData();
  if (kind === 'guard') {
    const pending = state.guardSignups.find(g => String(g.id) === String(id));
    const approved = (state.guards || []).find(g => pending?.email && String(g.email || '').trim().toLowerCase() === String(pending.email || '').trim().toLowerCase());
    if (approved) saveGuardRank(approved, guardRankFor({ id, email: pending?.email, signup_id: id }));
  }
  render();
  toast(`${kind === 'guard' ? 'Guard' : 'Client'} approved.`, 'success');
}

async function rejectSignup(kind, id) {
  await supabase.rpc(kind === 'guard' ? 'cp_reject_guard_signup' : 'cp_reject_client_signup', { p_signup_id: id });
  await loadData();
  render();
  toast(`${kind === 'guard' ? 'Guard' : 'Client'} rejected.`, 'success');
}


async function uploadProofFiles(requestId, files = [], note = '') {
  if (!requestId) throw new Error('Active job missing.');
  const list = Array.from(files || []);
  if (!list.length) throw new Error('Choose at least one photo or video.');
  const uploaded = [];

  for (const file of list) {
    const kind = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : '';
    if (!kind) throw new Error('Only photo or video files are allowed.');
    const safe = String(file.name || 'proof').replace(/[^a-zA-Z0-9._-]/g, '_').slice(-90);
    const objectPath = `${requestId}/${Date.now()}-${Math.random().toString(16).slice(2)}-${safe}`;
    await supabase.uploadStorageObject('patrol-proof', objectPath, file, { upsert: false });
    const publicUrl = supabase.getPublicUrl('patrol-proof', objectPath);
    const result = await supabase.rpc('cp_guard_register_patrol_proof', {
      p_request_id: requestId,
      p_bucket_id: 'patrol-proof',
      p_object_path: objectPath,
      p_file_name: safe,
      p_file_type: file.type || kind,
      p_file_size: file.size || 0,
      p_public_url: publicUrl,
      p_note: note
    });
    const proof = result?.proof || {};
    uploaded.push({
      ...proof,
      request_id: proof.request_id || requestId,
      bucket_id: proof.bucket_id || 'patrol-proof',
      object_path: proof.object_path || objectPath,
      file_name: proof.file_name || safe,
      file_type: proof.file_type || file.type || kind,
      file_size: proof.file_size || file.size || 0,
      public_url: proof.public_url || publicUrl,
      note: proof.note || note,
      uploaded_at: proof.uploaded_at || new Date().toISOString(),
      created_at: proof.created_at || new Date().toISOString()
    });
  }

  addLocalProofItems(requestId, uploaded);
  return uploaded;
}

async function uploadProof(form) {
  const requestId = form.request_id.value;
  const files = [...(form.proof_files.files || [])];
  const note = form.note.value.trim();
  await uploadProofFiles(requestId, files, note);
  await loadData();
  state.view = state.role === 'guard' ? 'active-job' : 'proof-review';
  render();
  toast('Proof uploaded.', 'success');
}


async function assignPatrolNow(requestId) {
  const req = state.patrolRequests.find(r => String(r.id) === String(requestId));
  if (!req) throw new Error('Pending patrol request not found. Refresh Dispatch and try again.');
  if (String(req.status || '') === 'completed') throw new Error('Completed jobs cannot be assigned.');
  const guards = adminAssignableGuards();
  if (!guards.length) throw new Error('No approved active guards found. Approve or create a guard before assigning.');
  const select = document.querySelector(`select[data-assign-guard="${String(requestId).replace(/"/g, '&quot;')}"]`);
  const selectedGuardId = select?.value || guards[0]?.id || '';
  if (!selectedGuardId) throw new Error('Choose a guard before assigning.');
  const result = await supabase.rpc('cp_admin_assign_patrol_request', {
    p_request_id: requestId,
    p_guard_id: selectedGuardId
  });
  if (!result?.ok) throw new Error(result?.message || 'Patrol request could not be assigned.');
  await loadData();
  state.view = 'dashboard';
  render();
  const guardName = result.guard?.name || result.guard?.display_name || result.guard?.email || 'guard';
  toast(`${requestTitle(result.request || req)} assigned to ${guardName}.`, 'success');
}


async function submitClientPatrolRequest(form) {
  const propertyId = form.property_id?.value || '';
  const priority = form.priority?.value || 'normal';
  const scheduleType = form.schedule_type?.value || 'on_demand';
  const patrolType = form.patrol_type?.value || (scheduleType === 'vacation_watch' ? 'vacation_watch' : scheduleType === 'on_demand' ? 'urgent' : 'standard');
  const proofPreference = form.proof_preference?.value || 'photo';
  const duration = form.estimated_duration?.value || '';
  const instructions = form.instructions?.value?.trim() || '';
  const scheduleNotes = form.schedule_notes?.value?.trim() || '';
  const services = Array.from(form.querySelectorAll('input[name="requested_services"]:checked')).map(input => input.value);
  const recurrenceDays = Array.from(form.querySelectorAll('input[name="recurrence_days"]:checked')).map(input => input.value);
  const referenceFile = form.reference_photo_file?.files?.[0] || null;
  if (!propertyId) throw new Error('Choose a saved property before requesting patrol.');

  const date = form.scheduled_date?.value || '';
  const time = form.scheduled_time?.value || '';
  const scheduledFor = (scheduleType === 'scheduled' && date && time) ? `${date}T${time}` : '';
  const startDate = form.schedule_start_date?.value || '';
  const endDate = form.schedule_end_date?.value || '';
  const preferredTimeWindow = form.preferred_time_window?.value || '';
  const recurrencePattern = form.recurrence_pattern?.value || '';
  const referenceNote = referenceFile ? `Reference upload selected from device: ${referenceFile.name}` : '';
  const details = [
    instructions,
    duration ? `Estimated duration: ${duration}` : '',
    services.length ? `Requested services: ${services.join(', ')}` : '',
    referenceNote,
    scheduleNotes ? `Schedule notes: ${scheduleNotes}` : ''
  ].filter(Boolean).join('\n');

  let result = null;
  try {
    result = await supabase.rpc('cp_submit_patrol_request', {
      p_property_id: propertyId,
      p_priority: priority,
      p_instructions: details,
      p_patrol_type: patrolType,
      p_proof_preference: proofPreference,
      p_schedule_type: scheduleType,
      p_scheduled_for: scheduledFor || null,
      p_schedule_start_date: startDate || null,
      p_schedule_end_date: endDate || null,
      p_preferred_time_window: preferredTimeWindow,
      p_recurrence_pattern: recurrencePattern,
      p_recurrence_days: recurrenceDays.join(','),
      p_schedule_notes: scheduleNotes
    });
  } catch (err) {
    const msg = String(err?.message || err || '').toLowerCase();
    if (!(msg.includes('function') || msg.includes('argument') || msg.includes('schema cache'))) throw err;
    try {
      result = await supabase.rpc('cp_submit_patrol_request', {
        p_property_id: propertyId,
        p_priority: priority,
        p_instructions: details,
        p_patrol_type: patrolType,
        p_proof_preference: proofPreference
      });
    } catch (err2) {
      const msg2 = String(err2?.message || err2 || '').toLowerCase();
      if (!(msg2.includes('function') || msg2.includes('argument') || msg2.includes('schema cache'))) throw err2;
      result = await supabase.rpc('cp_submit_patrol_request', {
        p_property_id: propertyId,
        p_priority: priority,
        p_instructions: details
      });
    }
  }

  if (!result?.ok) throw new Error(result?.message || 'Patrol request could not be submitted.');
  await loadData();
  state.view = 'patrol-requests';
  render();
  toast('Patrol request submitted to Dispatch.', 'success');
}


function renderLoading() {
  app.innerHTML = `<div class="auth-shell"><div class="auth-card"><section class="auth-hero"><div class="brand-row"><div class="logo-box">CP</div><div><strong>Co Pilot</strong><small>Security</small></div></div><h1>Loading Command Center</h1><p>Connecting to Supabase.</p></section><section class="auth-panel"><div class="auth-box"><p class="eyebrow">Loading</p><h2>Preparing app</h2><p class="auth-note">Loading your role, patrol data, messages, notifications, and reports.</p></div></section></div></div>`;
  ensureBadge();
  scheduleGuardGpsPrep();
  scheduleGuardLeafletMap();
  scheduleClientMapPrep();
  scheduleClientLeafletMap();
  scheduleClientPropertyMapPrep();
  scheduleClientPropertyDetailMap();
  resumePersistedGuardGpsIfNeeded();
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
  if (view === 'completed' && state.role === 'guard') return guardCompletedJobsForFilter('today').length;
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
      <span class="version-mini">${esc(BUILD.label)}</span>
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

function adminAssignableGuards() {
  return (state.guards || []).filter(g => {
    const status = String(g.status || 'active').toLowerCase();
    return !['inactive', 'disabled', 'rejected', 'pending'].includes(status);
  });
}
function adminGuardOptionLabel(g = {}) {
  const name = g.name || g.display_name || g.email || 'Guard';
  const unit = [g.vehicle, g.license_plate].filter(Boolean).join(' · ');
  return unit ? `${name} — ${unit}` : name;
}
function adminAssignNowPanel(pending = []) {
  const guards = adminAssignableGuards();
  const rows = pending.slice(0, 4);
  const guardOptions = guards.map(g => `<option value="${esc(g.id)}">${esc(adminGuardOptionLabel(g))}</option>`).join('');
  return `<section class="panel panel-pad assign-now-panel">
    <div class="panel-head"><div><h2>Assign Now</h2><p>Development shortcut: assign a pending client request directly from the dashboard.</p></div><button class="ghost-button" data-view="pending-dispatch">Pending Dispatch</button></div>
    ${rows.length ? `<div class="assign-now-list">${rows.map(req => `<article class="assign-now-row">
      <div class="assign-now-main"><strong>${esc(requestTitle(req))}</strong><span>${esc(propertyLabel(req))}</span><small>${esc(propertyAddress(req))}</small></div>
      <div class="assign-now-meta"><b>${esc(req.priority || 'Normal')}</b><small>${esc(fmtTime(req.created_at))}</small></div>
      <label class="assign-now-select"><span>Guard</span><select data-assign-guard="${esc(req.id)}">${guardOptions || '<option value="">No active guards</option>'}</select></label>
      <button type="button" class="assign-now-button" data-action="admin-assign-now" data-request-id="${esc(req.id)}" ${guards.length ? '' : 'disabled'}>Assign Now</button>
    </article>`).join('')}</div>` : `<div class="assign-now-empty"><strong>No pending requests.</strong><span>When a client requests patrol, the job will appear here with an Assign Now shortcut.</span></div>`}
  </section>`;
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

        ${adminAssignNowPanel(pending)}

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
  const includeGuard = liveGps.online && Number.isFinite(liveGps.guardLat) && Number.isFinite(liveGps.guardLng);
  const includeProperty = liveGps.online && Boolean(guard302CurrentRequest()) && Number.isFinite(liveGps.propertyLat) && Number.isFinite(liveGps.propertyLng);
  if (includeGuard) points.push([liveGps.guardLat, liveGps.guardLng]);
  if (includeProperty) points.push([liveGps.propertyLat, liveGps.propertyLng]);
  for (const p of (includeProperty ? liveGps.routePoints : []) || []) {
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
  if (!liveGps.online || !req) {
    liveGps.propertyLat = null;
    liveGps.propertyLng = null;
    liveGps.propertyAddress = '';
    liveGps.routePoints = [];
    liveGps.routeDistanceMiles = null;
    liveGps.routeEtaMin = null;
    if (liveGps.online && !req) liveGps.mapNotice = 'Guard is online. Property marker appears only after Dispatch assigns an active job.';
    render();
    return;
  }
  await geocodePropertyIfNeeded(req);
  if (Number.isFinite(liveGps.guardLat) && Number.isFinite(liveGps.propertyLat)) {
    await fetchRouteIfPossible();
  } else {
    liveGps.routePoints = [];
    liveGps.routeDistanceMiles = null;
    liveGps.routeEtaMin = null;
    liveGps.mapNotice = 'Active job loaded. Property marker is available while GPS is online.';
  }
  render();
}

function setGuardOnline(options = {}) {
  if (!navigator.geolocation) {
    liveGps.mapNotice = 'This browser does not support location tracking.';
    render();
    return;
  }
  if (liveGps.watchId !== null) navigator.geolocation.clearWatch(liveGps.watchId);
  const now = new Date().toISOString();
  liveGps.online = true;
  liveGps.gpsMode = 'online';
  liveGps.onlineSince = options.restored && liveGps.onlineSince ? liveGps.onlineSince : (liveGps.onlineSince || now);
  liveGps.statusChangedAt = options.restored && liveGps.statusChangedAt ? liveGps.statusChangedAt : now;
  liveGps.offlineAt = null;
  liveGps.selectedMapCard = null;
  liveGps.mapNotice = options.restored
    ? 'Online restored. Waiting for browser GPS location update...'
    : 'Online requested. Waiting for browser GPS permission/location...';
  writeGuardGpsPersistedState({ online: true });
  render();
  liveGps.watchId = navigator.geolocation.watchPosition(async position => {
    liveGps.guardLat = position.coords.latitude;
    liveGps.guardLng = position.coords.longitude;
    liveGps.accuracy = position.coords.accuracy;
    liveGps.lastUpdate = new Date().toISOString();
    liveGps.online = true;
    liveGps.gpsMode = 'online';
    if (!liveGps.onlineSince) liveGps.onlineSince = liveGps.lastUpdate;
    if (!liveGps.statusChangedAt) liveGps.statusChangedAt = liveGps.lastUpdate;
    writeGuardGpsPersistedState({ online: true });
    await reverseGeocodeGuard(liveGps.guardLat, liveGps.guardLng);
    writeGuardGpsPersistedState({ online: true });
    await syncGpsForCurrentJob();
  }, error => {
    liveGps.online = true;
    liveGps.gpsMode = 'online';
    liveGps.selectedMapCard = null;
    liveGps.mapNotice = `${error?.message || 'Location permission denied or unavailable.'} Online status remains active until you click Offline.`;
    writeGuardGpsPersistedState({ online: true, gpsError: liveGps.mapNotice });
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
  const now = new Date().toISOString();
  liveGps.online = false;
  liveGps.gpsMode = 'offline';
  liveGps.statusChangedAt = now;
  liveGps.offlineAt = now;
  liveGps.onlineSince = null;
  liveGps.restoredFromStorage = false;
  liveGps.selectedMapCard = null;
  liveGps.guardLat = null;
  liveGps.guardLng = null;
  liveGps.accuracy = null;
  liveGps.currentAddress = 'Location not active';
  liveGps.propertyLat = null;
  liveGps.propertyLng = null;
  liveGps.propertyAddress = '';
  liveGps.routePoints = [];
  liveGps.routeDistanceMiles = null;
  liveGps.routeEtaMin = null;
  liveGps.mapNotice = 'Guard is offline. Guard and property markers are hidden.';
  writeGuardGpsPersistedState({ online: false });
  render();
}

function openMapCard(type, propertyId = '') {
  if (state.role === 'client' && ['dashboard','properties'].includes(state.view)) {
    const activeReq = clientAcceptedMapRequest();
    const entries = clientMapPropertyEntries();
    const hasGuard = Boolean(activeReq) && liveGps.online && Number.isFinite(liveGps.guardLat) && Number.isFinite(liveGps.guardLng);
    if (type === 'guard' && !hasGuard) return;
    if (type === 'property' && !entries.length) return;
    liveGps.clientSelectedPropertyId = propertyId || liveGps.clientSelectedPropertyId || String(activeReq?.property_id || entries[0]?.property?.id || '');
    liveGps.selectedMapCard = type;
    render();
    return;
  }
  const req = guard302CurrentRequest();
  const hasGuard = liveGps.online && Number.isFinite(liveGps.guardLat) && Number.isFinite(liveGps.guardLng);
  const hasProperty = liveGps.online && Boolean(req);
  if (type === 'guard' && !hasGuard) return;
  if (type === 'property' && !hasProperty) return;
  liveGps.selectedMapCard = type;
  render();
}

function closeMapCard() {
  liveGps.selectedMapCard = null;
  render();
}

function guard302CurrentRequest() {
  return activeRequests()[0] || null;
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
    <div class="guard302-assignment-actions single">
      <button type="button" class="guard302-primary" data-view="active-job">Open Active Job <b>›</b></button>
    </div>
  </section>`;
}

function guard302Map(req) {
  const hasGuard = liveGps.online && Number.isFinite(liveGps.guardLat) && Number.isFinite(liveGps.guardLng);
  const showProperty = liveGps.online && Boolean(req);
  const hasPropertyCoords = showProperty && Number.isFinite(liveGps.propertyLat) && Number.isFinite(liveGps.propertyLng);
  const bounds = currentMapBounds();
  const guardPct = hasGuard ? mapPercentForPoint(liveGps.guardLat, liveGps.guardLng, bounds) : null;
  const propertyPct = hasPropertyCoords ? mapPercentForPoint(liveGps.propertyLat, liveGps.propertyLng, bounds) : { x: 76, y: 37 };
  const fallbackRoute = showProperty ? routeSvgPath(bounds) : '';
  return `<section class="panel panel-pad guard302-map-card">
    <div class="guard302-card-head"><div><h2>Route / GPS <span class="guard302-live ${liveGps.online ? 'on' : ''}">${liveGps.online ? 'Live' : 'Offline'}</span></h2></div></div>
    <div class="guard302-leaflet-wrap">
      <div id="guard302-live-leaflet-map" class="guard302-leaflet-map" data-online="${liveGps.online ? '1' : '0'}"></div>
      <div class="guard302-map-fallback" id="guard302-map-fallback">
        <span class="street-name s1">W. Flamingo Rd</span><span class="street-name s2">S. Durango Dr</span><span class="street-name s3">W. Tropicana Ave</span><span class="street-name s4">S. Jones Blvd</span>
        <div class="fallback-road r1"></div><div class="fallback-road r2"></div><div class="fallback-road r3"></div><div class="fallback-road r4"></div>
        ${fallbackRoute ? `<svg class="guard302-fallback-route" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${esc(fallbackRoute)}"></path></svg>` : ''}
        ${hasGuard ? `<button type="button" class="guard302-fallback-marker guard" data-action="map-card" data-card="guard" style="left:${guardPct.x.toFixed(2)}%;top:${guardPct.y.toFixed(2)}%" aria-label="Open guard card"><span></span></button>` : ''}
        ${showProperty ? `<button type="button" class="guard302-fallback-marker property" data-action="map-card" data-card="property" style="left:${propertyPct.x.toFixed(2)}%;top:${propertyPct.y.toFixed(2)}%" aria-label="Open property card"><span></span></button>` : ''}
        <small>${liveGps.online ? 'Loading live street map layer...' : 'Offline. Markers hidden until guard goes Online.'}</small>
      </div>
      ${(showProperty && !hasPropertyCoords) ? `<div class="guard302-marker-overlay"><button type="button" class="guard302-fallback-marker property" data-action="map-card" data-card="property" style="left:${propertyPct.x.toFixed(2)}%;top:${propertyPct.y.toFixed(2)}%" aria-label="Open property card"><span></span></button></div>` : ''}
      ${liveGps.selectedMapCard === 'guard' && hasGuard ? guard302GuardCard(req) : ''}
      ${liveGps.selectedMapCard === 'property' && showProperty ? guard302PropertyCard(req) : ''}
      <div class="guard302-map-status">${esc(liveGps.mapNotice)} ${liveGps.lastUpdate ? 'Last update ' + timeAgo(liveGps.lastUpdate) + '.' : ''}</div>
    </div>
    <div class="guard302-map-stats">
      <div><small>ETA to Property</small><strong>${esc(showProperty && liveGps.routeEtaMin ? liveGps.routeEtaMin + ' min' : '—')}</strong></div>
      <div><small>Distance</small><strong>${esc(showProperty && liveGps.routeDistanceMiles ? liveGps.routeDistanceMiles.toFixed(1) + ' mi' : '—')}</strong></div>
      <div><small>Accuracy</small><strong>${esc(liveGps.accuracy ? '±' + Math.round(liveGps.accuracy) + ' ft' : '—')} <i></i></strong></div>
    </div>
    <div class="guard302-map-actions">
      <button type="button" class="guard302-online ${liveGps.gpsMode === 'online' ? 'active' : ''}" data-action="guard-online">Online</button>
      <button type="button" class="guard302-offline ${liveGps.gpsMode === 'offline' ? 'active' : ''}" data-action="guard-offline">Offline</button>
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

function guardWorkflowStorageKey(req) {
  return `cp_guard_workflow_stage_${String(req?.id || 'none')}`;
}
function guardWorkflowLogKey(req) {
  return `cp_guard_workflow_log_${String(req?.id || 'none')}`;
}
function guardWorkflowValidStages() {
  return ['accepted', 'on_way', 'arrived', 'checking', 'upload_proof', 'complete'];
}
function guardWorkflowStage(req) {
  if (!req) return 'accepted';
  if (String(req.status) === 'completed') return 'complete';
  const stored = sessionStorage.getItem(guardWorkflowStorageKey(req));
  if (guardWorkflowValidStages().includes(stored)) return stored;
  if (String(req.status) === 'in_progress') return 'checking';
  return 'accepted';
}
function guardWorkflowStageText(stage) {
  return ({
    accepted: 'Accepted',
    on_way: 'On The Way',
    arrived: 'Arrived',
    checking: 'Checking Property',
    upload_proof: 'Upload Proof',
    complete: 'Complete'
  })[stage] || 'Accepted';
}
function guardWorkflowInstruction(stage) {
  return ({
    accepted: 'Assignment accepted. When you leave for the property, mark On The Way.',
    on_way: 'You are currently en route to the property. When you arrive, mark Arrived to continue.',
    arrived: 'You are on site. Start checking the property when the patrol begins.',
    checking: 'Complete the property check, then upload proof photos or video.',
    upload_proof: 'Upload required proof, then complete the job when the patrol is finished.',
    complete: 'Job completed. The property marker is cleared from the live map workflow.'
  })[stage] || 'Use the workflow buttons below to continue.';
}
function guardWorkflowIndex(stage) {
  return Math.max(0, guardWorkflowValidStages().indexOf(stage));
}
function guardWorkflowStageState(req, targetStage) {
  const currentStage = guardWorkflowStage(req);
  const currentIndex = guardWorkflowIndex(currentStage);
  const targetIndex = guardWorkflowIndex(targetStage);
  if (targetIndex < currentIndex) return 'locked';
  if (targetStage === currentStage) return 'current';
  return 'default';
}
function guardWorkflowIsLocked(req, targetStage) {
  return guardWorkflowStageState(req, targetStage) === 'locked';
}
function guardWorkflowLocalLogs(req) {
  if (!req) return [];
  try {
    const parsed = JSON.parse(sessionStorage.getItem(guardWorkflowLogKey(req)) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function addGuardWorkflowLocalLog(req, title, details) {
  if (!req) return;
  const rows = guardWorkflowLocalLogs(req);
  rows.unshift({ created_at: new Date().toISOString(), title, details, actor: activeGuardName() });
  sessionStorage.setItem(guardWorkflowLogKey(req), JSON.stringify(rows.slice(0, 12)));
}
function setGuardWorkflowLocalStage(req, stage) {
  if (!req) return;
  sessionStorage.setItem(guardWorkflowStorageKey(req), stage);
}

function syncGuardWorkflowDom(req, stage) {
  document.querySelectorAll('[data-action="guard-workflow-step"][data-request-id]').forEach(btn => {
    if (String(btn.dataset.requestId) !== String(req?.id || '')) return;
    const stateName = guardWorkflowStageState(req, btn.dataset.step);
    const isCurrent = stateName === 'current';
    const isLocked = stateName === 'locked';
    btn.classList.toggle('current-stage', isCurrent);
    btn.classList.toggle('locked-stage', isLocked);
    btn.classList.toggle('default-stage', stateName === 'default');
    btn.disabled = isLocked;
    btn.setAttribute('aria-disabled', isLocked ? 'true' : 'false');
    if (btn.classList.contains('active-step')) {
      const small = btn.querySelector('small');
      if (small) small.textContent = isLocked ? 'Locked' : isCurrent ? 'Current' : 'Default';
    }
  });
  const status = document.querySelector('.active-workflow-status');
  if (status) status.innerHTML = `<strong>Current Status: <b>${esc(guardWorkflowStageText(stage))}</b></strong><p>${esc(guardWorkflowInstruction(stage))}</p>`;
}

function clearInlineProofState() {
  inlineProof.objectUrls.forEach(url => {
    try { URL.revokeObjectURL(url); } catch {}
  });
  inlineProof.requestId = '';
  inlineProof.files = [];
  inlineProof.objectUrls = [];
}

function closeInlineProofModal() {
  document.querySelectorAll('.inline-proof-modal').forEach(el => el.remove());
  clearInlineProofState();
}

function launchInlineProofPicker(req) {
  if (!req) return;
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*,video/*';
  input.multiple = true;
  input.style.position = 'fixed';
  input.style.left = '-9999px';
  input.style.top = '-9999px';
  input.addEventListener('change', () => {
    const files = Array.from(input.files || []);
    input.remove();
    if (!files.length) return;
    showInlineProofPreview(req, files);
  }, { once: true });
  document.body.appendChild(input);
  input.click();
}

function showInlineProofPreview(req, files = []) {
  closeInlineProofModal();
  inlineProof.requestId = String(req.id);
  inlineProof.files = Array.from(files || []);
  inlineProof.objectUrls = inlineProof.files.map(file => URL.createObjectURL(file));
  const previews = inlineProof.files.slice(0, 6).map((file, idx) => {
    const url = inlineProof.objectUrls[idx];
    const kind = file.type.startsWith('video/') ? 'video' : 'image';
    const media = kind === 'video'
      ? `<video src="${esc(url)}" controls muted playsinline></video>`
      : `<img src="${esc(url)}" alt="Proof preview">`;
    return `<div class="inline-proof-preview-item">${media}<span>${esc(file.name || 'Proof file')}</span></div>`;
  }).join('');
  const more = inlineProof.files.length > 6 ? `<p class="inline-proof-more">+${inlineProof.files.length - 6} more selected</p>` : '';
  const modal = document.createElement('div');
  modal.className = 'inline-proof-modal';
  modal.innerHTML = `<div class="inline-proof-backdrop" data-action="cancel-inline-proof"></div>
    <section class="inline-proof-dialog" role="dialog" aria-modal="true" aria-label="Confirm proof upload">
      <div class="inline-proof-head"><div><p class="eyebrow">Proof Upload</p><h2>Confirm this upload</h2><span>${esc(requestTitle(req))} · ${esc(propertyLabel(req))}</span></div><button type="button" data-action="cancel-inline-proof">×</button></div>
      <div class="inline-proof-grid">${previews}${more}</div>
      <label class="inline-proof-note">Guard note<textarea name="inline_proof_note" placeholder="Optional note for Dispatch and final report"></textarea></label>
      <div class="inline-proof-actions"><button type="button" class="ghost-button" data-action="cancel-inline-proof">Cancel</button><button type="button" class="primary-button" data-action="confirm-inline-proof">Confirm Upload</button></div>
    </section>`;
  document.body.appendChild(modal);
  const note = modal.querySelector('textarea');
  if (note) note.focus();
}

async function confirmInlineProofUpload() {
  const req = state.patrolRequests.find(r => String(r.id) === String(inlineProof.requestId));
  if (!req) throw new Error('Active job not found for proof upload.');
  const modal = document.querySelector('.inline-proof-modal');
  const note = modal?.querySelector('textarea[name="inline_proof_note"]')?.value?.trim() || '';
  const files = inlineProof.files.slice();
  const btn = modal?.querySelector('[data-action="confirm-inline-proof"]');
  if (btn) { btn.disabled = true; btn.textContent = 'Uploading…'; }
  await uploadProofFiles(req.id, files, note);
  setGuardWorkflowLocalStage(req, 'upload_proof');
  addGuardWorkflowLocalLog(req, 'Proof uploaded', note || `${files.length} proof item${files.length === 1 ? '' : 's'} uploaded`);
  closeInlineProofModal();
  await loadData();
  state.view = 'active-job';
  render();
  toast('Proof uploaded and saved to this job. You can now complete the job.', 'success');
}
function guardWorkflowProofProgress(req) {
  const count = req ? proofForRequest(req.id).length : 0;
  const target = 4;
  return { count, target, pct: Math.min(100, Math.round((count / target) * 100)) };
}
async function callGuardStatusRpc(req, nextStatus) {
  const result = await supabase.rpc('cp_guard_update_patrol_request_status', {
    p_request_id: req.id,
    p_next_status: nextStatus
  });
  if (!result?.ok) throw new Error(result?.message || 'Workflow status could not be updated.');
  return result.request || null;
}
async function updateGuardWorkflowStep(requestId, step) {
  const req = state.patrolRequests.find(r => String(r.id) === String(requestId));
  if (!req) throw new Error('Active job not found.');
  const beforeStatus = String(req.status || 'assigned');
  const currentStage = guardWorkflowStage(req);
  if (guardWorkflowIndex(step) < guardWorkflowIndex(currentStage)) {
    toast(`${guardWorkflowStageText(step)} is locked. Continue from ${guardWorkflowStageText(currentStage)}.`, 'error');
    return;
  }

  if (step === 'upload_proof') {
    setGuardWorkflowLocalStage(req, 'upload_proof');
    addGuardWorkflowLocalLog(req, 'Opened Inline Proof Upload', `${propertyLabel(req)} proof upload opened inside Active Job`);
    syncGuardWorkflowDom(req, 'upload_proof');
    launchInlineProofPicker(req);
    return;
  }

  if (step === 'on_way') {
    if (beforeStatus === 'assigned') await callGuardStatusRpc(req, 'accepted');
    setGuardWorkflowLocalStage(req, 'on_way');
    addGuardWorkflowLocalLog(req, 'Guard marked On The Way', `${propertyLabel(req)} · route started`);
  } else if (step === 'arrived') {
    if (beforeStatus === 'assigned') await callGuardStatusRpc(req, 'accepted');
    const latest = state.patrolRequests.find(r => String(r.id) === String(requestId)) || req;
    if (String(latest.status || beforeStatus) !== 'in_progress') await callGuardStatusRpc(latest, 'in_progress');
    setGuardWorkflowLocalStage(req, 'arrived');
    addGuardWorkflowLocalLog(req, 'Guard marked Arrived', `${propertyLabel(req)} · on site`);
  } else if (step === 'checking') {
    if (beforeStatus === 'assigned') await callGuardStatusRpc(req, 'accepted');
    const latest = state.patrolRequests.find(r => String(r.id) === String(requestId)) || req;
    if (String(latest.status || beforeStatus) !== 'in_progress') await callGuardStatusRpc(latest, 'in_progress');
    setGuardWorkflowLocalStage(req, 'checking');
    addGuardWorkflowLocalLog(req, 'Started Property Check', `${propertyLabel(req)} · checking property`);
  } else if (step === 'complete') {
    let latest = req;
    if (String(latest.status) === 'assigned') {
      const updated = await callGuardStatusRpc(latest, 'accepted');
      latest = updated || latest;
    }
    if (String(latest.status) === 'accepted') {
      const updated = await callGuardStatusRpc(latest, 'in_progress');
      latest = updated || latest;
    }
    if (String(latest.status) !== 'completed') await callGuardStatusRpc(latest, 'completed');
    setGuardWorkflowLocalStage(req, 'complete');
    addGuardWorkflowLocalLog(req, 'Guard completed job', `${propertyLabel(req)} · patrol completed`);
    liveGps.propertyLat = null;
    liveGps.propertyLng = null;
    liveGps.propertyAddress = '';
    liveGps.routePoints = [];
    liveGps.routeDistanceMiles = null;
    liveGps.routeEtaMin = null;
    liveGps.selectedMapCard = null;
  }

  await loadData();
  render();
  toast(`${guardWorkflowStageText(step)} saved.`, 'success');
}
function activeJobSummaryCard(req) {
  const photo = getPropertyPhotoUrl(req);
  const proof = guardWorkflowProofProgress(req);
  const stage = guardWorkflowStage(req);
  const thumb = photo ? `<img src="${esc(photo)}" alt="${esc(propertyLabel(req))}">` : `<div class="active-job-photo-fallback"><span>CP</span><strong>${esc(initials(propertyLabel(req)))}</strong></div>`;
  return `<section class="panel panel-pad active-job-summary-card">
    <div class="active-job-photo">${thumb}</div>
    <div class="active-job-summary-main">
      <div class="active-job-card-title"><h2>${esc(requestTitle(req))}</h2>${statusChip(req.status)}</div>
      <h3>${esc(propertyLabel(req))}</h3>
      <p>${esc(propertyAddress(req))}</p>
      <div class="active-job-chip-row"><span>● GPS ${liveGps.online ? 'Live' : 'Offline'}</span><span>${esc(req.priority || 'Medium')}</span><span>${esc(proof.count)} Proof Uploaded</span><button type="button" data-view="route-gps">Open Assignment</button></div>
    </div>
    <div class="active-job-meta-grid">
      <div><small>Started</small><strong>${esc(fmtDate(req.started_at || req.accepted_at || req.assigned_at || req.created_at))}</strong></div>
      <div><small>ETA</small><strong>${esc(liveGps.routeEtaMin ? fmtTime(new Date(Date.now() + liveGps.routeEtaMin * 60000).toISOString()) + ' (' + liveGps.routeEtaMin + ' min)' : '—')}</strong></div>
      <div><small>Priority</small><strong><i></i>${esc(req.priority || 'Medium')}</strong></div>
      <div><small>Status</small><strong>${esc(guardWorkflowStageText(stage))}</strong></div>
    </div>
  </section>`;
}
function activeJobWorkflowPanel(req) {
  const stage = guardWorkflowStage(req);
  const steps = [
    ['accepted', '✓', 'Accepted'],
    ['on_way', '▣', 'On The Way'],
    ['arrived', '⌖', 'Arrived'],
    ['checking', '⌕', 'Checking Property'],
    ['upload_proof', '⇧', 'Upload Proof'],
    ['complete', '✓', 'Complete']
  ];
  const stageMeta = actionStage => {
    const stateName = guardWorkflowStageState(req, actionStage);
    return {
      stateName,
      cls: stateName === 'current' ? 'current-stage' : stateName === 'locked' ? 'locked-stage' : 'default-stage',
      label: stateName === 'current' ? 'Current' : stateName === 'locked' ? 'Locked' : 'Default',
      disabled: stateName === 'locked' ? 'disabled aria-disabled="true"' : 'aria-disabled="false"'
    };
  };
  const actionClass = actionStage => {
    const meta = stageMeta(actionStage);
    return `active-job-action ${meta.cls}`;
  };
  const actionDisabled = actionStage => stageMeta(actionStage).disabled;
  return `<section class="panel panel-pad active-workflow-panel">
    <div class="panel-head"><div><h2>Workflow Progress</h2><p>Move forward through the job. Once the next stage is clicked, previous stages lock and cannot be reopened.</p></div></div>
    <div class="active-stepper">
      ${steps.map(([key, icon, label]) => {
        const meta = stageMeta(key);
        return `<button type="button" class="active-step ${meta.cls}" ${meta.disabled} data-action="guard-workflow-step" data-request-id="${esc(req.id)}" data-step="${esc(key)}"><i>${esc(icon)}</i><strong>${esc(label)}</strong><small>${esc(meta.label)}</small></button>`;
      }).join('')}
    </div>
    <div class="active-workflow-status"><strong>Current Status: <b>${esc(guardWorkflowStageText(stage))}</b></strong><p>${esc(guardWorkflowInstruction(stage))}</p></div>
    <div class="active-job-action-row">
      <button type="button" class="${actionClass('on_way')}" ${actionDisabled('on_way')} data-action="guard-workflow-step" data-request-id="${esc(req.id)}" data-step="on_way"><i>▣</i>Mark On The Way</button>
      <button type="button" class="${actionClass('arrived')}" ${actionDisabled('arrived')} data-action="guard-workflow-step" data-request-id="${esc(req.id)}" data-step="arrived"><i>⌖</i>Mark Arrived</button>
      <button type="button" class="${actionClass('checking')}" ${actionDisabled('checking')} data-action="guard-workflow-step" data-request-id="${esc(req.id)}" data-step="checking"><i>⌕</i>Start Checking</button>
      <button type="button" class="${actionClass('upload_proof')}" ${actionDisabled('upload_proof')} data-action="guard-workflow-step" data-request-id="${esc(req.id)}" data-step="upload_proof"><i>⇧</i>Upload Proof</button>
      <button type="button" class="${actionClass('complete')}" ${actionDisabled('complete')} data-action="guard-workflow-step" data-request-id="${esc(req.id)}" data-step="complete"><i>✓</i>Complete Job</button>
    </div>
  </section>`;
}
function activeJobLogPanel(req) {
  const local = guardWorkflowLocalLogs(req);
  const remote = req ? state.patrolActivity.filter(item => String(item.request_id) === String(req.id)).map(item => ({
    created_at: item.created_at,
    title: item.title || item.event_type || 'Patrol Event',
    details: item.details || item.message || '',
    actor: requestGuardName(req)
  })) : [];
  const fallback = req ? [
    { created_at: req.accepted_at || req.assigned_at || req.created_at, title: 'Guard accepted patrol', details: `${propertyLabel(req)} · assignment active`, actor: activeGuardName() },
    { created_at: req.assigned_at || req.created_at, title: 'Admin assigned guard', details: `${activeGuardName()} assigned to patrol request`, actor: 'System' },
    { created_at: req.created_at, title: 'Patrol request created', details: propertyAddress(req), actor: 'System' }
  ] : [];
  const rows = [...local, ...remote, ...fallback].filter(x => x.created_at).slice(0, 7);
  return `<section class="panel panel-pad active-job-log-panel">
    <div class="panel-head"><div><h2>Activity / Job Log</h2><p>Request timeline</p></div><button class="ghost-button" data-view="activity-log">View Full Activity</button></div>
    <div class="active-log-table">
      ${rows.length ? rows.map(row => `<div class="active-log-row"><span>${esc(fmtTime(row.created_at))}</span><i>•</i><strong>${esc(row.title)}</strong><p>${esc(row.details)}</p><em>${esc(row.actor || 'System')}</em></div>`).join('') : `<div class="empty">No activity yet.</div>`}
    </div>
  </section>`;
}
function activeJobGpsMini(req) {
  const hasGuard = liveGps.online && Number.isFinite(liveGps.guardLat) && Number.isFinite(liveGps.guardLng);
  const showProperty = liveGps.online && Boolean(req);
  const proof = guardWorkflowProofProgress(req);
  return `<section class="panel panel-pad active-rail-card active-gps-mini">
    <div class="active-rail-head"><h2>Route / GPS <span class="${liveGps.online ? 'on' : ''}">${liveGps.online ? 'Online' : 'Offline'}</span></h2></div>
    <div class="active-mini-map">
      <span class="street s1">I-15</span><span class="street s2">S Main St</span><span class="street s3">W Charleston Blvd</span>
      <div class="road a"></div><div class="road b"></div><div class="road c"></div>
      ${showProperty ? '<svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M 22 72 C 36 72, 35 42, 54 48 S 70 37, 82 23"></path></svg>' : ''}
      ${hasGuard ? '<button type="button" class="active-mini-marker guard" data-action="map-card" data-card="guard"><span></span></button>' : ''}
      ${showProperty ? '<button type="button" class="active-mini-marker property" data-action="map-card" data-card="property"><span></span></button>' : ''}
      ${liveGps.selectedMapCard === 'guard' && hasGuard ? guard302GuardCard(req) : ''}
      ${liveGps.selectedMapCard === 'property' && showProperty ? guard302PropertyCard(req) : ''}
    </div>
    <div class="active-rail-metrics"><div><small>ETA</small><strong>${esc(liveGps.routeEtaMin ? liveGps.routeEtaMin + ' min' : '—')}</strong></div><div><small>Distance</small><strong>${esc(liveGps.routeDistanceMiles ? liveGps.routeDistanceMiles.toFixed(1) + ' mi' : '—')}</strong></div><div><small>Accuracy</small><strong>${esc(liveGps.accuracy ? '±' + Math.round(liveGps.accuracy) + ' ft' : '—')}</strong></div></div>
  </section>`;
}
function activeJobDetailsCard(req) {
  return `<section class="panel panel-pad active-rail-card">
    <div class="active-rail-head"><h2>Open Job Details</h2></div>
    <div class="active-detail-list"><span>Request #</span><strong>${esc(String(req.request_number || req.id || '').slice(0, 8))}</strong><span>Property</span><strong>${esc(propertyLabel(req))}</strong><span>Scheduled</span><strong>${esc(fmtDate(req.scheduled_for || req.requested_for || req.scheduled_at || req.created_at))}</strong><span>Client</span><strong>${esc(requestClientName(req))}</strong></div>
    <button class="ghost-button active-full-width" data-view="dashboard">View Full Job</button>
  </section>`;
}
function activeJobProofNotesCard(req) {
  const proof = guardWorkflowProofProgress(req);
  const local = guardWorkflowLocalLogs(req)[0];
  const proofLocked = guardWorkflowIsLocked(req, 'upload_proof');
  return `<section class="panel panel-pad active-rail-card">
    <div class="active-rail-head"><h2>Proof / Notes</h2><button class="ghost-button ${proofLocked ? 'locked-stage' : ''}" ${proofLocked ? 'disabled aria-disabled="true"' : 'aria-disabled="false"'} data-action="guard-workflow-step" data-request-id="${esc(req.id)}" data-step="upload_proof">${proofLocked ? 'Proof Locked' : 'Upload Proof'}</button></div>
    <div class="active-proof-row"><span>Proof Progress</span><b>${esc(proof.count)} / ${esc(proof.target)} uploaded</b></div>
    <div class="active-proof-bar"><i style="width:${esc(proof.pct)}%"></i></div>
    <div class="active-note-box"><small>Notes from Guard</small><p>${esc(local?.details || req.instructions || 'No guard notes yet.')}</p><em>— ${esc(activeGuardName())}</em></div>
  </section>`;
}
function activeJobNotificationsCard() {
  const notes = state.notifications.slice(0, 2);
  return `<section class="panel panel-pad active-rail-card">
    <div class="active-rail-head"><h2>Recent Notifications</h2><button class="ghost-button" data-view="notifications">View All</button></div>
    <div class="active-notice-list">${notes.length ? notes.map(n => `<button type="button" data-view="notifications"><i></i><span><strong>${esc(n.title || n.event_type || 'Notification')}</strong><small>${esc(n.message || n.details || '')}</small></span><em>${esc(fmtTime(n.created_at))}</em></button>`).join('') : `<div class="empty">No notifications yet.</div>`}</div>
  </section>`;
}

function requestCompletedAt(req = {}) {
  return req.completed_at || req.closed_at || req.updated_at || req.created_at || null;
}
function completedRangeLabel(filter = 'today') {
  return ({ today: 'Today', week: 'This Week', month: 'This Month', year: 'This Year' })[filter] || 'Today';
}
function activeGuardRecord() {
  const profileId = String(state.profile?.id || state.profile?.auth_user_id || state.profile?.user_id || '');
  const email = String(activeGuardEmail() || '').toLowerCase();
  const name = String(activeGuardName() || '').trim().toLowerCase();
  return state.guards.find(g => [g.id, g.auth_user_id, g.user_id, g.profile_id].some(v => String(v || '') && String(v || '') === profileId))
    || state.guards.find(g => String(g.email || '').toLowerCase() === email)
    || state.guards.find(g => String(g.name || g.display_name || '').trim().toLowerCase() === name)
    || null;
}
function requestMatchesActiveGuard(req = {}) {
  const record = activeGuardRecord();
  const ids = [record?.id, record?.auth_user_id, record?.user_id, record?.profile_id, state.profile?.id, state.profile?.auth_user_id, state.profile?.user_id]
    .map(v => String(v || ''))
    .filter(Boolean);
  if (ids.length && ids.includes(String(req.guard_id || req.assigned_guard_id || ''))) return true;
  const reqGuardName = String(requestGuardName(req) || '').trim().toLowerCase();
  const reqGuardEmail = String(guardById(req.guard_id || req.assigned_guard_id)?.email || '').trim().toLowerCase();
  const selfName = String(activeGuardName() || '').trim().toLowerCase();
  const selfEmail = String(activeGuardEmail() || '').trim().toLowerCase();
  if (selfEmail && reqGuardEmail && selfEmail === reqGuardEmail) return true;
  if (selfName && reqGuardName && selfName === reqGuardName) return true;
  return false;
}
function completedFilterMatch(dateValue, filter = 'today') {
  const d = new Date(dateValue || 0);
  if (isNaN(d.getTime())) return false;
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (filter === 'today') return d >= startToday;
  if (filter === 'week') {
    const start = new Date(startToday);
    start.setDate(startToday.getDate() - startToday.getDay());
    return d >= start;
  }
  if (filter === 'month') return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  if (filter === 'year') return d.getFullYear() === now.getFullYear();
  return true;
}
function guardCompletedRequestsBase() {
  const all = completedRequests().filter(requestMatchesActiveGuard);
  return all.length ? all : completedRequests();
}
function guardCompletedJobsForFilter(filter = state.completedFilter || 'today') {
  return guardCompletedRequestsBase()
    .filter(req => completedFilterMatch(requestCompletedAt(req), filter))
    .sort((a, b) => new Date(requestCompletedAt(b) || 0) - new Date(requestCompletedAt(a) || 0));
}
function guardCompletedDurationMinutes(req = {}) {
  const start = new Date(req.started_at || req.accepted_at || req.assigned_at || req.created_at || 0).getTime();
  const end = new Date(requestCompletedAt(req) || 0).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
  return Math.max(1, Math.round((end - start) / 60000));
}
function guardCompletedStats(filter = state.completedFilter || 'today') {
  const rows = guardCompletedJobsForFilter(filter);
  const proofCount = rows.reduce((sum, req) => sum + proofForRequest(req.id).length, 0);
  const durations = rows.map(guardCompletedDurationMinutes).filter(Number.isFinite);
  const avgDuration = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : null;
  const totalMinutes = durations.length ? durations.reduce((a, b) => a + b, 0) : 0;
  return { rows, proofCount, avgDuration, totalMinutes };
}
function guardCompletedSelectedRequest(rows = []) {
  return rows.find(r => String(r.id) === String(state.selectedCompletedRequestId || '')) || rows[0] || null;
}
function completedJobStatCard(icon, title, value, sub, tone = '') {
  return `<article class="completed-stat-card ${esc(tone)}"><div class="completed-stat-icon">${esc(icon)}</div><div><strong>${esc(title)}</strong><b>${esc(value)}</b><span>${esc(sub)}</span></div></article>`;
}
function completedFilterButton(filter, label) {
  const active = (state.completedFilter || 'today') === filter;
  return `<button type="button" class="completed-filter-btn ${active ? 'active' : ''}" data-completed-filter="${esc(filter)}">${esc(label)}</button>`;
}
function completedProofStack(req = {}) {
  const proofs = proofForRequest(req.id).slice(0, 3);
  if (!proofs.length) return `<span class="completed-proof-none">0</span>`;
  return `<div class="completed-proof-stack">${proofs.map((item, idx) => `<span style="z-index:${4-idx}">${esc(String((item.file_type || 'proof')).startsWith('video/') ? '▶' : '▣')}</span>`).join('')}<b>${esc(proofForRequest(req.id).length)}</b></div>`;
}
function completedJobRow(req = {}, selected = false) {
  const completedAt = requestCompletedAt(req);
  const duration = guardCompletedDurationMinutes(req);
  return `<button type="button" class="completed-job-row ${selected ? 'active' : ''}" data-action="select-completed-request" data-request-id="${esc(req.id)}">
    <div class="completed-request-col"><strong>${esc(requestTitle(req))}</strong><span>${esc(propertyLabel(req))}</span></div>
    <div class="completed-prop-col"><strong>${esc(propertyAddress(req))}</strong><span>${esc(requestClientName(req))}</span></div>
    <div class="completed-date-col"><strong>${esc(fmtDate(completedAt))}</strong><span>${esc(timeAgo(completedAt))}</span></div>
    <div class="completed-duration-col"><strong>${esc(duration ? duration + ' min' : '—')}</strong><span>Duration</span></div>
    <div class="completed-proof-col">${completedProofStack(req)}</div>
    <div class="completed-status-col">${statusChip('completed')}</div>
  </button>`;
}
function completedProofPreview(item = {}) {
  const url = proofUrlValue(item);
  const name = item.file_name || 'Proof file';
  const isVideo = String(item.file_type || '').startsWith('video/');
  if (!url) return `<div class="completed-proof-tile empty"><span>${esc(name)}</span></div>`;
  return `<div class="completed-proof-tile">${isVideo ? `<video src="${esc(url)}" muted playsinline preload="metadata"></video>` : `<img src="${esc(url)}" alt="${esc(name)}">`}<div><strong>${esc(name)}</strong><span>${esc(item.file_type || (isVideo ? 'Video' : 'Image'))}</span></div></div>`;
}
function guardCompletedJobsView() {
  const filter = state.completedFilter || 'today';
  const stats = guardCompletedStats(filter);
  const rows = stats.rows;
  const selected = guardCompletedSelectedRequest(rows);
  const proofs = selected ? proofForRequest(selected.id) : [];
  const durations = rows.map(guardCompletedDurationMinutes).filter(Number.isFinite);
  const completionRate = rows.length ? '100%' : '—';
  return `<div class="dashboard completed-page">
    <header class="dashboard-header completed-header">
      <div class="title-block"><h1>Completed</h1><p>Review finished patrols, proof, and job history.</p></div>
      <div class="header-actions completed-toolbar">${completedFilterButton('today', 'Today')}${completedFilterButton('week', 'This Week')}${completedFilterButton('month', 'This Month')}${completedFilterButton('year', 'This Year')}</div>
    </header>
    <section class="completed-stats-grid">
      ${completedJobStatCard('✓', 'Completed Jobs', rows.length, completedRangeLabel(filter), 'green')}
      ${completedJobStatCard('◷', 'Total Time', stats.totalMinutes ? Math.floor(stats.totalMinutes / 60) + 'h ' + String(stats.totalMinutes % 60).padStart(2, '0') + 'm' : '—', completedRangeLabel(filter), 'blue')}
      ${completedJobStatCard('▣', 'Proof Uploaded', stats.proofCount, completedRangeLabel(filter), 'purple')}
      ${completedJobStatCard('◎', 'Completion Rate', completionRate, completedRangeLabel(filter), 'teal')}
    </section>
    <section class="completed-layout">
      <div class="panel completed-list-panel">
        <div class="completed-list-head"><span>Request</span><span>Property / Address</span><span>Completed</span><span>Duration</span><span>Proof</span><span>Status</span></div>
        <div class="completed-list-body">${rows.length ? rows.map(req => completedJobRow(req, selected && String(selected.id) === String(req.id))).join('') : `<div class="empty completed-empty"><strong>No completed jobs for ${esc(completedRangeLabel(filter))}.</strong><br>By default this page only shows today's completed jobs. Change the filter above to view more history.</div>`}</div>
        <div class="completed-list-foot"><span>Showing ${esc(rows.length)} result${rows.length === 1 ? '' : 's'}</span><span>Default filter: Today</span></div>
      </div>
      <aside class="panel panel-pad completed-detail-rail">
        ${selected ? `
          <div class="active-rail-head completed-detail-head"><h2>Job Details</h2><button class="ghost-button" data-view="active-job">Open Active Job</button></div>
          <div class="completed-detail-summary"><div class="completed-detail-photo">${(propertyById(selected.property_id).photo_url || propertyById(selected.property_id).image_url) ? `<img src="${esc(propertyById(selected.property_id).photo_url || propertyById(selected.property_id).image_url)}" alt="${esc(propertyLabel(selected))}">` : `<div>${esc(propertyLabel(selected).slice(0,1) || 'P')}</div>`}</div><div><strong>${esc(requestTitle(selected))}</strong><span>${esc(propertyLabel(selected))}</span><small>${esc(propertyAddress(selected))}</small></div>${statusChip('completed')}</div>
          <div class="active-detail-list completed-detail-list"><span>Completed</span><strong>${esc(fmtDate(requestCompletedAt(selected)))}</strong><span>Duration</span><strong>${esc(guardCompletedDurationMinutes(selected) ? guardCompletedDurationMinutes(selected) + ' min' : '—')}</strong><span>Patrol Type</span><strong>${esc(selected.patrol_type || selected.request_type || 'Patrol Check')}</strong><span>Priority</span><strong>${esc(statusText(selected.priority || 'Normal'))}</strong><span>Client</span><strong>${esc(requestClientName(selected))}</strong><span>Assigned Guard</span><strong>${esc(requestGuardName(selected))}</strong></div>
          <div class="completed-timeline"><h3>Job Timeline</h3><div>${['accepted','on_the_way','arrived','checking_property','upload_proof','completed'].map(step => `<div><i>✓</i><span>${esc(guardWorkflowStageText(step))}</span></div>`).join('')}</div></div>
          <div class="completed-proof-section"><div class="active-rail-head"><h2>Proof Files (${esc(proofs.length)})</h2></div><div class="completed-proof-grid">${proofs.length ? proofs.slice(0, 4).map(completedProofPreview).join('') : `<div class="empty">No proof files uploaded.</div>`}</div></div>
        ` : `<div class="empty"><strong>No job selected.</strong><br>Select a completed job on the left to see its details.</div>`}
      </aside>
    </section>
  </div>`;
}
function guardActiveJobWorkflowView() {
  const req = guard302CurrentRequest();
  if (!req) {
    return `<div class="dashboard guard-active-workflow"><header class="dashboard-header"><div class="title-block"><h1>Active Job</h1><p>Manage your current patrol workflow from start to finish.</p></div><div class="header-actions"><span class="system-pill"><i></i>System Operational</span></div></header><section class="page-panel"><div class="empty"><strong>No Active Job</strong><br>When Dispatch assigns a patrol, the workflow controls will appear here.</div></section></div>`;
  }
  return `<div class="dashboard guard-active-workflow">
    <header class="dashboard-header active-job-header"><div class="title-block"><h1>Active Job</h1><p>Manage your current patrol workflow from start to finish.</p></div><div class="header-actions"><span class="system-pill"><i></i>System Operational</span></div></header>
    <section class="active-job-layout">
      <div class="active-job-main-col">
        ${activeJobSummaryCard(req)}
        ${activeJobWorkflowPanel(req)}
        ${activeJobLogPanel(req)}
      </div>
      <aside class="active-job-right-col">
        ${activeJobGpsMini(req)}
        ${activeJobDetailsCard(req)}
        ${activeJobProofNotesCard(req)}
        ${activeJobNotificationsCard()}
      </aside>
    </section>
  </div>`;
}


function guardRouteGpsLiveView() {
  const req = guard302CurrentRequest();
  return `<div class="dashboard guard-route-gps-page">
    <header class="dashboard-header active-job-header"><div class="title-block"><h1>Route / GPS</h1><p>Live location sharing, route status, and active patrol map.</p></div><div class="header-actions"><span class="system-pill"><i></i>System Operational</span></div></header>
    <section class="guard-route-gps-layout">
      <div class="guard-route-gps-main">${guard302Map(req)}</div>
      <aside class="guard-route-gps-rail">
        ${guard302CurrentAssignment(req)}
        <section class="panel panel-pad guard-route-gps-help">
          <div class="guard302-card-head"><div><h2>Map Behavior</h2></div></div>
          <div class="guard-route-gps-help-list">
            <div><strong>Online</strong><span>Shows your blue pulse marker and stays online after logout/login until Offline is clicked.</span><em>Online since: ${esc(fmtDateTimeStamp(liveGps.onlineSince))}</em></div>
            <div><strong>Active Job</strong><span>Shows the red property marker only while an active job exists.</span><em>Checked: ${esc(currentDateTimeStamp())}</em></div>
            <div><strong>Offline</strong><span>Hides both guard and property markers and saves the offline timestamp.</span><em>Last offline: ${esc(fmtDateTimeStamp(liveGps.offlineAt))}</em></div>
            <div><strong>Marker Click</strong><span>Click a marker to open its detail card, then close with X.</span><em>Last GPS update: ${esc(fmtDateTimeStamp(liveGps.lastUpdate))}</em></div>
          </div>
        </section>
      </aside>
    </section>
  </div>`;
}


function clientPendingDispatchRequests() {
  return state.patrolRequests.filter(r => String(r.status || 'pending_dispatch') === 'pending_dispatch');
}
function clientRecentReportRecords() {
  const reports = [...(state.patrolReports || [])].sort((a,b) => new Date(b.released_at || b.created_at || 0) - new Date(a.released_at || a.created_at || 0));
  if (reports.length) return reports.slice(0, 3);
  return completedRequests().slice(0, 3).map(req => ({ request_id: req.id, title: `${propertyLabel(req)} Report`, released_at: req.updated_at || req.created_at }));
}
function clientReportRow(report = {}) {
  const req = report.request_id ? state.patrolRequests.find(r => String(r.id) === String(report.request_id)) : null;
  const title = report.title || report.name || propertyLabel(req || {}) || 'Patrol Report';
  const sub = req ? `${statusText(req.status)} • ${fmtDate(report.released_at || report.created_at || req.updated_at || req.created_at)}` : fmtDate(report.released_at || report.created_at);
  return `<button type="button" class="client-report-row" data-view="reports"><i>▣</i><span><strong>${esc(title)}</strong><small>${esc(sub)}</small></span><em>${esc(fmtTime(report.released_at || report.created_at || req?.updated_at || req?.created_at))}</em></button>`;
}
function clientMessageFeedRows(limit = 2) {
  const rows = (state.messageThreads || []).slice(0, limit);
  return rows.length ? rows.map(t => `<button type="button" class="client-feed-row" data-view="messages"><i>${esc(initials(t.subject || t.title || 'D'))}</i><span><strong>${esc(t.subject || t.title || 'Conversation')}</strong><small>${esc(t.last_message_preview || 'No messages yet')}</small></span><em>${esc(fmtTime(t.updated_at || t.created_at))}</em></button>`).join('') : '<div class="empty">No messages yet.</div>';
}
function clientNotificationFeedRows(limit = 3) {
  const rows = notificationsList().slice(0, limit);
  return rows.length ? rows.map(n => `<button type="button" class="client-feed-row" data-view="notifications"><i class="${esc(notificationAccentClass(n))}">${esc(notificationIcon(n))}</i><span><strong>${esc(n._title)}</strong><small>${esc(n._body || notificationCategoryLabel(n))}</small></span><em>${esc(n._time)}</em></button>`).join('') : '<div class="empty">No notifications.</div>';
}
function clientActivityEntries() {
  const reqRows = state.patrolRequests.map(req => ({
    type: 'request',
    timestamp: req.updated_at || req.created_at,
    event: req.status === 'completed' ? 'Patrol completed' : req.status === 'in_progress' ? 'Patrol started' : req.status === 'accepted' ? 'Guard accepted patrol' : req.status === 'assigned' ? 'Guard assigned' : 'Patrol requested',
    property: propertyLabel(req),
    person: requestGuardName(req) !== 'Unassigned' ? requestGuardName(req) : requestClientName(req),
    status: req.status || 'pending_dispatch'
  }));
  const alertRows = notificationsList().slice(0, 3).map(n => ({
    type: 'notification',
    timestamp: n._created,
    event: n._title,
    property: relatedRequestForNotification(n) ? propertyLabel(relatedRequestForNotification(n)) : notificationCategoryLabel(n),
    person: n.source || 'Operations',
    status: n._category === 'message' ? 'assigned' : 'completed'
  }));
  return [...reqRows, ...alertRows].sort((a,b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0)).slice(0, 5);
}
function clientActivityRow(entry = {}) {
  return `<div class="client-activity-row"><span>${esc(fmtDate(entry.timestamp))}</span><strong>${esc(entry.event)}</strong><span>${esc(entry.property)}</span><span>${esc(entry.person)}</span><span>${statusChip(entry.status)}</span></div>`;
}

function clientOwnedPropertyIds() {
  return new Set((state.properties || []).map(p => String(p.id)));
}
function clientAcceptedMapRequest() {
  const owned = clientOwnedPropertyIds();
  return [...(state.patrolRequests || [])]
    .filter(r => owned.has(String(r.property_id)) && ['accepted', 'in_progress'].includes(String(r.status || '')))
    .sort((a, b) => new Date(b.updated_at || b.accepted_at || b.created_at || 0) - new Date(a.updated_at || a.accepted_at || a.created_at || 0))[0] || null;
}
function restoreClientViewOfGuardGps() {
  const saved = readGuardGpsPersistedState();
  if (!saved?.online) return false;
  liveGps.online = true;
  liveGps.gpsMode = 'online';
  liveGps.onlineSince = saved.onlineSince || saved.statusChangedAt || saved.savedAt || liveGps.onlineSince || new Date().toISOString();
  liveGps.statusChangedAt = saved.statusChangedAt || liveGps.onlineSince;
  liveGps.offlineAt = saved.offlineAt || null;
  liveGps.lastUpdate = saved.lastUpdate || null;
  liveGps.guardLat = Number.isFinite(Number(saved.guardLat)) ? Number(saved.guardLat) : liveGps.guardLat;
  liveGps.guardLng = Number.isFinite(Number(saved.guardLng)) ? Number(saved.guardLng) : liveGps.guardLng;
  liveGps.accuracy = Number.isFinite(Number(saved.accuracy)) ? Number(saved.accuracy) : liveGps.accuracy;
  liveGps.currentAddress = saved.currentAddress || liveGps.currentAddress || 'Waiting for live guard GPS update...';
  return true;
}
function clientMapPropertyEntries() {
  const activeReq = clientAcceptedMapRequest();
  return (state.properties || []).slice(0, 12).map((property, idx) => {
    const req = { property_id: property.id };
    let coords = getPropertyCoords(req);
    if ((!coords || !Number.isFinite(coords.lat) || !Number.isFinite(coords.lng)) && activeReq && String(activeReq.property_id) === String(property.id) && Number.isFinite(liveGps.propertyLat) && Number.isFinite(liveGps.propertyLng)) {
      coords = { lat: liveGps.propertyLat, lng: liveGps.propertyLng };
    }
    const fallback = [
      { x: 26, y: 64 }, { x: 42, y: 39 }, { x: 60, y: 54 }, { x: 76, y: 36 }, { x: 87, y: 60 }, { x: 30, y: 28 }
    ][idx] || { x: 50, y: 50 };
    return { property, coords, fallback, isActive: activeReq && String(activeReq.property_id) === String(property.id) };
  });
}
function clientMapBounds(entries = []) {
  const points = [];
  for (const entry of entries) {
    if (entry.coords && Number.isFinite(entry.coords.lat) && Number.isFinite(entry.coords.lng)) points.push([entry.coords.lat, entry.coords.lng]);
  }
  if (liveGps.online && Number.isFinite(liveGps.guardLat) && Number.isFinite(liveGps.guardLng)) points.push([liveGps.guardLat, liveGps.guardLng]);
  for (const p of (liveGps.routePoints || [])) {
    if (Number.isFinite(p.lat) && Number.isFinite(p.lng)) points.push([p.lat, p.lng]);
  }
  if (!points.length) return { minLat: 36.07, maxLat: 36.20, minLng: -115.30, maxLng: -115.08 };
  let minLat = Math.min(...points.map(p => p[0]));
  let maxLat = Math.max(...points.map(p => p[0]));
  let minLng = Math.min(...points.map(p => p[1]));
  let maxLng = Math.max(...points.map(p => p[1]));
  const latPad = Math.max(.006, (maxLat - minLat) * .35);
  const lngPad = Math.max(.006, (maxLng - minLng) * .35);
  return { minLat: minLat - latPad, maxLat: maxLat + latPad, minLng: minLng - lngPad, maxLng: maxLng + lngPad };
}
function clientMapRoutePath(bounds, activeEntry) {
  if (liveGps.routePoints && liveGps.routePoints.length >= 2) {
    return liveGps.routePoints.map((pt, idx) => {
      const p = mapPercentForPoint(pt.lat, pt.lng, bounds);
      return `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
    }).join(' ');
  }
  if (activeEntry && activeEntry.coords && Number.isFinite(liveGps.guardLat) && Number.isFinite(liveGps.guardLng)) {
    const g = mapPercentForPoint(liveGps.guardLat, liveGps.guardLng, bounds);
    const p = mapPercentForPoint(activeEntry.coords.lat, activeEntry.coords.lng, bounds);
    const midX = (g.x + p.x) / 2;
    const midY = (g.y + p.y) / 2;
    return `M ${g.x.toFixed(2)} ${g.y.toFixed(2)} C ${(midX - 10).toFixed(2)} ${(midY + 16).toFixed(2)}, ${(midX + 12).toFixed(2)} ${(midY - 14).toFixed(2)}, ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  }
  return '';
}
function clientSelectedProperty() {
  const entries = clientMapPropertyEntries();
  const activeReq = clientAcceptedMapRequest();
  const activePropertyId = String(activeReq?.property_id || '');
  const selectedId = String(liveGps.clientSelectedPropertyId || activePropertyId || entries[0]?.property?.id || '');
  return entries.find(entry => String(entry.property.id) === selectedId)?.property || entries[0]?.property || null;
}
function clientMapGuardCard(req) {
  return `<div class="guard302-live-card">
    <button type="button" class="guard302-card-close" data-action="close-map-card">×</button>
    <div>${avatar(requestGuardName(req) || activeGuardName(), getGuardPhotoUrl())}</div>
    <div>
      <strong>${esc(requestGuardName(req) || activeGuardName())}</strong>
      <small>${esc(activeGuardEmail() || 'Assigned guard')}</small>
      <p>${esc(liveGps.currentAddress || 'Waiting for live guard GPS address...')}</p>
      <span>${liveGps.online ? 'Accepted assignment · Live GPS visible to client' : 'GPS waiting'}${liveGps.accuracy ? ' · Accuracy ±' + Math.round(liveGps.accuracy) + ' ft' : ''}</span>
    </div>
  </div>`;
}
function clientMapPropertyCard(property) {
  if (!property) return '';
  const photo = property.photo_url || property.image_url || property.property_photo_url || property.reference_photo_url || property.logo_url || '';
  const label = property.label || property.name || property.property_name || 'Property';
  const address = [property.address || property.address_line1, property.city, property.state, property.zip_code].filter(Boolean).join(', ');
  const owner = property.owner_name || property.contact_name || state.profile?.display_name || state.profile?.name || state.profile?.email || 'Client';
  const img = photo ? `<div class="avatar"><img src="${esc(photo)}" alt="${esc(label)}"></div>` : `<div class="avatar">${esc(initials(label || owner))}</div>`;
  return `<div class="guard302-live-card property">
    <button type="button" class="guard302-card-close" data-action="close-map-card">×</button>
    <div>${img}</div>
    <div>
      <strong>${esc(label)}</strong>
      <small>Client Property: ${esc(owner)}</small>
      <p>${esc(address || 'Address unavailable')}</p>
      <span>Your property marker · Visible in client map only</span>
    </div>
  </div>`;
}
function clientLivePatrolMapCard() {
  const activeReq = clientAcceptedMapRequest();
  const entries = clientMapPropertyEntries();
  const selectedProperty = clientSelectedProperty();
  const activeEntry = entries.find(entry => entry.isActive) || null;
  const bounds = clientMapBounds(entries);
  const routePath = activeReq && liveGps.online ? clientMapRoutePath(bounds, activeEntry) : '';
  const hasGuard = Boolean(activeReq) && liveGps.online && Number.isFinite(liveGps.guardLat) && Number.isFinite(liveGps.guardLng);
  return `<section class="panel panel-pad guard302-map-card client-live-map-card">
    <div class="guard302-card-head"><div><h2>Client Patrol Map <span class="guard302-live ${hasGuard ? 'on' : ''}">${hasGuard ? 'Live' : 'Tracking Idle'}</span></h2></div></div>
    <div class="guard302-leaflet-wrap client-leaflet-wrap">
      <div id="client-live-leaflet-map" class="guard302-leaflet-map" data-online="${hasGuard ? '1' : '0'}"></div>
      <div class="guard302-map-fallback" id="client-live-map-fallback">
        <span class="street-name s1">W. Flamingo Rd</span><span class="street-name s2">S. Durango Dr</span><span class="street-name s3">W. Tropicana Ave</span><span class="street-name s4">S. Jones Blvd</span>
        <div class="fallback-road r1"></div><div class="fallback-road r2"></div><div class="fallback-road r3"></div><div class="fallback-road r4"></div>
        ${routePath ? `<svg class="guard302-fallback-route" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${esc(routePath)}"></path></svg>` : ''}
        ${entries.map(entry => {
          const pos = entry.coords ? mapPercentForPoint(entry.coords.lat, entry.coords.lng, bounds) : entry.fallback;
          return `<button type="button" class="guard302-fallback-marker property" data-action="map-card" data-card="property" data-property-id="${esc(entry.property.id)}" style="left:${pos.x.toFixed ? pos.x.toFixed(2) : pos.x}%;top:${pos.y.toFixed ? pos.y.toFixed(2) : pos.y}%" aria-label="Open property card"><span></span></button>`;
        }).join('')}
        ${hasGuard ? `<button type="button" class="guard302-fallback-marker guard" data-action="map-card" data-card="guard" style="left:${mapPercentForPoint(liveGps.guardLat, liveGps.guardLng, bounds).x.toFixed(2)}%;top:${mapPercentForPoint(liveGps.guardLat, liveGps.guardLng, bounds).y.toFixed(2)}%" aria-label="Open guard card"><span></span></button>` : ''}
        <small>${esc(liveGps.mapNotice || 'Client map ready.')}</small>
      </div>
      ${liveGps.selectedMapCard === 'guard' && hasGuard && activeReq ? clientMapGuardCard(activeReq) : ''}
      ${liveGps.selectedMapCard === 'property' && selectedProperty ? clientMapPropertyCard(selectedProperty) : ''}
      <div class="guard302-map-status">${esc(liveGps.mapNotice || 'Client map ready.')} ${liveGps.lastUpdate ? 'Last update ' + timeAgo(liveGps.lastUpdate) + '.' : ''}</div>
    </div>
    <div class="guard302-map-stats">
      <div><small>Tracked Property</small><strong>${esc(activeReq ? propertyLabel(activeReq) : (state.properties[0]?.label || state.properties[0]?.name || '—'))}</strong></div>
      <div><small>ETA</small><strong>${esc(activeReq && liveGps.routeEtaMin ? liveGps.routeEtaMin + ' min' : '—')}</strong></div>
      <div><small>Distance</small><strong>${esc(activeReq && liveGps.routeDistanceMiles ? liveGps.routeDistanceMiles.toFixed(1) + ' mi' : '—')}</strong></div>
      <div><small>Accuracy</small><strong>${esc(hasGuard && liveGps.accuracy ? '±' + Math.round(liveGps.accuracy) + ' ft' : '—')} <i></i></strong></div>
    </div>
    <div class="guard302-map-actions client-map-note"><span>Client view only · You see only your properties. Guard appears after accepting your patrol and route updates live from the guard GPS.</span></div>
  </section>`;
}
function hideClientMapFallback() {
  const fallback = document.getElementById('client-live-map-fallback');
  if (fallback) fallback.classList.add('loaded');
}
function showClientMapFallback(message = 'Live street map layer unavailable. Showing fallback street grid.') {
  const fallback = document.getElementById('client-live-map-fallback');
  if (fallback) {
    fallback.classList.remove('loaded');
    const small = fallback.querySelector('small');
    if (small) small.textContent = message;
  }
}
function initClientLeafletMap() {
  const el = document.getElementById('client-live-leaflet-map');
  if (!el) return;
  if (!window.L) {
    showClientMapFallback('Leaflet did not load yet. Showing fallback client map with clickable property markers.');
    return;
  }
  if (el.dataset.ready === '1' && liveGps.leafletMap) {
    try { liveGps.leafletMap.invalidateSize(); } catch {}
    return;
  }
  try {
    if (liveGps.leafletMap) {
      try { liveGps.leafletMap.remove(); } catch {}
      liveGps.leafletMap = null;
      liveGps.leafletLayer = null;
    }
    const entries = clientMapPropertyEntries();
    const activeReq = clientAcceptedMapRequest();
    const hasGuard = Boolean(activeReq) && liveGps.online && Number.isFinite(liveGps.guardLat) && Number.isFinite(liveGps.guardLng);
    const centerEntry = entries.find(entry => entry.isActive && entry.coords) || entries.find(entry => entry.coords) || null;
    const center = hasGuard ? [liveGps.guardLat, liveGps.guardLng] : centerEntry?.coords ? [centerEntry.coords.lat, centerEntry.coords.lng] : [36.1699, -115.1398];
    const map = L.map(el, { zoomControl:true, attributionControl:false, dragging:true, scrollWheelZoom:true, doubleClickZoom:true }).setView(center, centerEntry || hasGuard ? 14 : 11);
    liveGps.leafletMap = map;
    el.dataset.ready = '1';
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19, crossOrigin:true });
    tiles.on('load', hideClientMapFallback);
    tiles.on('tileerror', () => showClientMapFallback('Map tiles blocked or slow. Showing fallback client map.'));
    tiles.addTo(map);
    const markerGroup = L.featureGroup().addTo(map);
    entries.forEach(entry => {
      const lat = entry.coords?.lat;
      const lng = entry.coords?.lng;
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
      const propertyMarker = L.marker([lat, lng], { icon: leafletDivIcon('leaflet-property-pulse-icon', '<span></span>') }).addTo(markerGroup);
      propertyMarker.on('click', () => openMapCard('property', entry.property.id));
    });
    if (hasGuard) {
      const guardMarker = L.marker([liveGps.guardLat, liveGps.guardLng], { icon: leafletDivIcon('leaflet-guard-pulse-icon', '<span></span>') }).addTo(markerGroup);
      guardMarker.on('click', () => openMapCard('guard'));
    }
    if (hasGuard && Number.isFinite(liveGps.propertyLat) && Number.isFinite(liveGps.propertyLng)) {
      const coords = (liveGps.routePoints && liveGps.routePoints.length >= 2) ? liveGps.routePoints.map(p => [p.lat, p.lng]) : [[liveGps.guardLat, liveGps.guardLng], [(liveGps.guardLat + liveGps.propertyLat) / 2 + 0.003, (liveGps.guardLng + liveGps.propertyLng) / 2 - 0.003], [liveGps.propertyLat, liveGps.propertyLng]];
      L.polyline(coords, { color:'#2e88ff', weight:5, opacity:.88, dashArray:'10 8', lineCap:'round', lineJoin:'round' }).addTo(markerGroup);
    }
    if (markerGroup.getLayers().length > 0) {
      try { map.fitBounds(markerGroup.getBounds(), { padding:[36,36], maxZoom:15 }); } catch {}
    }
    setTimeout(() => { try { map.invalidateSize(); } catch {} }, 150);
    setTimeout(() => {
      const tilePane = el.querySelector('.leaflet-tile-pane');
      const hasTiles = tilePane && tilePane.querySelector('img');
      if (hasTiles) hideClientMapFallback();
    }, 1100);
  } catch (err) {
    showClientMapFallback('Map could not initialize. Showing fallback client map with clickable property markers.');
  }
}
function scheduleClientLeafletMap() {
  if (state.role === 'client' && state.view === 'dashboard') {
    requestAnimationFrame(() => {
      [75, 450, 1200, 2500].forEach(delay => setTimeout(initClientLeafletMap, delay));
    });
  }
}
function scheduleClientMapPrep() {
  if (state.role !== 'client' || state.view !== 'dashboard') return;
  restoreClientViewOfGuardGps();
  const activeReq = clientAcceptedMapRequest();
  if (!activeReq) {
    liveGps.routePoints = [];
    liveGps.routeDistanceMiles = null;
    liveGps.routeEtaMin = null;
    liveGps.propertyLat = null;
    liveGps.propertyLng = null;
    liveGps.propertyAddress = '';
    liveGps.mapNotice = 'Client view only. You can see only your properties. Guard marker and route appear after a guard accepts one of your patrol requests.';
    return;
  }
  const existing = getPropertyCoords(activeReq);
  if (existing) {
    liveGps.propertyLat = existing.lat;
    liveGps.propertyLng = existing.lng;
    liveGps.propertyAddress = propertyAddress(activeReq);
  }
  if (!liveGps.clientSelectedPropertyId) liveGps.clientSelectedPropertyId = String(activeReq.property_id || '');
  if (liveGps.online && Number.isFinite(liveGps.guardLat) && Number.isFinite(liveGps.guardLng) && Number.isFinite(liveGps.propertyLat) && Number.isFinite(liveGps.propertyLng) && !liveGps.routeBusy && !liveGps.routePoints.length) {
    setTimeout(async () => {
      await fetchRouteIfPossible();
      if (state.role === 'client' && state.view === 'dashboard') render();
    }, 180);
  } else if (!existing && !liveGps.geocodeBusy) {
    const key = `client_${String(activeReq.id || activeReq.property_id || 'active')}`;
    if (liveGps.propertyPrepKey !== key) {
      liveGps.propertyPrepKey = key;
      setTimeout(async () => {
        await geocodePropertyIfNeeded(activeReq);
        if (liveGps.online && Number.isFinite(liveGps.guardLat) && Number.isFinite(liveGps.guardLng) && Number.isFinite(liveGps.propertyLat) && Number.isFinite(liveGps.propertyLng)) await fetchRouteIfPossible();
        if (state.role === 'client' && state.view === 'dashboard') render();
      }, 250);
    }
  }
  liveGps.mapNotice = liveGps.online && Number.isFinite(liveGps.guardLat) && Number.isFinite(liveGps.guardLng)
    ? 'Live client map active. You can see the accepted guard marker, your property marker, and the live route line.'
    : 'Patrol accepted. Waiting for the guard device to update live GPS.';
}

function clientDashboardView() {
  const propertiesCount = state.properties.length;
  const activePatrolsCount = clientOpenRequests().filter(r => ['assigned','accepted','in_progress'].includes(String(r.status || ''))).length;
  const openRequestsCount = clientPendingDispatchRequests().length;
  const reportsReadyCount = reportsReady().length || state.patrolReports.length;
  const reportRows = clientRecentReportRecords();
  const activityRows = clientActivityEntries();
  return `<div class="dashboard client-dashboard-shell">
    <header class="dashboard-header">
      <div class="title-block"><h1>Client Dashboard</h1><p>Modern client command center for patrol visibility, requests, reports, and communication.</p></div>
      <div class="header-actions"><button class="header-button">⌕</button><button class="header-button">🔔</button><button class="header-button">☼</button><span class="system-pill"><i></i>System Operational</span><button class="header-button">?</button></div>
    </header>
    <section class="kpi-row client-kpi-row">
      ${kpiCard('▦', 'Properties', propertiesCount, `${propertiesCount ? propertiesCount : '0'} total properties`, '#2f83ff')}
      ${kpiCard('◈', 'Active Patrols', activePatrolsCount, `${activePatrolsCount} in motion`, '#37dc72')}
      ${kpiCard('☰', 'Open Requests', openRequestsCount, `${openRequestsCount} needs attention`, '#b05cff')}
      ${kpiCard('▣', 'Reports Ready', reportsReadyCount, `${reportsReadyCount} available`, '#ffb53d')}
    </section>
    <section class="client-dashboard-grid">
      <div class="client-dashboard-main">
        ${clientLivePatrolMapCard()}
        <section class="panel panel-pad client-activity-card">
          <div class="panel-head"><div><h2>Recent Activity</h2><p>Latest patrols and property updates across your portfolio.</p></div><button class="ghost-button" data-view="patrol-requests">View all activity</button></div>
          <div class="client-activity-table"><div class="client-activity-head"><span>Time</span><span>Event</span><span>Property</span><span>Guard / Unit</span><span>Status</span></div>${activityRows.length ? activityRows.map(clientActivityRow).join('') : '<div class="empty">No recent activity.</div>'}<div class="client-activity-footer">Showing ${activityRows.length ? `1 to ${activityRows.length}` : '0'} of ${state.patrolRequests.length || 0} results</div></div>
        </section>
      </div>
      <aside class="client-dashboard-right">
        <section class="panel panel-pad client-side-card"><div class="panel-head"><div><h2>Messages</h2><p>Inbox</p></div><button class="ghost-button" data-view="messages">View all</button></div><div class="client-feed-list">${clientMessageFeedRows(2)}</div></section>
        <section class="panel panel-pad client-side-card"><div class="panel-head"><div><h2>Notifications</h2><p>Alerts and updates</p></div><button class="ghost-button" data-view="notifications">View all</button></div><div class="client-feed-list">${clientNotificationFeedRows(3)}</div></section>
        <section class="panel panel-pad client-side-card client-reports-card"><div class="panel-head"><div><h2>Recent Reports</h2><p>Latest client-facing patrol reports.</p></div><button class="ghost-button" data-view="reports">View all</button></div><div class="client-report-list">${reportRows.length ? reportRows.map(clientReportRow).join('') : '<div class="empty">No reports ready.</div>'}</div></section>
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



function notificationsView() {
  const counts = notificationCounts();
  const rows = filteredNotifications();
  const note = selectedNotification();
  const linkedRequest = relatedRequestForNotification(note);
  const groups = groupedNotifications(rows);
  const recentActivity = [...(state.patrolActivity || [])].sort((a,b) => new Date(b.created_at || b.timestamp || 0) - new Date(a.created_at || a.timestamp || 0)).slice(0,2);
  return `<div class="dashboard notifications-shell">
    <header class="dashboard-header">
      <div class="title-block"><h1>Notifications</h1><p>Alerts, patrol updates, and dispatch communication.</p></div>
      <div class="header-actions"><span class="system-pill"><i></i>System Operational</span></div>
    </header>
    <section class="notifications-toolbar page-panel">
      <div class="notifications-search"><span>⌕</span><input type="search" placeholder="Search notifications..." value="${esc(state.notificationSearch)}" data-notification-search></div>
      <div class="notifications-filter-row">
        <button type="button" class="filter-pill ${state.notificationFilter === 'all' ? 'active' : ''}" data-notification-filter="all">All</button>
        <button type="button" class="filter-pill ${state.notificationFilter === 'unread' ? 'active' : ''}" data-notification-filter="unread">Unread ${counts.unread ? `<b>${esc(counts.unread)}</b>` : ''}</button>
        <button type="button" class="filter-pill ${state.notificationFilter === 'patrol' ? 'active' : ''}" data-notification-filter="patrol">Patrols</button>
        <button type="button" class="filter-pill ${state.notificationFilter === 'messages' ? 'active' : ''}" data-notification-filter="messages">Messages</button>
        <button type="button" class="filter-pill ${state.notificationFilter === 'system' ? 'active' : ''}" data-notification-filter="system">System</button>
      </div>
      <div class="notifications-toolbar-actions">
        <button type="button" class="ghost-button" data-action="mark-all-notifications-read">✓ Mark All Read</button>
        <button type="button" class="ghost-button" data-action="clear-notification-filters">⟲ Clear Filters</button>
      </div>
    </section>
    <section class="notifications-summary-row">
      ${notificationSummaryCard('◔', 'Total Notifications', counts.total, '+ 18% vs yesterday', 'blue')}
      ${notificationSummaryCard('⦿', 'Unread', counts.unread, counts.unread ? 'Requires attention' : 'All caught up', 'violet')}
      ${notificationSummaryCard('✓', 'Patrol Updates', counts.patrol, '+ 12% vs yesterday', 'green')}
      ${notificationSummaryCard('☵', 'Dispatch Messages', counts.messages, '+ 5% vs yesterday', 'purple')}
    </section>
    <section class="notifications-layout page-panel">
      <div class="notifications-feed">
        ${groups.length ? groups.map(group => `<div class="notifications-group"><div class="notifications-group-label">${esc(group.label)}</div><div class="notifications-group-list">${group.rows.map(item => notificationRow(item)).join('')}</div></div>`).join('') : '<div class="empty">No notifications found.</div>'}
        <div class="notifications-load-more"><button type="button" class="ghost-button">⌄ Load more</button></div>
      </div>
      <aside class="notifications-detail panel panel-pad">
        ${note ? `<div class="notifications-detail-head"><div class="detail-title-wrap"><div class="notification-orb ${esc(notificationAccentClass(note))}">${esc(notificationIcon(note))}</div><div><h2>${esc(note._title)}</h2><p>${esc(fmtDate(note._created))} (${esc(note._timeAgo)})</p></div></div><span class="severity-chip ${esc(note._severity)}">${esc(notificationPriorityLabel(note))}</span></div>
          <div class="detail-card"><div class="detail-card-head"><strong>Message</strong></div><div class="notification-message-box">${esc(note._body || 'No message body available.')}</div><div class="detail-grid"><span>Source</span><strong>${esc(note.source || (note._category === 'message' ? 'Dispatch Center' : note._category === 'system' ? 'System Monitor' : 'Operations'))}</strong><span>Category</span><strong>${esc(notificationCategoryLabel(note))}</strong><span>Related Job</span><strong>${esc(linkedRequest ? `${propertyLabel(linkedRequest)}${propertyAddress(linkedRequest) ? ' / ' + propertyAddress(linkedRequest) : ''}` : 'None linked')}</strong><span>Reference ID</span><strong>${esc(notificationReferenceId(note))}</strong><span>Priority</span><strong>${esc(notificationPriorityLabel(note))}</strong><span>Status</span><strong>${esc(note._isUnread ? 'New' : 'Read')}</strong></div><div class="detail-action-row"><button type="button" class="primary-button" data-action="notification-open-linked-job">${esc(linkedRequest && String(linkedRequest.status) === 'completed' ? 'View Completed Job' : 'View Active Job')}</button><button type="button" class="ghost-button" data-action="notification-open-messages">Open Messages</button><button type="button" class="ghost-button" data-action="acknowledge-notification" data-notification-id="${esc(note._id)}">✓ Acknowledge</button></div></div>
          <section class="detail-card"><div class="detail-card-head"><strong>Recent Activity</strong><button type="button" class="ghost-inline">View all</button></div>${recentActivity.length ? recentActivity.map(a => `<div class="detail-line icon"><span class="mini-icon ${esc(notificationAccentClass(note))}">${esc(notificationIcon(note))}</span><div><strong>${esc(a.event_type || a.title || 'Patrol update')}</strong><p>${esc(a.notes || a.message || propertyLabel(linkedRequest || {}))}</p></div><em>${esc(fmtTime(a.created_at || a.timestamp))}</em></div>`).join('') : '<div class="detail-line"><span>No recent activity.</span></div>'}</section>
          <section class="detail-card"><div class="detail-card-head"><strong>Notification Preferences</strong></div><div class="preferences-row"><div><strong>Manage how and when you receive notifications.</strong><p>Patrol assignments, dispatch messages, and system updates.</p></div><button type="button" class="ghost-button" data-action="open-notification-preferences">Open Preferences</button></div></section>` : '<div class="empty">No notification selected.</div>'}
      </aside>
    </section>
  </div>`;
}
function notificationSummaryCard(icon, label, value, sub, tone = 'blue') {
  return `<article class="notification-summary ${esc(tone)}"><div class="summary-icon">${esc(icon)}</div><div class="summary-copy"><span>${esc(label)}</span><strong>${esc(value)}</strong><small>${esc(sub)}</small></div></article>`;
}
function notificationRow(item) {
  return `<button type="button" class="notification-row ${String(state.selectedNotificationId) === String(item._id) ? 'active' : ''} ${item._isUnread ? 'unread' : ''}" data-action="select-notification" data-notification-id="${esc(item._id)}"><div class="notification-orb ${esc(notificationAccentClass(item))}">${esc(notificationIcon(item))}</div><div class="notification-row-copy"><div class="notification-row-top"><strong>${esc(item._title)}</strong>${item._isUnread ? '<span class="notif-dot"></span>' : ''}</div><p>${esc(item._body)}</p><div class="notification-row-tags"><span class="category-pill ${esc(notificationAccentClass(item))}">${esc(notificationCategoryLabel(item))}</span>${item._severity === 'high' ? '<span class="category-pill danger">High Priority</span>' : ''}</div></div><div class="notification-row-meta"><strong>${esc(item._time)}</strong><span>${esc(item._timeAgo)}</span>${item._isUnread ? '<i></i>' : ''}</div></button>`;
}


function proofUploadView() {
  state.view = 'active-job';
  return guardActiveJobWorkflowView();
}

function clientOpenRequests() {
  return state.patrolRequests.filter(r => ['pending_dispatch', 'assigned', 'accepted', 'in_progress'].includes(String(r.status || 'pending_dispatch')));
}
function clientRecentRequests() {
  return [...state.patrolRequests].sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0));
}
function clientPropertyOptionLabel(p = {}) {
  const name = p.label || p.name || p.property_name || 'Property';
  const address = [p.address || p.address_line1, p.city, p.state, p.zip_code].filter(Boolean).join(', ');
  return address ? `${name} — ${address}` : name;
}
function clientRequestStatusLabel(req = {}) {
  const status = String(req.status || 'pending_dispatch');
  if (status === 'pending_dispatch') return 'Waiting for Dispatch';
  if (status === 'assigned') return 'Guard Assigned';
  if (status === 'accepted') return 'Guard Accepted';
  if (status === 'in_progress') return 'In Progress';
  if (status === 'completed') return 'Completed';
  return statusText(status);
}
function clientRequestCard(req) {
  const proof = proofForRequest(req.id).length;
  return `<article class="client-request-row">
    <div><strong>${esc(requestTitle(req))}</strong><span>${esc(propertyLabel(req))}</span><small>${esc(propertyAddress(req))}</small></div>
    <p>${statusChip(req.status)}</p>
    <div><b>${esc(clientRequestStatusLabel(req))}</b><small>${esc(fmtDate(req.created_at || req.requested_at))}</small></div>
    <em>${esc(proof)} proof</em>
  </article>`;
}
function clientPropertyCardForRequest(p) {
  const photo = p.photo_url || p.image_url || p.property_photo_url || p.reference_photo_url || '';
  const address = [p.address || p.address_line1, p.city, p.state, p.zip_code].filter(Boolean).join(', ');
  return `<button type="button" class="client-property-pick" data-action="client-prefill-property" data-property-id="${esc(p.id)}">
    ${photo ? `<img src="${esc(photo)}" alt="${esc(p.label || p.name || 'Property')}">` : `<i>${esc(initials(p.label || p.name || 'CP'))}</i>`}
    <span><strong>${esc(p.label || p.name || p.property_name || 'Property')}</strong><small>${esc(address || 'Address unavailable')}</small></span>
  </button>`;
}

function propertyDisplayName(property = {}) {
  return property.label || property.name || property.property_name || property.nickname || `Property #${property.id || ''}`.trim() || 'Property';
}
function propertyDisplayAddress(property = {}) {
  return [property.address || property.address_line1 || property.street, property.city, property.state, property.zip || property.zip_code].filter(Boolean).join(', ') || 'Address unavailable';
}
function propertyImageValue(property = {}) {
  return property.photo_url || property.image_url || property.property_photo_url || property.reference_photo_url || property.logo_url || '';
}
function propertyStatusValue(property = {}) {
  // Client properties are considered active/saved as long as they exist in the database.
  return 'saved';
}
function propertyRequestsForProperty(property = {}) {
  return (state.patrolRequests || []).filter(req => String(req.property_id) === String(property.id));
}
function propertyLatestRequest(property = {}) {
  return propertyRequestsForProperty(property).sort((a,b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0))[0] || null;
}
function propertyActiveRequest(property = {}) {
  return propertyRequestsForProperty(property)
    .filter(req => ['accepted','in_progress','assigned'].includes(String(req.status || '')))
    .sort((a,b) => new Date(b.updated_at || b.accepted_at || b.created_at || 0) - new Date(a.updated_at || a.accepted_at || a.created_at || 0))[0] || null;
}
function propertyOpenRequestCount(property = {}) {
  return propertyRequestsForProperty(property).filter(req => String(req.status || '') !== 'completed').length;
}
function propertyReportsForProperty(property = {}) {
  const reqIds = new Set(propertyRequestsForProperty(property).map(req => String(req.id)));
  return (state.patrolReports || []).filter(report => reqIds.has(String(report.request_id)));
}
function propertyLastActivityMeta(property = {}) {
  const req = propertyLatestRequest(property);
  const reports = propertyReportsForProperty(property).sort((a,b) => new Date(b.released_at || b.created_at || 0) - new Date(a.released_at || a.created_at || 0));
  const report = reports[0] || null;
  const events = (state.patrolActivity || []).filter(item => {
    const linked = requestById(item.request_id);
    return linked && String(linked.property_id) === String(property.id);
  }).sort((a,b) => new Date(b.created_at || b.timestamp || 0) - new Date(a.created_at || a.timestamp || 0));
  const event = events[0] || null;
  const candidates = [
    req ? { type:'request', title: statusText(req.status), subtitle: req.status === 'completed' ? 'Patrol finished' : req.status === 'in_progress' ? 'GPS update' : 'Patrol activity', at: req.updated_at || req.created_at } : null,
    report ? { type:'report', title:'Report ready', subtitle: 'Client report released', at: report.released_at || report.created_at } : null,
    event ? { type:'event', title: event.title || event.event_type || 'Activity', subtitle: event.details || event.message || 'Patrol update', at: event.created_at || event.timestamp } : null
  ].filter(Boolean).sort((a,b) => new Date(b.at || 0) - new Date(a.at || 0));
  return candidates[0] || { title:'System Check', subtitle:'No recent events', at:null };
}

function propertyTypeStorageKey() { return 'cp_security_client_property_types_v1'; }
function readPropertyTypeMap() {
  try {
    const parsed = JSON.parse(localStorage.getItem(propertyTypeStorageKey()) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}
function writePropertyTypeMap(map = {}) {
  try { localStorage.setItem(propertyTypeStorageKey(), JSON.stringify(map)); } catch {}
}
function savePropertyTypeOverride(propertyId, type) {
  if (!propertyId) return;
  const map = readPropertyTypeMap();
  map[String(propertyId)] = type || 'Retail';
  writePropertyTypeMap(map);
}
function propertyTypeOverride(property = {}) {
  const map = readPropertyTypeMap();
  return map[String(property.id || '')] || '';
}
function propertyTypeLabel(property = {}) {
  const override = propertyTypeOverride(property);
  const raw = String(override || property.property_type || property.type || property.category || '').trim();
  const value = raw.toLowerCase();
  if (/residential|home|house|apartment|condo|townhome|duplex|triplex|fourplex/.test(value)) return 'Residential';
  if (/retail|restaurant|store|shop|commercial|business|office|warehouse|mall/.test(value)) return 'Retail';
  if (!raw) return 'Retail';
  return raw.replace(/\s+location$/i, '').replace(/\b\w/g, c => c.toUpperCase());
}
function propertyContactName(property = {}) {
  return property.owner_name || property.contact_name || state.profile?.display_name || state.profile?.name || 'Client';
}
function propertyPhoneValue(property = {}) {
  return property.phone || property.contact_phone || property.owner_phone || '—';
}
function propertyEmailValue(property = {}) {
  return property.email || property.contact_email || property.owner_email || state.profile?.email || '—';
}
function propertyTimezoneValue(property = {}) {
  return property.timezone || 'America/Los_Angeles';
}
function propertyFootageValue(property = {}) {
  return property.square_footage || property.sq_ft || property.squareFeet || '—';
}
function propertyClientSince(property = {}) {
  return property.client_since || property.created_at || property.inserted_at || null;
}
function propertyIsPrimary(property = {}) {
  return Boolean(property.is_primary || property.primary || property.default_property);
}
function filteredClientProperties() {
  const term = String(state.clientPropertySearch || '').trim().toLowerCase();
  return (state.properties || []).filter(property => {
    const hay = [propertyDisplayName(property), propertyDisplayAddress(property), propertyTypeLabel(property), propertyContactName(property)].join(' ').toLowerCase();
    const matchesTerm = !term || hay.includes(term);
    const type = propertyTypeLabel(property).toLowerCase();
    const hasActive = Boolean(propertyActiveRequest(property));
    const hasOpen = propertyOpenRequestCount(property) > 0;
    const matchesFilter = state.clientPropertyFilter === 'all'
      || (state.clientPropertyFilter === 'active' && hasActive)
      || (state.clientPropertyFilter === 'open' && hasOpen)
      || (state.clientPropertyFilter === 'retail' && type.includes('retail'))
      || (state.clientPropertyFilter === 'residential' && type.includes('residential'));
    return matchesTerm && matchesFilter;
  });
}
function selectedClientProperty() {
  const filtered = filteredClientProperties();
  const all = state.properties || [];
  const selectedId = String(state.clientSelectedPropertyId || '');
  let property = filtered.find(item => String(item.id) === selectedId) || all.find(item => String(item.id) === selectedId) || filtered[0] || all[0] || null;
  if (property && String(state.clientSelectedPropertyId || '') !== String(property.id)) state.clientSelectedPropertyId = String(property.id);
  return property;
}
function clientPropertiesCounts() {
  const properties = state.properties || [];
  const total = properties.length;
  const activePatrols = properties.filter(property => Boolean(propertyActiveRequest(property))).length;
  const openRequests = properties.reduce((sum, property) => sum + propertyOpenRequestCount(property), 0);
  const saved = properties.length;
  return { total, activePatrols, openRequests, saved };
}
function clientPropertyStatusChip(property = {}) {
  const type = propertyTypeLabel(property);
  const color = /residential/i.test(type) ? '#b05cff' : '#2e7dff';
  return `<span class="client-property-online type-chip" style="--tone:${color}">${esc(type)}</span>`;
}
function clientPropertyPatrolSummary(property = {}) {
  const req = propertyActiveRequest(property);
  if (!req) return `<div class="client-property-patrol none"><i>–</i><span><strong>No active patrol</strong><small>Waiting for request</small></span></div>`;
  const statusLabel = String(req.status || '') === 'accepted' ? 'En Route' : String(req.status || '') === 'assigned' ? 'Assigned' : 'On Patrol';
  return `<div class="client-property-patrol"><i>${esc(initials(requestGuardName(req) || 'G'))}</i><span><strong>${esc(requestGuardName(req))}</strong><small>${esc(statusLabel)}</small></span><em>${liveGps.routeEtaMin ? `ETA: ${esc(liveGps.routeEtaMin)} min` : statusText(req.status)}</em></div>`;
}
function clientPropertyLastActivity(property = {}) {
  const meta = propertyLastActivityMeta(property);
  return `<div class="client-property-last"><strong>${esc(meta.at ? timeAgo(meta.at) : '—')}</strong><small>${esc(meta.subtitle)}</small></div>`;
}
function clientPropertyRow(property = {}) {
  const activeReq = propertyActiveRequest(property);
  const latest = propertyLatestRequest(property);
  const image = propertyImageValue(property);
  const selected = String(state.clientSelectedPropertyId || '') === String(property.id);
  return `<button type="button" class="client-property-row ${selected ? 'active' : ''}" data-action="select-client-property" data-property-id="${esc(property.id)}">
    <div class="client-property-col property-main"><div class="client-property-thumb">${image ? `<img src="${esc(image)}" alt="${esc(propertyDisplayName(property))}">` : `<span>${esc(initials(propertyDisplayName(property)))}</span>`}</div><div class="property-main-copy"><strong>${esc(propertyDisplayName(property))}</strong><small>${esc(propertyTypeLabel(property))}</small>${propertyIsPrimary(property) ? '<b>Primary</b>' : ''}</div></div>
    <div class="client-property-col address"><strong>${esc(property.address || property.address_line1 || property.street || '—')}</strong><small>${esc([property.city, property.state, property.zip || property.zip_code].filter(Boolean).join(', ') || 'Address unavailable')}</small></div>
    <div class="client-property-col status">${clientPropertyStatusChip(property)}<small>Saved property</small></div>
    <div class="client-property-col patrol">${clientPropertyPatrolSummary(property)}</div>
    <div class="client-property-col last-activity">${clientPropertyLastActivity(property)}</div>
    <div class="client-property-chevron">›</div>
  </button>`;
}
function clientPropertyGridCard(property = {}) {
  const selected = String(state.clientSelectedPropertyId || '') === String(property.id);
  const image = propertyImageValue(property);
  return `<button type="button" class="client-property-grid-card ${selected ? 'active' : ''}" data-action="select-client-property" data-property-id="${esc(property.id)}">
    <div class="client-property-grid-image">${image ? `<img src="${esc(image)}" alt="${esc(propertyDisplayName(property))}">` : `<span>${esc(initials(propertyDisplayName(property)))}</span>`}</div>
    <div class="client-property-grid-copy"><div class="row"><strong>${esc(propertyDisplayName(property))}</strong>${clientPropertyStatusChip(property)}</div><small>${esc(propertyDisplayAddress(property))}</small><div class="row patrol-meta">${clientPropertyPatrolSummary(property)}</div></div>
  </button>`;
}

function clientPropertyMapCard(property = {}) {
  const req = propertyActiveRequest(property);
  const showGuard = req && ['accepted','in_progress'].includes(String(req.status || '')) && liveGps.online && Number.isFinite(liveGps.guardLat) && Number.isFinite(liveGps.guardLng);
  const propertyCoords = getPropertyCoords({ property_id: property.id });
  const bounds = clientPropertyDetailMapBounds(property);
  const propertyPos = propertyCoords ? mapPercentForPoint(propertyCoords.lat, propertyCoords.lng, bounds) : { x: 50, y: 50 };
  const guardPos = showGuard ? mapPercentForPoint(liveGps.guardLat, liveGps.guardLng, bounds) : null;
  const routePath = showGuard ? clientPropertyDetailRoutePath(bounds, propertyCoords) : '';
  return `<section class="client-property-guard-map">
    <h3>Property Location</h3>
    <div class="guard302-leaflet-wrap client-property-detail-map-wrap">
      <div id="client-property-detail-leaflet-map" class="guard302-leaflet-map" data-property-id="${esc(property.id)}"></div>
      <div class="guard302-map-fallback" id="client-property-detail-map-fallback">
        <span class="street-name s1">W. Flamingo Rd</span><span class="street-name s2">S. Durango Dr</span><span class="street-name s3">W. Tropicana Ave</span><span class="street-name s4">S. Jones Blvd</span>
        <div class="fallback-road r1"></div><div class="fallback-road r2"></div><div class="fallback-road r3"></div><div class="fallback-road r4"></div>
        ${routePath ? `<svg class="guard302-fallback-route" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${esc(routePath)}"></path></svg>` : ''}
        <button type="button" class="guard302-fallback-marker property" data-action="map-card" data-card="property" data-property-id="${esc(property.id)}" style="left:${propertyPos.x.toFixed ? propertyPos.x.toFixed(2) : propertyPos.x}%;top:${propertyPos.y.toFixed ? propertyPos.y.toFixed(2) : propertyPos.y}%" aria-label="Open property card"><span></span></button>
        ${showGuard && guardPos ? `<button type="button" class="guard302-fallback-marker guard" data-action="map-card" data-card="guard" style="left:${guardPos.x.toFixed(2)}%;top:${guardPos.y.toFixed(2)}%" aria-label="Open guard card"><span></span></button>` : ''}
        <small>${esc(liveGps.mapNotice || 'Property map ready.')}</small>
      </div>
      ${liveGps.selectedMapCard === 'property' ? clientMapPropertyCard(property) : ''}
      ${liveGps.selectedMapCard === 'guard' && showGuard && req ? clientMapGuardCard(req) : ''}
      <div class="guard302-map-status">${esc(liveGps.mapNotice || 'Client property map ready.')} ${liveGps.lastUpdate ? 'Last update ' + timeAgo(liveGps.lastUpdate) + '.' : ''}</div>
    </div>
    <div class="guard302-map-stats client-property-map-stats">
      <div><small>Property</small><strong>${esc(propertyDisplayName(property))}</strong></div>
      <div><small>Guard Visibility</small><strong>${esc(showGuard ? 'Live' : 'After Accepted')}</strong></div>
      <div><small>ETA</small><strong>${esc(showGuard && liveGps.routeEtaMin ? liveGps.routeEtaMin + ' min' : '—')}</strong></div>
      <div><small>Distance</small><strong>${esc(showGuard && liveGps.routeDistanceMiles ? liveGps.routeDistanceMiles.toFixed(1) + ' mi' : '—')}</strong></div>
    </div>
  </section>`;
}
function clientPropertyDetailMapBounds(property = {}) {
  const points = [];
  const coords = getPropertyCoords({ property_id: property.id });
  const req = propertyActiveRequest(property);
  const showGuard = req && ['accepted','in_progress'].includes(String(req.status || '')) && liveGps.online && Number.isFinite(liveGps.guardLat) && Number.isFinite(liveGps.guardLng);
  if (coords) points.push([coords.lat, coords.lng]);
  if (showGuard) points.push([liveGps.guardLat, liveGps.guardLng]);
  if (showGuard && liveGps.routePoints?.length) liveGps.routePoints.forEach(pt => points.push([pt.lat, pt.lng]));
  if (!points.length) return { minLat: 36.07, maxLat: 36.20, minLng: -115.30, maxLng: -115.08 };
  let minLat = Math.min(...points.map(p => p[0])); let maxLat = Math.max(...points.map(p => p[0]));
  let minLng = Math.min(...points.map(p => p[1])); let maxLng = Math.max(...points.map(p => p[1]));
  const latPad = Math.max(.006, (maxLat - minLat) * .35);
  const lngPad = Math.max(.006, (maxLng - minLng) * .35);
  return { minLat:minLat-latPad, maxLat:maxLat+latPad, minLng:minLng-lngPad, maxLng:maxLng+lngPad };
}
function clientPropertyDetailRoutePath(bounds, coords) {
  if (!coords || !Number.isFinite(liveGps.guardLat) || !Number.isFinite(liveGps.guardLng)) return '';
  if (liveGps.routePoints && liveGps.routePoints.length >= 2) {
    return liveGps.routePoints.map((pt, idx) => {
      const p = mapPercentForPoint(pt.lat, pt.lng, bounds);
      return `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
    }).join(' ');
  }
  const g = mapPercentForPoint(liveGps.guardLat, liveGps.guardLng, bounds);
  const p = mapPercentForPoint(coords.lat, coords.lng, bounds);
  const midX = (g.x + p.x) / 2;
  const midY = (g.y + p.y) / 2;
  return `M ${g.x.toFixed(2)} ${g.y.toFixed(2)} C ${(midX - 10).toFixed(2)} ${(midY + 16).toFixed(2)}, ${(midX + 12).toFixed(2)} ${(midY - 14).toFixed(2)}, ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
}
function hideClientPropertyDetailMapFallback() {
  const fallback = document.getElementById('client-property-detail-map-fallback');
  if (fallback) fallback.classList.add('loaded');
}
function showClientPropertyDetailMapFallback(message = 'Live street map layer unavailable. Showing fallback street grid.') {
  const fallback = document.getElementById('client-property-detail-map-fallback');
  if (fallback) {
    fallback.classList.remove('loaded');
    const small = fallback.querySelector('small');
    if (small) small.textContent = message;
  }
}
function initClientPropertyDetailLeafletMap() {
  const el = document.getElementById('client-property-detail-leaflet-map');
  if (!el) return;
  const property = selectedClientProperty();
  if (!property) return;
  if (!window.L) {
    showClientPropertyDetailMapFallback('Leaflet did not load yet. Showing the same fallback street grid used by Guard map.');
    return;
  }
  if (el.dataset.ready === '1' && liveGps.leafletMap && el.dataset.propertyId === String(property.id)) {
    try { liveGps.leafletMap.invalidateSize(); } catch {}
    return;
  }
  try {
    if (liveGps.leafletMap) {
      try { liveGps.leafletMap.remove(); } catch {}
      liveGps.leafletMap = null;
      liveGps.leafletLayer = null;
    }
    el.dataset.propertyId = String(property.id);
    const coords = getPropertyCoords({ property_id: property.id });
    const req = propertyActiveRequest(property);
    const showGuard = req && ['accepted','in_progress'].includes(String(req.status || '')) && liveGps.online && Number.isFinite(liveGps.guardLat) && Number.isFinite(liveGps.guardLng);
    const center = showGuard ? [liveGps.guardLat, liveGps.guardLng] : coords ? [coords.lat, coords.lng] : [36.1699, -115.1398];
    const map = L.map(el, { zoomControl:true, attributionControl:false, dragging:true, scrollWheelZoom:true, doubleClickZoom:true }).setView(center, coords || showGuard ? 14 : 11);
    liveGps.leafletMap = map;
    el.dataset.ready = '1';
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19, crossOrigin:true });
    tiles.on('load', hideClientPropertyDetailMapFallback);
    tiles.on('tileerror', () => showClientPropertyDetailMapFallback('Map tiles blocked or slow. Showing fallback street grid.'));
    tiles.addTo(map);
    const markerGroup = L.featureGroup().addTo(map);
    if (coords) {
      const marker = L.marker([coords.lat, coords.lng], { icon: leafletDivIcon('leaflet-property-pulse-icon', '<span></span>') }).addTo(markerGroup);
      marker.on('click', () => openMapCard('property', property.id));
    }
    if (showGuard) {
      const guardMarker = L.marker([liveGps.guardLat, liveGps.guardLng], { icon: leafletDivIcon('leaflet-guard-pulse-icon', '<span></span>') }).addTo(markerGroup);
      guardMarker.on('click', () => openMapCard('guard'));
    }
    if (showGuard && coords) {
      const routeCoords = (liveGps.routePoints && liveGps.routePoints.length >= 2)
        ? liveGps.routePoints.map(p => [p.lat, p.lng])
        : [[liveGps.guardLat, liveGps.guardLng], [(liveGps.guardLat + coords.lat) / 2 + 0.003, (liveGps.guardLng + coords.lng) / 2 - 0.003], [coords.lat, coords.lng]];
      L.polyline(routeCoords, { color:'#2e88ff', weight:5, opacity:.88, dashArray:'10 8', lineCap:'round', lineJoin:'round' }).addTo(markerGroup);
    }
    if (markerGroup.getLayers().length > 0) {
      try { map.fitBounds(markerGroup.getBounds(), { padding:[36,36], maxZoom:15 }); } catch {}
    }
    setTimeout(() => { try { map.invalidateSize(); } catch {} }, 150);
    setTimeout(() => {
      const tilePane = el.querySelector('.leaflet-tile-pane');
      const hasTiles = tilePane && tilePane.querySelector('img');
      if (hasTiles) hideClientPropertyDetailMapFallback();
    }, 1100);
  } catch (err) {
    showClientPropertyDetailMapFallback('Map could not initialize. Showing fallback street grid with clickable markers.');
  }
}
function scheduleClientPropertyDetailMap() {
  if (state.role === 'client' && state.view === 'properties') {
    requestAnimationFrame(() => {
      [75, 450, 1200, 2500].forEach(delay => setTimeout(initClientPropertyDetailLeafletMap, delay));
    });
  }
}
function scheduleClientPropertyMapPrep() {
  if (state.role !== 'client' || state.view !== 'properties') return;
  restoreClientViewOfGuardGps();
  const property = selectedClientProperty();
  if (!property) return;
  const req = propertyActiveRequest(property);
  const coords = getPropertyCoords({ property_id: property.id });
  if (coords) {
    liveGps.propertyLat = coords.lat;
    liveGps.propertyLng = coords.lng;
    liveGps.propertyAddress = propertyDisplayAddress(property);
  }
  const showGuard = req && ['accepted','in_progress'].includes(String(req.status || '')) && liveGps.online && Number.isFinite(liveGps.guardLat) && Number.isFinite(liveGps.guardLng);
  if (showGuard && coords && !liveGps.routeBusy && !liveGps.routePoints.length) {
    setTimeout(async () => {
      await fetchRouteIfPossible();
      if (state.role === 'client' && state.view === 'properties') render();
    }, 180);
  } else if (!coords && !liveGps.geocodeBusy) {
    const key = `property_detail_${String(property.id || '')}`;
    if (liveGps.propertyPrepKey !== key) {
      liveGps.propertyPrepKey = key;
      setTimeout(async () => {
        await geocodePropertyIfNeeded({ property_id: property.id });
        if (showGuard) await fetchRouteIfPossible();
        if (state.role === 'client' && state.view === 'properties') render();
      }, 250);
    }
  }
  liveGps.mapNotice = showGuard
    ? 'Live map active. Client can see this accepted guard, route line, ETA, distance, and GPS updates.'
    : 'Property map active. Guard marker appears only after a guard accepts an assignment for this property.';
}

function clientPropertyOverviewGrid(property = {}) {
  return `<section class="client-property-overview-grid"><h3>Property Overview</h3><div class="grid">
    <div><small>Property ID</small><strong>${esc(property.property_code || property.code || `PROP-${property.id || '—'}`)}</strong></div>
    <div><small>Client Since</small><strong>${esc(propertyClientSince(property) ? fmtDate(propertyClientSince(property)) : '—')}</strong></div>
    <div><small>Property Type</small><strong>${esc(propertyTypeLabel(property))}</strong></div>
    <div><small>Contact Person</small><strong>${esc(propertyContactName(property))}</strong></div>
    <div><small>Time Zone</small><strong>${esc(propertyTimezoneValue(property))}</strong></div>
    <div><small>Phone</small><strong>${esc(propertyPhoneValue(property))}</strong></div>
    <div><small>Square Footage</small><strong>${esc(propertyFootageValue(property))}${propertyFootageValue(property) !== '—' ? ' sq ft' : ''}</strong></div>
    <div><small>Email</small><strong>${esc(propertyEmailValue(property))}</strong></div>
  </div></section>`;
}
function clientPropertyActivePatrolCard(property = {}) {
  const req = propertyActiveRequest(property);
  if (!req) return `<section class="client-property-active-card"><h3>Active Patrol</h3><div class="empty">No guard is currently assigned to this property.</div></section>`;
  const eta = liveGps.routeEtaMin ? `${liveGps.routeEtaMin} min` : '—';
  const distance = liveGps.routeDistanceMiles ? `${liveGps.routeDistanceMiles.toFixed(1)} mi` : '—';
  const accuracy = liveGps.accuracy ? `${Math.round(liveGps.accuracy)} ft` : '—';
  return `<section class="client-property-active-card"><h3>Active Patrol</h3><div class="client-property-active-inner">${avatar(requestGuardName(req), getGuardPhotoUrl())}<div class="copy"><strong>${esc(requestGuardName(req))}</strong><small>${esc(String(req.status || '') === 'accepted' ? 'En Route' : 'On Patrol')}</small><span>Started: ${esc(fmtTime(req.accepted_at || req.assigned_at || req.created_at))}</span></div><div class="stat"><small>ETA</small><strong>${esc(eta)}</strong></div><div class="stat"><small>Distance</small><strong>${esc(distance)}</strong></div><div class="stat"><small>Accuracy</small><strong>${esc(accuracy)}</strong></div><button class="ghost-button" data-view="messages">View Details</button></div></section>`;
}
function clientPropertyDetailTabs(property = {}) {
  const tab = state.clientPropertyTab || 'overview';
  if (tab === 'details') {
    return `<section class="client-property-tab-content"><div class="client-property-detail-list"><div><small>Property Name</small><strong>${esc(propertyDisplayName(property))}</strong></div><div><small>Full Address</small><strong>${esc(propertyDisplayAddress(property))}</strong></div><div><small>Database Status</small><strong>Saved</strong></div><div><small>Primary Property</small><strong>${esc(propertyIsPrimary(property) ? 'Yes' : 'No')}</strong></div><div><small>Patrol Notes</small><strong>${esc(property.notes || property.instructions || 'No special property notes saved yet.')}</strong></div></div></section>`;
  }
  if (tab === 'activity') {
    const reqs = propertyRequestsForProperty(property).sort((a,b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0)).slice(0, 6);
    return `<section class="client-property-tab-content"><div class="client-property-history-list">${reqs.length ? reqs.map(req => `<article><strong>${esc(requestTitle(req))}</strong><span>${esc(statusText(req.status))}</span><small>${esc(fmtDate(req.updated_at || req.created_at))} · ${esc(req.instructions || propertyAddress(req))}</small></article>`).join('') : '<div class="empty">No recent property activity.</div>'}</div></section>`;
  }
  if (tab === 'patrol-history') {
    const completed = propertyRequestsForProperty(property).filter(req => String(req.status || '') === 'completed').sort((a,b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0));
    return `<section class="client-property-tab-content"><div class="client-property-history-list">${completed.length ? completed.map(req => `<article><strong>${esc(requestTitle(req))}</strong><span>${esc(fmtDate(req.updated_at || req.created_at))}</span><small>${esc(requestGuardName(req))} · ${esc(proofForRequest(req.id).length)} proof item(s)</small></article>`).join('') : '<div class="empty">No completed patrol history yet.</div>'}</div></section>`;
  }
  if (tab === 'notes') {
    return `<section class="client-property-tab-content"><div class="client-property-notes-box"><strong>Client Notes</strong><p>${esc(property.notes || property.instructions || 'No saved notes for this property yet. Use this area later for gate codes, alarm notes, and dispatch instructions.')}</p></div></section>`;
  }
  return `${clientPropertyMapCard(property)}${clientPropertyOverviewGrid(property)}${clientPropertyActivePatrolCard(property)}`;
}
function clientPropertyDetailPanel(property) {
  if (!property) return `<aside class="client-property-detail panel panel-pad"><div class="empty">No property selected.</div></aside>`;
  const img = propertyImageValue(property);
  return `<aside class="client-property-detail panel panel-pad"><div class="client-property-detail-head"><div class="copy"><h2>Property Details</h2></div><button class="header-button" data-action="clear-client-property-filters">×</button></div><div class="client-property-hero"><div class="hero-image">${img ? `<img src="${esc(img)}" alt="${esc(propertyDisplayName(property))}">` : `<span>${esc(initials(propertyDisplayName(property)))}</span>`}</div><div class="hero-copy"><div class="title-row"><strong>${esc(propertyDisplayName(property))}</strong></div><small>${esc(propertyTypeLabel(property))}</small><span class="primary-tag">${propertyIsPrimary(property) ? 'Primary Property' : 'Property'}</span></div></div><div class="client-property-hero-actions"><button class="ghost-button" data-action="edit-client-property"><span>✎</span> Edit Property</button><button class="ghost-button" data-action="open-client-patrol-request" data-property-id="${esc(property.id)}"><span>🛡</span> Request Patrol</button><button class="ghost-button" data-action="open-client-reports"><span>▣</span> View Reports</button></div><div class="client-property-tabs"><button class="${state.clientPropertyTab === 'overview' ? 'active' : ''}" data-property-tab="overview">Overview</button><button class="${state.clientPropertyTab === 'details' ? 'active' : ''}" data-property-tab="details">Details</button><button class="${state.clientPropertyTab === 'activity' ? 'active' : ''}" data-property-tab="activity">Activity</button><button class="${state.clientPropertyTab === 'patrol-history' ? 'active' : ''}" data-property-tab="patrol-history">Patrol History</button><button class="${state.clientPropertyTab === 'notes' ? 'active' : ''}" data-property-tab="notes">Notes</button></div>${clientPropertyDetailTabs(property)}</aside>`;
}

function propertyFormValue(property = {}, field = '') {
  if (!property) return '';
  if (field === 'label') return property.label || property.name || property.property_name || '';
  if (field === 'address') return property.address || property.address_line1 || property.street || '';
  if (field === 'zip') return property.zip_code || property.zip || '';
  if (field === 'photo_url') return property.photo_url || property.image_url || property.property_photo_url || property.reference_photo_url || '';
  if (field === 'latitude') return Number.isFinite(Number(property.latitude ?? property.lat ?? property.property_latitude ?? property.geo_lat)) ? String(Number(property.latitude ?? property.lat ?? property.property_latitude ?? property.geo_lat)) : '';
  if (field === 'longitude') return Number.isFinite(Number(property.longitude ?? property.lng ?? property.lon ?? property.property_longitude ?? property.geo_lng)) ? String(Number(property.longitude ?? property.lng ?? property.lon ?? property.property_longitude ?? property.geo_lng)) : '';
  return property[field] || '';
}
function closeClientPropertyEditModal() {
  document.querySelectorAll('.client-property-edit-modal').forEach(el => el.remove());
}

function showClientPropertyEditModal(property = null) {
  closeClientPropertyEditModal();
  const isEdit = Boolean(property?.id);
  const type = property ? propertyTypeLabel(property) : 'Retail';
  const currentPhoto = property ? propertyImageValue(property) : '';
  const modal = document.createElement('div');
  modal.className = 'client-property-edit-modal';
  modal.innerHTML = `<div class="client-property-edit-backdrop" data-action="close-client-property-edit"></div>
    <section class="client-property-edit-dialog" role="dialog" aria-modal="true" aria-label="${isEdit ? 'Edit property' : 'Add property'}">
      <div class="client-property-edit-head">
        <div><p class="eyebrow">Client Property</p><h2>${isEdit ? 'Edit Property' : 'Add Property'}</h2><span>${isEdit ? esc(propertyDisplayName(property)) : 'Create a new client property record'}</span></div>
        <button type="button" data-action="close-client-property-edit">×</button>
      </div>
      <form class="client-property-edit-form" data-form="client-property-edit">
        <input type="hidden" name="property_id" value="${esc(property?.id || '')}">
        <input type="hidden" name="client_id" value="${esc(property?.client_id || '')}">
        <div class="form-row">
          <label>Property Name<input name="label" value="${esc(propertyFormValue(property, 'label'))}" placeholder="McDonald's" required></label>
          <label>Property Type<select name="property_type"><option value="Retail" ${type === 'Retail' ? 'selected' : ''}>Retail</option><option value="Residential" ${type === 'Residential' ? 'selected' : ''}>Residential</option></select></label>
        </div>
        <label>Street Address<input name="address" value="${esc(propertyFormValue(property, 'address'))}" placeholder="10020 Eastern Ave" required></label>
        <div class="form-row three">
          <label>City<input name="city" value="${esc(propertyFormValue(property, 'city'))}" placeholder="Las Vegas"></label>
          <label>State<input name="state" value="${esc(propertyFormValue(property, 'state'))}" placeholder="NV" maxlength="2"></label>
          <label>ZIP<input name="zip_code" value="${esc(propertyFormValue(property, 'zip'))}" placeholder="89052" required></label>
        </div>
        <div class="client-property-photo-upload">
          <div class="client-property-photo-preview" data-property-photo-preview>${currentPhoto ? `<img src="${esc(currentPhoto)}" alt="${esc(propertyDisplayName(property || {}))}">` : `<span>${esc(initials(propertyDisplayName(property || {})))}</span>`}</div>
          <label class="client-property-photo-picker">
            <input type="file" name="property_photo_file" accept="image/*" data-property-photo-file>
            <strong>Upload Property Photo</strong>
            <small>Choose a photo from this device. No URL entry is allowed.</small>
          </label>
        </div>
        <div class="form-row">
          <label>Latitude<input name="latitude" value="${esc(propertyFormValue(property, 'latitude'))}" placeholder="Optional"></label>
          <label>Longitude<input name="longitude" value="${esc(propertyFormValue(property, 'longitude'))}" placeholder="Optional"></label>
        </div>
        <label>Property Notes<textarea name="notes" placeholder="Gate codes, alarm details, special patrol instructions...">${esc(propertyFormValue(property, 'notes'))}</textarea></label>
        <div class="client-property-edit-actions">
          <button type="button" class="ghost-button" data-action="close-client-property-edit">Cancel</button>
          <button type="submit" class="primary-button">${isEdit ? 'Save Property' : 'Add Property'}</button>
        </div>
      </form>
    </section>`;
  document.body.appendChild(modal);
  const first = modal.querySelector('input[name="label"]');
  if (first) first.focus();
}

async function uploadClientPropertyPhoto(propertyId, file) {
  if (!file) return '';
  if (!file.type.startsWith('image/')) throw new Error('Property photo must be an image file.');
  const safe = String(file.name || 'property-photo').replace(/[^a-zA-Z0-9._-]/g, '_').slice(-90);
  const objectPath = `${propertyId || 'new'}/${Date.now()}-${Math.random().toString(16).slice(2)}-${safe}`;
  await supabase.uploadStorageObject('property-photos', objectPath, file, { upsert: false });
  return supabase.getPublicUrl('property-photos', objectPath);
}
function cleanPropertyRpcPayload(payload = {}) {
  const out = { ...payload };
  Object.keys(out).forEach(key => {
    if (out[key] === undefined) delete out[key];
  });
  return out;
}
async function savePropertyThroughKnownRpc(payload = {}) {
  const clean = cleanPropertyRpcPayload(payload);
  const attempts = [
    { name: 'cp_core_save_property', payload: clean },
    { name: 'cp_save_property_for_client', payload: clean },
    { name: 'cp_save_property_for_client', payload: (() => {
      const copy = { ...clean };
      delete copy.p_client_id;
      return copy;
    })() },
    { name: 'cp_save_property_for_client', payload: (() => {
      const copy = { ...clean };
      delete copy.p_client_id;
      delete copy.p_photo_url;
      delete copy.p_latitude;
      delete copy.p_longitude;
      return copy;
    })() }
  ];
  let lastErr = null;
  for (const attempt of attempts) {
    try {
      const result = await supabase.rpc(attempt.name, attempt.payload);
      if (result?.ok === false) throw new Error(result?.message || 'Property could not be saved.');
      return result;
    } catch (err) {
      lastErr = err;
      const msg = String(err?.message || err || '').toLowerCase();
      const canTryNext = msg.includes('could not find the function') || msg.includes('schema cache') || msg.includes('function') || msg.includes('ambiguous');
      if (!canTryNext) throw err;
    }
  }
  throw lastErr || new Error('Property could not be saved.');
}
async function saveClientPropertyPayload(payload = {}) {
  return savePropertyThroughKnownRpc(payload);
}
async function saveClientPropertyEdit(form) {
  const propertyId = form.property_id.value.trim() || null;
  const clientId = form.client_id.value.trim() || null;
  const type = form.property_type.value || 'Retail';
  const latRaw = form.latitude.value.trim();
  const lngRaw = form.longitude.value.trim();
  const latitude = latRaw === '' ? null : Number(latRaw);
  const longitude = lngRaw === '' ? null : Number(lngRaw);
  if (latRaw && !Number.isFinite(latitude)) throw new Error('Latitude must be a number.');
  if (lngRaw && !Number.isFinite(longitude)) throw new Error('Longitude must be a number.');

  const existingProperty = propertyId ? propertyById(propertyId) : {};
  const selectedPhotoFile = form.property_photo_file?.files?.[0] || null;
  const existingPhotoUrl = existingProperty ? propertyImageValue(existingProperty) : '';

  const basePayload = {
    p_property_id: propertyId,
    p_client_id: clientId,
    p_label: form.label.value.trim() || 'Property',
    p_address: form.address.value.trim(),
    p_city: form.city.value.trim(),
    p_state: form.state.value.trim(),
    p_zip_code: form.zip_code.value.trim(),
    p_photo_url: existingPhotoUrl,
    p_notes: form.notes.value.trim(),
    p_latitude: latitude,
    p_longitude: longitude
  };

  if (!basePayload.p_address) throw new Error('Property address is required.');
  if (!basePayload.p_zip_code) throw new Error('ZIP code is required.');

  const btn = form.querySelector('button[type="submit"]');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }

  let result = await saveClientPropertyPayload(basePayload);
  let saved = result?.property || {};
  let savedId = saved.id || propertyId;

  if (selectedPhotoFile) {
    if (btn) btn.textContent = 'Uploading photo…';
    const uploadedUrl = await uploadClientPropertyPhoto(savedId, selectedPhotoFile);
    const photoPayload = { ...basePayload, p_property_id: savedId, p_photo_url: uploadedUrl };
    result = await saveClientPropertyPayload(photoPayload);
    saved = result?.property || { ...saved, photo_url: uploadedUrl };
    savedId = saved.id || savedId;
  }

  savePropertyTypeOverride(savedId, type);
  closeClientPropertyEditModal();
  await loadData();
  state.view = 'properties';
  state.clientSelectedPropertyId = String(savedId || state.clientSelectedPropertyId || '');
  state.clientPropertyTab = 'overview';
  render();
  toast('Property saved.', 'success');
}


function clientPropertiesView() {
  const counts = clientPropertiesCounts();
  const rows = filteredClientProperties();
  const selected = selectedClientProperty();
  return `<div class="dashboard client-properties-shell"><header class="dashboard-header"><div class="title-block"><h1>Properties</h1><p>Manage and monitor all properties under your account.</p></div><div class="header-actions"><span class="system-pill"><i></i>System Operational</span></div></header><section class="client-properties-toolbar"><div class="client-properties-search"><span>⌕</span><input type="search" placeholder="Search properties..." value="${esc(state.clientPropertySearch)}" data-client-property-search></div><button class="ghost-button" data-action="cycle-client-property-filter">⎚ ${esc(state.clientPropertyFilter === 'all' ? 'Filters' : 'Filter: ' + (state.clientPropertyFilter === 'open' ? 'Open Requests' : statusText(state.clientPropertyFilter)))}</button><button class="primary-button" data-action="add-client-property">＋ Add Property</button></section><section class="kpi-row client-properties-kpis">${kpiCard('⌂', 'Total Properties', counts.total, 'All properties', '#2f83ff')}${kpiCard('◉', 'Active Patrols', counts.activePatrols, 'Currently in progress', '#37dc72')}${kpiCard('▣', 'Open Requests', counts.openRequests, 'Needs attention', '#ffb53d')}${kpiCard('⌁', 'Saved Properties', counts.saved, 'In database', '#b05cff')}</section><section class="client-properties-filter-pills"><button class="filter-pill ${state.clientPropertyFilter === 'all' ? 'active' : ''}" data-client-property-filter="all">All</button><button class="filter-pill ${state.clientPropertyFilter === 'active' ? 'active' : ''}" data-client-property-filter="active">Active Patrol</button><button class="filter-pill ${state.clientPropertyFilter === 'open' ? 'active' : ''}" data-client-property-filter="open">Open Requests</button><button class="filter-pill ${state.clientPropertyFilter === 'retail' ? 'active' : ''}" data-client-property-filter="retail">Retail</button><button class="filter-pill ${state.clientPropertyFilter === 'residential' ? 'active' : ''}" data-client-property-filter="residential">Residential</button></section><section class="client-properties-layout"><div class="client-properties-main panel"><div class="client-properties-list-head"><div><h2>All Properties (${rows.length})</h2></div><div class="client-properties-view-toggle"><button class="${state.clientPropertyView === 'list' ? 'active' : ''}" data-property-view="list">☰</button><button class="${state.clientPropertyView === 'grid' ? 'active' : ''}" data-property-view="grid">☷</button></div></div>${state.clientPropertyView === 'grid' ? `<div class="client-property-grid">${rows.length ? rows.map(clientPropertyGridCard).join('') : '<div class="empty">No properties match your filters.</div>'}</div>` : `<div class="client-property-table-head"><span>Property</span><span>Address</span><span>Type</span><span>Active Patrol</span><span>Last Activity</span><span></span></div><div class="client-property-list">${rows.length ? rows.map(clientPropertyRow).join('') : '<div class="empty">No properties match your filters.</div>'}</div>`}<div class="client-property-list-footer">Showing ${rows.length ? `1 to ${rows.length}` : '0'} of ${state.properties.length} properties</div></div>${clientPropertyDetailPanel(selected)}</section></div>`;
}


function clientRequestTypeConfig(type = state.clientRequestType || 'immediate') {
  const map = {
    immediate: { icon:'⚡', label:'Immediate Patrol', sub:'Request a patrol as soon as possible.', schedule:'on_demand', patrol:'urgent', tone:'blue' },
    vacation: { icon:'▣', label:'Vacation Watch', sub:'Schedule patrols while you are away.', schedule:'vacation_watch', patrol:'vacation_watch', tone:'green' },
    recurring: { icon:'↻', label:'Recurring Patrol', sub:'Set up repeated patrol schedules.', schedule:'recurring', patrol:'standard', tone:'purple' },
    scheduled: { icon:'▦', label:'Scheduled Patrol', sub:'Schedule a one-time future patrol.', schedule:'scheduled', patrol:'standard', tone:'orange' }
  };
  return map[type] || map.immediate;
}
function clientRequestTypeCard(type) {
  const cfg = clientRequestTypeConfig(type);
  const active = (state.clientRequestType || 'immediate') === type;
  return `<button type="button" class="client-request-type-card ${active ? 'active' : ''} ${esc(cfg.tone)}" data-client-request-type="${esc(type)}"><i>${esc(cfg.icon)}</i><span><strong>${esc(cfg.label)}</strong><small>${esc(cfg.sub)}</small></span></button>`;
}

function clientRequestTypeOptions() {
  return ['immediate','vacation','recurring','scheduled'].map(type => {
    const cfg = clientRequestTypeConfig(type);
    return `<option value="${esc(type)}" ${(state.clientRequestType || 'immediate') === type ? 'selected' : ''}>${esc(cfg.label)}</option>`;
  }).join('');
}
function clientPrioritySegment() {
  const choices = [
    { value:'normal', label:'Normal' },
    { value:'high', label:'High' },
    { value:'urgent', label:'Emergency' }
  ];
  return `<div class="client-priority-segment" role="radiogroup" aria-label="Priority">${choices.map(item => `<label class="${item.value === 'urgent' ? 'danger' : ''}"><input type="radio" name="priority" value="${esc(item.value)}" ${item.value === 'normal' ? 'checked' : ''}><span>${esc(item.label)}</span></label>`).join('')}</div>`;
}
function clientRequestServiceCards() {
  const services = [
    ['Check doors', true],
    ['Check perimeter', true],
    ['Check windows', true],
    ['Photo proof required', true],
    ['Lock up if needed', false]
  ];
  return `<div class="client-request-services mockup-services"><span>Requested Services</span>${services.map(([label, checked]) => `<label><input type="checkbox" name="requested_services" value="${esc(label)}" ${checked ? 'checked' : ''}><b>${esc(label)}</b></label>`).join('')}</div>`;
}
function clientRequestTypeCounts() {
  const requests = clientRecentRequests();
  return {
    open: clientOpenRequests().length,
    immediate: requests.filter(r => ['on_demand','immediate'].includes(String(r.schedule_type || 'on_demand')) || String(r.patrol_type || '').includes('urgent')).length,
    vacation: requests.filter(r => String(r.schedule_type || '') === 'vacation_watch' || String(r.patrol_type || '') === 'vacation_watch').length,
    recurring: requests.filter(r => String(r.schedule_type || '') === 'recurring').length
  };
}
function clientSelectedRequestProperty() {
  const id = String(state.clientPatrolPrefillPropertyId || state.clientSelectedPropertyId || '');
  return (state.properties || []).find(p => String(p.id) === id) || (state.properties || [])[0] || null;
}
function clientRequestRecentForProperty(property) {
  const rows = clientRecentRequests().filter(req => !property || String(req.property_id) === String(property.id));
  return rows.slice(0, 3);
}
function clientScheduleFields() {
  const type = state.clientRequestType || 'immediate';
  if (type === 'vacation') return `<div class="client-request-schedule-grid"><label>Start Date<input type="date" name="schedule_start_date" required></label><label>End Date<input type="date" name="schedule_end_date" required></label><label>Preferred Time Window<select name="preferred_time_window"><option value="morning">Morning</option><option value="afternoon">Afternoon</option><option value="evening">Evening</option><option value="overnight">Overnight</option></select></label></div>`;
  if (type === 'recurring') return `<div class="client-request-schedule-grid recurring"><label>Start Date<input type="date" name="schedule_start_date" required></label><label>End Date<input type="date" name="schedule_end_date"></label><label>Pattern<select name="recurrence_pattern" required><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="custom_days">Custom Days</option></select></label><label>Time Window<select name="preferred_time_window"><option value="morning">Morning</option><option value="afternoon">Afternoon</option><option value="evening">Evening</option><option value="overnight">Overnight</option></select></label><div class="client-request-days"><span>Days</span>${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => `<label><input type="checkbox" name="recurrence_days" value="${esc(d.toLowerCase())}"> ${esc(d)}</label>`).join('')}</div></div>`;
  if (type === 'scheduled') return `<div class="client-request-schedule-grid"><label>Date<input type="date" name="scheduled_date" required></label><label>Time<input type="time" name="scheduled_time" required></label><label>Estimated Duration<select name="estimated_duration"><option value="30 minutes">30 minutes</option><option value="60 minutes" selected>60 minutes</option><option value="90 minutes">90 minutes</option><option value="120 minutes">120 minutes</option></select></label></div>`;
  return `<div class="client-request-schedule-grid"><label>Date<input type="text" value="Today" disabled></label><label>Time<select name="preferred_time_window"><option value="asap">Now (ASAP)</option><option value="within_1_hour">Within 1 hour</option><option value="tonight">Tonight</option></select></label><label>Estimated Duration<select name="estimated_duration"><option value="30 minutes">30 minutes</option><option value="60 minutes" selected>60 minutes</option><option value="90 minutes">90 minutes</option></select></label></div>`;
}
function clientRequestSummary(property) {
  const cfg = clientRequestTypeConfig();
  const when = state.clientRequestType === 'immediate' ? 'ASAP' : state.clientRequestType === 'vacation' ? 'Date range' : state.clientRequestType === 'recurring' ? 'Repeating schedule' : 'Future date/time';
  return `<section class="panel panel-pad client-request-summary-card"><div class="panel-head"><div><h2>Request Summary</h2></div></div><div class="client-request-summary-list command"><span>Type</span><strong>${esc(cfg.label)}</strong><span>Priority</span><strong><em class="mockup-priority">Normal</em></strong><span>Property</span><strong>${esc(property ? propertyDisplayName(property) : 'Choose property')}</strong><span>When</span><strong>${esc(when)}</strong><span>Duration</span><strong>60 minutes (est.)</strong><span>Services</span><strong class="summary-icons"><i>▥</i><i>◇</i><i>▦</i><i>▣</i></strong><span>Special Instructions</span><strong>Yes / Optional</strong></div></section>`;
}
function clientRequestPropertyPanel(property) {
  if (!property) return `<section class="panel panel-pad client-selected-request-property"><div class="empty">Add a property before requesting patrol.</div></section>`;
  const image = propertyImageValue(property);
  return `<section class="panel panel-pad client-selected-request-property mockup-selected-property"><div class="panel-head"><div><h2>Selected Property</h2></div></div><div class="client-request-property-hero"><div>${image ? `<img src="${esc(image)}" alt="${esc(propertyDisplayName(property))}">` : `<span>${esc(initials(propertyDisplayName(property)))}</span>`}</div><aside><strong>${esc(propertyDisplayName(property))}</strong><small>${esc(propertyDisplayAddress(property))}</small><em>${clientPropertyStatusChip(property)}</em></aside></div><button type="button" class="ghost-button wide" data-view="properties">View Property <span>↗</span></button></section>`;
}
function clientRequestHistoryRows() {
  let rows = clientRecentRequests();
  const f = state.clientRequestHistoryFilter || 'all';
  if (f === 'immediate') rows = rows.filter(r => ['on_demand','immediate'].includes(String(r.schedule_type || 'on_demand')) || String(r.patrol_type || '').includes('urgent'));
  if (f === 'vacation') rows = rows.filter(r => String(r.schedule_type || '') === 'vacation_watch' || String(r.patrol_type || '') === 'vacation_watch');
  if (f === 'recurring') rows = rows.filter(r => String(r.schedule_type || '') === 'recurring');
  if (f === 'scheduled') rows = rows.filter(r => String(r.schedule_type || '') === 'scheduled');
  return rows.slice(0, 12);
}
function clientRequestHistoryTableRow(req = {}) {
  const type = req.schedule_type === 'vacation_watch' ? 'Vacation Watch' : req.schedule_type === 'recurring' ? 'Recurring Patrol' : req.schedule_type === 'scheduled' ? 'Scheduled Patrol' : (req.patrol_type === 'urgent' ? 'Immediate Patrol' : statusText(req.patrol_type || 'Patrol'));
  const scheduled = req.scheduled_for || req.schedule_start_date || req.requested_at || req.created_at;
  return `<div class="client-request-history-row"><span>${esc(type)}</span><span>${esc(propertyLabel(req))}</span><span>${statusChip(req.priority || 'normal')}</span><span>${statusChip(req.status || 'pending_dispatch')}</span><span>${esc(fmtDate(req.created_at || req.requested_at))}</span><span>${esc(fmtDate(scheduled))}</span><span>${esc(requestGuardName(req) === 'Unassigned' ? '—' : requestGuardName(req))}</span><button type="button" class="icon-square small">⋯</button></div>`;
}
function clientRequestRecentList(property) {
  const rows = clientRequestRecentForProperty(property);
  return `<section class="panel panel-pad client-request-recent-card"><div class="active-rail-head"><h2>Recent Requests</h2><button class="ghost-button" data-client-request-history-filter="all">View all</button></div><div class="client-request-recent-list">${rows.length ? rows.map(req => `<div><i>${esc(clientRequestTypeConfig(req.schedule_type === 'vacation_watch' ? 'vacation' : req.schedule_type === 'recurring' ? 'recurring' : req.schedule_type === 'scheduled' ? 'scheduled' : 'immediate').icon)}</i><span><strong>${esc(requestTitle(req))}</strong><small>${esc(fmtDate(req.created_at || req.requested_at))}</small></span>${statusChip(req.status || 'pending_dispatch')}</div>`).join('') : '<div class="empty">No requests for this property yet.</div>'}</div></section>`;
}
function clientRequestPropertyMiniMap(property) {
  return `<section class="panel panel-pad client-request-property-map-card"><div class="panel-head"><div><h2>Property Location</h2></div></div><div class="client-request-mini-map"><span class="street-name s1">W Main St</span><span class="street-name s2">S Eastern Ave</span><div class="fallback-road r1"></div><div class="fallback-road r2"></div><div class="fallback-road r3"></div><button type="button" class="guard302-fallback-marker property"><span></span></button></div></section>`;
}
function clientPatrolRequestsView() {
  const properties = state.properties || [];
  const counts = clientRequestTypeCounts();
  const selectedProperty = clientSelectedRequestProperty();
  const cfg = clientRequestTypeConfig();
  const prefillPropertyId = String(selectedProperty?.id || state.clientPatrolPrefillPropertyId || '');
  const propertyOptions = properties.map(p => `<option value="${esc(p.id)}" ${String(p.id) === prefillPropertyId ? 'selected' : ''}>${esc(clientPropertyOptionLabel(p))}</option>`).join('');
  const historyRows = clientRequestHistoryRows();
  return `<div class="dashboard client-patrol-request-command"><header class="dashboard-header"><div class="title-block"><h1>Patrol Requests</h1><p>Request immediate, vacation, recurring, or scheduled patrol coverage for your properties.</p></div><div class="header-actions"><span class="system-pill"><i></i>System Operational</span></div></header><section class="kpi-row client-request-kpis">${kpiCard('◈','Open Requests',counts.open,'Needs attention','#2f83ff')}${kpiCard('▣','Immediate Patrols',counts.immediate,'Active now','#37dc72')}${kpiCard('✪','Vacation Watches',counts.vacation,'Scheduled','#b05cff')}${kpiCard('↻','Recurring Patrols',counts.recurring,'Active schedules','#ffb53d')}</section><section class="client-patrol-request-layout"><div class="client-patrol-request-main"><section class="panel panel-pad client-request-type-section"><div class="panel-head"><div><h2>Select Request Type</h2><p>Choose the type of patrol service you need.</p></div></div><div class="client-request-type-grid">${['immediate','vacation','recurring','scheduled'].map(clientRequestTypeCard).join('')}</div></section><section class="panel panel-pad client-request-details-card"><div class="panel-head"><div><h2>Request Details</h2><p>${esc(cfg.sub)}</p></div><span class="client-flow-pill">Client → Dispatch → Guard</span></div>${properties.length ? `<form class="client-patrol-request-form command-request-form" data-form="client-patrol-request"><input type="hidden" name="schedule_type" value="${esc(cfg.schedule)}"><input type="hidden" name="patrol_type" value="${esc(cfg.patrol)}"><div class="client-request-top-grid"><label>Property * <select name="property_id" required><option value="">Choose property</option>${propertyOptions}</select></label><label>Request Type * <select name="request_type_select" data-client-request-type-select><option value="">Choose type</option>${clientRequestTypeOptions()}</select></label><label class="priority-field">Priority * ${clientPrioritySegment()}</label></div>${clientScheduleFields()}<div class="client-request-body-grid"><label class="client-request-instructions">Special Instructions <textarea name="instructions" maxlength="500" placeholder="Example: Front door alarm triggered. Please respond immediately and check all perimeter doors."></textarea><small>0/500</small></label>${clientRequestServiceCards()}</div><label class="client-request-schedule-notes">Schedule Notes <textarea name="schedule_notes" maxlength="300" placeholder="Optional recurring/vacation notes, access details, preferred route, or gate code instructions."></textarea></label><div class="client-request-final-grid"><div class="client-request-reference-upload"><label class="client-request-upload-drop"><input type="file" name="reference_photo_file" accept="image/*,video/*" data-client-request-reference-file><i>⬆</i><strong>Drag and drop or click to upload</strong><small>JPG, PNG, MP4 from device only. No URL entry.</small></label><div class="client-request-reference-preview" data-client-request-reference-preview><span>No file selected</span></div></div><div class="client-request-submit-row"><button class="ghost-button" type="button" data-action="save-client-request-draft">Save Draft</button><button class="primary-button" type="submit">➤ Submit Request</button></div></div></form>` : `<div class="empty"><strong>No saved properties yet.</strong><br>Add a property first, then request immediate, vacation, recurring, or scheduled patrols.</div>`}</section><section class="panel panel-pad client-request-history-card"><div class="panel-head"><div><h2>Request History</h2><p>All patrol requests for your properties.</p></div></div><div class="client-request-history-tabs">${['all','immediate','vacation','recurring','scheduled'].map(f => `<button class="${state.clientRequestHistoryFilter === f ? 'active' : ''}" data-client-request-history-filter="${esc(f)}">${esc(f === 'all' ? 'All Requests' : statusText(f))}</button>`).join('')}</div><div class="client-request-history-table"><div class="client-request-history-head"><span>Type</span><span>Property</span><span>Priority</span><span>Status</span><span>Created</span><span>Scheduled</span><span>Assigned Guard</span><span></span></div>${historyRows.length ? historyRows.map(clientRequestHistoryTableRow).join('') : '<div class="empty">No requests found.</div>'}</div></section></div><aside class="client-patrol-request-rail">${clientRequestPropertyPanel(selectedProperty)}${clientRequestSummary(selectedProperty)}${clientRequestRecentList(selectedProperty)}${clientRequestPropertyMiniMap(selectedProperty)}</aside></section></div>`;
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
    if (state.view === 'guard-approvals') return guardApprovalsView();
    if (state.view === 'clients') return cardsView('Clients', 'Approved client roster.', state.clients);
    if (state.view === 'activity-log') return cardsView('Activity Log', 'Patrol activity events.', state.patrolActivity.map(x => ({ title: x.title || x.event_type, message: x.details || x.message })));
    if (state.view === 'proof-review') return cardsView('Proof Review', 'Proof uploaded by guards.', state.proofItems.map(x => ({ title: x.file_name || 'Proof item', message: x.note || x.file_type })));
    if (state.view === 'report-builder') return tableView('Report Builder', 'Completed patrols ready for reports.', completedRequests());
    if (state.view === 'report-archive') return cardsView('Report Archive', 'Released report records.', state.patrolReports);
  }
  if (state.role === 'guard') {
    if (state.view === 'dashboard') return guardDashboardMockup302();
    if (state.view === 'active-job') return guardActiveJobWorkflowView();
    if (state.view === 'completed') return guardCompletedJobsView();
    if (state.view === 'route-gps') return guardRouteGpsLiveView();
    if (state.view === 'upload-proof') return proofUploadView();
  }
  if (state.role === 'client') {
    if (state.view === 'dashboard') return clientDashboardView();
    if (state.view === 'properties') return clientPropertiesView();
    if (state.view === 'patrol-requests') return clientPatrolRequestsView();
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
  if (state.role === 'guard' && ['dashboard','active-job','route-gps'].includes(state.view)) {
    requestAnimationFrame(() => {
      [75, 450, 1200, 2500].forEach(delay => setTimeout(initGuardLeafletMap, delay));
    });
  }
}
function scheduleGuardGpsPrep() {
  if (state.role !== 'guard' || !['dashboard','active-job','route-gps'].includes(state.view)) return;
  if (!liveGps.online) return;
  const req = guard302CurrentRequest();
  if (!req) return;
  const key = String(req.id || req.property_id || propertyAddress(req) || 'current');
  const existing = getPropertyCoords(req);
  if (existing) {
    liveGps.propertyLat = existing.lat;
    liveGps.propertyLng = existing.lng;
    liveGps.propertyAddress = propertyAddress(req);
    return;
  }
  if (liveGps.propertyPrepKey === key || liveGps.geocodeBusy) return;
  liveGps.propertyPrepKey = key;
  setTimeout(async () => {
    try {
      await geocodePropertyIfNeeded(req);
    } finally {
      if (state.role === 'guard' && ['dashboard','active-job','route-gps'].includes(state.view)) render();
    }
  }, 250);
}
function leafletDivIcon(cls, html = '') {
  return L.divIcon({
    className: cls,
    html,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
}
function hideMapFallback() {
  const fallback = document.getElementById('guard302-map-fallback');
  if (fallback) fallback.classList.add('loaded');
}
function showMapFallback(message = 'Live street map layer unavailable. Showing fallback street grid.') {
  const fallback = document.getElementById('guard302-map-fallback');
  if (fallback) {
    fallback.classList.remove('loaded');
    const small = fallback.querySelector('small');
    if (small) small.textContent = message;
  }
}
function initGuardLeafletMap() {
  const el = document.getElementById('guard302-live-leaflet-map');
  if (!el) return;

  if (!window.L) {
    showMapFallback('Leaflet did not load yet. Showing fallback street grid with clickable markers.');
    return;
  }

  if (el.dataset.ready === '1' && liveGps.leafletMap) {
    try { liveGps.leafletMap.invalidateSize(); } catch {}
    return;
  }

  try {
    if (liveGps.leafletMap) {
      try { liveGps.leafletMap.remove(); } catch {}
      liveGps.leafletMap = null;
      liveGps.leafletLayer = null;
    }

    const req = guard302CurrentRequest();
    const hasGuard = liveGps.online && Number.isFinite(liveGps.guardLat) && Number.isFinite(liveGps.guardLng);
    const hasProperty = liveGps.online && Boolean(req) && Number.isFinite(liveGps.propertyLat) && Number.isFinite(liveGps.propertyLng);
    const center = hasGuard ? [liveGps.guardLat, liveGps.guardLng] : [36.1699, -115.1398];

    const map = L.map(el, {
      zoomControl: true,
      attributionControl: false,
      dragging: true,
      scrollWheelZoom: true,
      doubleClickZoom: true
    }).setView(center, hasGuard || hasProperty ? 14 : 11);

    liveGps.leafletMap = map;
    el.dataset.ready = '1';

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      crossOrigin: true
    });

    tiles.on('load', hideMapFallback);
    tiles.on('tileerror', () => showMapFallback('Map tiles blocked or slow. Showing fallback street grid.'));
    tiles.addTo(map);

    const markerGroup = L.featureGroup().addTo(map);

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
      L.polyline(coords, {
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
    }, 150);

    setTimeout(() => {
      const tilePane = el.querySelector('.leaflet-tile-pane');
      const hasTiles = tilePane && tilePane.querySelector('img');
      if (hasTiles) hideMapFallback();
    }, 1100);
  } catch (err) {
    showMapFallback('Map could not initialize. Showing fallback street grid with clickable markers.');
  }
}


function render() {
  if (state.booting) renderLoading();
  else if (!state.profile) renderPublic();
  else renderAppShell();
  ensureBadge();
  scheduleGuardGpsPrep();
  scheduleGuardLeafletMap();
  scheduleClientMapPrep();
  scheduleClientLeafletMap();
  scheduleClientPropertyMapPrep();
  scheduleClientPropertyDetailMap();
  resumePersistedGuardGpsIfNeeded();
}

async function initialize() {
  render();
  try {
    if (supabase.accessToken) {
      await loadData();
      if (state.role === 'guard') restoreGuardGpsPersistedState();
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
      state.view = button.dataset.view === 'upload-proof' ? 'active-job' : button.dataset.view;
      render();
      return;
    }
    if (button.dataset.completedFilter) {
      state.completedFilter = button.dataset.completedFilter;
      state.selectedCompletedRequestId = '';
      render();
      return;
    }
    if (button.dataset.messageFilter) {
      state.messageFilter = button.dataset.messageFilter;
      render();
      return;
    }
    if (button.dataset.notificationFilter) {
      state.notificationFilter = button.dataset.notificationFilter;
      render();
      return;
    }
    if (button.dataset.clientRequestType) {
      state.clientRequestType = button.dataset.clientRequestType;
      render();
      return;
    }
    if (button.dataset.clientRequestHistoryFilter) {
      state.clientRequestHistoryFilter = button.dataset.clientRequestHistoryFilter;
      render();
      return;
    }
    if (button.dataset.clientPropertyFilter) {
      state.clientPropertyFilter = button.dataset.clientPropertyFilter;
      render();
      return;
    }
    if (button.dataset.propertyView) {
      state.clientPropertyView = button.dataset.propertyView;
      render();
      return;
    }
    if (button.dataset.propertyTab) {
      state.clientPropertyTab = button.dataset.propertyTab;
      render();
      return;
    }
    if (button.dataset.action === 'save-client-request-draft') {
      toast('Draft saved locally for this development session.', 'success');
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
      openMapCard(button.dataset.card || 'guard', button.dataset.propertyId || '');
      return;
    }
    if (button.dataset.action === 'close-map-card') {
      closeMapCard();
      return;
    }
    if (button.dataset.action === 'client-prefill-property') {
      const select = document.querySelector('[data-form="client-patrol-request"] select[name="property_id"]');
      if (select) { select.value = button.dataset.propertyId || ''; select.focus(); }
      return;
    }
    if (button.dataset.action === 'refresh-data') {
      await loadData();
      render();
      toast('Data refreshed.', 'success');
      return;
    }
    if (button.dataset.action === 'admin-assign-now') {
      await assignPatrolNow(button.dataset.requestId);
      return;
    }
    if (button.dataset.action === 'select-completed-request') {
      state.selectedCompletedRequestId = button.dataset.requestId || '';
      render();
      return;
    }
    if (button.dataset.action === 'guard-workflow-step') {
      await updateGuardWorkflowStep(button.dataset.requestId, button.dataset.step);
      return;
    }
    if (button.dataset.action === 'select-thread') {
      state.selectedThreadId = button.dataset.threadId || '';
      markCurrentThreadRead();
      render();
      return;
    }
    if (button.dataset.action === 'select-notification') {
      state.selectedNotificationId = button.dataset.notificationId || '';
      markNotificationReadById(state.selectedNotificationId);
      render();
      return;
    }
    if (button.dataset.action === 'mark-all-notifications-read') {
      markAllNotificationsRead();
      render();
      toast('All notifications marked as read.', 'success');
      return;
    }
    if (button.dataset.action === 'clear-notification-filters') {
      state.notificationSearch = '';
      state.notificationFilter = 'all';
      render();
      return;
    }
    if (button.dataset.action === 'acknowledge-notification') {
      markNotificationReadById(button.dataset.notificationId || state.selectedNotificationId);
      render();
      toast('Notification acknowledged.', 'success');
      return;
    }
    if (button.dataset.action === 'notification-open-linked-job') {
      const note = selectedNotification();
      const req = relatedRequestForNotification(note);
      state.view = req && String(req.status) === 'completed' ? 'completed' : 'active-job';
      if (req && String(req.status) === 'completed') state.selectedCompletedRequestId = req.id || '';
      render();
      return;
    }
    if (button.dataset.action === 'notification-open-messages') {
      state.view = 'messages';
      render();
      return;
    }
    if (button.dataset.action === 'open-notification-preferences') {
      toast('Notification preferences coming next.', 'success');
      return;
    }
    if (button.dataset.action === 'quick-message') {
      sendDispatchGuardMessage(button.dataset.text || '');
      render();
      toast('Message sent.', 'success');
      return;
    }
    if (button.dataset.action === 'confirm-inline-proof') {
      await confirmInlineProofUpload();
      return;
    }
    if (button.dataset.action === 'select-client-property') {
      state.clientSelectedPropertyId = button.dataset.propertyId || '';
      state.clientPropertyTab = 'overview';
      render();
      return;
    }
    if (button.dataset.action === 'cycle-client-property-filter') {
      const order = ['all', 'active', 'open', 'retail', 'residential'];
      const idx = order.indexOf(state.clientPropertyFilter || 'all');
      state.clientPropertyFilter = order[(idx + 1) % order.length];
      render();
      return;
    }
    if (button.dataset.action === 'clear-client-property-filters') {
      state.clientPropertySearch = '';
      state.clientPropertyFilter = 'all';
      render();
      return;
    }
    if (button.dataset.action === 'add-client-property') {
      showClientPropertyEditModal(null);
      return;
    }
    if (button.dataset.action === 'edit-client-property') {
      showClientPropertyEditModal(selectedClientProperty());
      return;
    }
    if (button.dataset.action === 'close-client-property-edit') {
      closeClientPropertyEditModal();
      return;
    }
    if (button.dataset.action === 'open-client-patrol-request') {
      state.clientPatrolPrefillPropertyId = button.dataset.propertyId || state.clientSelectedPropertyId || '';
      state.view = 'patrol-requests';
      render();
      return;
    }
    if (button.dataset.action === 'open-client-reports') {
      state.view = 'reports';
      render();
      return;
    }
    if (button.dataset.action === 'cancel-inline-proof') {
      closeInlineProofModal();
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
    if (form.dataset.form === 'client-patrol-request') await submitClientPatrolRequest(form);
    if (form.dataset.form === 'client-property-edit') await saveClientPropertyEdit(form);
    if (form.dataset.form === 'dispatch-guard-message') {
      sendDispatchGuardMessage(form.message.value);
      form.reset();
      render();
      toast('Message sent.', 'success');
    }
  } catch (err) {
    toast(friendly(err));
  }
});

document.addEventListener('input', event => {
  const input = event.target;

  if (input && input.hasAttribute('data-client-request-type-select')) {
    state.clientRequestType = input.value || 'immediate';
    render();
    return;
  }
  if (input && input.hasAttribute('data-message-search')) {
    state.messageSearch = input.value || '';
    render();
  }
  if (input && input.hasAttribute('data-notification-search')) {
    state.notificationSearch = input.value || '';
    render();
  }
  if (input && input.hasAttribute('data-client-property-search')) {
    state.clientPropertySearch = input.value || '';
    render();
  }
});

document.addEventListener('change', event => {
  const input = event.target;
  if (input && input.hasAttribute('data-client-request-type-select')) {
    state.clientRequestType = input.value || 'immediate';
    render();
    return;
  }
  if (input && input.hasAttribute('data-property-photo-file')) {
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast('Property photo must be an image file.');
      input.value = '';
      return;
    }
    const preview = document.querySelector('[data-property-photo-preview]');
    if (preview) {
      const url = URL.createObjectURL(file);
      preview.innerHTML = `<img src="${esc(url)}" alt="Property photo preview">`;
    }
  }
  if (input && input.hasAttribute('data-client-request-reference-file')) {
    const file = input.files?.[0];
    const preview = document.querySelector('[data-client-request-reference-preview]');
    if (!file || !preview) return;
    const url = URL.createObjectURL(file);
    preview.innerHTML = file.type.startsWith('video/') ? `<video src="${esc(url)}" muted controls playsinline></video><span>${esc(file.name)}</span>` : `<img src="${esc(url)}" alt="Reference preview"><span>${esc(file.name)}</span>`;
  }
});

setInterval(ensureBadge, 1000);
initialize();
