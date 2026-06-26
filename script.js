
const CP_DEV_CACHE_BUST = '2026-06-25T20-05-v3051';
const BUILD = {
  version: '3.0.54',
  label: 'v3.0.54 DISPATCH SIDEBAR PROFILE FIX'
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
  clientRequestHistoryFilter: 'all',
  clientReportSearch: '',
  clientReportStatusFilter: 'all',
  clientReportPropertyFilter: 'all',
  clientReportPage: 1,
  settingsTab: 'profile',
  liveGpsViewMode: 'default',
  liveGpsLayersOpen: false,
  liveGpsSelectedEventId: '',
  pendingDispatchPriorityFilter: 'all',
  pendingDispatchSearch: '',
  pendingDispatchFiltersOpen: true,
  pendingDispatchFilters: { priority: 'all', propertyType: 'all', clientId: 'all', requestedTime: 'all', status: 'all' },
  selectedPendingRequestId: '',
  pendingDispatchSelectedIds: [],
  pendingDispatchPage: 1,
  pendingDispatchPerPage: 6,
  pendingDispatchGuardSelections: {},
  scheduledQueueSearch: '',
  scheduledQueueTab: 'all',
  scheduledQueueFiltersOpen: true,
  scheduledQueueFilters: { priority: 'all', propertyType: 'all', clientId: 'all', guardId: 'all', scheduleType: 'all' },
  selectedScheduledRequestId: '',
  scheduledQueueSelectedIds: [],
  scheduledQueuePage: 1,
  scheduledQueuePerPage: 10,
  scheduledLocalOverrides: {},
  guardsSearch: '',
  guardsStatusFilter: 'all',
  guardsDutyFilter: 'all',
  guardsRankFilter: 'all',
  guardsApprovalFilter: 'all',
  selectedGuardId: '',
  guardsPage: 1,
  guardsPerPage: 10,
  guardProfileMode: 'overview',
  guardApprovalSearch: '',
  guardApprovalTab: 'all',
  guardApprovalFilters: { status: 'all', rank: 'all', experience: 'all', background: 'all', sort: 'newest' },
  selectedGuardApprovalId: '',
  guardApprovalSelectedIds: [],
  guardApprovalPage: 1,
  guardApprovalPerPage: 5
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
  clientSelectedPropertyId: '',
  dispatchSelectedPropertyId: '',
  dispatchSelectedGuardId: '',
  dispatchRouteCache: {},
  dispatchRouteFetching: {}
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
    const rec = typeof activeGuardRecord === 'function' ? activeGuardRecord() : null;
    const guardName = rec?.name || rec?.display_name || activeGuardName?.() || state.profile?.name || state.profile?.email || 'Guard';
    const guardEmail = rec?.email || activeGuardEmail?.() || state.profile?.email || '';
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
      guardId: rec?.id || rec?.auth_user_id || rec?.user_id || rec?.profile_id || state.profile?.id || state.profile?.auth_user_id || state.profile?.user_id || '',
      guardEmail: String(guardEmail || '').trim().toLowerCase(),
      guardName: String(guardName || '').trim(),
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
function scheduledRequestSearchText(req = {}) {
  return [
    req.schedule_type, req.request_type, req.patrol_type, req.type, req.recurrence, req.recurring_pattern,
    req.repeat_rule, req.schedule_rule, req.recurrence_pattern, req.recurrence_days,
    req.schedule_start_date, req.start_date, req.schedule_end_date, req.end_date,
    req.preferred_time_window, req.schedule_notes, req.instructions, req.special_instructions, req.notes,
    req.description, req.request_details
  ].filter(Boolean).join(' ').toLowerCase();
}
function isScheduledQueueRequest(req = {}) {
  const override = readScheduledQueueOverrides()[String(req.id || '')] || {};
  if (Object.keys(override).length && (override.schedule_type || override.scheduled_for || override.next_run || override.next_run_at || override.recurrence || override.status)) return true;
  const text = scheduledRequestSearchText(req);
  const status = String(req.status || '').toLowerCase();
  if (/immediate|on_demand|asap|urgent/.test(text) && !/scheduled|recurring|vacation|repeat|future|daily|weekly|monthly|watch/.test(text)) return false;
  if (/scheduled|recurring|vacation|vacation_watch|watch|repeat|future|daily|weekly|monthly|weekdays|weekend/.test(text)) return true;
  if (req.scheduled_for || req.scheduled_at || req.next_run || req.next_run_at || req.schedule_start_date || req.start_date || req.schedule_end_date || req.end_date) return true;
  if (status === 'scheduled' || status === 'recurring' || status === 'vacation_watch') return true;
  return false;
}
function scheduledRequests() {
  return (state.patrolRequests || []).filter(isScheduledQueueRequest);
}
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

function clientDispatchMessageStoreKey() { return 'cp_security_client_dispatch_messages_v1'; }
function readClientDispatchMessageStore() {
  try {
    const parsed = JSON.parse(localStorage.getItem(clientDispatchMessageStoreKey()) || '{}');
    return {
      threads: Array.isArray(parsed.threads) ? parsed.threads : [],
      messages: Array.isArray(parsed.messages) ? parsed.messages : []
    };
  } catch {
    return { threads: [], messages: [] };
  }
}
function writeClientDispatchMessageStore(store = { threads: [], messages: [] }) {
  try { localStorage.setItem(clientDispatchMessageStoreKey(), JSON.stringify(store)); } catch {}
}
function messageClientKey(client = {}) {
  return String(client.id || client.auth_user_id || client.user_id || client.profile_id || String(client.email || '').trim().toLowerCase() || '').trim();
}
function activeClientRecord() {
  const email = String(state.profile?.email || '').trim().toLowerCase();
  return (state.clients || []).find(c => String(c.email || '').trim().toLowerCase() === email)
    || (state.clients || []).find(c => String(c.auth_user_id || c.user_id || c.profile_id || c.id || '') === String(state.profile?.auth_user_id || state.profile?.id || ''))
    || state.profile
    || {};
}
function activeClientName() {
  const c = activeClientRecord();
  return c.name || c.display_name || c.business_name || c.email || state.profile?.display_name || state.profile?.email || 'Client';
}
function activeClientEmail() {
  const c = activeClientRecord();
  return String(c.email || state.profile?.email || '').trim().toLowerCase();
}
function dispatchThreadIdForClient(client = {}) {
  return `dispatch-client-${messageClientKey(client).replace(/[^a-zA-Z0-9_-]/g, '_')}`;
}
function syncClientDispatchMessages() {
  if (state.role !== 'client') return;
  const store = readClientDispatchMessageStore();
  const client = activeClientRecord();
  const now = new Date().toISOString();
  const id = dispatchThreadIdForClient(client);
  let thread = store.threads.find(t => String(t.id) === String(id));
  if (!thread) {
    thread = {
      id,
      type: 'dispatch_client',
      title: 'Dispatch / Client',
      client_id: client.id || state.profile?.id || '',
      client_email: activeClientEmail(),
      client_name: activeClientName(),
      created_at: now,
      updated_at: now,
      last_message_preview: 'No messages yet',
      unread_client: 0,
      unread_admin: 0
    };
    store.threads.push(thread);
  } else {
    thread.client_id = thread.client_id || client.id || state.profile?.id || '';
    thread.client_email = thread.client_email || activeClientEmail();
    thread.client_name = activeClientName();
    thread.title = 'Dispatch / Client';
  }
  writeClientDispatchMessageStore(store);
  state.messageThreads = store.threads
    .filter(t => String(t.id) === String(id))
    .map(t => ({
      id: t.id,
      subject: 'Dispatch / Client',
      title: 'Dispatch / Client',
      updated_at: t.updated_at,
      created_at: t.created_at,
      last_message_preview: t.last_message_preview || 'No messages yet',
      unread_count: Number(t.unread_client || 0),
      client_id: t.client_id,
      client_email: t.client_email,
      client_name: t.client_name,
      type: 'dispatch_client'
    }));
  state.messages = store.messages.filter(m => state.messageThreads.some(t => String(t.id) === String(m.thread_id)));
  if ((!state.selectedThreadId || !state.messageThreads.some(t => String(t.id) === String(state.selectedThreadId))) && state.messageThreads[0]) {
    state.selectedThreadId = state.messageThreads[0].id;
  }
}
function currentClientMessageThread() {
  syncClientDispatchMessages();
  return state.messageThreads.find(t => String(t.id) === String(state.selectedThreadId)) || state.messageThreads[0] || null;
}
function clientMessagesForThread(threadId) {
  const store = readClientDispatchMessageStore();
  return store.messages.filter(m => String(m.thread_id) === String(threadId)).sort((a,b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
}
function markCurrentClientThreadRead() {
  const thread = currentClientMessageThread();
  if (!thread) return;
  const store = readClientDispatchMessageStore();
  const raw = store.threads.find(t => String(t.id) === String(thread.id));
  if (!raw) return;
  raw.unread_client = 0;
  writeClientDispatchMessageStore(store);
  syncClientDispatchMessages();
}
function sendClientDispatchMessage(text) {
  const body = String(text || '').trim();
  if (!body) throw new Error('Type a message first.');
  const thread = currentClientMessageThread();
  if (!thread) throw new Error('Dispatch channel not found.');
  const store = readClientDispatchMessageStore();
  const raw = store.threads.find(t => String(t.id) === String(thread.id));
  if (!raw) throw new Error('Conversation thread not found.');
  const now = new Date().toISOString();
  const msg = {
    id: `client-msg-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    thread_id: raw.id,
    sender_role: 'client',
    sender_name: activeClientName(),
    sender_email: activeClientEmail(),
    body,
    created_at: now
  };
  store.messages.push(msg);
  raw.updated_at = now;
  raw.last_message_preview = body;
  raw.unread_admin = Number(raw.unread_admin || 0) + 1;
  raw.unread_client = 0;
  writeClientDispatchMessageStore(store);
  syncClientDispatchMessages();
}
function filteredClientMessageThreads() {
  syncClientDispatchMessages();
  let rows = [...state.messageThreads];
  const q = String(state.messageSearch || '').trim().toLowerCase();
  if (q) rows = rows.filter(t => `${t.title || ''} ${t.subject || ''} ${t.last_message_preview || ''}`.toLowerCase().includes(q));
  if (state.messageFilter === 'unread') rows = rows.filter(t => Number(t.unread_count || 0) > 0);
  if (state.messageFilter === 'active-job') rows = rows.filter(t => Boolean(clientMessageLinkedRequest()));
  return rows;
}
function clientMessageLinkedRequest() {
  return clientOpenRequests().find(r => ['assigned','accepted','in_progress','pending_dispatch'].includes(String(r.status || '')))
    || clientOpenRequests()[0]
    || completedRequests().find(r => state.properties.some(p => String(p.id) === String(r.property_id)))
    || null;
}
function clientMessagesView() {
  syncClientDispatchMessages();
  const threads = filteredClientMessageThreads();
  const selected = threads.find(t => String(t.id) === String(state.selectedThreadId)) || threads[0] || null;
  if (selected && String(state.selectedThreadId) !== String(selected.id)) state.selectedThreadId = selected.id;
  const activeThread = selected || currentClientMessageThread();
  const req = clientMessageLinkedRequest();
  const msgs = activeThread ? clientMessagesForThread(activeThread.id) : [];
  const alerts = notificationsList().slice(0,3);
  const reports = clientReportSourceRows().slice(0,3);
  const selectedProperty = req ? propertyById(req.property_id) : selectedClientProperty();
  const propertyName = selectedProperty ? propertyDisplayName(selectedProperty) : 'Client Property';
  return `<div class="dashboard messages-shell client-messages-shell"><header class="dashboard-header"><div class="title-block"><h1>Messages</h1><p>Real-time communication between Client and Dispatch.</p></div><div class="header-actions"><span class="system-pill"><i></i>System Operational</span></div></header><section class="messages-layout page-panel"><aside class="messages-inbox panel"><div class="messages-inbox-head"><div><h2>Dispatch Inbox</h2><p>Client conversations</p></div><button class="icon-square">✎</button></div><div class="messages-search-row"><input type="search" placeholder="Search conversations..." value="${esc(state.messageSearch)}" data-message-search><button class="icon-square">⌕</button></div><div class="messages-filter-row"><button type="button" class="filter-pill ${state.messageFilter === 'all' ? 'active' : ''}" data-message-filter="all">All</button><button type="button" class="filter-pill ${state.messageFilter === 'unread' ? 'active' : ''}" data-message-filter="unread">Unread ${unreadMessagesCount() ? `<b>${esc(unreadMessagesCount())}</b>` : ''}</button><button type="button" class="filter-pill ${state.messageFilter === 'active-job' ? 'active' : ''}" data-message-filter="active-job">Active Patrol</button></div><div class="messages-thread-list">${threads.length ? threads.map(thread => `<button type="button" class="messages-thread-row ${activeThread && String(activeThread.id) === String(thread.id) ? 'active' : ''}" data-action="select-client-thread" data-thread-id="${esc(thread.id)}"><div class="thread-avatar">D</div><div class="thread-copy"><div class="thread-top"><strong>Dispatch / Client</strong><em>${esc(fmtTime(thread.updated_at || thread.created_at))}</em></div><small>Client Channel</small><p>${esc(thread.last_message_preview || 'No messages yet')}</p></div>${Number(thread.unread_count || 0) ? `<span class="thread-unread">${esc(thread.unread_count)}</span>` : ''}</button>`).join('') : '<div class="empty">No Dispatch conversations yet.</div>'}</div></aside><section class="messages-conversation panel">${activeThread ? `<div class="conversation-head"><div><h2>Dispatch / Client</h2><p>Online communication with Dispatch</p></div><div class="conversation-actions"><button class="icon-square">☎</button><button class="icon-square">⌕</button><button class="icon-square">⋯</button></div></div><div class="conversation-stream">${msgs.length ? msgs.map(msg => `<div class="chat-row ${msg.sender_role === 'client' ? 'me' : 'them'}"><div class="chat-bubble"><header><strong>${esc(msg.sender_role === 'client' ? 'You' : (msg.sender_name || activeDispatchLabel()))}</strong><span>${esc(fmtTime(msg.created_at))}</span></header><p>${esc(msg.body || '')}</p></div></div>`).join('') : '<div class="empty">No messages yet. Start the conversation below.</div>'}</div><form class="conversation-compose" data-form="client-dispatch-message"><input type="hidden" name="thread_id" value="${esc(activeThread.id)}"><div class="compose-toolbar"><button type="button" class="icon-square small">📎</button><button type="button" class="icon-square small">📷</button></div><div class="compose-input-wrap"><textarea name="message" rows="3" placeholder="Type your message to Dispatch..."></textarea><div class="quick-actions-inline"><button type="button" class="quick-pill" data-action="quick-message" data-text="Can I get an update on my patrol request?">Request Update</button><button type="button" class="quick-pill" data-action="quick-message" data-text="I need assistance at my property.">Need Assistance</button><button type="button" class="quick-pill" data-action="quick-message" data-text="Everything is all set on my end.">All Set</button><button type="button" class="quick-pill" data-action="quick-message" data-text="Please call me when available.">Call Me</button></div></div><button type="submit" class="send-button">Send</button></form>` : `<div class="empty" style="min-height:480px;display:grid;place-items:center;">No conversation selected.</div>`}</section><aside class="messages-detail panel panel-pad">${activeThread ? `<div class="panel-head"><div><h2>Conversation Details</h2><p>Linked to Dispatch support channel</p></div></div><div class="messages-detail-stack"><section class="detail-card"><div class="detail-card-head"><strong>Linked Property / Request</strong>${req ? `<span class="rank-chip active">${esc(statusText(req.status))}</span>` : '<span class="rank-chip">Ready</span>'}</div><h3>${esc(req ? propertyLabel(req) : propertyName)}</h3><p>${esc(req ? propertyAddress(req) : (selectedProperty ? propertyDisplayAddress(selectedProperty) : 'Select a property or request.'))}</p><div class="detail-grid"><span>Request</span><strong>${esc(req ? requestTitle(req) : 'No active request')}</strong><span>Priority</span><strong>${esc(req ? statusText(req.priority || 'Normal') : 'Normal')}</strong><span>Last Message</span><strong>${esc(fmtTime(activeThread.updated_at))}</strong></div><button type="button" class="ghost-button wide" data-view="${req ? 'patrol-requests' : 'properties'}">${req ? 'View Patrol Request' : 'View Property'}</button></section><section class="detail-card"><div class="detail-card-head"><strong>Client Status</strong><span class="rank-chip">Client</span></div><div class="detail-grid"><span>Status</span><strong>Active</strong><span>Channel</span><strong>Dispatch</strong><span>Client</span><strong>${esc(activeClientName())}</strong></div></section><section class="detail-card"><div class="detail-card-head"><strong>Quick Responses</strong></div><div class="quick-response-list"><button type="button" data-action="quick-message" data-text="Can I get an update on my patrol request?">Can I get an update?</button><button type="button" data-action="quick-message" data-text="I need assistance at my property.">Need assistance at property.</button><button type="button" data-action="quick-message" data-text="Please call me when available.">Please call me.</button></div></section><div class="detail-split"><section class="detail-card"><div class="detail-card-head"><strong>Recent Alerts</strong></div>${alerts.length ? alerts.map(n => `<div class="detail-line"><span>${esc(n._title || n.title || 'Alert')}</span><em>${esc(fmtTime(n._created || n.created_at))}</em></div>`).join('') : '<div class="detail-line"><span>No alerts</span></div>'}</section><section class="detail-card"><div class="detail-card-head"><strong>Recent Reports</strong></div>${reports.length ? reports.map(r => `<div class="detail-line"><span>${esc(r.reportNumber || r.title || 'Report')}</span><em>${esc(fmtTime(r.createdAt))}</em></div>`).join('') : '<div class="detail-line"><span>No reports</span></div>'}</section></div></div>` : `<div class="empty">No conversation selected.</div>`}</aside></section></div>`;
}

function guardApprovalsView() {
  const rows = guardApprovals().map(x => ({ ...x, kind: 'guard' }));
  const rankOptions = ['Guard', 'Sergeant', 'Field Supervisor', 'Supervisor', 'Lead Guard'];
  return `<div class="dashboard"><header class="dashboard-header"><div class="title-block"><h1>Guard Approvals</h1><p>Approve guard applications and assign the guard rank for Dispatch workflows.</p></div><div class="header-actions"><span class="system-pill"><i></i>System Operational</span></div></header><section class="page-panel"><div class="cards-grid cards-grid-guard-approvals">${rows.length ? rows.map(item => `<article class="panel panel-pad guard-approval-card"><div class="guard-approval-head"><div class="avatar">${esc(initials(item.name || item.display_name || item.email || 'G'))}</div><div><h2>${esc(item.name || item.display_name || 'Guard Applicant')}</h2><p>${esc(item.email || '')}</p><small>${esc(item.phone || 'No phone listed')}</small></div><span class="rank-chip pending">Pending</span></div><div class="guard-approval-body"><div class="guard-approval-meta"><span>Requested Role</span><strong>Guard</strong><span>Notes</span><strong>${esc(item.notes || 'No notes added')}</strong></div><label class="form-field"><span>Guard Rank</span><select data-guard-rank="${esc(item.id)}">${rankOptions.map(rank => `<option value="${esc(rank)}" ${rank === guardRankFor(item) ? 'selected' : ''}>${esc(rank)}</option>`).join('')}</select></label><div class="button-row"><button class="btn success" data-approve="guard" data-id="${esc(item.id)}">Approve Guard</button><button class="btn secondary" data-reject="guard" data-id="${esc(item.id)}">Reject</button></div></div></article>`).join('') : '<div class="empty">No pending guard applications.</div>'}</div></section></div>`;
}
function messagesView() {
  if (state.role === 'client') return clientMessagesView();
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
  state.view = ['dispatch-board','pending-dispatch'].includes(state.view) ? state.view : 'dashboard';
  render();
  const guardName = result.guard?.name || result.guard?.display_name || result.guard?.email || 'guard';
  toast(`${requestTitle(result.request || req)} assigned to ${guardName}.`, 'success');
}



function summaryRequestTypeLabel(value) {
  const cfg = clientRequestTypeConfig(value || state.clientRequestType || 'immediate');
  return cfg.label || 'Immediate Patrol';
}
function summaryPriorityHtml(value) {
  const v = String(value || 'normal').toLowerCase();
  const label = v === 'urgent' ? 'Emergency' : statusText(v);
  const cls = v === 'urgent' ? 'emergency' : v;
  return `<em class="mockup-priority ${esc(cls)}">${esc(label)}</em>`;
}
function summaryServiceIcons(form) {
  const checked = [...form.querySelectorAll('input[name="requested_services"]:checked')].map(i => i.value);
  if (!checked.length) return '<span class="summary-empty">None selected</span>';
  const iconMap = {
    'Check doors': '▥',
    'Check perimeter': '◇',
    'Check windows': '▦',
    'Photo proof required': '▣',
    'Lock up if needed': '⌘'
  };
  return checked.map(item => `<i title="${esc(item)}">${esc(iconMap[item] || '✓')}</i>`).join('');
}
function summaryWhenText(form, requestType) {
  const date = form.querySelector('[name="requested_date"], [name="date"], [name="start_date"]')?.value?.trim() || '';
  const time = form.querySelector('[name="requested_time"], [name="time"]')?.value?.trim() || '';
  const end = form.querySelector('[name="end_date"]')?.value?.trim() || '';
  const recurring = form.querySelector('[name="recurring_pattern"], [name="frequency"]')?.value?.trim() || '';
  if (requestType === 'immediate') return 'ASAP';
  if (requestType === 'vacation') return [date || 'Start date', end ? `to ${end}` : 'End date'].join(' ');
  if (requestType === 'recurring') return recurring || date || 'Repeating schedule';
  return [date || 'Future date', time || 'Time'].join(' at ');
}
function updateClientRequestSummaryFromForm(form = document.querySelector('[data-form="client-patrol-request"]')) {
  const summary = document.querySelector('[data-live-request-summary]');
  if (!summary || !form) return;
  const requestType = form.querySelector('[name="request_type_select"]')?.value || state.clientRequestType || 'immediate';
  const priority = form.querySelector('input[name="priority"]:checked')?.value || form.querySelector('[name="priority"]')?.value || 'normal';
  const propertySelect = form.querySelector('[name="property_id"]');
  const propertyText = propertySelect?.selectedOptions?.[0]?.textContent?.trim() || 'Choose property';
  const duration = form.querySelector('[name="estimated_duration"], [name="duration"]')?.selectedOptions?.[0]?.textContent?.trim()
    || form.querySelector('[name="estimated_duration"], [name="duration"]')?.value?.trim()
    || '60 minutes';
  const instructions = form.querySelector('[name="instructions"]')?.value?.trim() || '';
  const file = form.querySelector('[name="reference_photo_file"]')?.files?.[0] || null;
  const set = (key, html) => {
    const el = summary.querySelector(`[data-summary="${key}"]`);
    if (el) el.innerHTML = html;
  };
  set('type', esc(summaryRequestTypeLabel(requestType)));
  set('priority', summaryPriorityHtml(priority));
  set('property', esc(propertyText.replace(/^Choose property$/i, 'Choose property')));
  set('when', esc(summaryWhenText(form, requestType)));
  set('duration', esc(`${duration}${/minute|hour|day/i.test(duration) ? '' : ' minutes'} (est.)`));
  set('services', summaryServiceIcons(form));
  set('instructions', instructions ? 'Yes' : 'No');
  set('reference', file ? esc(file.name || 'File selected') : 'No file selected');
}
function syncClientRequestFormStateFromInput(input) {
  if (!input) return;
  const form = input.closest?.('[data-form="client-patrol-request"]');
  if (!form) return;
  if (input.name === 'request_type_select') state.clientRequestType = input.value || 'immediate';
  if (input.name === 'property_id') state.clientPatrolPrefillPropertyId = input.value || '';
  updateClientRequestSummaryFromForm(form);
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
  const scheduleMetadata = scheduledQueueMetadataFromClientForm(form);
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
  const returnedRequest = result.request || result.patrol_request || result.data || {};
  let submittedRequestId = returnedRequest.id || returnedRequest.request_id || result.request_id || result.id || '';
  await loadData();
  if (!submittedRequestId) submittedRequestId = findRecentlySubmittedRequestId(propertyId);
  rememberSubmittedScheduleMetadata(submittedRequestId, scheduleMetadata);
  state.view = 'patrol-requests';
  render();
  toast('Patrol request submitted to Dispatch.', 'success');
}


function renderLoading() {
  app.innerHTML = `<div class="auth-shell"><div class="auth-card"><section class="auth-hero"><div class="brand-row"><div class="logo-box">CP</div><div><strong>Co Pilot</strong><small>Security</small></div></div><h1>Loading Command Center</h1><p>Connecting to Supabase.</p></section><section class="auth-panel"><div class="auth-box"><p class="eyebrow">Loading</p><h2>Preparing app</h2><p class="auth-note">Loading your role, patrol data, messages, notifications, and reports.</p></div></section></div></div>`;
  ensureBadge();
  scheduleGuardGpsPrep();
  scheduleGuardLeafletMap();
  scheduleDispatchLeafletMap();
  scheduleDispatchRoutePrep();
  scheduleClientMapPrep();
  scheduleClientLeafletMap();
  scheduleClientPropertyMapPrep();
  scheduleClientPropertyDetailMap();
  if (state.role === 'client' && state.view === 'patrol-requests') setTimeout(() => updateClientRequestSummaryFromForm(), 0);
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
  const nav = NAV[role] || NAV.admin;
  const roleText = roleLabel(role);
  const portalText = role === 'admin' ? 'Dispatch Portal' : role === 'guard' ? 'Guard Portal' : 'Client Portal';
  return `<aside class="sidebar global-sidebar-redesign sidebar-${esc(role)}">
    <button class="sidebar-collapse-visual" type="button" aria-label="Sidebar style control">‹‹</button>
    <div class="sidebar-brand">
      <div class="logo-box"><span>CP</span></div>
      <div><strong>Co Pilot</strong><small>Security</small></div>
    </div>
    <div class="profile-card">
      ${avatar(name, photo)}
      <div class="profile-main-copy">
        <strong>${esc(name)}</strong>
        <span>${esc(portalText)}</span>
        <em><i></i>Online</em>
      </div>
      <b class="profile-role-pill">${esc(roleText)}</b>
      <i class="profile-chevron">⌄</i>
    </div>
    <div class="nav-scroll">
      ${nav.map(item => {
        if (item[0] === 'heading') return `<div class="nav-heading"><span>${esc(item[2])}</span></div>`;
        const badge = navBadge(item[0]);
        return `<button class="nav-item ${state.view === item[0] ? 'active' : ''}" data-view="${esc(item[0])}"><i>${esc(item[1])}</i><span>${esc(item[2])}</span>${badge ? `<b>${esc(badge)}</b>` : ''}</button>`;
      }).join('')}
    </div>
    <div class="sidebar-footer">
      <button class="nav-item logout-item" data-action="logout"><i>↪</i><span>Logout</span></button>
      <div class="sidebar-platform-card"><i>✓</i><span><strong>CoPilot Security</strong><small>Platform Online</small></span></div>
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
function dispatchPropertyCoords(property = {}) {
  const lat = Number(property.latitude ?? property.lat ?? property.property_latitude ?? property.geo_lat ?? property.location_lat ?? property.coords?.lat);
  const lng = Number(property.longitude ?? property.lng ?? property.lon ?? property.property_longitude ?? property.geo_lng ?? property.location_lng ?? property.coords?.lng);
  if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
  return null;
}
function dispatchMapPropertyEntries() {
  return (state.properties || []).map(property => {
    const coords = dispatchPropertyCoords(property);
    const activeReq = activeRequests().find(req => String(req.property_id) === String(property.id)) || null;
    return { property, coords, activeReq, isActive: Boolean(activeReq) };
  }).filter(entry => entry.coords);
}
function dispatchNumberValue(...values) {
  for (const value of values) {
    if (value === null || value === undefined || value === '') continue;
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}
function dispatchGuardExplicitOnlineState(guard = {}) {
  const onlineFields = [
    guard.is_online, guard.online, guard.gps_online, guard.location_online, guard.guard_online,
    guard.isOnline, guard.live_gps_online, guard.gps_sharing, guard.location_sharing
  ];
  for (const value of onlineFields) {
    if (value === true || value === 1 || String(value).toLowerCase() === 'true') return true;
    if (value === false || value === 0 || String(value).toLowerCase() === 'false') return false;
  }
  const text = [
    guard.gps_status, guard.online_status, guard.availability_status, guard.location_status,
    guard.current_gps_status, guard.presence
  ].filter(Boolean).join(' ').toLowerCase();
  if (/offline|gps off|location off|not sharing|inactive|disabled|rejected|pending|off duty|off-duty/.test(text)) return false;
  if (/online|gps online|location online|sharing gps|live gps|live location/.test(text)) return true;
  return null;
}
function dispatchGuardRawCoords(guard = {}) {
  const loc = guard.location || guard.current_location || guard.last_location || guard.gps || guard.coords || {};
  const lat = dispatchNumberValue(
    guard.latitude, guard.lat, guard.current_latitude, guard.currentLat, guard.last_latitude,
    guard.last_known_latitude, guard.geo_lat, guard.location_lat, guard.gps_latitude,
    guard.gps_lat, guard.address_latitude, guard.home_latitude, loc.latitude, loc.lat
  );
  const lng = dispatchNumberValue(
    guard.longitude, guard.lng, guard.lon, guard.current_longitude, guard.currentLng, guard.last_longitude,
    guard.last_known_longitude, guard.geo_lng, guard.location_lng, guard.gps_longitude,
    guard.gps_lng, guard.gps_lon, guard.address_longitude, guard.home_longitude, loc.longitude, loc.lng, loc.lon
  );
  if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng, source: 'guard-record' };
  return null;
}
function dispatchGuardIdentityKeys(guard = {}) {
  return [guard.id, guard.auth_user_id, guard.user_id, guard.profile_id, String(guard.email || '').trim().toLowerCase(), String(guard.name || guard.display_name || '').trim().toLowerCase()]
    .filter(Boolean)
    .map(v => String(v).trim().toLowerCase());
}
function dispatchGuardMatchesPersistedOnlineState(guard = {}) {
  const saved = readGuardGpsPersistedState();
  if (!saved?.online) return false;
  const savedKeys = [saved.guardId, saved.guardEmail, saved.guardName]
    .filter(Boolean)
    .map(v => String(v).trim().toLowerCase());
  const guardKeys = dispatchGuardIdentityKeys(guard);
  if (savedKeys.length && guardKeys.some(k => savedKeys.includes(k))) return true;

  // Backward compatibility for older local GPS records that did not store guard identity.
  if (!savedKeys.length || savedKeys.every(k => ['guard','unknown'].includes(k))) {
    const approved = adminAssignableGuards();
    const tony = approved.find(g => /tony/i.test(String(g.name || g.display_name || g.email || '')));
    if (tony) return dispatchGuardIdentityKeys(tony).some(k => guardKeys.includes(k));
    const nonGeneric = approved.filter(g => !/^guard$/i.test(String(g.name || g.display_name || '').trim() || 'Guard'));
    if (nonGeneric.length === 1) return dispatchGuardIdentityKeys(nonGeneric[0]).some(k => guardKeys.includes(k));
  }
  return false;
}
function dispatchPersistedGuardCoords() {
  const saved = readGuardGpsPersistedState();
  if (!saved?.online) return null;
  const lat = Number(saved.guardLat);
  const lng = Number(saved.guardLng);
  if (Number.isFinite(lat) && Number.isFinite(lng)) return {
    lat, lng,
    source: 'persisted-online',
    currentAddress: saved.currentAddress || '',
    accuracy: Number.isFinite(Number(saved.accuracy)) ? Number(saved.accuracy) : null
  };
  return null;
}
function dispatchFallbackGuardCenter() {
  const persisted = dispatchPersistedGuardCoords();
  if (persisted) return persisted;
  for (const guard of (state.guards || [])) {
    if (dispatchGuardExplicitOnlineState(guard) === true) {
      const raw = dispatchGuardRawCoords(guard);
      if (raw) return raw;
    }
  }
  return null;
}
function dispatchGuardCoords(guard = {}, idx = 0, req = null) {
  if (dispatchGuardMatchesPersistedOnlineState(guard)) {
    const persisted = dispatchPersistedGuardCoords();
    if (persisted) return persisted;
  }

  const explicit = dispatchGuardExplicitOnlineState(guard);
  const raw = dispatchGuardRawCoords(guard);
  if (explicit === true && raw) return raw;

  const linkedReq = req || activeRequests().find(row => String(row.guard_id || row.assigned_guard_id) === String(guard.id)) || null;
  if (explicit === true && linkedReq && liveGps.online && Number.isFinite(liveGps.guardLat) && Number.isFinite(liveGps.guardLng) &&
      String(linkedReq.guard_id || linkedReq.assigned_guard_id || '') === String(guard.id || '')) {
    return { lat: liveGps.guardLat, lng: liveGps.guardLng, source: 'live-gps' };
  }

  const fallback = dispatchFallbackGuardCenter();
  if (explicit === true && fallback) {
    const offsets = [[0,0], [0.00022, -0.00020], [-0.00020, 0.00022], [0.00026, 0.00018], [-0.00024, -0.00018]];
    const pair = offsets[idx % offsets.length];
    return { lat: fallback.lat + pair[0], lng: fallback.lng + pair[1], source: 'online-cluster' };
  }
  return null;
}
function dispatchGuardIsOnlineForMap(guard = {}, coords = null) {
  if (!coords) return false;
  if (dispatchGuardMatchesPersistedOnlineState(guard)) return true;
  return dispatchGuardExplicitOnlineState(guard) === true;
}
function dispatchMapOnlineGuards() {
  const active = activeRequests();
  return adminAssignableGuards().map((guard, idx) => {
    const linkedReq = active.find(req => String(req.guard_id || req.assigned_guard_id) === String(guard.id)) || null;
    const coords = dispatchGuardCoords(guard, idx, linkedReq);
    return { guard, request: linkedReq, coords, positionSource: coords?.source || 'unknown' };
  }).filter(entry => dispatchGuardIsOnlineForMap(entry.guard, entry.coords));
}
function dispatchMapBounds(propertyEntries = [], guardEntries = []) {
  const points = [];
  propertyEntries.forEach(entry => {
    if (entry.coords && Number.isFinite(entry.coords.lat) && Number.isFinite(entry.coords.lng)) points.push([entry.coords.lat, entry.coords.lng]);
  });
  guardEntries.forEach(entry => {
    if (entry.coords && Number.isFinite(entry.coords.lat) && Number.isFinite(entry.coords.lng)) points.push([entry.coords.lat, entry.coords.lng]);
  });
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
function dispatchSelectedProperty() {
  const entries = dispatchMapPropertyEntries();
  const selectedId = String(liveGps.dispatchSelectedPropertyId || entries[0]?.property?.id || '');
  return entries.find(entry => String(entry.property.id) === selectedId)?.property || entries[0]?.property || null;
}
function dispatchSelectedGuardEntry() {
  const entries = dispatchMapOnlineGuards();
  const selectedId = String(liveGps.dispatchSelectedGuardId || entries[0]?.guard?.id || '');
  return entries.find(entry => String(entry.guard.id) === selectedId) || entries[0] || null;
}
function dispatchPropertyOwnerName(property = {}) {
  return property.owner_name || property.contact_name || property.client_name || property.client_label || property.owner || 'Owner / Client';
}
function dispatchGuardGpsAddress(entry = {}) {
  const guard = entry.guard || {};
  const coords = entry.coords || null;
  const fromGuard = [guard.current_address, guard.last_address, guard.address, guard.address_line1, guard.city && guard.state ? `${guard.city}, ${guard.state}` : guard.city].filter(Boolean)[0];
  if (fromGuard) return fromGuard;
  if (entry.positionSource === 'persisted-online') {
    const saved = readGuardGpsPersistedState();
    if (saved.currentAddress && saved.currentAddress !== 'Location not active') return saved.currentAddress;
  }
  if (entry.positionSource === 'live-gps' && liveGps.currentAddress && liveGps.currentAddress !== 'Location not active') {
    return liveGps.currentAddress;
  }
  if (coords && Number.isFinite(coords.lat) && Number.isFinite(coords.lng)) {
    return `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`;
  }
  return 'GPS address unavailable';
}
function dispatchMapPropertyCard(property = {}) {
  const photo = propertyImageValue(property);
  const image = photo ? `<div class="avatar"><img src="${esc(photo)}" alt="${esc(propertyDisplayName(property))}"></div>` : avatar(propertyDisplayName(property));
  const owner = dispatchPropertyOwnerName(property);
  const activeReq = activeRequests().find(req => String(req.property_id) === String(property.id)) || null;
  const statusTextValue = activeReq ? `Active patrol · ${statusText(activeReq.status)}` : 'Saved property · Visible to Dispatch';
  return `<div class="guard302-live-card property dispatch-compact-map-card">
    <button type="button" class="guard302-card-close" data-action="close-map-card">×</button>
    <div>${image}</div>
    <div>
      <strong>${esc(propertyDisplayName(property))}</strong>
      <small>Owner / Client: ${esc(owner)}</small>
      <p>${esc(propertyDisplayAddress(property))}</p>
      <span>${esc(statusTextValue)}</span>
    </div>
  </div>`;
}
function dispatchMapGuardCard(entry = {}) {
  const guard = entry.guard || {};
  const req = entry.request || null;
  const rank = (readGuardRankMap && readGuardRankMap()[guard.id]) || guard.rank || guard.role_title || 'Guard';
  const status = String(guard.status || 'online').replace(/_/g, ' ');
  const gpsAddress = dispatchGuardGpsAddress(entry);
  const name = guard.name || guard.display_name || guard.email || 'Guard';
  const subline = [rank, statusText(status)].filter(Boolean).join(' · ');
  const accuracy = guard.accuracy || guard.gps_accuracy || guard.location_accuracy || liveGps.accuracy || '';
  return `<div class="guard302-live-card dispatch-compact-map-card">
    <button type="button" class="guard302-card-close" data-action="close-map-card">×</button>
    <div>${avatar(name, guard.photo_url || guard.avatar_url || guard.image_url || '')}</div>
    <div>
      <strong>${esc(name)}</strong>
      <small>${esc(subline)}</small>
      <p>${esc(gpsAddress)}</p>
      <span>${esc(req ? `Assigned: ${propertyLabel(req)} · ${(() => { const r = dispatchRouteForRequestAndGuard(req, entry); return r ? `${r.distanceMiles?.toFixed(1) || '—'} mi · ETA ${r.etaMin || '—'} min` : 'route pending'; })()}` : 'Online · Live GPS')}${accuracy ? ' · Accuracy ±' + esc(String(Math.round(Number(accuracy)) || accuracy)) + ' ft' : ''}</span>
    </div>
  </div>`;
}
function dispatchMapOverlay() {
  if (liveGps.selectedMapCard === 'guard') return dispatchMapGuardCard(dispatchSelectedGuardEntry());
  if (liveGps.selectedMapCard === 'property') return dispatchMapPropertyCard(dispatchSelectedProperty());
  return '';
}
function dispatchPrimaryRouteSummary() {
  const activeEntry = dispatchMapOnlineGuards().find(entry => entry.request && entry.coords);
  if (activeEntry?.request) {
    const route = dispatchRouteForRequestAndGuard(activeEntry.request, activeEntry);
    if (route) return { route, label: 'Assigned route' };
  }
  const req = selectedPendingRequest ? selectedPendingRequest() : null;
  if (req) {
    const entry = dispatchNearestOnlineGuardEntry(req);
    const route = dispatchRouteForRequestAndGuard(req, entry);
    if (route) return { route, label: 'Nearest guard' };
  }
  return null;
}
function mapArea() {
  let properties = dispatchMapPropertyEntries();
  let guards = dispatchMapOnlineGuards();
  const active = activeRequests();
  if (state.role === 'admin' && state.view === 'live-gps') {
    const mode = state.liveGpsViewMode || 'default';
    if (mode === 'guards') properties = [];
    if (mode === 'properties') guards = [];
    if (mode === 'patrols') {
      properties = properties.filter(entry => entry.activeReq);
      guards = guards.filter(entry => entry.request);
    }
  }
  const bounds = dispatchMapBounds(properties, guards);
  const dispatchRoutePaths = guards.map(entry => {
    if (!entry.request || !entry.coords) return '';
    const end = getPropertyCoords(entry.request);
    if (!end) return '';
    const route = dispatchRouteForPoints(entry.coords, end);
    const path = route?.points?.length ? dispatchRouteSvgPath(route.points, bounds) : '';
    return path ? `<path d="${esc(path)}"></path>` : '';
  }).join('');
  const propertyMarkers = properties.map(entry => {
    const pct = mapPercentForPoint(entry.coords.lat, entry.coords.lng, bounds);
    return `<button type="button" class="guard302-fallback-property" data-action="map-card" data-card="property" data-property-id="${esc(entry.property.id)}" style="left:${pct.x.toFixed(2)}%;top:${pct.y.toFixed(2)}%" aria-label="Open property card"><span></span></button>`;
  }).join('');
  const guardMarkers = guards.map(entry => {
    const pct = mapPercentForPoint(entry.coords.lat, entry.coords.lng, bounds);
    return `<button type="button" class="guard302-fallback-guard" data-action="map-card" data-card="guard" data-property-id="${esc(entry.guard.id)}" style="left:${pct.x.toFixed(2)}%;top:${pct.y.toFixed(2)}%" aria-label="Open guard card"><span></span></button>`;
  }).join('');
  const overlay = dispatchMapOverlay();
  const routeSummary = dispatchPrimaryRouteSummary();
  return `
    <div class="guard302-leaflet-wrap dispatch-leaflet-wrap">
      <button type="button" class="dispatch-map-default-btn" data-action="dispatch-map-default">Default</button>
      <div id="dispatch-live-leaflet-map" class="guard302-leaflet-map" data-online="${guards.length ? '1' : '0'}"></div>
      <div class="guard302-map-fallback" id="dispatch-live-map-fallback">
        <span class="street-name s1">W. Flamingo Rd</span><span class="street-name s2">S. Decatur Blvd</span><span class="street-name s3">W. Tropicana Ave</span><span class="street-name s4">S. Jones Blvd</span>
        <div class="fallback-road r1"></div><div class="fallback-road r2"></div><div class="fallback-road r3"></div><div class="fallback-road r4"></div>
        ${dispatchRoutePaths ? `<svg class="guard302-fallback-route dispatch-multi-route" viewBox="0 0 100 100" preserveAspectRatio="none">${dispatchRoutePaths}</svg>` : ''}
        ${propertyMarkers}
        ${guardMarkers}
        <div class="guard302-map-legend">
          <span><i class="guard302-legend-property"></i>Properties</span>
          <span><i class="guard302-legend-guard"></i>Online Guards</span>
          <span><i class="guard302-legend-route"></i>Live Routes</span>
        </div>
      </div>
      ${overlay}
    </div>
    <div class="guard302-map-metrics">
      <div><small>Online Guards</small><strong>${esc(String(guards.length))}</strong></div>
      <div><small>Saved Properties</small><strong>${esc(String(properties.length))}</strong></div>
      <div><small>Active Patrols</small><strong>${esc(String(active.length))}</strong></div>
      <div><small>Route Distance</small><strong>${esc(routeSummary?.route?.distanceMiles ? routeSummary.route.distanceMiles.toFixed(1) + ' mi' : '—')}</strong></div>
      <div><small>ETA</small><strong>${esc(routeSummary?.route?.etaMin ? routeSummary.route.etaMin + ' min' : '—')}</strong></div>
    </div>
  `;
}
function updateDispatchMapCardOnly() {
  const wrap = document.querySelector('.dispatch-leaflet-wrap');
  if (!wrap) { render(); return; }
  wrap.querySelectorAll('.guard302-live-card').forEach(el => el.remove());
  const html = dispatchMapOverlay();
  if (html) wrap.insertAdjacentHTML('beforeend', html);
}

function hideDispatchMapFallback() {
  const fallback = document.getElementById('dispatch-live-map-fallback');
  if (fallback) fallback.classList.add('loaded');
}
function showDispatchMapFallback(message = 'Live dispatch map unavailable. Showing fallback street grid.') {
  const fallback = document.getElementById('dispatch-live-map-fallback');
  if (fallback) {
    fallback.classList.remove('loaded');
    const small = fallback.querySelector('small');
    if (small) small.textContent = message;
  }
}
function initDispatchLeafletMap() {
  const el = document.getElementById('dispatch-live-leaflet-map');
  if (!el) return;
  if (!window.L) {
    showDispatchMapFallback('Leaflet did not load yet. Showing fallback dispatch map.');
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
    const properties = dispatchMapPropertyEntries();
    const guards = dispatchMapOnlineGuards();
    const centerEntry = guards[0]?.coords || properties[0]?.coords || null;
    const center = centerEntry ? [centerEntry.lat, centerEntry.lng] : [36.1699, -115.1398];
    const map = L.map(el, { zoomControl:true, attributionControl:false, scrollWheelZoom:true }).setView(center, centerEntry ? 13 : 11);
    liveGps.leafletMap = map;
    el.dataset.ready = '1';
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19, crossOrigin:true });
    tiles.on('load', hideDispatchMapFallback);
    tiles.on('tileerror', () => showDispatchMapFallback('Map tiles blocked or slow. Showing fallback dispatch map.'));
    tiles.addTo(map);
    const markerGroup = L.featureGroup().addTo(map);
    properties.forEach(entry => {
      const lat = entry.coords?.lat;
      const lng = entry.coords?.lng;
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
      const propertyMarker = L.marker([lat, lng], { icon: leafletDivIcon('leaflet-property-pulse-icon', '<span></span>') }).addTo(markerGroup);
      propertyMarker.on('click', () => openMapCard('property', entry.property.id));
    });
    guards.forEach(entry => {
      const lat = entry.coords?.lat;
      const lng = entry.coords?.lng;
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
      const guardMarker = L.marker([lat, lng], { icon: leafletDivIcon('leaflet-guard-pulse-icon', '<span></span>') }).addTo(markerGroup);
      guardMarker.on('click', () => openMapCard('guard', entry.guard.id));
      const linkedCoords = entry.request ? getPropertyCoords(entry.request) : null;
      if (linkedCoords && entry.positionSource !== 'city-seed' && String(entry.request?.guard_id || entry.request?.assigned_guard_id || '') === String(entry.guard.id || '')) {
        const route = dispatchRouteForPoints({ lat, lng }, linkedCoords);
        const routeCoords = route?.points?.length >= 2 ? route.points.map(pt => [pt.lat, pt.lng]) : dispatchRouteFallbackPoints({ lat, lng }, linkedCoords).map(pt => [pt.lat, pt.lng]);
        L.polyline(routeCoords, { color:'#2e88ff', weight:5, opacity:.88, dashArray:'10 8', lineCap:'round', lineJoin:'round' }).addTo(markerGroup);
      }
    });
    if (markerGroup.getLayers().length > 0) {
      try { map.fitBounds(markerGroup.getBounds(), { padding:[36,36], maxZoom:15 }); } catch {}
    }
    setTimeout(() => { try { map.invalidateSize(); } catch {} }, 150);
    setTimeout(() => {
      const tilePane = el.querySelector('.leaflet-tile-pane');
      const hasTiles = tilePane && tilePane.querySelector('img');
      if (hasTiles) hideDispatchMapFallback();
    }, 1100);
  } catch (err) {
    showDispatchMapFallback('Map could not initialize. Showing fallback dispatch map with clickable markers.');
  }
}
function resetDispatchMapToDefault() {
  liveGps.selectedMapCard = null;
  document.querySelectorAll('.dispatch-leaflet-wrap .guard302-live-card').forEach(el => el.remove());
  const points = [];
  dispatchMapPropertyEntries().forEach(entry => { if (entry.coords) points.push([entry.coords.lat, entry.coords.lng]); });
  dispatchMapOnlineGuards().forEach(entry => { if (entry.coords) points.push([entry.coords.lat, entry.coords.lng]); });
  if (window.L && liveGps.leafletMap && points.length) {
    try {
      liveGps.leafletMap.fitBounds(L.latLngBounds(points), { padding: [36, 36], maxZoom: 15 });
      return;
    } catch {}
  }
  if (window.L && liveGps.leafletMap) {
    try { liveGps.leafletMap.setView([36.1699, -115.1398], 11); return; } catch {}
  }
  scheduleDispatchLeafletMap();
}

function scheduleDispatchLeafletMap() {
  if (state.role === 'admin' && ['dashboard','dispatch-board','live-gps'].includes(state.view)) {
    requestAnimationFrame(() => {
      [75, 450, 1200, 2500].forEach(delay => setTimeout(initDispatchLeafletMap, delay));
    });
  }
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

function dispatchRouteKey(start = {}, end = {}) {
  if (!start || !end || !Number.isFinite(start.lat) || !Number.isFinite(start.lng) || !Number.isFinite(end.lat) || !Number.isFinite(end.lng)) return '';
  return `${start.lat.toFixed(5)},${start.lng.toFixed(5)}_${end.lat.toFixed(5)},${end.lng.toFixed(5)}`;
}
function dispatchRouteFallbackPoints(start = {}, end = {}) {
  if (!start || !end || !Number.isFinite(start.lat) || !Number.isFinite(start.lng) || !Number.isFinite(end.lat) || !Number.isFinite(end.lng)) return [];
  const dLat = end.lat - start.lat;
  const dLng = end.lng - start.lng;
  const bendLat = dLng * 0.18;
  const bendLng = -dLat * 0.18;
  return [
    { lat: start.lat, lng: start.lng },
    { lat: start.lat + dLat * 0.22 + bendLat, lng: start.lng + dLng * 0.20 + bendLng },
    { lat: start.lat + dLat * 0.46 - bendLat * 0.35, lng: start.lng + dLng * 0.52 - bendLng * 0.35 },
    { lat: start.lat + dLat * 0.72 + bendLat * 0.25, lng: start.lng + dLng * 0.74 + bendLng * 0.25 },
    { lat: end.lat, lng: end.lng }
  ];
}
function dispatchRouteEstimate(start = {}, end = {}) {
  const direct = milesBetween(start.lat, start.lng, end.lat, end.lng);
  const roadMiles = Number.isFinite(direct) ? direct * 1.22 : null;
  return {
    points: dispatchRouteFallbackPoints(start, end),
    distanceMiles: roadMiles,
    etaMin: estimateEtaMinutes(roadMiles),
    source: 'estimated-road'
  };
}
function readCachedDispatchRoute(start = {}, end = {}) {
  const key = dispatchRouteKey(start, end);
  if (!key) return null;
  if (liveGps.dispatchRouteCache?.[key]) return liveGps.dispatchRouteCache[key];
  try {
    const raw = sessionStorage.getItem(`cp_dispatch_route_${key}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.points?.length >= 2) {
        liveGps.dispatchRouteCache = liveGps.dispatchRouteCache || {};
        liveGps.dispatchRouteCache[key] = parsed;
        return parsed;
      }
    }
  } catch {}
  return null;
}
function dispatchRouteForPoints(start = {}, end = {}, options = {}) {
  if (!start || !end || !Number.isFinite(start.lat) || !Number.isFinite(start.lng) || !Number.isFinite(end.lat) || !Number.isFinite(end.lng)) return null;
  const cached = readCachedDispatchRoute(start, end);
  if (cached) return cached;
  if (options.fetch !== false) ensureDispatchRoute(start, end);
  return dispatchRouteEstimate(start, end);
}
function dispatchRouteSvgPath(points = [], bounds) {
  if (!points || points.length < 2) return '';
  return points.map((pt, idx) => {
    const p = mapPercentForPoint(pt.lat, pt.lng, bounds);
    return `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  }).join(' ');
}
async function ensureDispatchRoute(start = {}, end = {}) {
  const key = dispatchRouteKey(start, end);
  if (!key) return null;
  const cached = readCachedDispatchRoute(start, end);
  if (cached) return cached;
  liveGps.dispatchRouteFetching = liveGps.dispatchRouteFetching || {};
  if (liveGps.dispatchRouteFetching[key]) return null;
  liveGps.dispatchRouteFetching[key] = true;
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson&steps=false`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Dispatch route service failed');
    const data = await res.json();
    const route = data?.routes?.[0];
    const coords = route?.geometry?.coordinates || [];
    if (!coords.length) throw new Error('No route geometry');
    const result = {
      points: coords.map(([lng, lat]) => ({ lat: Number(lat), lng: Number(lng) })).filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng)),
      distanceMiles: route.distance ? route.distance / 1609.344 : milesBetween(start.lat, start.lng, end.lat, end.lng),
      etaMin: route.duration ? Math.max(1, Math.round(route.duration / 60)) : estimateEtaMinutes(route.distance ? route.distance / 1609.344 : milesBetween(start.lat, start.lng, end.lat, end.lng)),
      source: 'osrm-road'
    };
    if (result.points.length >= 2) {
      liveGps.dispatchRouteCache = liveGps.dispatchRouteCache || {};
      liveGps.dispatchRouteCache[key] = result;
      try { sessionStorage.setItem(`cp_dispatch_route_${key}`, JSON.stringify(result)); } catch {}
      if (state.role === 'admin' && ['dashboard','dispatch-board','live-gps','pending-dispatch'].includes(state.view)) {
        setTimeout(() => { try { render(); } catch {} }, 60);
      }
      return result;
    }
  } catch (err) {
    const fallback = dispatchRouteEstimate(start, end);
    liveGps.dispatchRouteCache = liveGps.dispatchRouteCache || {};
    liveGps.dispatchRouteCache[key] = fallback;
    try { sessionStorage.setItem(`cp_dispatch_route_${key}`, JSON.stringify(fallback)); } catch {}
    return fallback;
  } finally {
    delete liveGps.dispatchRouteFetching[key];
  }
  return null;
}
function dispatchNearestOnlineGuardEntry(req = {}) {
  const coords = getPropertyCoords(req);
  const entries = dispatchMapOnlineGuards().filter(entry => entry.coords);
  if (!coords || !entries.length) return entries[0] || null;
  const selectedId = state.pendingDispatchGuardSelections?.[req.id] || '';
  if (selectedId) {
    const selected = entries.find(entry => String(entry.guard.id) === String(selectedId));
    if (selected) return selected;
  }
  return entries.slice().sort((a,b) => milesBetween(a.coords.lat,a.coords.lng,coords.lat,coords.lng) - milesBetween(b.coords.lat,b.coords.lng,coords.lat,coords.lng))[0] || null;
}
function dispatchRouteForRequestAndGuard(req = {}, guardEntry = null) {
  const end = getPropertyCoords(req);
  const entry = guardEntry || dispatchNearestOnlineGuardEntry(req);
  const start = entry?.coords || null;
  if (!start || !end) return null;
  return dispatchRouteForPoints(start, end);
}
function scheduleDispatchRoutePrep() {
  if (state.role !== 'admin') return;
  if (!['dashboard','dispatch-board','live-gps','pending-dispatch'].includes(state.view)) return;
  dispatchMapOnlineGuards().forEach(entry => {
    if (!entry.request || !entry.coords) return;
    const end = getPropertyCoords(entry.request);
    if (end) ensureDispatchRoute(entry.coords, end);
  });
  const reqs = state.view === 'pending-dispatch'
    ? [selectedPendingRequest()].filter(Boolean)
    : pendingDispatchRequests().slice(0, 2);
  reqs.forEach(req => {
    const entry = dispatchNearestOnlineGuardEntry(req);
    const end = getPropertyCoords(req);
    if (entry?.coords && end) ensureDispatchRoute(entry.coords, end);
  });
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
  if (state.role === 'admin' && ['dashboard','dispatch-board','live-gps'].includes(state.view)) {
    const propertyEntries = dispatchMapPropertyEntries();
    const guardEntries = dispatchMapOnlineGuards();
    if (type === 'guard' && !guardEntries.length) return;
    if (type === 'property' && !propertyEntries.length) return;
    if (type === 'guard') {
      liveGps.dispatchSelectedGuardId = propertyId || liveGps.dispatchSelectedGuardId || String(guardEntries[0]?.guard?.id || '');
    } else if (type === 'property') {
      liveGps.dispatchSelectedPropertyId = propertyId || liveGps.dispatchSelectedPropertyId || String(propertyEntries[0]?.property?.id || '');
    }
    liveGps.selectedMapCard = type;
    updateDispatchMapCardOnly();
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
  if (state.role === 'admin' && ['dashboard','dispatch-board','live-gps'].includes(state.view)) {
    document.querySelectorAll('.dispatch-leaflet-wrap .guard302-live-card').forEach(el => el.remove());
    return;
  }
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
  return `<section class="panel panel-pad client-request-summary-card" data-live-request-summary><div class="panel-head"><div><h2>Request Summary</h2></div></div><div class="client-request-summary-list command"><span>Type</span><strong data-summary="type">${esc(cfg.label)}</strong><span>Priority</span><strong data-summary="priority"><em class="mockup-priority normal">Normal</em></strong><span>Property</span><strong data-summary="property">${esc(property ? propertyDisplayName(property) : 'Choose property')}</strong><span>When</span><strong data-summary="when">${esc(when)}</strong><span>Duration</span><strong data-summary="duration">60 minutes (est.)</strong><span>Services</span><strong class="summary-icons" data-summary="services"><i title="Check doors">▥</i><i title="Check perimeter">◇</i><i title="Check windows">▦</i><i title="Photo proof">▣</i></strong><span>Special Instructions</span><strong data-summary="instructions">No</strong><span>Reference Upload</span><strong data-summary="reference">No file selected</strong></div></section>`;
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



function settingsProfileName() {
  return state.profile?.display_name || state.profile?.name || (state.profile?.email ? String(state.profile.email).split('@')[0] : '') || roleLabel(state.role);
}
function settingsProfileEmail() {
  return state.profile?.email || activeGuardEmail() || 'user@example.com';
}
function settingsProfileInitials() {
  return initials(settingsProfileName());
}
function settingsCompanyName() {
  if (state.role === 'client') return state.clients[0]?.company_name || state.clients[0]?.business_name || state.profile?.company_name || 'Client Property Group';
  if (state.role === 'guard') return 'Co Pilot Security Guard Team';
  return 'Co Pilot Security Operations';
}
function settingsPhone() {
  return state.profile?.phone || state.profile?.phone_number || state.clients[0]?.phone || '(702) 555-0198';
}
function settingsMemberSince() {
  return fmtDate(state.profile?.created_at || state.clients[0]?.created_at || state.guards[0]?.created_at || new Date().toISOString());
}
function settingsAccountId() {
  const raw = state.profile?.id || state.profile?.auth_user_id || state.clients[0]?.id || state.guards[0]?.id || '0001257';
  return `${roleLabel(state.role).slice(0,3).toUpperCase()}-${String(raw).slice(0,8).toUpperCase()}`;
}
function settingsPhotoUrl() {
  return state.profile?.photo_url || state.profile?.avatar_url || state.profile?.profile_photo_url || getGuardPhotoUrl() || '';
}
function settingsTabs() {
  const tabs = [
    ['profile','♙','Profile'],
    ['company','▦','Company'],
    ['notifications','♧','Notifications'],
    ['security','◈','Security'],
    ['billing','▣','Billing'],
    ['integrations','⌘','Integrations']
  ];
  return `<nav class="settings-tabs">${tabs.map(([id, icon, label]) => `<button type="button" class="${state.settingsTab === id ? 'active' : ''}" data-settings-tab="${esc(id)}"><span>${esc(icon)}</span>${esc(label)}</button>`).join('')}</nav>`;
}
function settingsProfileContent() {
  const photo = settingsPhotoUrl();
  return `<div class="settings-main-stack">
    <section class="panel panel-pad settings-profile-card">
      <div class="settings-section-head"><div><h2>Profile Information</h2><p>Update your personal information and how we contact you.</p></div><button class="primary-button" data-action="save-settings">Save Changes</button></div>
      <div class="settings-profile-grid">
        <div class="settings-form-grid">
          <label>Full Name<input type="text" value="${esc(settingsProfileName())}" placeholder="Full name"></label>
          <label>Job Title<input type="text" value="${esc(state.role === 'client' ? 'Property Manager' : roleLabel(state.role))}" placeholder="Job title"></label>
          <label>Email Address<input type="email" value="${esc(settingsProfileEmail())}" placeholder="email@example.com"></label>
          <label>Preferred Contact Method<select><option>Email</option><option>SMS</option><option>Phone</option></select></label>
          <label>Phone Number<input type="tel" value="${esc(settingsPhone())}" placeholder="Phone number"></label>
          <label>Secondary Phone (Optional)<input type="tel" value="" placeholder="Optional secondary phone"></label>
          <label>Time Zone<select><option>(GMT-07:00) Pacific Time (US & Canada)</option><option>(GMT-08:00) Alaska</option><option>(GMT-06:00) Mountain Time</option><option>(GMT-05:00) Central Time</option><option>(GMT-04:00) Eastern Time</option></select></label>
          <label>Language<select><option>English (US)</option><option>Spanish</option></select></label>
        </div>
        <aside class="settings-photo-panel">
          <p>Profile Photo</p>
          <div class="settings-avatar" data-settings-photo-preview>${photo ? `<img src="${esc(photo)}" alt="${esc(settingsProfileName())}">` : `<span>${esc(settingsProfileInitials())}</span>`}<em>📷</em></div>
          <label class="settings-upload-button"><input type="file" accept="image/*" data-settings-photo-file><strong>Upload Photo</strong></label>
          <small>JPG, PNG up to 2MB. Device upload only.</small>
        </aside>
      </div>
    </section>
    <section class="panel panel-pad settings-password-card">
      <div class="settings-section-head"><div><h2>Change Password</h2><p>Ensure your account is using a strong password.</p></div></div>
      <div class="settings-password-grid"><label>Current Password<div><input type="password" placeholder="Enter current password"><span>⊙</span></div></label><label>New Password<div><input type="password" placeholder="Enter new password"><span>⊙</span></div></label><label>Confirm New Password<div><input type="password" placeholder="Confirm new password"><span>⊙</span></div></label><button class="primary-button" data-action="update-settings-password">Update Password</button></div>
    </section>
    <section class="panel panel-pad settings-comm-card">
      <div class="settings-section-head"><div><h2>Communication Preferences</h2><p>Choose what updates and alerts you want to receive.</p></div></div>
      <div class="settings-pref-grid">
        ${settingsPrefCard('♧','Patrol Updates','Receive updates when a patrol is started, completed, or canceled.', true)}
        ${settingsPrefCard('✉','Report Notifications','Get notified when new reports are ready to view.', true)}
        ${settingsPrefCard('☵','Message Alerts','Receive alerts for new messages from dispatch.', true)}
        ${settingsPrefCard('⚠','Security Alerts','Important security alerts and incident notifications.', false)}
        ${settingsPrefCard('▦','Scheduled Reminders','Reminders for upcoming patrols and schedules.', true)}
        ${settingsPrefCard('📣','Marketing & News','Product updates, tips, and promotional offers.', false)}
      </div>
    </section>
  </div>`;
}
function settingsPrefCard(icon, title, text, checked) {
  return `<label class="settings-pref-card"><input type="checkbox" ${checked ? 'checked' : ''}><i>${esc(icon)}</i><span><strong>${esc(title)}</strong><small>${esc(text)}</small></span></label>`;
}
function settingsPlaceholderContent(kind = 'company') {
  const data = {
    company: ['Company Information', 'Manage company name, business contact details, account address, and linked property ownership.', 'Edit Company Info'],
    notifications: ['Notification Preferences', 'Control patrol alerts, message alerts, report notifications, and incident escalation preferences.', 'Save Notification Settings'],
    security: ['Security Settings', 'Manage passwords, two-factor authentication, session timeouts, and login alerts.', 'Update Security'],
    billing: ['Payment & Billing', 'Manage invoices, billing contacts, payment methods, subscription plan, and export receipts.', 'Open Billing Center'],
    integrations: ['Integrations', 'Connect dispatch tools, API keys, webhooks, and future third-party security integrations.', 'Manage Integrations']
  }[kind] || ['Settings', 'Manage account settings.', 'Save'];
  return `<div class="settings-main-stack"><section class="panel panel-pad settings-placeholder-card"><div class="settings-section-head"><div><h2>${esc(data[0])}</h2><p>${esc(data[1])}</p></div><button class="primary-button" data-action="save-settings">${esc(data[2])}</button></div><div class="settings-placeholder-grid">${['Account Details','Permissions','Preferences','Audit Trail'].map((label, idx) => `<article><i>${['▦','◈','☰','☷'][idx]}</i><strong>${esc(label)}</strong><small>${esc(data[1])}</small></article>`).join('')}</div></section></div>`;
}
function settingsMainContent() {
  if (state.settingsTab === 'profile') return settingsProfileContent();
  return settingsPlaceholderContent(state.settingsTab || 'company');
}
function settingsAccountSummary() {
  return `<section class="panel panel-pad settings-rail-card"><h2>Account Summary</h2><div class="settings-meta-list"><span>Account Type</span><strong>${esc(roleLabel(state.role))}</strong><span>Status</span><strong class="green-dot"><i></i>Active</strong><span>Member Since</span><strong>${esc(settingsMemberSince())}</strong><span>Last Login</span><strong>${esc(fmtDate(new Date().toISOString()))}</strong></div><button class="ghost-button wide" data-action="settings-login-history">View Login History <span>↗</span></button></section>`;
}
function settingsCompanyCard() {
  const firstProperty = state.properties[0];
  return `<section class="panel panel-pad settings-rail-card"><h2>Company Information</h2><div class="settings-company-mini"><i>▦</i><div><strong>${esc(settingsCompanyName())}</strong><small>${esc(firstProperty ? propertyDisplayAddress(firstProperty) : 'Business address not saved')}</small><small>${esc(settingsPhone())}</small></div></div><button class="ghost-button wide" data-settings-tab="company">Edit Company Info</button></section>`;
}
function settingsPreferencesCard() {
  return `<section class="panel panel-pad settings-rail-card"><h2>Preferences</h2><div class="settings-meta-list"><span>Date Format</span><strong>MM/DD/YYYY</strong><span>Time Format</span><strong>12 Hour (AM/PM)</strong><span>Currency</span><strong>USD ($)</strong><span>Distance Unit</span><strong>Miles</strong></div><button class="ghost-button wide" data-settings-tab="profile">Edit Preferences</button></section>`;
}
function settingsQuickActions() {
  const actions = [
    ['Manage Users','guards','♙'],
    ['View API Keys','settings','⌘'],
    ['Download Data','settings','⇩'],
    ['Delete Account','settings','🗑']
  ];
  return `<section class="panel panel-pad settings-rail-card"><h2>Quick Actions</h2><div class="settings-quick-list">${actions.map(([label, view, icon], idx) => `<button type="button" class="${idx === 3 ? 'danger' : ''}" ${idx < 2 ? `data-view="${esc(view)}"` : 'data-action="settings-quick-action"'}><span>${esc(icon)}</span>${esc(label)}<em>›</em></button>`).join('')}</div></section>`;
}
function settingsView() {
  return `<div class="dashboard settings-shell">
    <header class="dashboard-header"><div class="title-block"><h1>Settings</h1><p>Manage your account, company, notifications, and preferences.</p></div><div class="header-actions"><span class="system-pill"><i></i>System Operational</span><button class="header-button">?</button></div></header>
    ${settingsTabs()}
    <section class="settings-layout"><main>${settingsMainContent()}</main><aside class="settings-rail">${settingsAccountSummary()}${settingsCompanyCard()}${settingsPreferencesCard()}${settingsQuickActions()}</aside></section>
  </div>`;
}


function clientReportSourceRows() {
  const fromReports = (state.patrolReports || []).map(report => {
    const req = report.request_id ? requestById(report.request_id) : null;
    return {
      id: report.id || `report-${report.request_id || Math.random()}`,
      report,
      req,
      reportNumber: report.report_number || report.reference_id || `RPT-${String(report.id || report.request_id || '').slice(0, 8)}`,
      title: report.title || report.name || (req ? `${propertyLabel(req)} Patrol Report` : 'Patrol Report'),
      description: report.summary || report.notes || report.final_notes || report.details || (req?.instructions || 'Released patrol report.'),
      status: report.status || (report.released_at ? 'completed' : 'pending_review'),
      createdAt: report.released_at || report.created_at || req?.updated_at || req?.created_at,
      propertyId: req?.property_id || report.property_id || '',
      propertyName: req ? propertyLabel(req) : report.property_name || 'Property',
      propertyAddress: req ? propertyAddress(req) : report.property_address || '',
      type: req?.patrol_type || report.patrol_type || report.type || 'Patrol',
      guardName: req ? requestGuardName(req) : report.guard_name || 'Unassigned',
      requestId: report.request_id || req?.id || '',
      proofCount: report.proof_count || (req ? proofForRequest(req.id).length : 0),
      url: report.public_url || report.file_url || report.url || report.pdf_url || ''
    };
  });

  const reportReqIds = new Set(fromReports.map(row => String(row.requestId || '')).filter(Boolean));
  const fromCompleted = completedRequests()
    .filter(req => !reportReqIds.has(String(req.id)))
    .map(req => ({
      id: `completed-${req.id}`,
      report: null,
      req,
      reportNumber: `RPT-${String(req.id || '').slice(0, 8)}`,
      title: `${propertyLabel(req)} Final Patrol Report`,
      description: req.instructions || 'Completed patrol report ready for review.',
      status: 'completed',
      createdAt: req.completed_at || req.updated_at || req.created_at,
      propertyId: req.property_id || '',
      propertyName: propertyLabel(req),
      propertyAddress: propertyAddress(req),
      type: req.patrol_type || req.schedule_type || 'Patrol',
      guardName: requestGuardName(req),
      requestId: req.id,
      proofCount: proofForRequest(req.id).length,
      url: ''
    }));

  return [...fromReports, ...fromCompleted].sort((a,b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}
function clientReportTypeLabel(value = '') {
  const v = String(value || '').toLowerCase();
  if (v.includes('immediate')) return 'Immediate Patrol';
  if (v.includes('vacation')) return 'Vacation Watch';
  if (v.includes('recurring')) return 'Recurring Patrol';
  if (v.includes('scheduled')) return 'Scheduled Patrol';
  return statusText(value || 'Patrol');
}
function clientReportTypeIcon(value = '') {
  const label = clientReportTypeLabel(value).toLowerCase();
  if (label.includes('immediate')) return 'ϟ';
  if (label.includes('vacation')) return '▣';
  if (label.includes('recurring')) return '↻';
  if (label.includes('scheduled')) return '▦';
  return '▤';
}
function clientReportStatus(row = {}) {
  const raw = String(row.status || '').toLowerCase();
  if (raw.includes('attention') || raw.includes('incident') || raw.includes('flag')) return 'attention';
  if (raw.includes('pending') || raw.includes('review')) return 'pending_review';
  if (raw.includes('progress')) return 'in_progress';
  if (raw.includes('complete') || raw.includes('released') || raw.includes('approved')) return 'completed';
  return 'completed';
}
function clientReportStatusLabel(status = '') {
  if (status === 'pending_review') return 'Pending Review';
  if (status === 'in_progress') return 'In Progress';
  if (status === 'attention') return 'Attention';
  return 'Completed';
}
function filteredClientReports() {
  let rows = clientReportSourceRows();
  const q = String(state.clientReportSearch || '').trim().toLowerCase();
  if (q) rows = rows.filter(row => [row.reportNumber, row.title, row.description, row.propertyName, row.propertyAddress, row.guardName, clientReportTypeLabel(row.type)].join(' ').toLowerCase().includes(q));
  if (state.clientReportStatusFilter && state.clientReportStatusFilter !== 'all') rows = rows.filter(row => clientReportStatus(row) === state.clientReportStatusFilter);
  if (state.clientReportPropertyFilter && state.clientReportPropertyFilter !== 'all') rows = rows.filter(row => String(row.propertyId) === String(state.clientReportPropertyFilter));
  return rows;
}
function clientReportCounts() {
  const rows = clientReportSourceRows();
  const total = rows.length;
  const completed = rows.filter(row => clientReportStatus(row) === 'completed').length;
  const pending = rows.filter(row => clientReportStatus(row) === 'pending_review').length;
  const attention = rows.filter(row => clientReportStatus(row) === 'attention').length;
  const now = new Date();
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const thisMonth = rows.filter(row => new Date(row.createdAt || 0).getTime() >= startMonth).length;
  return { total, completed, pending, attention, thisMonth };
}
function clientReportKpi(icon, label, value, sub, tone = 'blue') {
  return `<article class="client-report-kpi ${esc(tone)}"><div class="icon">${esc(icon)}</div><div><span>${esc(label)}</span><strong>${esc(value)}</strong><small>${esc(sub)}</small></div></article>`;
}
function clientReportPropertyOptions() {
  const rows = clientReportSourceRows();
  const ids = new Set(rows.map(r => String(r.propertyId || '')).filter(Boolean));
  const props = (state.properties || []).filter(p => ids.has(String(p.id)));
  return `<option value="all">All Properties</option>${props.map(p => `<option value="${esc(p.id)}" ${String(state.clientReportPropertyFilter) === String(p.id) ? 'selected' : ''}>${esc(propertyDisplayName(p))}</option>`).join('')}`;
}
function clientReportStatusChip(row = {}) {
  const status = clientReportStatus(row);
  return `<span class="report-status-chip ${esc(status)}">${esc(clientReportStatusLabel(status))}</span>`;
}
function clientReportImage(row = {}) {
  const p = propertyById(row.propertyId);
  const img = propertyImageValue(p);
  if (img) return `<img src="${esc(img)}" alt="${esc(row.propertyName)}">`;
  return `<span>${esc(initials(row.propertyName || 'Report'))}</span>`;
}
function clientReportOfficerAvatar(row = {}) {
  const guard = state.guards.find(g => (g.name || g.display_name || g.email) === row.guardName) || {};
  const img = guard.photo_url || guard.avatar_url || guard.profile_photo_url || '';
  if (img) return `<img src="${esc(img)}" alt="${esc(row.guardName)}">`;
  return `<span>${esc(initials(row.guardName || 'G'))}</span>`;
}
function clientReportRow(row = {}) {
  return `<div class="client-report-row">
    <div class="report-main"><div class="report-thumb">${clientReportImage(row)}</div><div><strong>${esc(row.reportNumber)}</strong><small>${esc(row.description)}</small></div></div>
    <div class="report-property"><strong>${esc(row.propertyName)}</strong><small>${esc(row.propertyAddress || 'Address unavailable')}</small></div>
    <div class="report-type"><i>${esc(clientReportTypeIcon(row.type))}</i><span>${esc(clientReportTypeLabel(row.type))}</span></div>
    <div class="report-date"><strong>${esc(fmtDate(row.createdAt))}</strong><small>${esc(fmtTime(row.createdAt))}</small></div>
    <div>${clientReportStatusChip(row)}</div>
    <div class="report-officer"><div>${clientReportOfficerAvatar(row)}</div><span>${esc(row.guardName)}</span></div>
    <div class="report-actions"><button type="button" data-action="view-client-report" data-report-id="${esc(row.id)}" title="View report">⊙</button><button type="button" data-action="download-client-report" data-report-id="${esc(row.id)}" title="Download report">⇩</button></div>
  </div>`;
}
function clientReportSummaryCard() {
  const counts = clientReportCounts();
  const total = counts.total || 1;
  const completedPct = Math.round((counts.completed / total) * 100);
  const pendingPct = Math.round((counts.pending / total) * 100);
  const attentionPct = Math.round((counts.attention / total) * 100);
  return `<section class="panel panel-pad report-summary-card"><div class="panel-head"><div><h2>Report Summary</h2></div></div><div class="report-donut-wrap"><div class="report-donut" style="--completed:${completedPct};--pending:${pendingPct};--attention:${attentionPct};"></div><div class="report-donut-legend"><span><i class="green"></i>Completed <b>${completedPct}% (${counts.completed})</b></span><span><i class="yellow"></i>Pending Review <b>${pendingPct}% (${counts.pending})</b></span><span><i class="red"></i>Attention <b>${attentionPct}% (${counts.attention})</b></span></div></div></section>`;
}
function clientReportActivityCard() {
  const rows = clientReportSourceRows().slice(0, 3);
  return `<section class="panel panel-pad report-activity-card"><div class="panel-head"><div><h2>Recent Activity</h2></div></div><div class="report-activity-list">${rows.length ? rows.map(row => `<div><i class="${esc(clientReportStatus(row))}"></i><span><strong>${esc(row.reportNumber)}</strong><small>${esc(clientReportStatusLabel(clientReportStatus(row)))} • ${esc(timeAgo(row.createdAt))}</small></span></div>`).join('') : '<div class="empty">No recent report activity.</div>'}</div><button class="ghost-button wide" type="button" data-action="view-all-report-activity">View All Activity</button></section>`;
}
function clientReportTopPropertiesCard() {
  const map = new Map();
  clientReportSourceRows().forEach(row => {
    const key = row.propertyName || 'Property';
    map.set(key, (map.get(key) || 0) + 1);
  });
  const rows = [...map.entries()].sort((a,b) => b[1]-a[1]).slice(0,5);
  const max = Math.max(1, ...rows.map(r => r[1]));
  return `<section class="panel panel-pad report-top-properties-card"><div class="panel-head"><div><h2>Top Properties</h2></div></div><div class="report-property-bars">${rows.length ? rows.map(([name,count]) => `<div><span>${esc(name)}</span><b><i style="width:${Math.max(10, Math.round((count/max)*100))}%"></i></b><em>${esc(count)}</em></div>`).join('') : '<div class="empty">No property report totals yet.</div>'}</div><button class="ghost-button wide" type="button" data-view="properties">View All Properties</button></section>`;
}
function clientReportsView() {
  const counts = clientReportCounts();
  const rows = filteredClientReports();
  const pageSize = 6;
  const page = Math.max(1, Math.min(state.clientReportPage || 1, Math.max(1, Math.ceil(rows.length / pageSize))));
  state.clientReportPage = page;
  const pageRows = rows.slice((page - 1) * pageSize, page * pageSize);
  const completedPct = counts.total ? Math.round((counts.completed / counts.total) * 100) : 0;
  const pendingPct = counts.total ? Math.round((counts.pending / counts.total) * 100) : 0;
  const attentionPct = counts.total ? Math.round((counts.attention / counts.total) * 100) : 0;
  return `<div class="dashboard client-reports-shell">
    <header class="dashboard-header"><div class="title-block"><h1>Reports</h1><p>View and manage all security reports generated from patrols and activity.</p></div><div class="header-actions"><span class="system-pill"><i></i>System Operational</span><button class="header-button">?</button></div></header>
    <section class="client-report-kpi-row">
      ${clientReportKpi('▤','Total Reports',counts.total,'All time','blue')}
      ${clientReportKpi('✓','Completed',counts.completed,`${completedPct}%`,'green')}
      ${clientReportKpi('◷','Pending Review',counts.pending,`${pendingPct}%`,'yellow')}
      ${clientReportKpi('⚑','Attention',counts.attention,`${attentionPct}%`,'purple')}
      ${clientReportKpi('▣','This Month',counts.thisMonth,'Released this month','orange')}
    </section>
    <section class="client-reports-layout">
      <main class="client-reports-main panel">
        <div class="client-report-toolbar">
          <div class="client-report-search"><span>⌕</span><input type="search" placeholder="Search reports..." value="${esc(state.clientReportSearch)}" data-client-report-search></div>
          <select data-client-report-property-filter>${clientReportPropertyOptions()}</select>
          <select data-client-report-status-filter><option value="all">All Statuses</option><option value="completed" ${state.clientReportStatusFilter === 'completed' ? 'selected' : ''}>Completed</option><option value="pending_review" ${state.clientReportStatusFilter === 'pending_review' ? 'selected' : ''}>Pending Review</option><option value="attention" ${state.clientReportStatusFilter === 'attention' ? 'selected' : ''}>Attention</option><option value="in_progress" ${state.clientReportStatusFilter === 'in_progress' ? 'selected' : ''}>In Progress</option></select>
          <button type="button" class="ghost-button report-date-range">▣ This Month</button>
          <button type="button" class="primary-button" data-action="export-client-reports">⇩ Export</button>
        </div>
        <div class="client-report-table">
          <div class="client-report-head"><span>Report</span><span>Property</span><span>Type</span><span>Date & Time</span><span>Status</span><span>Officer</span><span>Actions</span></div>
          ${pageRows.length ? pageRows.map(clientReportRow).join('') : '<div class="empty">No reports match your filters.</div>'}
        </div>
        <footer class="client-report-footer"><span>Showing ${rows.length ? `${(page - 1) * pageSize + 1} to ${Math.min(page * pageSize, rows.length)}` : '0'} of ${rows.length} reports</span><div class="report-pagination"><button type="button" data-action="client-report-page-prev">‹</button><strong>${esc(page)}</strong><button type="button" data-action="client-report-page-next">›</button></div><label>Rows per page:<select><option>6</option></select></label></footer>
      </main>
      <aside class="client-reports-rail">
        ${clientReportSummaryCard()}
        ${clientReportActivityCard()}
        ${clientReportTopPropertiesCard()}
      </aside>
    </section>
  </div>`;
}


function dispatchBoardKpi(icon, label, value, subtext, tone = 'blue', progress = null) {
  return `<article class="dispatch-board-kpi ${esc(tone)}">
    <div class="dispatch-kpi-icon">${esc(icon)}</div>
    <div class="dispatch-kpi-copy"><span>${esc(label)}</span><strong>${esc(value)}</strong><small>${esc(subtext)}</small></div>
    ${progress !== null ? `<div class="dispatch-kpi-ring" style="--progress:${esc(progress)}"><b>${esc(progress)}%</b></div>` : ''}
  </article>`;
}
function dispatchBoardKpis() {
  const pending = pendingRequests();
  const guards = dispatchMapOnlineGuards();
  const totalGuards = Math.max(1, adminAssignableGuards().length || guards.length || 1);
  const active = activeRequests();
  const approvals = guardApprovals();
  const reports = reportsReady();
  const guardPct = Math.round((guards.length / totalGuards) * 100);
  const activePct = Math.min(100, Math.round((active.length / Math.max(1, state.patrolRequests.length || active.length || 1)) * 100));
  return `<section class="dispatch-board-kpi-row">
    ${dispatchBoardKpi('⏳', 'Pending Dispatch', pending.length, `${pending.filter(r => /high|urgent|emergency/i.test(String(r.priority || ''))).length} urgent • ${pending.length} total`, 'amber')}
    ${dispatchBoardKpi('♙', 'Online Guards', guards.length, `of ${totalGuards} total`, 'green', guardPct)}
    ${dispatchBoardKpi('🛡', 'Active Patrols', active.length, `${active.filter(r => /accepted|assigned/i.test(String(r.status || ''))).length} en route • ${active.filter(r => /in_progress/i.test(String(r.status || ''))).length} on site`, 'blue', activePct)}
    ${dispatchBoardKpi('☑', 'Guard Approvals', approvals.length, 'Pending review', 'purple')}
    ${dispatchBoardKpi('▣', 'Reports Ready', reports.length, 'Ready to view', 'violet')}
  </section>`;
}
function dispatchPriorityBadge(priority = '') {
  const raw = String(priority || 'normal').toLowerCase();
  const label = raw.includes('urgent') || raw.includes('emergency') ? 'Urgent' : raw.includes('high') ? 'High' : raw.includes('medium') ? 'New' : 'Normal';
  const cls = raw.includes('urgent') || raw.includes('emergency') || raw.includes('high') ? 'urgent' : raw.includes('medium') ? 'new' : 'normal';
  return `<span class="dispatch-priority-badge ${esc(cls)}">${esc(label)}</span>`;
}
function dispatchDistanceLabel(req = {}) {
  const distance = req.distance_miles || req.distance || req.eta_distance_miles || '';
  if (distance) return `${Number(distance).toFixed ? Number(distance).toFixed(1) : distance} mi`;
  return '—';
}
function dispatchAssignCard(req = {}) {
  const guards = dispatchMapOnlineGuards().map(entry => entry.guard);
  const guardOptions = guards.map(g => `<option value="${esc(g.id)}">${esc(adminGuardOptionLabel(g))}</option>`).join('');
  return `<article class="dispatch-assign-card">
    <div class="dispatch-assign-top">${dispatchPriorityBadge(req.priority)}<small>${esc(timeAgo(req.created_at))}</small></div>
    <h3>${esc(requestTitle(req))}</h3>
    <p>${esc(propertyAddress(req))}</p>
    <div class="dispatch-assign-meta"><span>• ${esc(statusText(req.priority || 'Normal'))}</span><span>⌖ ${esc(dispatchDistanceLabel(req))}</span></div>
    <div class="dispatch-assign-actions">
      <select data-assign-guard="${esc(req.id)}">${guardOptions || '<option value="">No online guards</option>'}</select>
      <button type="button" data-action="admin-assign-now" data-request-id="${esc(req.id)}" ${guards.length ? '' : 'disabled'}>Assign</button>
      <button type="button" data-view="pending-dispatch">⋮</button>
    </div>
  </article>`;
}
function dispatchAssignNowBoard() {
  const pending = pendingRequests();
  const rows = pending.slice(0, 2);
  return `<section class="dispatch-board-panel dispatch-assign-now">
    <div class="dispatch-panel-head"><div><h2>Assign Now <b>${esc(pending.length)}</b></h2><p>Pending patrol requests requiring assignment</p></div></div>
    <div class="dispatch-assign-list">${rows.length ? rows.map(dispatchAssignCard).join('') : `<div class="dispatch-empty-state"><strong>No pending requests.</strong><span>Client patrol requests will appear here with an Assign shortcut.</span></div>`}</div>
    <button type="button" class="dispatch-link-button" data-view="pending-dispatch">View all pending (${esc(pending.length)}) →</button>
  </section>`;
}
function dispatchQueueItem(req = {}) {
  return `<div class="dispatch-queue-item"><strong>${esc(requestTitle(req))}</strong><small>${esc(fmtTime(req.scheduled_for || req.requested_for || req.scheduled_at || req.created_at))}</small><span>${esc(propertyLabel(req))}</span></div>`;
}
function dispatchScheduledQueuePanel() {
  const rows = scheduledRequests().slice(0, 3);
  return `<section class="dispatch-board-panel dispatch-mini-panel">
    <div class="dispatch-panel-head compact"><h2>Scheduled Queue <b>${esc(scheduledRequests().length)}</b></h2></div>
    <div class="dispatch-mini-list">${rows.length ? rows.map(dispatchQueueItem).join('') : '<div class="dispatch-empty-line">No scheduled patrols.</div>'}</div>
    <button type="button" class="dispatch-link-button" data-view="scheduled-queue">View full schedule →</button>
  </section>`;
}
function dispatchProofReviewPanel() {
  const rows = proofWaiting().slice(0, 3);
  return `<section class="dispatch-board-panel dispatch-mini-panel">
    <div class="dispatch-panel-head compact"><h2>Proof Waiting Review <b>${esc(proofWaiting().length)}</b></h2></div>
    <div class="dispatch-mini-list">${rows.length ? rows.map(item => `<div class="dispatch-queue-item"><strong>${esc(item.file_name || item.title || 'Proof Upload')}</strong><small>${esc(timeAgo(item.created_at || item.uploaded_at))}</small><span>${esc(item.note || item.file_type || 'Photo / video proof')}</span></div>`).join('') : '<div class="dispatch-empty-line">No proof waiting for review.</div>'}</div>
    <button type="button" class="dispatch-link-button" data-view="proof-review">Go to Proof Review →</button>
  </section>`;
}
function dispatchBoardMapPanel() {
  return `<section class="dispatch-board-panel dispatch-board-map-panel">
    <div class="dispatch-panel-head"><div><h2>Dispatch Command Map <span class="dispatch-live-pill">● Live</span></h2></div><div class="dispatch-map-actions"><button type="button" data-action="dispatch-map-default">⌖ Default</button><button type="button" data-view="live-gps">⛶</button></div></div>
    ${mapArea()}
  </section>`;
}
function dispatchActivityIcon(item = {}) {
  const text = String(item.title || item.event_type || item.message || '').toLowerCase();
  if (/complete|done|closed/.test(text)) return '✓';
  if (/route|way|gps|en route/.test(text)) return '⌖';
  if (/request|created|pending/.test(text)) return '!';
  if (/report/.test(text)) return '▣';
  return '•';
}
function dispatchRecentActivityPanel() {
  const rows = state.patrolActivity.slice(0, 5);
  return `<section class="dispatch-board-panel dispatch-activity-panel">
    <div class="dispatch-panel-head"><div><h2>Recent Activity</h2></div><button type="button" data-view="activity-log">View all</button></div>
    <div class="dispatch-activity-table">
      <div class="dispatch-activity-head"><span>Event</span><span>Details</span><span>By</span><span>Time</span></div>
      ${rows.length ? rows.map(item => {
        const req = requestById(item.request_id) || {};
        return `<div class="dispatch-activity-row"><strong><i>${esc(dispatchActivityIcon(item))}</i>${esc(item.title || item.event_type || 'Activity')}</strong><span>${esc(item.details || item.message || propertyLabel(req))}</span><span>${esc(requestGuardName(req) || requestClientName(req) || 'System')}</span><span>${esc(fmtTime(item.created_at))}</span></div>`;
      }).join('') : `<div class="dispatch-activity-row"><strong><i>✓</i>Dashboard ready</strong><span>Dispatch command center is online.</span><span>System</span><span>Now</span></div>`}
    </div>
    <button type="button" class="dispatch-link-button" data-view="activity-log">View all activity →</button>
  </section>`;
}
function dispatchMessagesPanel() {
  const rows = state.messageThreads.slice(0, 3);
  return `<section class="dispatch-board-panel dispatch-rail-panel">
    <div class="dispatch-panel-head"><div><h2>Messages</h2></div><button type="button" data-view="messages">View all</button></div>
    <div class="dispatch-rail-list">${rows.length ? rows.map(t => `<button type="button" data-view="messages" class="dispatch-message-mini"><i>${esc(initials(t.subject || t.title || 'D'))}</i><span><strong>${esc(t.subject || t.title || 'Conversation')}</strong><small>${esc(t.last_message_preview || 'No messages yet')}</small></span><em>${esc(fmtTime(t.updated_at || t.created_at))}</em></button>`).join('') : `${feedRow('T','Tony','Arrived at site. Beginning perimeter check.','6:56 AM')}${feedRow('M','Maria','All teams update status before 8 AM.','6:42 AM')}${feedRow('J','Jake','Gate secured. No issues to report.','6:33 AM')}`}</div>
    <button type="button" class="dispatch-link-button" data-view="messages">Go to Messages →</button>
  </section>`;
}
function dispatchNotificationsPanel() {
  const rows = notificationsList().slice(0, 3);
  return `<section class="dispatch-board-panel dispatch-rail-panel">
    <div class="dispatch-panel-head"><div><h2>Notifications</h2></div><button type="button" data-view="notifications">View all</button></div>
    <div class="dispatch-notification-list">${rows.length ? rows.map(n => `<button type="button" data-view="notifications" class="dispatch-notification-mini"><i>${/urgent|alert|alarm/i.test(n._title || n.title || '') ? '!' : '●'}</i><span><strong>${esc(n._title || n.title || 'Notification')}</strong><small>${esc(n._body || n.message || n.details || '')}</small></span><em>${esc(timeAgo(n._created || n.created_at))}</em></button>`).join('') : `<button type="button" data-view="pending-dispatch" class="dispatch-notification-mini"><i>!</i><span><strong>Urgent dispatch request</strong><small>Pending patrol requests need assignment.</small></span><em>Now</em></button><button type="button" data-view="guard-approvals" class="dispatch-notification-mini"><i>♙</i><span><strong>Guard approval pending</strong><small>${esc(guardApprovals().length)} guard applications require review.</small></span><em>Now</em></button><button type="button" data-view="report-builder" class="dispatch-notification-mini"><i>▣</i><span><strong>Reports ready</strong><small>${esc(reportsReady().length)} reports are ready to download.</small></span><em>Now</em></button>`}</div>
    <button type="button" class="dispatch-link-button" data-view="notifications">Go to Notifications →</button>
  </section>`;
}
function dispatchSystemStatusPanel() {
  return `<section class="dispatch-board-panel dispatch-rail-panel">
    <div class="dispatch-panel-head"><div><h2>System Status</h2></div><button type="button">All Systems Normal</button></div>
    <div class="dispatch-system-status">
      <div><i>⌖</i><strong>GPS Tracking</strong><small>Online</small></div>
      <div><i>▤</i><strong>Server</strong><small>Online</small></div>
      <div><i>●</i><strong>Database</strong><small>Healthy</small></div>
      <div><i>♧</i><strong>Notifications</strong><small>Online</small></div>
    </div>
  </section>`;
}
function dispatchQuickActionsPanel() {
  const actions = [
    ['🛡', 'Assign Patrol', 'pending-dispatch'],
    ['⊕', 'Add Dispatch', 'guards'],
    ['📣', 'Broadcast Message', 'messages'],
    ['♙', 'Add Guard', 'guard-approvals'],
    ['▥', 'Add Client', 'clients'],
    ['▣', 'Generate Report', 'report-builder']
  ];
  return `<section class="dispatch-board-panel dispatch-rail-panel">
    <div class="dispatch-panel-head"><div><h2>Quick Actions</h2></div></div>
    <div class="dispatch-quick-grid">${actions.map(([icon,label,view]) => `<button type="button" data-view="${esc(view)}"><i>${esc(icon)}</i><span>${esc(label)}</span></button>`).join('')}</div>
  </section>`;
}
function dispatchBoardView() {
  return `<div class="dashboard dispatch-board-shell">
    <header class="dashboard-header dispatch-board-header">
      <div class="title-block"><h1>Dispatch Board</h1><p>Live command center for patrol operations, approvals, and field visibility.</p></div>
      <div class="header-actions"><span class="system-pill"><i></i>System Operational</span><button class="header-button">⌕</button><button class="header-button">🔔${unreadNotificationsCount() ? `<b>${esc(unreadNotificationsCount())}</b>` : ''}</button><button class="header-button">✉${unreadMessagesCount() ? `<b>${esc(unreadMessagesCount())}</b>` : ''}</button><button class="header-button">⚙</button></div>
    </header>
    ${dispatchBoardKpis()}
    <section class="dispatch-board-layout">
      <aside class="dispatch-board-left">
        ${dispatchAssignNowBoard()}
        <div class="dispatch-mini-grid">${dispatchScheduledQueuePanel()}${dispatchProofReviewPanel()}</div>
      </aside>
      <main class="dispatch-board-center">
        ${dispatchBoardMapPanel()}
        ${dispatchRecentActivityPanel()}
      </main>
      <aside class="dispatch-board-rail">
        ${dispatchMessagesPanel()}
        ${dispatchNotificationsPanel()}
        ${dispatchSystemStatusPanel()}
        ${dispatchQuickActionsPanel()}
      </aside>
    </section>
  </div>`;
}


function liveGpsKpi(icon, label, value, subtext, tone = 'blue', spark = true) {
  return `<article class="live-gps-kpi ${esc(tone)}">
    <div class="live-gps-kpi-icon">${esc(icon)}</div>
    <div class="live-gps-kpi-copy"><span>${esc(label)}</span><strong>${esc(value)}</strong><small>${esc(subtext)}</small></div>
    ${spark ? `<svg class="live-gps-spark" viewBox="0 0 110 34" aria-hidden="true"><path d="M2 26 C14 19 18 24 28 17 C38 10 45 22 56 14 C66 7 72 14 81 8 C92 2 99 11 108 5"></path></svg>` : ''}
  </article>`;
}
function dispatchLiveGpsKpiRow() {
  const online = dispatchMapOnlineGuards();
  const approved = adminAssignableGuards();
  const active = activeRequests();
  const properties = dispatchMapPropertyEntries();
  const alerts = activeAlertCount();
  const onlineSub = `${online.length} / ${Math.max(approved.length, online.length)} guards online`;
  const activeSub = `${active.length} active of ${Math.max(state.patrolRequests.length, active.length)} requests`;
  const propertySub = `${properties.length} properties mapped`;
  const alertSub = alerts ? 'Require attention' : 'All clear';
  return `<section class="live-gps-kpi-row">
    ${liveGpsKpi('⌖', 'Online Guards', online.length, onlineSub, 'blue')}
    ${liveGpsKpi('🛡', 'Active Patrols', active.length, activeSub, 'green')}
    ${liveGpsKpi('▥', 'Active Properties', properties.length, propertySub, 'purple')}
    ${liveGpsKpi('⚠', 'Alerts', alerts, alertSub, 'red')}
  </section>`;
}
function liveGpsGuardSpeed(entry = {}) {
  const g = entry.guard || {};
  const speed = Number(g.speed_mph ?? g.speed ?? g.current_speed ?? g.gps_speed ?? 0);
  return Number.isFinite(speed) ? Math.max(0, Math.round(speed)) : 0;
}
function liveGpsGuardBadge(guard = {}) {
  return guard.badge_id || guard.unit_id || guard.guard_number || guard.employee_id || String(guard.id || '').slice(0, 8) || 'Guard';
}
function liveGpsGuardCity(entry = {}) {
  const g = entry.guard || {};
  const raw = [g.city, g.current_city, g.location_city, g.state].filter(Boolean).join(', ');
  if (raw) return raw;
  const addr = dispatchGuardGpsAddress(entry);
  if (addr && addr !== 'GPS address unavailable') return addr.split(',').slice(-3, -1).join(', ').trim() || 'Current GPS';
  return 'Current GPS';
}
function liveGpsSelectedGuardCard(entry = {}) {
  if (!entry?.guard) return `<div class="live-gps-selected-map-card empty">Select a blue guard marker or roster row.</div>`;
  const guard = entry.guard;
  const req = entry.request || null;
  const name = guard.name || guard.display_name || guard.email || 'Guard';
  const rank = (readGuardRankMap && readGuardRankMap()[guard.id]) || guard.rank || guard.role_title || 'Guard';
  const address = dispatchGuardGpsAddress(entry);
  const speed = liveGpsGuardSpeed(entry);
  const accuracy = entry.coords?.accuracy || guard.accuracy || guard.gps_accuracy || liveGps.accuracy || '—';
  return `<div class="live-gps-selected-map-card selected-guard">
    <button type="button" data-action="close-map-card">×</button>
    <div class="selected-guard-head">${avatar(name, guard.photo_url || guard.avatar_url || guard.image_url || '')}<div><span class="online-dot">● Online</span><h3>${esc(name)}</h3><p>${esc(rank)} ID: ${esc(liveGpsGuardBadge(guard))}</p></div></div>
    <section><h4>Current Location</h4><p>${esc(address)}</p><small>Updated: ${esc(fmtTime(liveGps.lastUpdate || new Date()))}</small></section>
    <div class="live-gps-card-grid"><div><span>Speed</span><strong>${esc(speed)} mph</strong></div><div><span>Accuracy</span><strong>± ${esc(String(Math.round(Number(accuracy)) || accuracy))} ft</strong></div></div>
    <section class="assignment"><h4>Current Assignment</h4><p>${esc(req ? propertyLabel(req) : 'No active assignment')}</p><small>${esc(req ? `ETA: ${liveGps.routeEtaMin ? `${liveGps.routeEtaMin} min` : 'calculating'}` : 'Available for dispatch')}</small></section>
  </div>`;
}
function liveGpsSelectedProperty() {
  const entries = dispatchMapPropertyEntries();
  const selectedId = String(liveGps.dispatchSelectedPropertyId || '');
  const activeReq = activeRequests()[0] || null;
  if (selectedId) return entries.find(entry => String(entry.property.id) === selectedId) || entries[0] || null;
  if (activeReq?.property_id) return entries.find(entry => String(entry.property.id) === String(activeReq.property_id)) || entries[0] || null;
  return entries[0] || null;
}
function liveGpsSelectedPropertyPanel() {
  const entry = liveGpsSelectedProperty();
  if (!entry) return `<section class="panel panel-pad live-selected-property-panel"><div class="empty">No mapped properties yet.</div></section>`;
  const property = entry.property;
  const req = entry.activeReq || activeRequests().find(r => String(r.property_id) === String(property.id)) || null;
  const img = propertyImageValue(property);
  return `<section class="panel panel-pad live-selected-property-panel">
    <div class="panel-head"><div><h2>Selected Property</h2></div><button type="button" data-view="properties">View</button></div>
    <button type="button" class="live-selected-property-card" data-action="select-live-gps-property" data-property-id="${esc(property.id)}">
      <div>${img ? `<img src="${esc(img)}" alt="${esc(propertyDisplayName(property))}">` : `<span>${esc(initials(propertyDisplayName(property)))}</span>`}</div>
      <aside><h3>${esc(propertyDisplayName(property))}</h3>${req ? '<em>Active Patrol</em>' : '<em class="idle">Mapped Property</em>'}<p>Owner: ${esc(dispatchPropertyOwnerName(property))}</p><p>${esc(propertyDisplayAddress(property))}</p>${req ? `<strong>ETA: ${esc(liveGps.routeEtaMin ? `${liveGps.routeEtaMin} min` : 'calculating')}</strong>` : ''}</aside>
    </button>
  </section>`;
}
function liveGpsOnlineGuardRoster() {
  const rows = dispatchMapOnlineGuards();
  return `<section class="panel panel-pad live-guard-roster-panel">
    <div class="panel-head"><div><h2>Online Guard Roster</h2></div><button type="button" data-view="guards">View all</button></div>
    <div class="live-guard-roster-list">${rows.length ? rows.map(entry => {
      const g = entry.guard;
      const name = g.name || g.display_name || g.email || 'Guard';
      const selected = String(liveGps.dispatchSelectedGuardId || '') === String(g.id);
      return `<button type="button" class="${selected ? 'selected' : ''}" data-action="select-live-gps-guard" data-guard-id="${esc(g.id)}">
        ${avatar(name, g.photo_url || g.avatar_url || g.image_url || '')}
        <span><strong>${esc(name)}</strong><small>${esc(liveGpsGuardBadge(g))}</small></span>
        <em>${esc(liveGpsGuardSpeed(entry))} mph<br>${esc(liveGpsGuardCity(entry))}</em>
      </button>`;
    }).join('') : '<div class="empty">No guards are currently online.</div>'}</div>
  </section>`;
}
function buildLiveGpsEvents() {
  const now = Date.now();
  const guardEntries = dispatchMapOnlineGuards();
  const activityEvents = (state.patrolActivity || []).slice(0, 10).map((item, idx) => {
    const req = requestById(item.request_id) || {};
    return {
      id: item.id || `activity-${idx}`,
      created_at: item.created_at || new Date(now - idx * 240000).toISOString(),
      guardName: requestGuardName(req) || item.actor_name || 'System',
      event: item.title || item.event_type || 'Route event',
      location: item.details || item.message || propertyLabel(req) || 'Live GPS',
      status: String(req.status || item.status || 'completed'),
      eta: liveGps.routeEtaMin ? `${liveGps.routeEtaMin} min` : fmtTime(item.created_at)
    };
  });
  const guardEvents = guardEntries.map((entry, idx) => {
    const name = entry.guard.name || entry.guard.display_name || entry.guard.email || 'Guard';
    const req = entry.request;
    return {
      id: `guard-${entry.guard.id}`,
      created_at: liveGps.lastUpdate || new Date(now - idx * 90000).toISOString(),
      guardName: name,
      event: req ? 'En route to destination' : 'Guard is now online',
      location: req ? propertyLabel(req) : dispatchGuardGpsAddress(entry),
      status: req ? String(req.status || 'in_progress') : 'online',
      eta: req && liveGps.routeEtaMin ? `${liveGps.routeEtaMin} min` : 'Live'
    };
  });
  return [...guardEvents, ...activityEvents].sort((a,b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)).slice(0, 12);
}
function statusChipHtml(status = '') {
  const raw = String(status || 'online').toLowerCase();
  const cls = raw.includes('complete') ? 'completed' : raw.includes('progress') || raw.includes('route') || raw.includes('assigned') || raw.includes('accepted') ? 'in-progress' : raw.includes('urgent') || raw.includes('alert') ? 'attention' : 'online';
  return `<span class="live-route-status ${esc(cls)}">${esc(statusText(status || 'Online'))}</span>`;
}
function liveGpsFeedPanel() {
  const events = buildLiveGpsEvents().slice(0, 5);
  return `<section class="panel panel-pad live-gps-feed-panel">
    <div class="panel-head"><div><h2>Live GPS Feed</h2></div><button type="button" data-view="activity-log">View all</button></div>
    <div class="live-gps-feed-list">${events.map(e => `<div class="live-gps-feed-row"><i></i><span><strong>${esc(fmtTime(e.created_at))}</strong><p>${esc(`${e.guardName} ${e.event}`)}</p><small>${esc(e.location)}</small></span></div>`).join('') || '<div class="empty">No live GPS events yet.</div>'}</div>
  </section>`;
}
function liveGpsRouteEventsTable() {
  const events = buildLiveGpsEvents().slice(0, 6);
  return `<section class="panel live-route-events-panel">
    <div class="panel-head"><div><h2>Recent Route Events</h2></div><button type="button" data-view="activity-log">View all</button></div>
    <div class="live-route-events-table">
      <div class="live-route-events-head"><span>Time</span><span>Guard</span><span>Event</span><span>Property / Location</span><span>Status</span><span>ETA / Info</span></div>
      ${events.length ? events.map(e => `<div class="live-route-events-row"><span>${esc(fmtTime(e.created_at))}</span><span>${esc(e.guardName)}</span><span>${esc(e.event)}</span><span>${esc(e.location)}</span><span>${statusChipHtml(e.status)}</span><span>${esc(e.eta || '—')}</span></div>`).join('') : '<div class="empty">No route events yet.</div>'}
    </div>
  </section>`;
}
function liveGpsMapLayersPanel() {
  if (!state.liveGpsLayersOpen) return '';
  const mode = state.liveGpsViewMode || 'default';
  return `<div class="live-gps-layer-popover"><strong>Map Layers</strong><label><input type="radio" name="live_gps_layer" value="default" ${mode === 'default' ? 'checked' : ''}> Default View</label><label><input type="radio" name="live_gps_layer" value="guards" ${mode === 'guards' ? 'checked' : ''}> Guards Only</label><label><input type="radio" name="live_gps_layer" value="properties" ${mode === 'properties' ? 'checked' : ''}> Properties Only</label><label><input type="radio" name="live_gps_layer" value="patrols" ${mode === 'patrols' ? 'checked' : ''}> Active Patrols</label></div>`;
}
function liveGpsMapPanel() {
  return `<section class="panel live-gps-map-panel">
    <div class="live-gps-map-toolbar">
      <button type="button" class="live-sync active" data-action="live-gps-refresh">◉ Live Sync</button>
      <select data-live-gps-view-mode>
        <option value="default" ${(state.liveGpsViewMode || 'default') === 'default' ? 'selected' : ''}>Default View</option>
        <option value="guards" ${state.liveGpsViewMode === 'guards' ? 'selected' : ''}>Guards Only</option>
        <option value="properties" ${state.liveGpsViewMode === 'properties' ? 'selected' : ''}>Properties Only</option>
        <option value="patrols" ${state.liveGpsViewMode === 'patrols' ? 'selected' : ''}>Active Patrols</option>
      </select>
      <button type="button" data-action="live-gps-layers">▱ Layers</button>
      <button type="button" data-action="dispatch-map-default">⌖ Default</button>
      <button type="button" data-action="live-gps-fullscreen">⛶</button>
      ${liveGpsMapLayersPanel()}
    </div>
    <div class="live-gps-map-wrap">${mapArea()}</div>
  </section>`;
}
function dispatchLiveGpsView() {
  return `<div class="dashboard live-gps-shell">
    <header class="dashboard-header live-gps-header">
      <div class="title-block"><h1><i>⌖</i> Live GPS</h1><p>Real-time live tracking of online guards, active patrols, and property locations.</p></div>
      <div class="header-actions"><span class="system-pill"><i></i>System Operational</span><button class="header-button" data-action="live-gps-search">⌕</button><button class="header-button" data-view="settings">⚙</button><button class="header-button" data-view="notifications">🔔${unreadNotificationsCount() ? `<b>${esc(unreadNotificationsCount())}</b>` : ''}</button><button class="header-button" data-view="dispatch-board">☰</button></div>
    </header>
    ${dispatchLiveGpsKpiRow()}
    <section class="live-gps-layout">
      <main class="live-gps-main">
        ${liveGpsMapPanel()}
        ${liveGpsRouteEventsTable()}
      </main>
      <aside class="live-gps-rail">
        ${liveGpsOnlineGuardRoster()}
        ${liveGpsSelectedPropertyPanel()}
        ${liveGpsFeedPanel()}
      </aside>
    </section>
  </div>`;
}


function pendingDispatchRequests() {
  return (state.patrolRequests || []).filter(req => {
    const status = String(req.status || '').toLowerCase();
    return ['pending', 'pending_dispatch', 'requested', 'new', 'unassigned', 'open'].includes(status);
  });
}
function pendingDispatchPriorityValue(req = {}) {
  const raw = String(req.priority || req.priority_level || 'normal').toLowerCase();
  if (/urgent|emergency|high/.test(raw)) return 'high';
  if (/medium|normal/.test(raw)) return raw.includes('medium') ? 'medium' : 'medium';
  if (/low/.test(raw)) return 'low';
  return 'medium';
}
function pendingDispatchPriorityLabel(req = {}) {
  const raw = String(req.priority || req.priority_level || '').toLowerCase();
  if (/urgent|emergency/.test(raw)) return 'Emergency';
  if (/high/.test(raw)) return 'High';
  if (/low/.test(raw)) return 'Low';
  return raw ? statusText(raw) : 'Medium';
}
function pendingPriorityBadge(req = {}) {
  const key = pendingDispatchPriorityValue(req);
  const label = pendingDispatchPriorityLabel(req);
  return `<span class="pending-priority-badge ${esc(key)}">${esc(label)}</span>`;
}
function pendingStatusBadge(req = {}) {
  const raw = String(req.status || 'pending').toLowerCase();
  const label = raw === 'pending_dispatch' ? 'Pending' : statusText(raw || 'Pending');
  return `<span class="pending-status-badge ${esc(raw.replace(/_/g,'-') || 'pending')}">${esc(label)}</span>`;
}
function shortRequestId(id = '') {
  return String(id || '').replace(/^req[_-]?/i, '').slice(0, 10) || 'request';
}
function requestAgeMinutes(req = {}) {
  const base = req.created_at || req.requested_at || req.submitted_at || new Date();
  const created = new Date(base).getTime();
  if (!Number.isFinite(created)) return 0;
  return Math.max(0, Math.floor((Date.now() - created) / 60000));
}
function requestAgeLabel(req = {}) {
  const mins = requestAgeMinutes(req);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  return `${hours}h ${rem}m`;
}
function requestedForLabel(req = {}) {
  const date = req.requested_for || req.scheduled_for || req.scheduled_at || req.created_at;
  if (!date) return 'ASAP';
  const timeText = fmtTime(date);
  const day = new Date(date).toDateString() === new Date().toDateString() ? 'Today' : fmtDate(date);
  return `${day}, ${timeText}`;
}
function pendingDistance(req = {}) {
  const entry = dispatchNearestOnlineGuardEntry(req);
  const route = dispatchRouteForRequestAndGuard(req, entry);
  if (route?.distanceMiles) return `${route.distanceMiles.toFixed(1)} mi`;
  const raw = req.distance_miles || req.distance || req.eta_distance_miles || req.route_distance_miles;
  const n = Number(raw);
  if (Number.isFinite(n) && n > 0) return `${n.toFixed(1)} mi`;
  return '—';
}
function assignedTodayCount() {
  const today = new Date().toDateString();
  return (state.patrolRequests || []).filter(req => {
    const assigned = req.assigned_at || req.updated_at;
    return assigned && new Date(assigned).toDateString() === today && ['assigned','accepted','in_progress','completed'].includes(String(req.status || ''));
  }).length;
}
function pendingDispatchCounts() {
  const rows = pendingDispatchRequests();
  const highPriority = rows.filter(req => pendingDispatchPriorityValue(req) === 'high');
  const slaAtRisk = rows.filter(req => requestAgeMinutes(req) >= 30);
  return {
    totalPending: rows.length,
    highPriority: highPriority.length,
    averageResponse: '18m',
    assignedToday: assignedTodayCount(),
    slaAtRisk: slaAtRisk.length
  };
}
function pendingDispatchKpi(icon, label, value, subtext, tone = 'blue') {
  return `<article class="pending-dispatch-kpi ${esc(tone)}"><div class="pending-kpi-icon">${esc(icon)}</div><div><span>${esc(label)}</span><strong>${esc(value)}</strong><small>${esc(subtext)}</small></div></article>`;
}
function pendingDispatchKpiRow() {
  const c = pendingDispatchCounts();
  return `<section class="pending-dispatch-kpis">
    ${pendingDispatchKpi('♧','Total Pending',c.totalPending,'Needs assignment','blue')}
    ${pendingDispatchKpi('⚠','High Priority',c.highPriority,'Needs fast response','red')}
    ${pendingDispatchKpi('⌁','Average Response',c.averageResponse,'8m improvement','green')}
    ${pendingDispatchKpi('◎','Assigned Today',c.assignedToday,'Today','purple')}
    ${pendingDispatchKpi('☂','SLA At Risk',c.slaAtRisk,'Requires attention','orange')}
  </section>`;
}
function pendingDispatchTab(key, label, count) {
  const active = (state.pendingDispatchPriorityFilter || 'all') === key;
  return `<button type="button" class="${active ? 'active' : ''}" data-pending-tab="${esc(key)}">${esc(label)} <b>${esc(count)}</b></button>`;
}
function pendingPriorityTabs() {
  const rows = pendingDispatchRequests();
  const counts = {
    all: rows.length,
    high: rows.filter(r => pendingDispatchPriorityValue(r) === 'high').length,
    medium: rows.filter(r => pendingDispatchPriorityValue(r) === 'medium').length,
    low: rows.filter(r => pendingDispatchPriorityValue(r) === 'low').length
  };
  return `<div class="pending-priority-tabs">
    ${pendingDispatchTab('all','All Requests',counts.all)}
    ${pendingDispatchTab('high','High Priority',counts.high)}
    ${pendingDispatchTab('medium','Medium Priority',counts.medium)}
    ${pendingDispatchTab('low','Low Priority',counts.low)}
  </div>`;
}
function pendingDispatchClientOptions() {
  const ids = new Set(pendingDispatchRequests().map(req => String(req.client_id || '')).filter(Boolean));
  const rows = (state.clients || []).filter(c => ids.has(String(c.id)));
  return `<option value="all">All Clients</option>${rows.map(c => `<option value="${esc(c.id)}" ${String(state.pendingDispatchFilters.clientId) === String(c.id) ? 'selected' : ''}>${esc(c.name || c.display_name || c.email || 'Client')}</option>`).join('')}`;
}
function pendingDispatchPropertyTypeOptions() {
  const types = [...new Set(pendingDispatchRequests().map(req => propertyTypeLabel(propertyById(req.property_id))).filter(Boolean))];
  return `<option value="all">All Property Types</option>${types.map(type => `<option value="${esc(type)}" ${state.pendingDispatchFilters.propertyType === type ? 'selected' : ''}>${esc(type)}</option>`).join('')}`;
}
function filteredPendingDispatchRequests() {
  let rows = pendingDispatchRequests();
  const q = String(state.pendingDispatchSearch || '').trim().toLowerCase();
  const filters = state.pendingDispatchFilters || {};
  const tab = state.pendingDispatchPriorityFilter || 'all';
  if (tab !== 'all') rows = rows.filter(req => pendingDispatchPriorityValue(req) === tab);
  if (q) {
    rows = rows.filter(req => [requestTitle(req), propertyLabel(req), propertyAddress(req), requestClientName(req), req.id, req.request_number].join(' ').toLowerCase().includes(q));
  }
  if (filters.priority && filters.priority !== 'all') rows = rows.filter(req => pendingDispatchPriorityValue(req) === filters.priority);
  if (filters.propertyType && filters.propertyType !== 'all') rows = rows.filter(req => propertyTypeLabel(propertyById(req.property_id)) === filters.propertyType);
  if (filters.clientId && filters.clientId !== 'all') rows = rows.filter(req => String(req.client_id) === String(filters.clientId));
  if (filters.status && filters.status !== 'all') rows = rows.filter(req => String(req.status || '').toLowerCase() === filters.status);
  if (filters.requestedTime && filters.requestedTime !== 'all') {
    const now = Date.now();
    rows = rows.filter(req => {
      const when = new Date(req.requested_for || req.scheduled_for || req.scheduled_at || req.created_at || now).getTime();
      if (!Number.isFinite(when)) return true;
      if (filters.requestedTime === 'asap') return !req.requested_for && !req.scheduled_for && !req.scheduled_at;
      if (filters.requestedTime === 'today') return new Date(when).toDateString() === new Date().toDateString();
      if (filters.requestedTime === 'week') return when <= now + 7 * 86400000;
      return true;
    });
  }
  return rows.sort((a,b) => {
    const pa = pendingDispatchPriorityValue(a) === 'high' ? 0 : pendingDispatchPriorityValue(a) === 'medium' ? 1 : 2;
    const pb = pendingDispatchPriorityValue(b) === 'high' ? 0 : pendingDispatchPriorityValue(b) === 'medium' ? 1 : 2;
    if (pa !== pb) return pa - pb;
    return new Date(a.created_at || 0) - new Date(b.created_at || 0);
  });
}
function selectedPendingRequest() {
  const rows = filteredPendingDispatchRequests();
  return rows.find(req => String(req.id) === String(state.selectedPendingRequestId)) || rows[0] || null;
}
function pendingPropertyIcon(req = {}) {
  const type = propertyTypeLabel(propertyById(req.property_id)).toLowerCase();
  if (/school/.test(type)) return '🎓';
  if (/warehouse|industrial/.test(type)) return '🏭';
  if (/retail|store/.test(type)) return '🏬';
  if (/garage|parking/.test(type)) return 'Ⓟ';
  if (/office/.test(type)) return '▥';
  return '⌂';
}
function pendingDispatchToolbar() {
  return `<div class="pending-dispatch-toolbar">
    ${pendingPriorityTabs()}
    <div class="pending-toolbar-actions">
      <button type="button" class="ghost-button" data-action="pending-auto-assign">Auto Assign</button>
      <button type="button" class="primary-button" data-action="pending-assign-selected">Assign Selected</button>
    </div>
  </div>`;
}
function pendingDispatchFilterBar() {
  return `<div class="pending-filter-bar ${state.pendingDispatchFiltersOpen ? '' : 'collapsed'}">
    <select data-pending-filter="priority"><option value="all">All Priorities</option><option value="high" ${state.pendingDispatchFilters.priority === 'high' ? 'selected' : ''}>High Priority</option><option value="medium" ${state.pendingDispatchFilters.priority === 'medium' ? 'selected' : ''}>Medium Priority</option><option value="low" ${state.pendingDispatchFilters.priority === 'low' ? 'selected' : ''}>Low Priority</option></select>
    <select data-pending-filter="propertyType">${pendingDispatchPropertyTypeOptions()}</select>
    <select data-pending-filter="clientId">${pendingDispatchClientOptions()}</select>
    <select data-pending-filter="requestedTime"><option value="all">All Requested Times</option><option value="asap" ${state.pendingDispatchFilters.requestedTime === 'asap' ? 'selected' : ''}>ASAP</option><option value="today" ${state.pendingDispatchFilters.requestedTime === 'today' ? 'selected' : ''}>Today</option><option value="week" ${state.pendingDispatchFilters.requestedTime === 'week' ? 'selected' : ''}>Next 7 Days</option></select>
    <select data-pending-filter="status"><option value="all">All Status</option><option value="pending_dispatch" ${state.pendingDispatchFilters.status === 'pending_dispatch' ? 'selected' : ''}>Pending</option><option value="requested" ${state.pendingDispatchFilters.status === 'requested' ? 'selected' : ''}>Requested</option><option value="new" ${state.pendingDispatchFilters.status === 'new' ? 'selected' : ''}>New</option></select>
    <button type="button" data-action="pending-clear-filters">× Clear Filters</button>
  </div>`;
}
function pendingGuardOptionsForRequest(req = {}) {
  const onlineEntries = dispatchMapOnlineGuards();
  const selectedEntry = dispatchNearestOnlineGuardEntry(req);
  const selectedId = state.pendingDispatchGuardSelections?.[req.id] || selectedEntry?.guard?.id || '';
  return onlineEntries.map(entry => {
    const g = entry.guard;
    const route = dispatchRouteForRequestAndGuard(req, entry);
    const dist = route?.distanceMiles ? ` — ${route.distanceMiles.toFixed(1)} mi / ${route.etaMin || '—'} min` : '';
    return `<option value="${esc(g.id)}" ${String(selectedId) === String(g.id) ? 'selected' : ''}>${esc(adminGuardOptionLabel(g) + dist)}</option>`;
  }).join('');
}
function pendingDispatchRow(req = {}) {
  const selected = String(state.selectedPendingRequestId || '') === String(req.id);
  const checked = (state.pendingDispatchSelectedIds || []).map(String).includes(String(req.id));
  const property = propertyById(req.property_id);
  const onlineGuards = dispatchMapOnlineGuards().map(e => e.guard);
  const guardOptions = pendingGuardOptionsForRequest(req);
  return `<div class="pending-dispatch-row ${selected ? 'selected' : ''}" data-request-id="${esc(req.id)}">
    <label class="pending-check"><input type="checkbox" ${checked ? 'checked' : ''} data-pending-request-check="${esc(req.id)}"></label>
    <div>${pendingPriorityBadge(req)}</div>
    <button type="button" class="pending-request-main" data-action="select-pending-request" data-request-id="${esc(req.id)}"><strong>${esc(requestTitle(req))}</strong><small>#${esc(shortRequestId(req.id))}</small></button>
    <div class="pending-property-cell"><i>${esc(pendingPropertyIcon(req))}</i><span><strong>${esc(propertyLabel(req))}</strong><small>${esc(requestClientName(req))}</small></span></div>
    <div class="pending-requested-cell"><strong>${esc(requestedForLabel(req))}</strong><small>${esc(fmtDate(req.requested_for || req.scheduled_for || req.created_at))}</small></div>
    <div class="pending-age ${requestAgeMinutes(req) >= 30 ? 'risk' : ''}">${esc(requestAgeLabel(req))}</div>
    <div class="pending-distance">${esc(pendingDistance(req))}</div>
    <div>${pendingStatusBadge(req)}</div>
    <div class="pending-actions"><select data-assign-guard="${esc(req.id)}">${guardOptions || '<option value="">No online guards</option>'}</select><button type="button" data-action="assign-pending-request" data-request-id="${esc(req.id)}" ${onlineGuards.length ? '' : 'disabled'}>Assign</button><button type="button" data-action="pending-request-menu" data-request-id="${esc(req.id)}">⋮</button></div>
  </div>`;
}
function pendingDispatchTable() {
  const rows = filteredPendingDispatchRequests();
  const per = Number(state.pendingDispatchPerPage || 6);
  const maxPage = Math.max(1, Math.ceil(rows.length / per));
  state.pendingDispatchPage = Math.min(Math.max(1, state.pendingDispatchPage || 1), maxPage);
  const start = (state.pendingDispatchPage - 1) * per;
  const pageRows = rows.slice(start, start + per);
  return `<div class="pending-dispatch-table">
    <div class="pending-dispatch-head"><span></span><span>Priority</span><span>Request</span><span>Property / Client</span><span>Requested For</span><span>Age</span><span>Distance</span><span>Status</span><span>Actions</span></div>
    ${pageRows.length ? pageRows.map(pendingDispatchRow).join('') : '<div class="pending-empty-results">No pending dispatch requests match your filters.</div>'}
  </div>`;
}
function pendingDispatchPagination() {
  const rows = filteredPendingDispatchRequests();
  const per = Number(state.pendingDispatchPerPage || 6);
  const maxPage = Math.max(1, Math.ceil(rows.length / per));
  const start = rows.length ? (state.pendingDispatchPage - 1) * per + 1 : 0;
  const end = Math.min(rows.length, (state.pendingDispatchPage || 1) * per);
  return `<footer class="pending-dispatch-footer"><span>Showing ${esc(start)} to ${esc(end)} of ${esc(rows.length)} requests</span><div class="pending-pagination"><button type="button" data-action="pending-page-prev">‹</button><strong>${esc(state.pendingDispatchPage || 1)}</strong><button type="button" data-action="pending-page-next">›</button></div><label><select data-pending-per-page><option value="6" ${per === 6 ? 'selected' : ''}>6 per page</option><option value="10" ${per === 10 ? 'selected' : ''}>10 per page</option><option value="20" ${per === 20 ? 'selected' : ''}>20 per page</option></select></label></footer>`;
}
function pendingRequestMiniMap(req = {}) {
  const end = getPropertyCoords(req);
  const entry = dispatchNearestOnlineGuardEntry(req);
  const start = entry?.coords || null;
  if (!start || !end) {
    return `<div class="pending-mini-map"><div class="mini-road r1"></div><div class="mini-road r2"></div><div class="pending-mini-empty">Waiting for online guard GPS and property coordinates.</div></div>`;
  }
  const route = dispatchRouteForPoints(start, end);
  const points = route?.points?.length >= 2 ? route.points : dispatchRouteFallbackPoints(start, end);
  const bounds = (() => {
    const all = [start, end, ...(points || [])].filter(p => p && Number.isFinite(p.lat) && Number.isFinite(p.lng));
    let minLat = Math.min(...all.map(p => p.lat));
    let maxLat = Math.max(...all.map(p => p.lat));
    let minLng = Math.min(...all.map(p => p.lng));
    let maxLng = Math.max(...all.map(p => p.lng));
    const latPad = Math.max(.002, (maxLat - minLat) * .35);
    const lngPad = Math.max(.002, (maxLng - minLng) * .35);
    return { minLat: minLat - latPad, maxLat: maxLat + latPad, minLng: minLng - lngPad, maxLng: maxLng + lngPad };
  })();
  const gPct = mapPercentForPoint(start.lat, start.lng, bounds);
  const pPct = mapPercentForPoint(end.lat, end.lng, bounds);
  const path = dispatchRouteSvgPath(points, bounds);
  const dist = route?.distanceMiles ? route.distanceMiles.toFixed(1) : '—';
  const eta = route?.etaMin || '—';
  const guardName = entry.guard?.name || entry.guard?.display_name || entry.guard?.email || 'Guard';
  return `<div class="pending-mini-map route-aware">
    <div class="mini-road r1"></div><div class="mini-road r2"></div>
    <svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${esc(path)}"></path></svg>
    <div class="mini-marker property" style="left:${pPct.x.toFixed(2)}%;top:${pPct.y.toFixed(2)}%"></div>
    <div class="mini-marker guard" style="left:${gPct.x.toFixed(2)}%;top:${gPct.y.toFixed(2)}%"></div>
    <span>${esc(guardName)} · ${esc(dist)} mi · ETA ${esc(eta)} min</span>
  </div>`;
}
function pendingRequestDetailsRail() {
  const req = selectedPendingRequest();
  if (!req) return `<aside class="pending-detail-rail"><section class="panel panel-pad pending-request-details"><div class="empty">No pending request selected.</div></section></aside>`;
  const property = propertyById(req.property_id);
  const photo = propertyImageValue(property);
  const onlineGuards = dispatchMapOnlineGuards().map(e => e.guard);
  const guardOptions = pendingGuardOptionsForRequest(req);
  return `<aside class="pending-detail-rail"><section class="panel panel-pad pending-request-details">
    <button type="button" class="pending-rail-close" data-action="clear-selected-pending">×</button>
    ${pendingPriorityBadge(req)}
    <h2>${esc(requestTitle(req))}</h2><p class="pending-request-code">#${esc(shortRequestId(req.id))}</p>
    <div class="pending-detail-photo">${photo ? `<img src="${esc(photo)}" alt="${esc(propertyLabel(req))}">` : `<span>${esc(initials(propertyLabel(req)))}</span>`}</div>
    <div class="pending-address-box"><i>⌖</i><strong>${esc(propertyAddress(req))}</strong><small>${esc((() => { const r = dispatchRouteForRequestAndGuard(req); return r ? `${r.distanceMiles?.toFixed(1) || '—'} mi · ETA ${r.etaMin || '—'} min` : pendingDistance(req); })())} from selected/nearest guard</small></div>
    <dl class="pending-detail-list"><dt>Client</dt><dd>${esc(requestClientName(req))}</dd><dt>Property Type</dt><dd>${esc(propertyTypeLabel(property))}</dd><dt>Requested By</dt><dd>${esc(req.requested_by_name || req.contact_name || requestClientName(req))}</dd><dt>Phone</dt><dd>${esc(req.phone || req.contact_phone || property.phone || '—')}</dd><dt>Requested For</dt><dd>${esc(requestedForLabel(req))}</dd><dt>Special Instructions</dt><dd>${esc(req.instructions || req.special_instructions || 'No special instructions.')}</dd></dl>
    ${pendingRequestMiniMap(req)}
    <select class="pending-rail-guard-select" data-assign-guard="${esc(req.id)}">${guardOptions || '<option value="">No online guards</option>'}</select>
    <button type="button" class="primary-button wide" data-action="assign-pending-request" data-request-id="${esc(req.id)}" ${onlineGuards.length ? '' : 'disabled'}>Assign Guard</button>
    <button type="button" class="ghost-button wide" data-action="view-pending-request-details" data-request-id="${esc(req.id)}">View Full Details ↗</button>
  </section></aside>`;
}
function pendingDispatchHeader() {
  return `<header class="dashboard-header pending-dispatch-header"><div class="title-block"><h1>Pending Dispatch</h1><p>Review and assign incoming patrol requests that need immediate dispatch.</p></div><div class="pending-header-actions"><span class="system-pill"><i></i>System Operational</span><label class="pending-search"><input type="search" placeholder="Search requests..." value="${esc(state.pendingDispatchSearch || '')}" data-pending-search><b>⌕</b></label><button type="button" data-action="pending-toggle-filters">⌁</button><button type="button" data-action="pending-refresh">⟳ Refresh</button></div></header>`;
}
function pendingDispatchView() {
  return `<div class="dashboard pending-dispatch-shell">
    ${pendingDispatchHeader()}
    ${pendingDispatchKpiRow()}
    <section class="pending-dispatch-layout">
      <main class="pending-dispatch-main panel">
        ${pendingDispatchToolbar()}
        ${pendingDispatchFilterBar()}
        ${pendingDispatchTable()}
        ${pendingDispatchPagination()}
      </main>
      ${pendingRequestDetailsRail()}
    </section>
  </div>`;
}
async function assignPendingDispatchRequest(requestId, guardId = '') {
  const req = state.patrolRequests.find(r => String(r.id) === String(requestId));
  if (!req) throw new Error('Pending request not found.');
  let select = document.querySelector(`select[data-assign-guard="${String(requestId).replace(/"/g, '&quot;')}"]`);
  if (select && guardId) select.value = guardId;
  if (!select && guardId) {
    const temp = document.createElement('select');
    temp.dataset.assignGuard = requestId;
    temp.style.display = 'none';
    temp.innerHTML = `<option value="${esc(guardId)}">${esc(guardId)}</option>`;
    document.body.appendChild(temp);
    select = temp;
  }
  await assignPatrolNow(requestId);
  state.selectedPendingRequestId = '';
  state.pendingDispatchSelectedIds = (state.pendingDispatchSelectedIds || []).filter(id => String(id) !== String(requestId));
}
async function autoAssignPendingDispatch() {
  const rows = filteredPendingDispatchRequests();
  const guards = dispatchMapOnlineGuards().map(e => e.guard);
  if (!rows.length) throw new Error('No pending dispatch requests to auto assign.');
  if (!guards.length) throw new Error('No online guards available for auto assignment.');
  await assignPendingDispatchRequest(rows[0].id, guards[0].id);
}
async function assignSelectedPendingDispatch() {
  const selected = state.pendingDispatchSelectedIds || [];
  const rows = selected.length ? filteredPendingDispatchRequests().filter(req => selected.map(String).includes(String(req.id))) : [selectedPendingRequest()].filter(Boolean);
  const guards = dispatchMapOnlineGuards().map(e => e.guard);
  if (!rows.length) throw new Error('Select at least one pending request.');
  if (!guards.length) throw new Error('No online guards available for assignment.');
  for (let i = 0; i < rows.length; i++) await assignPendingDispatchRequest(rows[i].id, guards[i % guards.length].id);
}

function scheduledQueueOverridesKey() {
  const who = state.profile?.id || state.profile?.email || 'admin';
  return `cp_security_scheduled_queue_overrides_${who}`;
}
function readScheduledQueueOverrides() {
  try { return JSON.parse(localStorage.getItem(scheduledQueueOverridesKey()) || '{}') || {}; } catch { return {}; }
}
function writeScheduledQueueOverrides(map = {}) {
  try { localStorage.setItem(scheduledQueueOverridesKey(), JSON.stringify(map)); } catch {}
}
function scheduledOverride(req = {}) {
  const map = { ...readScheduledQueueOverrides(), ...(state.scheduledLocalOverrides || {}) };
  return map[String(req.id || '')] || {};
}
function saveScheduledOverride(requestId, patch = {}) {
  const map = readScheduledQueueOverrides();
  map[String(requestId)] = { ...(map[String(requestId)] || {}), ...patch, updated_at: new Date().toISOString() };
  writeScheduledQueueOverrides(map);
  state.scheduledLocalOverrides = map;
}

function scheduledQueueMetadataFromClientForm(form = {}) {
  const scheduleType = form.schedule_type?.value || 'on_demand';
  const patrolType = form.patrol_type?.value || (scheduleType === 'vacation_watch' ? 'vacation_watch' : scheduleType === 'on_demand' ? 'urgent' : 'standard');
  const date = form.scheduled_date?.value || '';
  const time = form.scheduled_time?.value || '';
  const scheduledFor = (scheduleType === 'scheduled' && date && time) ? `${date}T${time}` : '';
  const startDate = form.schedule_start_date?.value || '';
  const endDate = form.schedule_end_date?.value || '';
  const recurrenceDays = Array.from(form.querySelectorAll?.('input[name="recurrence_days"]:checked') || []).map(input => input.value);
  const recurrencePattern = form.recurrence_pattern?.value || '';
  return {
    schedule_type: scheduleType,
    request_type: scheduleType === 'vacation_watch' ? 'vacation' : scheduleType,
    patrol_type: patrolType,
    scheduled_for: scheduledFor || startDate || '',
    next_run: scheduledFor || startDate || new Date().toISOString(),
    schedule_start_date: startDate || '',
    schedule_end_date: endDate || '',
    end_date: endDate || '',
    recurrence_pattern: recurrencePattern || '',
    recurrence_days: recurrenceDays.join(','),
    recurrence: recurrencePattern || recurrenceDays.join(',') || (scheduleType === 'recurring' ? 'Recurring' : ''),
    schedule_notes: form.schedule_notes?.value?.trim?.() || ''
  };
}
function rememberSubmittedScheduleMetadata(requestId, metadata = {}) {
  if (!requestId) return;
  const type = String(metadata.schedule_type || metadata.request_type || '').toLowerCase();
  if (!/scheduled|recurring|vacation|watch/.test(type) && !metadata.scheduled_for && !metadata.schedule_start_date && !metadata.recurrence) return;
  saveScheduledOverride(requestId, { ...metadata, status: metadata.status || 'scheduled' });
}
function findRecentlySubmittedRequestId(propertyId = '') {
  const rows = (state.patrolRequests || []).filter(req => String(req.property_id || '') === String(propertyId || ''));
  return rows.sort((a,b) => new Date(b.created_at || b.updated_at || 0) - new Date(a.created_at || a.updated_at || 0))[0]?.id || '';
}
function scheduledQueueRows() {
  return scheduledRequests().map(req => ({ ...req, ...(scheduledOverride(req) || {}) }));
}
function scheduleDateValue(req = {}) {
  const override = scheduledOverride(req);
  return override.next_run_at || override.next_run || override.scheduled_for || override.schedule_start_date || override.start_date || req.next_run_at || req.next_run || req.scheduled_for || req.schedule_start_date || req.start_date || req.requested_for || req.scheduled_at || req.created_at || new Date().toISOString();
}
function scheduleDateObj(req = {}) {
  const d = new Date(scheduleDateValue(req));
  return Number.isFinite(d.getTime()) ? d : new Date();
}
function scheduleTypeValue(req = {}) {
  const raw = String(req.request_type || req.schedule_type || req.patrol_type || req.type || scheduledRequestSearchText(req) || '').toLowerCase();
  if (/vacation|vacation_watch|watch/.test(raw)) return 'vacation';
  if (/recurring|repeat|weekly|daily|monthly|weekdays/.test(raw)) return 'recurring';
  if (/scheduled|future|one-time|one time/.test(raw)) return 'scheduled';
  if (/interior/.test(raw)) return 'interior';
  if (/exterior|perimeter/.test(raw)) return 'exterior';
  if (/lock|close/.test(raw)) return 'lockup';
  return 'scheduled';
}
function scheduleTypeLabel(req = {}) {
  const type = scheduleTypeValue(req);
  return ({
    scheduled: 'Scheduled Patrol',
    recurring: 'Recurring Patrol',
    vacation: 'Vacation Watch',
    interior: 'Interior Patrol',
    exterior: 'Exterior Patrol',
    lockup: 'Lockup / Close'
  })[type] || statusText(type || 'Scheduled Patrol');
}
function scheduleRecurrenceLabel(req = {}) {
  const raw = req.recurrence || req.recurrence_pattern || req.recurrence_days || req.recurring_pattern || req.repeat_rule || req.schedule_rule || '';
  if (raw) return String(raw).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const type = scheduleTypeValue(req);
  if (type === 'recurring') return 'Daily';
  if (type === 'vacation') return req.end_date ? `Until ${fmtDate(req.end_date)}` : 'Vacation window';
  const d = scheduleDateObj(req);
  return new Date(d).toDateString() === new Date().toDateString() ? 'One-time today' : 'One-time';
}
function schedulePriorityValue(req = {}) {
  const raw = String(req.priority || req.priority_level || 'normal').toLowerCase();
  if (/critical|emergency/.test(raw)) return 'critical';
  if (/high|urgent/.test(raw)) return 'high';
  if (/low/.test(raw)) return 'low';
  return 'medium';
}
function schedulePriorityBadge(req = {}) {
  const key = schedulePriorityValue(req);
  const label = ({critical:'Critical', high:'High', medium:'Medium', low:'Low'})[key] || 'Medium';
  return `<span class="schedule-priority ${esc(key)}">▲ ${esc(label)}</span>`;
}
function scheduleStatusValue(req = {}) {
  const override = scheduledOverride(req);
  const raw = String(override.status || req.schedule_status || req.status || 'scheduled').toLowerCase();
  if (/pause|hold/.test(raw)) return 'paused';
  if (/complete|done/.test(raw)) return 'completed';
  if (/unassigned|pending_dispatch|pending|new|requested/.test(raw)) return scheduleAssignedGuard(req).id ? 'scheduled' : 'unassigned';
  return 'scheduled';
}
function scheduleStatusBadge(req = {}) {
  const key = scheduleStatusValue(req);
  const label = ({scheduled:'Scheduled', unassigned:'Unassigned', paused:'Paused', completed:'Completed'})[key] || statusText(key);
  return `<span class="schedule-status ${esc(key)}"><i></i>${esc(label)}</span>`;
}
function scheduleId(req = {}) {
  return req.schedule_id || req.request_number || `SCH-${String(req.id || '').replace(/[^a-z0-9]/ig,'').slice(0, 6).toUpperCase() || '0000'}`;
}
function scheduleNextRunLabel(req = {}) {
  const d = scheduleDateObj(req);
  const today = new Date();
  const tomorrow = new Date(Date.now() + 86400000);
  const day = d.toDateString() === today.toDateString() ? 'Today' : d.toDateString() === tomorrow.toDateString() ? 'Tomorrow' : fmtDate(d);
  return `${day}, ${fmtTime(d)}`;
}
function scheduleAssignedGuard(req = {}) {
  const override = scheduledOverride(req);
  const id = override.guard_id || req.guard_id || req.assigned_guard_id || '';
  return guardById(id) || {};
}
function scheduleGuardName(req = {}) {
  const g = scheduleAssignedGuard(req);
  return g.name || g.display_name || req.guard_name || (scheduleStatusValue(req) === 'unassigned' ? 'Unassigned' : 'Unassigned');
}
function scheduledQueueCounts() {
  const rows = scheduledQueueRows();
  const now = Date.now();
  const today = new Date().toDateString();
  const weekEnd = now + 7 * 86400000;
  return {
    total: rows.length,
    today: rows.filter(r => scheduleDateObj(r).toDateString() === today).length,
    week: rows.filter(r => scheduleDateObj(r).getTime() <= weekEnd).length,
    recurring: rows.filter(r => scheduleTypeValue(r) === 'recurring').length,
    unassigned: rows.filter(r => scheduleStatusValue(r) === 'unassigned' || !scheduleAssignedGuard(r).id).length,
    risk: rows.filter(r => (scheduleStatusValue(r) === 'unassigned' && scheduleDateObj(r).getTime() - now < 2 * 3600000) || schedulePriorityValue(r) === 'critical').length,
    completed: rows.filter(r => scheduleStatusValue(r) === 'completed').length
  };
}
function scheduledKpi(icon, label, value, subtext, tone='blue') {
  return `<article class="scheduled-kpi ${esc(tone)}"><div class="scheduled-kpi-icon">${esc(icon)}</div><div><span>${esc(label)}</span><strong>${esc(value)}</strong><small>${esc(subtext)}</small></div></article>`;
}
function scheduledKpiRow() {
  const c = scheduledQueueCounts();
  return `<section class="scheduled-kpi-row">
    ${scheduledKpi('▣','Total Scheduled',c.total,'All upcoming assignments','blue')}
    ${scheduledKpi('◷','Today',c.today,'Scheduled for today','red')}
    ${scheduledKpi('▤','This Week',c.week,'Scheduled this week','blue')}
    ${scheduledKpi('↻','Recurring Routes',c.recurring,'Active recurring schedules','green')}
    ${scheduledKpi('♙','Unassigned',c.unassigned,'Need guard assignment','orange')}
    ${scheduledKpi('⚠','SLA Risk',c.risk,'At risk of breach','red')}
  </section>`;
}
function scheduledTab(key, label, count) {
  const active = (state.scheduledQueueTab || 'all') === key;
  return `<button type="button" class="${active ? 'active' : ''}" data-scheduled-tab="${esc(key)}">${esc(label)} <b>${esc(count)}</b></button>`;
}
function scheduledTabs() {
  const c = scheduledQueueCounts();
  return `<div class="scheduled-tabs">
    ${scheduledTab('all','All Scheduled',c.total)}
    ${scheduledTab('today','Today',c.today)}
    ${scheduledTab('week','This Week',c.week)}
    ${scheduledTab('recurring','Recurring',c.recurring)}
    ${scheduledTab('unassigned','Unassigned',c.unassigned)}
    ${scheduledTab('completed','Completed',c.completed)}
  </div>`;
}
function scheduleClientOptions() {
  const ids = new Set(scheduledQueueRows().map(req => String(req.client_id || '')).filter(Boolean));
  const rows = (state.clients || []).filter(c => ids.has(String(c.id)));
  return `<option value="all">All Clients</option>${rows.map(c => `<option value="${esc(c.id)}" ${String(state.scheduledQueueFilters.clientId) === String(c.id) ? 'selected' : ''}>${esc(c.name || c.display_name || c.email || 'Client')}</option>`).join('')}`;
}
function scheduleGuardOptions(selectedId = '') {
  const guards = adminAssignableGuards();
  return `<option value="all">All Assigned Guards</option>${guards.map(g => `<option value="${esc(g.id)}" ${String(selectedId) === String(g.id) ? 'selected' : ''}>${esc(adminGuardOptionLabel(g))}</option>`).join('')}`;
}
function filteredScheduledQueueRows() {
  let rows = scheduledQueueRows();
  const q = String(state.scheduledQueueSearch || '').trim().toLowerCase();
  const filters = state.scheduledQueueFilters || {};
  const tab = state.scheduledQueueTab || 'all';
  const now = Date.now();
  const today = new Date().toDateString();
  if (tab === 'today') rows = rows.filter(r => scheduleDateObj(r).toDateString() === today);
  if (tab === 'week') rows = rows.filter(r => scheduleDateObj(r).getTime() <= now + 7 * 86400000);
  if (tab === 'recurring') rows = rows.filter(r => scheduleTypeValue(r) === 'recurring');
  if (tab === 'unassigned') rows = rows.filter(r => scheduleStatusValue(r) === 'unassigned' || !scheduleAssignedGuard(r).id);
  if (tab === 'completed') rows = rows.filter(r => scheduleStatusValue(r) === 'completed');
  if (q) rows = rows.filter(r => [scheduleId(r), requestTitle(r), propertyLabel(r), propertyAddress(r), requestClientName(r), scheduleGuardName(r)].join(' ').toLowerCase().includes(q));
  if (filters.priority && filters.priority !== 'all') rows = rows.filter(r => schedulePriorityValue(r) === filters.priority);
  if (filters.propertyType && filters.propertyType !== 'all') rows = rows.filter(r => propertyTypeLabel(propertyById(r.property_id)) === filters.propertyType);
  if (filters.clientId && filters.clientId !== 'all') rows = rows.filter(r => String(r.client_id) === String(filters.clientId));
  if (filters.guardId && filters.guardId !== 'all') rows = rows.filter(r => String((scheduledOverride(r).guard_id || r.guard_id || r.assigned_guard_id || '')) === String(filters.guardId));
  if (filters.scheduleType && filters.scheduleType !== 'all') rows = rows.filter(r => scheduleTypeValue(r) === filters.scheduleType);
  return rows.sort((a,b) => scheduleDateObj(a) - scheduleDateObj(b));
}
function selectedScheduledRequest() {
  const rows = filteredScheduledQueueRows();
  return rows.find(r => String(r.id) === String(state.selectedScheduledRequestId)) || rows[0] || null;
}
function scheduledFilterBar() {
  if (!state.scheduledQueueFiltersOpen) return '';
  const types = [...new Set(scheduledQueueRows().map(req => propertyTypeLabel(propertyById(req.property_id))).filter(Boolean))];
  return `<div class="scheduled-filter-bar">
    <select data-scheduled-filter="priority"><option value="all">All Priorities</option><option value="critical" ${state.scheduledQueueFilters.priority === 'critical' ? 'selected' : ''}>Critical</option><option value="high" ${state.scheduledQueueFilters.priority === 'high' ? 'selected' : ''}>High</option><option value="medium" ${state.scheduledQueueFilters.priority === 'medium' ? 'selected' : ''}>Medium</option><option value="low" ${state.scheduledQueueFilters.priority === 'low' ? 'selected' : ''}>Low</option></select>
    <select data-scheduled-filter="propertyType"><option value="all">All Property Types</option>${types.map(t => `<option value="${esc(t)}" ${state.scheduledQueueFilters.propertyType === t ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select>
    <select data-scheduled-filter="clientId">${scheduleClientOptions()}</select>
    <select data-scheduled-filter="guardId">${scheduleGuardOptions(state.scheduledQueueFilters.guardId)}</select>
    <select data-scheduled-filter="scheduleType"><option value="all">All Schedule Types</option><option value="scheduled" ${state.scheduledQueueFilters.scheduleType === 'scheduled' ? 'selected' : ''}>Scheduled Patrol</option><option value="recurring" ${state.scheduledQueueFilters.scheduleType === 'recurring' ? 'selected' : ''}>Recurring Patrol</option><option value="vacation" ${state.scheduledQueueFilters.scheduleType === 'vacation' ? 'selected' : ''}>Vacation Watch</option><option value="exterior" ${state.scheduledQueueFilters.scheduleType === 'exterior' ? 'selected' : ''}>Exterior Patrol</option><option value="interior" ${state.scheduledQueueFilters.scheduleType === 'interior' ? 'selected' : ''}>Interior Patrol</option><option value="lockup" ${state.scheduledQueueFilters.scheduleType === 'lockup' ? 'selected' : ''}>Lockup / Close</option></select>
    <label class="scheduled-inline-search"><input type="search" placeholder="Search by property, client, ID..." value="${esc(state.scheduledQueueSearch || '')}" data-scheduled-search><b>⌕</b></label>
    <button type="button" data-action="scheduled-clear-filters">⌁ Clear</button>
  </div>`;
}
function scheduledQueueToolbar() {
  return `<div class="scheduled-toolbar">
    ${scheduledTabs()}
    <div class="scheduled-toolbar-actions"><button type="button" class="ghost-button" data-action="scheduled-auto-assign">Auto Assign</button><button type="button" class="primary-button" data-action="scheduled-bulk-reschedule">▣ Bulk Reschedule</button></div>
  </div>
  ${scheduledFilterBar()}`;
}
function scheduledRow(req = {}) {
  const selected = String(state.selectedScheduledRequestId || '') === String(req.id);
  const checked = (state.scheduledQueueSelectedIds || []).map(String).includes(String(req.id));
  const g = scheduleAssignedGuard(req);
  const guardName = scheduleGuardName(req);
  const guardPhoto = g.photo_url || g.avatar_url || g.image_url || '';
  const status = scheduleStatusValue(req);
  return `<div class="scheduled-row ${selected ? 'selected' : ''}" data-request-id="${esc(req.id)}">
    <label class="schedule-check"><input type="checkbox" ${checked ? 'checked' : ''} data-scheduled-check="${esc(req.id)}"></label>
    <div>${schedulePriorityBadge(req)}</div>
    <button type="button" class="schedule-id-cell" data-action="select-scheduled" data-request-id="${esc(req.id)}"><strong>${esc(scheduleId(req))}</strong><small>#${esc(shortRequestId(req.id))}</small></button>
    <button type="button" class="schedule-property-cell" data-action="select-scheduled" data-request-id="${esc(req.id)}"><strong>${esc(propertyLabel(req))}</strong><small>${esc(requestClientName(req))}</small></button>
    <div class="schedule-type-cell"><i>${scheduleTypeValue(req) === 'vacation' ? '▣' : scheduleTypeValue(req) === 'recurring' ? '↻' : '🛡'}</i><span>${esc(scheduleTypeLabel(req))}</span></div>
    <div class="schedule-next-cell"><strong>${esc(scheduleNextRunLabel(req))}</strong><small>${esc(fmtDate(scheduleDateObj(req)))}</small></div>
    <div class="schedule-recur-cell"><strong>${esc(scheduleRecurrenceLabel(req))}</strong><small>${esc(fmtTime(scheduleDateObj(req)))}</small></div>
    <div class="schedule-guard-cell">${g.id ? `${avatar(guardName, guardPhoto)}<span><strong>${esc(guardName)}</strong><small>${esc(typeof liveGpsGuardBadge === 'function' ? liveGpsGuardBadge(g) : (g.id || 'Guard'))}</small></span>` : `<div class="schedule-unassigned-avatar"></div><span><strong>Unassigned</strong><small>Needs guard</small></span>`}</div>
    <div>${scheduleStatusBadge(req)}</div>
    <div class="scheduled-actions"><button type="button" data-action="select-scheduled" data-request-id="${esc(req.id)}">View</button><button type="button" data-action="scheduled-row-menu" data-request-id="${esc(req.id)}">⋮</button></div>
  </div>`;
}
function scheduledQueueTable() {
  const rows = filteredScheduledQueueRows();
  const per = Number(state.scheduledQueuePerPage || 10);
  const maxPage = Math.max(1, Math.ceil(rows.length / per));
  state.scheduledQueuePage = Math.min(Math.max(1, state.scheduledQueuePage || 1), maxPage);
  const start = (state.scheduledQueuePage - 1) * per;
  const pageRows = rows.slice(start, start + per);
  return `<div class="scheduled-table">
    <div class="scheduled-head"><span></span><span>Priority</span><span>Schedule ID</span><span>Property / Client</span><span>Patrol Type</span><span>Next Run</span><span>Recurrence</span><span>Assigned Guard</span><span>Status</span><span>Actions</span></div>
    ${pageRows.length ? pageRows.map(scheduledRow).join('') : '<div class="scheduled-empty">No scheduled patrols match your filters.</div>'}
  </div>`;
}
function scheduledPagination() {
  const rows = filteredScheduledQueueRows();
  const per = Number(state.scheduledQueuePerPage || 10);
  const maxPage = Math.max(1, Math.ceil(rows.length / per));
  const start = rows.length ? (state.scheduledQueuePage - 1) * per + 1 : 0;
  const end = Math.min(rows.length, (state.scheduledQueuePage || 1) * per);
  return `<footer class="scheduled-footer"><span>Showing ${esc(start)} to ${esc(end)} of ${esc(rows.length)} schedules</span><div class="scheduled-pages"><button type="button" data-action="scheduled-page-prev">‹</button><strong>${esc(state.scheduledQueuePage || 1)}</strong><button type="button" data-action="scheduled-page-next">›</button></div><select data-scheduled-per-page><option value="8" ${per === 8 ? 'selected' : ''}>8 per page</option><option value="10" ${per === 10 ? 'selected' : ''}>10 per page</option><option value="20" ${per === 20 ? 'selected' : ''}>20 per page</option></select></footer>`;
}
function scheduleUpcomingRuns(req = {}) {
  const base = scheduleDateObj(req);
  const type = scheduleTypeValue(req);
  const rows = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(base.getTime());
    if (type === 'recurring') d.setDate(base.getDate() + i);
    else if (type === 'vacation') d.setDate(base.getDate() + i);
    else d.setDate(base.getDate() + i * 7);
    rows.push(d);
  }
  return `<section class="scheduled-side-section"><div class="side-head"><h3>Upcoming Runs</h3><button type="button" data-action="scheduled-view-runs">View All</button></div><div class="scheduled-runs">${rows.map((d,i) => `<div><i class="${i===0?'active':''}"></i><span>${esc(fmtDate(d))}</span><small>${esc(i===0 ? 'Next' : d.toLocaleDateString(undefined,{weekday:'short'}))}</small><strong>${esc(fmtTime(d))}</strong></div>`).join('')}</div></section>`;
}
function scheduledRoutePreview(req = {}) {
  const entry = dispatchNearestOnlineGuardEntry(req);
  const end = getPropertyCoords(req);
  const start = entry?.coords || null;
  if (!start || !end) return `<section class="scheduled-side-section route"><h3>Route Preview</h3><div class="scheduled-route-preview"><div class="pending-mini-empty">Waiting for guard GPS and property coordinates.</div></div></section>`;
  const route = dispatchRouteForPoints(start, end);
  const points = route?.points?.length >= 2 ? route.points : dispatchRouteFallbackPoints(start, end);
  const all = [start,end,...points];
  let minLat = Math.min(...all.map(p=>p.lat)), maxLat = Math.max(...all.map(p=>p.lat)), minLng = Math.min(...all.map(p=>p.lng)), maxLng = Math.max(...all.map(p=>p.lng));
  const latPad = Math.max(.002,(maxLat-minLat)*.35), lngPad = Math.max(.002,(maxLng-minLng)*.35);
  const bounds = { minLat:minLat-latPad, maxLat:maxLat+latPad, minLng:minLng-lngPad, maxLng:maxLng+lngPad };
  const gPct = mapPercentForPoint(start.lat,start.lng,bounds), pPct = mapPercentForPoint(end.lat,end.lng,bounds);
  const path = dispatchRouteSvgPath(points,bounds);
  return `<section class="scheduled-side-section route"><h3>Route Preview</h3><div class="scheduled-route-preview"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${esc(path)}"></path></svg><span class="rp guard" style="left:${gPct.x.toFixed(2)}%;top:${gPct.y.toFixed(2)}%">1</span><span class="rp property" style="left:${pPct.x.toFixed(2)}%;top:${pPct.y.toFixed(2)}%">2</span><em>Start / End</em><small>${esc(route?.distanceMiles ? `${route.distanceMiles.toFixed(1)} mi · ETA ${route.etaMin || '—'} min` : 'Route pending')}</small></div></section>`;
}
function scheduledDetailRail() {
  const req = selectedScheduledRequest();
  if (!req) return `<aside class="scheduled-detail-rail"><section class="panel panel-pad scheduled-selected"><div class="empty">Select a schedule.</div></section></aside>`;
  const property = propertyById(req.property_id);
  const photo = propertyImageValue(property);
  const guard = scheduleAssignedGuard(req);
  const guardName = scheduleGuardName(req);
  const guardPhoto = guard.photo_url || guard.avatar_url || guard.image_url || '';
  return `<aside class="scheduled-detail-rail"><section class="panel panel-pad scheduled-selected">
    <button type="button" class="scheduled-close" data-action="scheduled-clear-selected">×</button>
    <h2>Selected Schedule</h2>
    <div class="scheduled-property-card"><div>${photo ? `<img src="${esc(photo)}" alt="${esc(propertyLabel(req))}">` : `<span>${esc(initials(propertyLabel(req)))}</span>`}</div><aside><h3>${esc(propertyLabel(req))}</h3><p>${esc(propertyAddress(req))}</p><small>Client</small><strong>${esc(requestClientName(req))}</strong></aside></div>
    <div class="scheduled-side-grid"><div><span>Property Type</span><strong>${esc(propertyTypeLabel(property))}</strong></div><div><span>Patrol Type</span><strong>${esc(scheduleTypeLabel(req))}</strong></div></div>
    <div class="scheduled-assigned-card"><span>Assigned Guard</span>${guard.id ? `<div>${avatar(guardName, guardPhoto)}<strong>${esc(guardName)}</strong><small>${esc(typeof liveGpsGuardBadge === 'function' ? liveGpsGuardBadge(guard) : guard.id)}</small></div>` : `<div><span class="schedule-unassigned-avatar"></span><strong>Unassigned</strong><small>Needs guard</small></div>`}<button type="button" data-view="messages">☎</button></div>
    <dl class="scheduled-detail-list"><dt>Next Run</dt><dd>${esc(scheduleNextRunLabel(req))}</dd><dt>Recurrence</dt><dd>${esc(scheduleRecurrenceLabel(req))}</dd><dt>Estimated Duration</dt><dd>${esc(req.estimated_duration || req.duration || '45 min')}</dd><dt>Requested Services</dt><dd>${esc(req.services || req.requested_services || req.instructions || 'Patrol, perimeter check, photo proof')}</dd><dt>Special Instructions</dt><dd>${esc(req.special_instructions || req.notes || 'No special instructions.')}</dd></dl>
    <div class="scheduled-side-actions"><button type="button" class="primary-button" data-action="scheduled-edit" data-request-id="${esc(req.id)}">✎ Edit Schedule</button><button type="button" class="ghost-button" data-action="scheduled-reassign" data-request-id="${esc(req.id)}">♙ Reassign Guard</button><button type="button" class="ghost-button" data-action="scheduled-pause" data-request-id="${esc(req.id)}">${scheduleStatusValue(req)==='paused'?'▶ Resume Schedule':'⏸ Pause Schedule'}</button><button type="button" class="ghost-button" data-action="scheduled-view-full" data-request-id="${esc(req.id)}">⊙ View Full Details</button></div>
    ${scheduleUpcomingRuns(req)}
    ${scheduledRoutePreview(req)}
  </section></aside>`;
}
function scheduledQueueHeader() {
  return `<header class="dashboard-header scheduled-header"><div class="title-block"><h1>Scheduled Queue</h1><p>Manage upcoming patrols, recurring coverage, and future assignments.</p></div><div class="scheduled-header-actions"><span class="system-pill"><i></i>System Operational</span><label class="scheduled-search"><input type="search" placeholder="Search schedules..." value="${esc(state.scheduledQueueSearch || '')}" data-scheduled-search><b>⌕</b></label><button type="button" data-view="notifications">🔔${unreadNotificationsCount()?`<em>${esc(unreadNotificationsCount())}</em>`:''}</button><button type="button" data-action="scheduled-refresh">⟳ Refresh</button></div></header>`;
}
function scheduledQueueView() {
  const autoSelected = selectedScheduledRequest();
  if (autoSelected && !state.selectedScheduledRequestId) state.selectedScheduledRequestId = autoSelected.id;
  return `<div class="dashboard scheduled-queue-shell">
    ${scheduledQueueHeader()}
    ${scheduledKpiRow()}
    <section class="scheduled-layout">
      <main class="scheduled-main panel">
        ${scheduledQueueToolbar()}
        ${scheduledQueueTable()}
        ${scheduledPagination()}
      </main>
      ${scheduledDetailRail()}
    </section>
  </div>`;
}
async function autoAssignScheduledQueue() {
  const rows = filteredScheduledQueueRows().filter(r => scheduleStatusValue(r) === 'unassigned' || !scheduleAssignedGuard(r).id);
  const guards = dispatchMapOnlineGuards().map(e => e.guard);
  if (!rows.length) throw new Error('No unassigned schedules to auto assign.');
  if (!guards.length) throw new Error('No online guards available.');
  rows.slice(0, 3).forEach((req, idx) => saveScheduledOverride(req.id, { guard_id: guards[idx % guards.length].id, status: 'scheduled' }));
  await loadData().catch(() => {});
}
function bulkRescheduleScheduledQueue() {
  const ids = (state.scheduledQueueSelectedIds || []).length ? state.scheduledQueueSelectedIds : filteredScheduledQueueRows().slice(0, 3).map(r => r.id);
  ids.forEach(id => {
    const req = state.patrolRequests.find(r => String(r.id) === String(id));
    const d = req ? scheduleDateObj(req) : new Date();
    d.setDate(d.getDate() + 1);
    saveScheduledOverride(id, { next_run: d.toISOString(), scheduled_for: d.toISOString() });
  });
}

function adminApprovedGuards() {
  return adminAssignableGuards();
}
function activeAssignmentForGuard(guardId = '') {
  return activeRequests().find(req => String(req.guard_id || req.assigned_guard_id || '') === String(guardId)) || null;
}
function guardHasActiveAssignment(guard = {}) {
  const id = typeof guard === 'object' ? guard.id : guard;
  return Boolean(activeAssignmentForGuard(id));
}
function guardOnlineEntry(guard = {}) {
  return dispatchMapOnlineGuards().find(entry => String(entry.guard.id) === String(guard.id)) || null;
}
function isGuardOnlineForAdmin(guard = {}) {
  return Boolean(guardOnlineEntry(guard));
}
function isGuardPendingApproval(guard = {}) {
  return String(guard.status || '').toLowerCase() === 'pending';
}
function guardHasAlert(guard = {}) {
  const entry = guardOnlineEntry(guard);
  const gpsAge = entry?.coords?.updated_at || guard.last_gps_update || guard.updated_at || guard.last_seen_at;
  const stale = gpsAge ? (Date.now() - new Date(gpsAge).getTime()) / 60000 > 60 : false;
  return stale || /alert|incident|warning/i.test(String(guard.status_note || guard.notes || ''));
}
function guardRecordById(guardId = '') {
  const id = String(guardId || '');
  return (state.guards || []).find(g => String(g.id) === id) || null;
}
function guardEmailLooksMismatched(guard = {}, email = '') {
  const rawEmail = String(email || '').trim().toLowerCase();
  if (!rawEmail || !rawEmail.includes('@')) return false;
  const local = rawEmail.split('@')[0].replace(/[^a-z0-9]/g, '');
  const name = String(guard.name || guard.display_name || guard.full_name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!name || name === 'guard') return false;
  if (/^guard\d*$|guarddy|guardtest|testguard/.test(local) && !/guard/.test(name)) return true;
  const nameParts = name.match(/[a-z]+/g) || [];
  const meaningful = nameParts.filter(p => p.length >= 3);
  if (meaningful.length && !meaningful.some(p => local.includes(p)) && /^guard/.test(local)) return true;
  return false;
}
function guardContactEmail(guard = {}) {
  const candidates = [guard.email, guard.contact_email, guard.work_email, guard.user_email, guard.profile_email].filter(Boolean);
  const clean = candidates.map(v => String(v || '').trim()).find(v => v.includes('@') && !guardEmailLooksMismatched(guard, v));
  return clean || '—';
}
function guardContactPhone(guard = {}) {
  return guard.phone || guard.mobile || guard.cell_phone || guard.contact_phone || guard.work_phone || '—';
}
function guardName(guard = {}) {
  return guard.name || guard.display_name || guard.full_name || guard.email || 'Guard';
}
function guardPhoto(guard = {}) {
  return guard.photo_url || guard.avatar_url || guard.image_url || guard.profile_photo_url || '';
}
function guardBadgeId(guard = {}) {
  return guard.badge_id || guard.guard_id || guard.employee_id || guard.unit_id || String(guard.id || '').slice(0, 8) || 'G-0000';
}
function guardRankLabel(guard = {}) {
  return guardRankFor(guard) || guard.rank || 'Guard';
}
function guardGpsInfo(guard = {}) {
  const entry = guardOnlineEntry(guard);
  const saved = entry?.positionSource === 'persisted-online' ? readGuardGpsPersistedState() : null;
  const coords = entry?.coords || dispatchGuardRawCoords(guard);
  const address = entry
    ? dispatchGuardGpsAddress(entry)
    : (guard.current_address || guard.last_address || guard.address || (coords ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : 'No live GPS'));
  const updatedRaw = entry?.positionSource === 'persisted-online'
    ? (saved?.lastUpdate || saved?.savedAt || saved?.statusChangedAt || saved?.onlineSince || guard.last_gps_update || guard.updated_at)
    : (entry ? (liveGps.lastUpdate || entry.coords?.updated_at || guard.last_gps_update || guard.updated_at) : (guard.last_gps_update || guard.last_seen_at || guard.updated_at));
  const updatedMs = updatedRaw ? new Date(updatedRaw).getTime() : 0;
  const ageMin = Number.isFinite(updatedMs) && updatedMs ? Math.max(0, Math.floor((Date.now() - updatedMs) / 60000)) : null;
  const isOnline = Boolean(entry);
  const fresh = ageMin !== null && ageMin <= 15;
  const savedOnline = entry?.positionSource === 'persisted-online';
  const updatedLabel = isOnline
    ? (fresh ? 'Live now' : (savedOnline ? 'Online · saved GPS' : `GPS stale · ${timeAgo(updatedRaw)}`))
    : (updatedRaw ? timeAgo(updatedRaw) : '—');
  return {
    entry,
    coords,
    address,
    updatedLabel,
    updatedAt: updatedRaw || '',
    ageMin,
    isFresh: fresh,
    isOnline
  };
}
function guardStatusKind(guard = {}) {
  if (guardHasActiveAssignment(guard)) return 'on-patrol';
  if (isGuardOnlineForAdmin(guard)) return 'online';
  if (isGuardPendingApproval(guard)) return 'pending';
  if (/available/i.test(String(guard.status || ''))) return 'available';
  return 'offline';
}
function guardStatusBadge(guard = {}) {
  const kind = guardStatusKind(guard);
  const label = kind === 'on-patrol' ? 'On Patrol' : kind === 'online' ? 'Online' : kind === 'available' ? 'Available' : kind === 'pending' ? 'Pending' : 'Offline';
  return `<span class="guard-status-badge ${esc(kind)}">${esc(label)}</span>`;
}
function guardDutyText(guard = {}) {
  const kind = guardStatusKind(guard);
  if (kind === 'offline') return 'Off Duty';
  if (kind === 'online') return 'Available for dispatch';
  if (kind === 'pending') return 'Approval Pending';
  return statusText(kind);
}
function patrolTypeLabel(req = {}) {
  return req.request_type || req.patrol_type || req.service_type || req.type || 'Patrol';
}
function guardUnreadCount(guardId = '') {
  const thread = state.messageThreads.find(t => String(t.guard_id) === String(guardId));
  return Number(thread?.unread_count || 0);
}
function guardResponseTime(guard = {}) {
  const entry = guardOnlineEntry(guard);
  if (!entry) return '—';
  const id = String(guard.id || '');
  const index = Math.abs([...id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0)) % 7;
  return index < 2 ? `${45 + index * 15}s` : `${1 + index}m ${10 + index * 5}s`;
}
function guardCompletedToday(guardId = '') {
  const today = new Date().toDateString();
  return completedRequests().filter(req => String(req.guard_id || req.assigned_guard_id || '') === String(guardId) && new Date(req.completed_at || req.updated_at || req.created_at || 0).toDateString() === today).length;
}
function guardShiftStatus(guard = {}) {
  if (guardHasActiveAssignment(guard)) return 'On Duty';
  if (isGuardOnlineForAdmin(guard)) return 'Available';
  return 'Off Duty';
}
function guardCounts() {
  const guards = adminApprovedGuards();
  const online = guards.filter(isGuardOnlineForAdmin);
  const onPatrol = guards.filter(guardHasActiveAssignment);
  const offDuty = guards.filter(g => !isGuardOnlineForAdmin(g) && !guardHasActiveAssignment(g));
  const pendingApproval = guardApprovals();
  const alerts = guards.filter(guardHasAlert);
  return { total: guards.length, online: online.length, onPatrol: onPatrol.length, offDuty: offDuty.length, pendingApproval: pendingApproval.length, alerts: alerts.length };
}
function guardsKpi(icon, label, value, subtext, tone = 'blue') {
  return `<article class="guards-kpi ${esc(tone)}"><div class="guards-kpi-icon">${esc(icon)}</div><div><span>${esc(label)}</span><strong>${esc(value)}</strong><small>${esc(subtext)}</small></div></article>`;
}
function guardsKpiRow() {
  const c = guardCounts();
  return `<section class="guards-kpi-row">
    ${guardsKpi('♧','Total Guards',c.total,'All guards in system','blue')}
    ${guardsKpi('●','Online Now',c.online,'Currently online','green')}
    ${guardsKpi('⌖','On Patrol',c.onPatrol,'Active on patrol','blue')}
    ${guardsKpi('⏻','Off Duty',c.offDuty,'Not on duty','slate')}
    ${guardsKpi('♙','Pending Approval',c.pendingApproval,'Awaiting approval','amber')}
    ${guardsKpi('⚠','Alerts',c.alerts,'Requires attention','red')}
  </section>`;
}
function guardRankOptions() {
  const ranks = ['Guard','Officer','Corporal','Sergeant','Supervisor'];
  const fromRows = [...new Set(adminApprovedGuards().map(guardRankLabel).filter(Boolean))];
  return [...new Set([...ranks, ...fromRows])];
}
function filteredGuards() {
  let rows = adminApprovedGuards();
  const q = String(state.guardsSearch || '').trim().toLowerCase();
  if (q) rows = rows.filter(guard => [guardName(guard), guard.email, guard.phone, guardRankLabel(guard), guardBadgeId(guard), activeAssignmentForGuard(guard.id) ? propertyLabel(activeAssignmentForGuard(guard.id)) : '', guardGpsInfo(guard).address].join(' ').toLowerCase().includes(q));
  const status = state.guardsStatusFilter || 'all';
  if (status === 'online') rows = rows.filter(isGuardOnlineForAdmin);
  if (status === 'offline') rows = rows.filter(g => !isGuardOnlineForAdmin(g));
  if (status === 'on-patrol') rows = rows.filter(guardHasActiveAssignment);
  const duty = state.guardsDutyFilter || 'all';
  if (duty === 'on-patrol') rows = rows.filter(guardHasActiveAssignment);
  if (duty === 'available') rows = rows.filter(g => isGuardOnlineForAdmin(g) && !guardHasActiveAssignment(g));
  if (duty === 'off-duty') rows = rows.filter(g => !isGuardOnlineForAdmin(g) && !guardHasActiveAssignment(g));
  const rank = String(state.guardsRankFilter || 'all').toLowerCase();
  if (rank !== 'all') rows = rows.filter(g => String(guardRankLabel(g) || '').toLowerCase() === rank);
  const approval = state.guardsApprovalFilter || 'all';
  if (approval !== 'all') rows = rows.filter(g => String(g.approval_status || g.status || 'approved').toLowerCase() === approval);
  return rows.sort((a,b) => {
    const weight = g => guardHasActiveAssignment(g) ? 0 : isGuardOnlineForAdmin(g) ? 1 : 2;
    return weight(a) - weight(b) || guardName(a).localeCompare(guardName(b));
  });
}
function selectedGuard() {
  const rows = filteredGuards();
  return rows.find(g => String(g.id) === String(state.selectedGuardId)) || rows[0] || null;
}
function guardsHeader() {
  return `<header class="dashboard-header guards-header">
    <div class="title-block"><h1>Guards</h1><p>Monitor guard status, assignments, ranks, GPS activity, and availability.</p></div>
    <div class="guards-header-actions"><span class="system-pill"><i></i>System Operational</span><label class="guards-search"><input data-guards-search placeholder="Search guards..." value="${esc(state.guardsSearch || '')}"><b>⌕</b></label><button type="button" data-view="notifications">🔔${unreadNotificationsCount() ? `<b>${esc(unreadNotificationsCount())}</b>` : ''}</button><button type="button" data-action="guards-refresh">⟳ Refresh</button></div>
  </header>`;
}
function guardsFilterBar() {
  return `<section class="guards-filter-bar">
    <label class="guards-search-box"><input data-guards-search placeholder="Search guards..." value="${esc(state.guardsSearch || '')}"></label>
    <select data-guards-filter="status"><option value="all" ${state.guardsStatusFilter === 'all' ? 'selected' : ''}>All Guards</option><option value="online" ${state.guardsStatusFilter === 'online' ? 'selected' : ''}>Online</option><option value="on-patrol" ${state.guardsStatusFilter === 'on-patrol' ? 'selected' : ''}>On Patrol</option><option value="offline" ${state.guardsStatusFilter === 'offline' ? 'selected' : ''}>Offline</option></select>
    <select data-guards-filter="duty"><option value="all" ${state.guardsDutyFilter === 'all' ? 'selected' : ''}>All Duty</option><option value="available" ${state.guardsDutyFilter === 'available' ? 'selected' : ''}>Available</option><option value="on-patrol" ${state.guardsDutyFilter === 'on-patrol' ? 'selected' : ''}>On Patrol</option><option value="off-duty" ${state.guardsDutyFilter === 'off-duty' ? 'selected' : ''}>Off Duty</option></select>
    <select data-guards-filter="rank"><option value="all">All Ranks</option>${guardRankOptions().map(rank => `<option value="${esc(String(rank).toLowerCase())}" ${String(state.guardsRankFilter || 'all').toLowerCase() === String(rank).toLowerCase() ? 'selected' : ''}>${esc(rank)}</option>`).join('')}</select>
    <select data-guards-filter="approval"><option value="all" ${state.guardsApprovalFilter === 'all' ? 'selected' : ''}>Approval</option><option value="approved" ${state.guardsApprovalFilter === 'approved' ? 'selected' : ''}>Approved</option><option value="pending" ${state.guardsApprovalFilter === 'pending' ? 'selected' : ''}>Pending</option><option value="suspended" ${state.guardsApprovalFilter === 'suspended' ? 'selected' : ''}>Suspended</option></select>
    <button type="button" data-action="guards-clear-filters">⌁ Filters</button>
  </section>`;
}
function guardRankCell(guard = {}) {
  return `<div class="guard-rank-cell"><i>⌃</i><span>${esc(guardRankLabel(guard))}</span></div>`;
}
function guardsTableRow(guard = {}) {
  const selected = String(state.selectedGuardId || '') === String(guard.id);
  const assignment = activeAssignmentForGuard(guard.id);
  const gps = guardGpsInfo(guard);
  const unread = guardUnreadCount(guard.id);
  return `<div class="guards-row ${selected ? 'selected' : ''}" data-guard-id="${esc(guard.id)}">
    <button type="button" class="guard-cell-main" data-action="select-guard" data-guard-id="${esc(guard.id)}">${avatar(guardName(guard), guardPhoto(guard))}<span><strong>${esc(guardName(guard))}</strong><small>ID: ${esc(guardBadgeId(guard))}</small></span></button>
    ${guardRankCell(guard)}
    <div>${guardStatusBadge(guard)}</div>
    <div class="guard-assignment-cell"><strong>${esc(assignment ? propertyLabel(assignment) : '—')}</strong><small>${esc(assignment ? patrolTypeLabel(assignment) : guardDutyText(guard))}</small></div>
    <div class="guard-gps-cell ${gps.isOnline && !gps.isFresh ? 'gps-stale' : ''}"><strong>${esc(gps.updatedLabel)}</strong><small>${esc(gps.address)}</small></div>
    <div class="guard-messages-cell"><button type="button" data-action="message-guard" data-guard-id="${esc(guard.id)}">☵</button><span>${esc(unread)}</span></div>
    <div class="guard-response-cell">${esc(guardResponseTime(guard))}</div>
    <div class="guard-actions"><button type="button" data-action="message-guard" data-guard-id="${esc(guard.id)}">💬</button><button type="button" data-action="view-guard-route" data-guard-id="${esc(guard.id)}">⌖</button><button type="button" data-action="guard-menu" data-guard-id="${esc(guard.id)}">⋮</button></div>
  </div>`;
}
function guardsTable() {
  const rows = filteredGuards();
  const per = Number(state.guardsPerPage || 10);
  const maxPage = Math.max(1, Math.ceil(rows.length / per));
  state.guardsPage = Math.min(Math.max(1, state.guardsPage || 1), maxPage);
  const start = (state.guardsPage - 1) * per;
  const pageRows = rows.slice(start, start + per);
  return `<div class="guards-table"><div class="guards-table-head"><span>Guard</span><span>Rank</span><span>Status</span><span>Current Assignment</span><span>Last GPS Update</span><span>Messages</span><span>Response Time</span><span>Actions</span></div>${pageRows.length ? pageRows.map(guardsTableRow).join('') : '<div class="guards-empty">No guards match your filters.</div>'}</div>`;
}
function guardsPagination() {
  const rows = filteredGuards();
  const per = Number(state.guardsPerPage || 10);
  const maxPage = Math.max(1, Math.ceil(rows.length / per));
  const start = rows.length ? (state.guardsPage - 1) * per + 1 : 0;
  const end = Math.min(rows.length, (state.guardsPage || 1) * per);
  return `<footer class="guards-footer"><span>Showing ${esc(start)} to ${esc(end)} of ${esc(rows.length)} guards</span><div class="guards-pagination"><button type="button" data-action="guards-page-prev">‹</button><strong>${esc(state.guardsPage || 1)}</strong><button type="button" data-action="guards-page-next">›</button></div><select data-guards-per-page><option value="10" ${per === 10 ? 'selected' : ''}>10 per page</option><option value="20" ${per === 20 ? 'selected' : ''}>20 per page</option><option value="50" ${per === 50 ? 'selected' : ''}>50 per page</option></select></footer>`;
}
function guardLiveLocationMiniMap(guard = {}) {
  const gps = guardGpsInfo(guard);
  const hasGps = gps.coords && Number.isFinite(gps.coords.lat) && Number.isFinite(gps.coords.lng);
  return `<section class="guard-mini-map-card"><div class="guard-mini-map-head"><h3>Live Location</h3><small>${esc(gps.updatedLabel)}</small></div><div class="guard-mini-map"><span class="gm-street s1">Main St</span><span class="gm-street s2">Commerce Dr</span><div class="mini-road r1"></div><div class="mini-road r2"></div>${hasGps ? '<div class="mini-guard-marker"></div>' : '<div class="guard-mini-empty">No live GPS.</div>'}<button type="button" data-action="zoom-guard-mini-map">+</button><button type="button" data-action="recenter-guard-mini-map">⌖</button></div></section>`;
}
function guardRecentActivity(guard = {}) {
  const guardId = String(guard.id || '');
  const events = (state.patrolActivity || []).filter(a => String(a.guard_id || a.actor_id || a.user_id || '') === guardId || new RegExp(guardName(guard).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(`${a.title || ''} ${a.details || ''} ${a.message || ''}`)).slice(0, 4);
  const fallback = activeAssignmentForGuard(guard.id) ? [
    { title:'Patrol assigned', created_at:new Date().toISOString() },
    { title:'Route available', created_at:new Date().toISOString() }
  ] : [];
  const rows = (events.length ? events : fallback);
  return `<section class="guard-activity-card"><div class="section-head"><h3>Recent Activity</h3><button type="button" data-view="activity-log">View All</button></div>${rows.length ? rows.map(event => `<div class="guard-activity-row"><i>${/complete/i.test(event.title || '') ? '✓' : /incident|alert/i.test(event.title || '') ? '⚠' : '⌖'}</i><span><strong>${esc(event.title || event.event_type || 'Activity')}</strong><small>${esc(timeAgo(event.created_at || event.updated_at))}</small></span></div>`).join('') : '<div class="empty compact">No recent activity.</div>'}</section>`;
}
function guardCertifications(guard = {}) {
  const source = guard.certifications || guard.skills || guard.certification_list || '';
  const skills = Array.isArray(source) ? source : String(source || '').split(',').map(s => s.trim()).filter(Boolean);
  const safeSkills = skills.length ? skills : ['Guard License','CPR / First Aid','Fire Watch','Access Control','Emergency Response'];
  return `<section class="guard-skills-card"><h3>Certifications & Skills</h3><div class="guard-skills-list">${safeSkills.map(skill => `<span>${esc(skill)}</span>`).join('')}</div></section>`;
}
function guardDetailActions(guard = {}) {
  return `<div class="guard-detail-actions"><button type="button" data-action="message-guard" data-guard-id="${esc(guard.id)}">Message</button><button type="button" data-action="view-guard-route" data-guard-id="${esc(guard.id)}">View Route</button><button type="button" data-action="assign-guard-patrol" data-guard-id="${esc(guard.id)}">Assign Patrol</button><button type="button" data-action="view-guard-profile" data-guard-id="${esc(guard.id)}">View Profile</button></div>`;
}
function guardDetailRail() {
  const guard = selectedGuard();
  if (!guard) return `<aside class="guard-detail-rail"><section class="panel panel-pad guard-detail-card"><div class="empty">Select a guard.</div></section></aside>`;
  const assignment = activeAssignmentForGuard(guard.id);
  const gps = guardGpsInfo(guard);
  return `<aside class="guard-detail-rail"><section class="panel panel-pad guard-detail-card guard-detail-card-compact">
    <button type="button" class="rail-close" data-action="clear-selected-guard">×</button>
    <div class="guard-profile-head">${avatar(guardName(guard), guardPhoto(guard))}<div><h2>${esc(guardName(guard))}</h2><span>${esc(guardRankLabel(guard))}</span>${guardStatusBadge(guard)}</div></div>
    <div class="guard-detail-block"><label>Current Location</label><strong>${esc(gps.address)}</strong><small class="${gps.isOnline && !gps.isFresh ? 'gps-stale-label' : ''}">${esc(gps.updatedLabel)}</small></div>
    <div class="guard-detail-block"><label>Current Assignment</label><strong>${esc(assignment ? propertyLabel(assignment) : 'No active assignment')}</strong><small>${esc(assignment ? patrolTypeLabel(assignment) : (gps.isOnline ? 'Available for dispatch' : 'Off duty'))}</small></div>
    ${guardDetailActions(guard)}
    <dl class="guard-detail-list compact"><dt>Shift Status</dt><dd>${esc(guardShiftStatus(guard))}</dd><dt>Last Check-In</dt><dd>${esc(gps.updatedLabel)}</dd><dt>Patrols Today</dt><dd>${esc(guardCompletedToday(guard.id))}</dd><dt>Phone</dt><dd>${esc(guardContactPhone(guard))}</dd><dt>Email</dt><dd>${esc(guardContactEmail(guard))}</dd></dl>
    ${guardLiveLocationMiniMap(guard)}
    ${guardRecentActivity(guard)}
    ${guardCertifications(guard)}
  </section></aside>`;
}
function guardsCommandCenterView() {
  return `<div class="dashboard guards-shell">${guardsHeader()}${guardsKpiRow()}<section class="guards-layout"><main class="guards-main panel">${guardsFilterBar()}${guardsTable()}${guardsPagination()}</main>${guardDetailRail()}</section></div>`;
}



function guardApprovalOverrideKey() { return 'cp_security_guard_approval_overrides_v1'; }
function readGuardApprovalOverrides() {
  try { const parsed = JSON.parse(localStorage.getItem(guardApprovalOverrideKey()) || '{}'); return parsed && typeof parsed === 'object' ? parsed : {}; } catch { return {}; }
}
function writeGuardApprovalOverrides(map = {}) { try { localStorage.setItem(guardApprovalOverrideKey(), JSON.stringify(map)); } catch {} }
function saveGuardApprovalOverride(id, patch = {}) {
  const map = readGuardApprovalOverrides();
  map[String(id)] = { ...(map[String(id)] || {}), ...patch, updated_at: new Date().toISOString() };
  writeGuardApprovalOverrides(map);
}
function guardApprovalBaseRows() {
  const rows = [];
  const seen = new Set();
  (state.guardSignups || []).forEach((item, idx) => {
    const email = String(item.email || '').trim().toLowerCase();
    const id = String(item.id || item.signup_id || email || `signup-${idx}`);
    seen.add(email || id);
    rows.push({
      ...item,
      id,
      source: 'signup',
      name: item.name || item.display_name || item.full_name || item.email || 'Guard Applicant',
      photo_url: item.photo_url || item.avatar_url || item.image_url || '',
      rank_applied_for: item.rank_applied_for || item.requested_rank || guardRankFor(item) || 'Guard',
      status: item.status || item.approval_status || 'pending',
      application_number: item.application_number || `APP-${String(id).slice(0, 8)}`,
      experience_years: item.experience_years || item.years_experience || item.experience || '—',
      license_status: item.license_status || item.guard_card_status || 'active',
      background_status: item.background_status || item.background_check_status || 'clear',
      availability: item.availability || item.shift_availability || 'Full Time',
      preferred_shift: item.preferred_shift || item.shift || 'Days',
      city: item.city || item.location_city || '—',
      state: item.state || item.location_state || '',
      guard_card_number: item.guard_card_number || item.license_number || '—',
      review_notes: item.review_notes || item.notes || 'No review notes yet.'
    });
  });
  (state.guards || []).forEach((guard, idx) => {
    const email = String(guard.email || '').trim().toLowerCase();
    const id = String(guard.id || email || `guard-${idx}`);
    if (email && seen.has(email)) return;
    rows.push({
      ...guard,
      id,
      source: 'guard',
      name: guard.name || guard.display_name || guard.full_name || guard.email || 'Guard',
      photo_url: guard.photo_url || guard.avatar_url || guard.image_url || '',
      rank_applied_for: guard.rank_applied_for || guard.rank || guard.guard_rank || guardRankFor(guard) || 'Guard',
      status: guard.approval_status || 'approved',
      application_number: guard.application_number || `APP-${String(id).slice(0, 8)}`,
      experience_years: guard.experience_years || guard.years_experience || '—',
      license_status: guard.license_status || guard.guard_card_status || 'active',
      background_status: guard.background_status || guard.background_check_status || 'clear',
      availability: guard.availability || guard.shift_availability || 'Full Time',
      preferred_shift: guard.preferred_shift || guard.shift || 'Any Shift',
      city: guard.city || guard.location_city || '—',
      state: guard.state || guard.location_state || '',
      guard_card_number: guard.guard_card_number || guard.license_number || '—',
      review_notes: guard.review_notes || 'Approved guard record.'
    });
  });
  const overrides = readGuardApprovalOverrides();
  return rows.map(row => ({ ...row, ...(overrides[String(row.id)] || {}) }));
}
function approvalStatus(app = {}) {
  const s = String(app.status || app.approval_status || 'pending').toLowerCase().replace(/\s+/g, '_');
  if (['needs_interview','interview_needed','schedule_interview','scheduled_interview'].includes(s)) return 'interview';
  if (['missing_docs','request_info','needs_info','incomplete'].includes(s)) return 'missing_docs';
  if (['approved','active'].includes(s)) return 'approved';
  if (['rejected','declined','denied'].includes(s)) return 'rejected';
  return 'pending';
}
function approvalRank(app = {}) { return app.rank_applied_for || app.requested_rank || app.rank || app.guard_rank || guardRankFor(app) || 'Guard'; }
function approvalExperienceYears(app = {}) {
  const raw = app.experience_years || app.years_experience || app.experience || '';
  const n = Number(String(raw).match(/\d+/)?.[0] || raw);
  return Number.isFinite(n) ? n : null;
}
function approvalExperienceLabel(app = {}) {
  const n = approvalExperienceYears(app);
  if (n === null) return String(app.experience_years || app.experience || '—');
  return `${n}+ yrs`;
}
function approvalBackgroundStatus(app = {}) {
  const s = String(app.background_status || app.background_check_status || 'clear').toLowerCase().replace(/\s+/g, '_');
  if (/progress|pending|review/.test(s)) return 'in_progress';
  if (/issue|flag|fail|problem/.test(s)) return 'issue';
  return 'clear';
}
function approvalLicenseStatus(app = {}) {
  const s = String(app.license_status || app.guard_card_status || 'active').toLowerCase().replace(/\s+/g, '_');
  if (/expire/.test(s)) return 'expired';
  if (/pending|missing|review/.test(s)) return 'pending';
  return 'active';
}
function applicantMissingDocs(app = {}) {
  const missing = [];
  if (approvalLicenseStatus(app) !== 'active') missing.push('Guard Card');
  if (approvalBackgroundStatus(app) !== 'clear') missing.push('Background Check');
  if (approvalStatus(app) === 'missing_docs') missing.push('Requested Docs');
  if (String(app.training_docs_complete || '').toLowerCase() === 'false') missing.push('Training Docs');
  return [...new Set(missing)];
}
function guardApprovalRows() { return guardApprovalBaseRows(); }
function guardApprovalCounts() {
  const apps = guardApprovalRows();
  const today = new Date().toDateString();
  return {
    total: apps.length,
    pending: apps.filter(a => approvalStatus(a) === 'pending').length,
    approvedToday: apps.filter(a => approvalStatus(a) === 'approved' && new Date(a.approved_at || a.updated_at || a.created_at || Date.now()).toDateString() === today).length,
    rejected: apps.filter(a => approvalStatus(a) === 'rejected').length,
    interview: apps.filter(a => approvalStatus(a) === 'interview').length,
    missingDocs: apps.filter(a => applicantMissingDocs(a).length > 0).length
  };
}
function guardApprovalKpi(icon, label, value, subtext, tone = 'blue') {
  return `<article class="approval-kpi ${esc(tone)}"><div class="approval-kpi-icon">${esc(icon)}</div><div><span>${esc(label)}</span><strong>${esc(value)}</strong><small>${esc(subtext)}</small></div></article>`;
}
function guardApprovalKpiRow() {
  const c = guardApprovalCounts();
  return `<section class="guard-approvals-kpi-row">
    ${guardApprovalKpi('▣','Total Applications',c.total,'All time','blue')}
    ${guardApprovalKpi('◷','Pending Review',c.pending,'Requires attention','amber')}
    ${guardApprovalKpi('✓','Approved Today',c.approvedToday,'Updated today','green')}
    ${guardApprovalKpi('×','Rejected',c.rejected,'This week','red')}
    ${guardApprovalKpi('♙','Interview Needed',c.interview,'Scheduled','purple')}
    ${guardApprovalKpi('▤','Missing Docs',c.missingDocs,'Incomplete','orange')}
  </section>`;
}
function guardApprovalTabButton(key, label, count) {
  const active = (state.guardApprovalTab || 'all') === key;
  return `<button type="button" class="${active ? 'active' : ''}" data-approval-tab="${esc(key)}">${esc(label)} <b>${esc(count)}</b></button>`;
}
function guardApprovalTabs() {
  const rows = guardApprovalRows();
  const counts = {
    all: rows.length,
    pending: rows.filter(a => approvalStatus(a) === 'pending').length,
    interview: rows.filter(a => approvalStatus(a) === 'interview').length,
    approved: rows.filter(a => approvalStatus(a) === 'approved').length,
    rejected: rows.filter(a => approvalStatus(a) === 'rejected').length
  };
  return `<nav class="guard-approval-tabs">
    ${guardApprovalTabButton('all','All Applications',counts.all)}
    ${guardApprovalTabButton('pending','Pending',counts.pending)}
    ${guardApprovalTabButton('interview','Interview',counts.interview)}
    ${guardApprovalTabButton('approved','Approved',counts.approved)}
    ${guardApprovalTabButton('rejected','Rejected',counts.rejected)}
  </nav>`;
}
function guardApprovalFilterBar() {
  const f = state.guardApprovalFilters || {};
  return `<section class="guard-approval-filter-bar">
    <select data-approval-filter="status"><option value="all">All Status</option><option value="pending" ${f.status==='pending'?'selected':''}>Pending</option><option value="interview" ${f.status==='interview'?'selected':''}>Needs Interview</option><option value="approved" ${f.status==='approved'?'selected':''}>Approved</option><option value="rejected" ${f.status==='rejected'?'selected':''}>Rejected</option><option value="missing_docs" ${f.status==='missing_docs'?'selected':''}>Missing Docs</option></select>
    <select data-approval-filter="rank"><option value="all">All Ranks</option><option value="guard" ${f.rank==='guard'?'selected':''}>Guard</option><option value="officer" ${f.rank==='officer'?'selected':''}>Officer</option><option value="corporal" ${f.rank==='corporal'?'selected':''}>Corporal</option><option value="sergeant" ${f.rank==='sergeant'?'selected':''}>Sergeant</option><option value="supervisor" ${f.rank==='supervisor'?'selected':''}>Supervisor</option></select>
    <select data-approval-filter="experience"><option value="all">All Experience</option><option value="0-1" ${f.experience==='0-1'?'selected':''}>0–1 Years</option><option value="2-4" ${f.experience==='2-4'?'selected':''}>2–4 Years</option><option value="5-plus" ${f.experience==='5-plus'?'selected':''}>5+ Years</option></select>
    <select data-approval-filter="background"><option value="all">Background Check</option><option value="clear" ${f.background==='clear'?'selected':''}>Clear</option><option value="in_progress" ${f.background==='in_progress'?'selected':''}>In Progress</option><option value="issue" ${f.background==='issue'?'selected':''}>Issue Found</option></select>
    <select data-approval-filter="sort"><option value="newest" ${f.sort==='newest'?'selected':''}>Sort: Newest</option><option value="oldest" ${f.sort==='oldest'?'selected':''}>Sort: Oldest</option><option value="priority" ${f.sort==='priority'?'selected':''}>Sort: Priority</option></select>
    <button type="button" data-action="guard-approval-clear-filters">⌁ Filters</button>
  </section>`;
}
function filteredGuardApprovals() {
  let rows = guardApprovalRows();
  const q = String(state.guardApprovalSearch || '').trim().toLowerCase();
  const f = state.guardApprovalFilters || {};
  const tab = state.guardApprovalTab || 'all';
  if (tab !== 'all') rows = rows.filter(app => approvalStatus(app) === tab);
  if (q) rows = rows.filter(app => [app.name, app.email, app.phone, app.application_number, approvalRank(app), app.city, app.state].join(' ').toLowerCase().includes(q));
  if (f.status && f.status !== 'all') rows = rows.filter(app => approvalStatus(app) === f.status);
  if (f.rank && f.rank !== 'all') rows = rows.filter(app => String(approvalRank(app)).toLowerCase() === f.rank);
  if (f.background && f.background !== 'all') rows = rows.filter(app => approvalBackgroundStatus(app) === f.background);
  if (f.experience && f.experience !== 'all') rows = rows.filter(app => {
    const n = approvalExperienceYears(app);
    if (n === null) return false;
    if (f.experience === '0-1') return n <= 1;
    if (f.experience === '2-4') return n >= 2 && n <= 4;
    if (f.experience === '5-plus') return n >= 5;
    return true;
  });
  const priority = { pending: 0, missing_docs: 1, interview: 2, rejected: 3, approved: 4 };
  rows = rows.slice().sort((a,b) => {
    if (f.sort === 'oldest') return new Date(a.created_at || 0) - new Date(b.created_at || 0);
    if (f.sort === 'priority') return (priority[approvalStatus(a)] ?? 9) - (priority[approvalStatus(b)] ?? 9);
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });
  return rows;
}
function selectedGuardApproval() {
  const rows = filteredGuardApprovals();
  return rows.find(app => String(app.id) === String(state.selectedGuardApprovalId)) || rows[0] || null;
}
function approvalStatusBadge(app = {}) {
  const status = approvalStatus(app);
  const label = status === 'interview' ? 'Needs Interview' : status === 'missing_docs' ? 'Missing Docs' : statusText(status);
  return `<span class="approval-status ${esc(status)}">${esc(label)}</span>`;
}
function licenseStatusBadge(app = {}) {
  const status = approvalLicenseStatus(app);
  return `<span class="license-badge ${esc(status)}">${esc(statusText(status))}</span>`;
}
function backgroundStatusBadge(app = {}) {
  const status = approvalBackgroundStatus(app);
  const label = status === 'in_progress' ? 'In Progress' : status === 'issue' ? 'Review' : 'Clear';
  return `<span class="background-badge ${esc(status)}">${esc(label)}</span>`;
}
function isApprovalChecked(id) { return (state.guardApprovalSelectedIds || []).map(String).includes(String(id)); }
function guardApprovalRow(app = {}) {
  const selected = String(state.selectedGuardApprovalId || '') === String(app.id);
  return `<div class="guard-approval-row ${selected ? 'selected' : ''}">
    <label class="approval-check"><input type="checkbox" data-approval-check="${esc(app.id)}" ${isApprovalChecked(app.id) ? 'checked' : ''}></label>
    <button type="button" class="approval-applicant-cell" data-action="select-guard-approval" data-approval-id="${esc(app.id)}">${avatar(app.name || app.email || 'Applicant', app.photo_url)}<span><strong>${esc(app.name || app.email || 'Applicant')}</strong><small>${esc(app.application_number || shortRequestId(app.id))}</small></span></button>
    <div>${esc(approvalRank(app))}</div>
    <div>${esc(approvalExperienceLabel(app))}</div>
    <div>${licenseStatusBadge(app)}</div>
    <div>${backgroundStatusBadge(app)}</div>
    <div><strong>${esc(app.availability || 'Full Time')}</strong><small>${esc(app.preferred_shift || 'Days')}</small></div>
    <div><strong>${esc(fmtDate(app.created_at))}</strong><small>${esc(fmtTime(app.created_at))}</small></div>
    <div>${approvalStatusBadge(app)}</div>
    <div class="approval-actions"><button type="button" data-action="view-approval" data-approval-id="${esc(app.id)}">⊙</button><button type="button" data-action="message-approval" data-approval-id="${esc(app.id)}">☵</button><button type="button" data-action="approve-guard" data-approval-id="${esc(app.id)}">✓</button><button type="button" data-action="reject-guard" data-approval-id="${esc(app.id)}">×</button></div>
  </div>`;
}
function guardApprovalTable() {
  const rows = filteredGuardApprovals();
  const per = Number(state.guardApprovalPerPage || 5);
  const maxPage = Math.max(1, Math.ceil(rows.length / per));
  state.guardApprovalPage = Math.min(Math.max(1, state.guardApprovalPage || 1), maxPage);
  const start = (state.guardApprovalPage - 1) * per;
  const pageRows = rows.slice(start, start + per);
  return `<div class="guard-approval-table"><div class="guard-approval-head-row"><span></span><span>Applicant</span><span>Rank Applied For</span><span>Experience</span><span>License Status</span><span>Background Check</span><span>Availability</span><span>Submitted</span><span>Status</span><span>Actions</span></div>${pageRows.length ? pageRows.map(guardApprovalRow).join('') : '<div class="approval-empty-results">No guard applications match your filters.</div>'}</div>`;
}
function guardApprovalPagination() {
  const rows = filteredGuardApprovals();
  const per = Number(state.guardApprovalPerPage || 5);
  const maxPage = Math.max(1, Math.ceil(rows.length / per));
  const start = rows.length ? (state.guardApprovalPage - 1) * per + 1 : 0;
  const end = Math.min(rows.length, (state.guardApprovalPage || 1) * per);
  return `<footer class="approval-pagination"><span>Showing ${esc(start)} to ${esc(end)} of ${esc(rows.length)} results</span><div><button type="button" data-action="approval-page-prev">‹</button><strong>${esc(state.guardApprovalPage || 1)}</strong><button type="button" data-action="approval-page-next">›</button></div><label>Rows per page: <select data-approval-per-page><option value="5" ${per===5?'selected':''}>5</option><option value="10" ${per===10?'selected':''}>10</option><option value="20" ${per===20?'selected':''}>20</option></select></label></footer>`;
}
function approvalCertifications(app = {}) {
  const certs = Array.isArray(app.certifications) ? app.certifications : ['Unarmed Guard License', 'CPR / First Aid', 'OC Spray Certified', 'Handcuffing Certified', 'Fire Watch Certified'];
  return `<section class="approval-cert-card"><h3>Certifications</h3><div class="approval-check-list">${certs.map(cert => `<span><i>✓</i>${esc(cert)}</span>`).join('')}</div></section>`;
}
function approvalOnboardingChecklist(app = {}) {
  const checklist = [['ID Verified', app.id_verified !== false], ['Guard Card', approvalLicenseStatus(app) === 'active'], ['Background Check', approvalBackgroundStatus(app) === 'clear'], ['Drug Screen', app.drug_screen_status === 'clear' || app.drug_screen_status === true], ['Interview Complete', app.interview_complete === true || approvalStatus(app) === 'approved'], ['Training Docs', app.training_docs_complete === true || approvalStatus(app) === 'approved']];
  return `<section class="approval-onboarding-card"><h3>Onboarding Checklist</h3><div class="approval-check-list">${checklist.map(([label, done]) => `<span class="${done ? 'done' : 'missing'}"><i>${done ? '✓' : '×'}</i>${esc(label)}</span>`).join('')}</div></section>`;
}
function approvalReviewNotes(app = {}) {
  return `<section class="approval-notes-card"><div><h3>Notes / Review Comments</h3><button type="button" data-action="edit-approval-notes" data-approval-id="${esc(app.id)}">Edit</button></div><p>${esc(app.review_notes || app.notes || 'No review notes yet.')}</p><small>— ${esc(app.reviewed_by || 'Dispatch Admin')}, ${esc(fmtDate(app.updated_at || app.created_at))}</small></section>`;
}
function guardApprovalDetailRail() {
  const app = selectedGuardApproval();
  if (!app) return `<aside class="guard-approval-detail-rail"><section class="panel panel-pad guard-approval-detail-card"><div class="empty">Select an application.</div></section></aside>`;
  return `<aside class="guard-approval-detail-rail"><section class="panel panel-pad guard-approval-detail-card">
    <button type="button" class="approval-rail-close" data-action="clear-selected-approval">×</button>
    <div class="approval-profile-head">${avatar(app.name || app.email || 'Applicant', app.photo_url)}<div><h2>${esc(app.name || app.email || 'Applicant')}</h2><p>Applying For: <strong>${esc(approvalRank(app))}</strong></p>${approvalStatusBadge(app)}</div></div>
    <dl class="approval-info-list"><dt>Phone</dt><dd>${esc(app.phone || '—')}</dd><dt>Email</dt><dd>${esc(app.email || '—')}</dd><dt>Location</dt><dd>${esc([app.city, app.state].filter(Boolean).join(', ') || '—')}</dd><dt>Experience</dt><dd>${esc(approvalExperienceLabel(app))}</dd><dt>Guard Card</dt><dd>${esc(app.guard_card_number || app.license_number || '—')}</dd><dt>Availability</dt><dd>${esc(app.availability || 'Full Time')}</dd></dl>
    <div class="approval-detail-split">${approvalCertifications(app)}${approvalOnboardingChecklist(app)}</div>
    ${approvalReviewNotes(app)}
    <div class="approval-detail-actions"><button type="button" class="approve" data-action="approve-guard" data-approval-id="${esc(app.id)}">✓ Approve Guard</button><button type="button" class="info" data-action="request-guard-info" data-approval-id="${esc(app.id)}">✉ Request Info</button><button type="button" class="interview" data-action="schedule-guard-interview" data-approval-id="${esc(app.id)}">▣ Schedule Interview</button><button type="button" class="reject" data-action="reject-guard" data-approval-id="${esc(app.id)}">× Reject Application</button></div>
  </section></aside>`;
}
function guardApprovalsHeader() {
  return `<header class="dashboard-header guard-approvals-header"><div class="title-block"><h1>Guard Approvals</h1><p>Review new guard applications, approve qualified officers, and manage onboarding status.</p></div><div class="approval-header-actions"><span class="system-pill"><i></i>System Operational</span><label class="approval-search"><input type="search" data-guard-approval-search placeholder="Search applicants..." value="${esc(state.guardApprovalSearch || '')}"><b>⌕</b></label><button type="button" data-action="guard-approvals-refresh">⟳ Refresh</button></div></header>`;
}
function guardApprovalsCommandCenterView() {
  const autoSelected = selectedGuardApproval();
  if (autoSelected && !state.selectedGuardApprovalId) state.selectedGuardApprovalId = autoSelected.id;
  return `<div class="dashboard guard-approvals-shell">${guardApprovalsHeader()}${guardApprovalKpiRow()}<section class="guard-approvals-layout"><main class="guard-approvals-main panel">${guardApprovalTabs()}${guardApprovalFilterBar()}${guardApprovalTable()}${guardApprovalPagination()}</main>${guardApprovalDetailRail()}</section></div>`;
}
async function approveGuardApplication(id) {
  const app = guardApprovalRows().find(a => String(a.id) === String(id));
  if (!app) throw new Error('Application not found.');
  saveGuardRank({ id: app.id, email: app.email, signup_id: app.source === 'signup' ? app.id : '' }, approvalRank(app));
  if (app.source === 'signup') {
    await approveSignup('guard', id);
    return;
  }
  saveGuardApprovalOverride(id, { status: 'approved', approved_at: new Date().toISOString() });
  await loadData();
  render();
  toast('Guard approved.', 'success');
}
async function rejectGuardApplication(id) {
  const app = guardApprovalRows().find(a => String(a.id) === String(id));
  if (app?.source === 'signup') {
    await rejectSignup('guard', id);
    return;
  }
  saveGuardApprovalOverride(id, { status: 'rejected', rejected_at: new Date().toISOString() });
  await loadData();
  render();
  toast('Application rejected.', 'success');
}
async function requestGuardMoreInfo(id) {
  saveGuardApprovalOverride(id, { status: 'missing_docs', review_notes: 'Additional information requested by Dispatch.' });
  render();
  toast('Info request sent.', 'success');
}
async function scheduleGuardInterview(id) {
  saveGuardApprovalOverride(id, { status: 'interview', interview_requested_at: new Date().toISOString(), review_notes: 'Interview requested by Dispatch.' });
  render();
  toast('Interview scheduled.', 'success');
}

function renderRoleView() {
  if (state.role === 'admin') {
    if (state.view === 'dashboard') return adminDashboard();
    if (state.view === 'dispatch-board') return dispatchBoardView();
    if (state.view === 'live-gps') return dispatchLiveGpsView();
    if (state.view === 'pending-dispatch') return pendingDispatchView();
    if (state.view === 'scheduled-queue') return scheduledQueueView();
    if (state.view === 'guards') return guardsCommandCenterView();
    if (state.view === 'guard-approvals') return guardApprovalsCommandCenterView();
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
    if (state.view === 'reports') return clientReportsView();
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
  scheduleDispatchLeafletMap();
  scheduleDispatchRoutePrep();
  scheduleClientMapPrep();
  scheduleClientLeafletMap();
  scheduleClientPropertyMapPrep();
  scheduleClientPropertyDetailMap();
  if (state.role === 'client' && state.view === 'patrol-requests') setTimeout(() => updateClientRequestSummaryFromForm(), 0);
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
    if (button.dataset.settingsTab) {
      state.settingsTab = button.dataset.settingsTab;
      render();
      return;
    }
    if (button.dataset.pendingTab) {
      state.pendingDispatchPriorityFilter = button.dataset.pendingTab || 'all';
      state.pendingDispatchPage = 1;
      state.selectedPendingRequestId = '';
      render();
      return;
    }
    if (button.dataset.scheduledTab) {
      state.scheduledQueueTab = button.dataset.scheduledTab || 'all';
      state.scheduledQueuePage = 1;
      state.selectedScheduledRequestId = '';
      render();
      return;
    }
    if (button.dataset.action === 'select-scheduled') {
      state.selectedScheduledRequestId = button.dataset.requestId || '';
      render();
      return;
    }
    if (button.dataset.action === 'scheduled-refresh') {
      await loadData();
      render();
      toast('Scheduled queue refreshed.', 'success');
      return;
    }
    if (button.dataset.action === 'scheduled-clear-filters') {
      state.scheduledQueueTab = 'all';
      state.scheduledQueueSearch = '';
      state.scheduledQueueFilters = { priority: 'all', propertyType: 'all', clientId: 'all', guardId: 'all', scheduleType: 'all' };
      state.scheduledQueuePage = 1;
      state.selectedScheduledRequestId = '';
      render();
      return;
    }
    if (button.dataset.action === 'scheduled-auto-assign') {
      await autoAssignScheduledQueue();
      render();
      toast('Scheduled auto assignment complete.', 'success');
      return;
    }
    if (button.dataset.action === 'scheduled-bulk-reschedule') {
      bulkRescheduleScheduledQueue();
      render();
      toast('Selected schedules moved to the next run window.', 'success');
      return;
    }
    if (button.dataset.action === 'scheduled-page-prev') {
      state.scheduledQueuePage = Math.max(1, (state.scheduledQueuePage || 1) - 1);
      render();
      return;
    }
    if (button.dataset.action === 'scheduled-page-next') {
      const maxPage = Math.max(1, Math.ceil(filteredScheduledQueueRows().length / Number(state.scheduledQueuePerPage || 10)));
      state.scheduledQueuePage = Math.min(maxPage, (state.scheduledQueuePage || 1) + 1);
      render();
      return;
    }
    if (button.dataset.action === 'scheduled-clear-selected') {
      state.selectedScheduledRequestId = '';
      render();
      return;
    }
    if (button.dataset.action === 'scheduled-edit') {
      state.selectedScheduledRequestId = button.dataset.requestId || state.selectedScheduledRequestId;
      toast('Edit mode selected. Full edit modal is ready for the next form build.', 'success');
      render();
      return;
    }
    if (button.dataset.action === 'scheduled-reassign') {
      const reqId = button.dataset.requestId || state.selectedScheduledRequestId;
      const guard = dispatchMapOnlineGuards()[0]?.guard || adminAssignableGuards()[0];
      if (!guard) throw new Error('No active guards available for reassignment.');
      saveScheduledOverride(reqId, { guard_id: guard.id, status: 'scheduled' });
      render();
      toast('Schedule reassigned to the first available online guard.', 'success');
      return;
    }
    if (button.dataset.action === 'scheduled-pause') {
      const reqId = button.dataset.requestId || state.selectedScheduledRequestId;
      const req = state.patrolRequests.find(r => String(r.id) === String(reqId)) || {};
      const paused = scheduleStatusValue(req) === 'paused';
      saveScheduledOverride(reqId, { status: paused ? 'scheduled' : 'paused' });
      render();
      toast(paused ? 'Schedule resumed.' : 'Schedule paused.', 'success');
      return;
    }
    if (button.dataset.action === 'scheduled-view-full') {
      state.selectedScheduledRequestId = button.dataset.requestId || state.selectedScheduledRequestId;
      toast('Full schedule details selected for the next detail build.', 'success');
      return;
    }
    if (button.dataset.action === 'scheduled-view-runs') {
      toast('Upcoming runs are shown in the selected schedule panel.', 'success');
      return;
    }
    if (button.dataset.action === 'scheduled-row-menu') {
      state.selectedScheduledRequestId = button.dataset.requestId || state.selectedScheduledRequestId;
      render();
      toast('Schedule action menu selected.', 'success');
      return;
    }

    if (button.dataset.action === 'select-pending-request') {
      state.selectedPendingRequestId = button.dataset.requestId || '';
      render();
      return;
    }
    if (button.dataset.action === 'assign-pending-request') {
      await assignPendingDispatchRequest(button.dataset.requestId);
      toast('Patrol assigned.', 'success');
      return;
    }
    if (button.dataset.action === 'pending-auto-assign') {
      await autoAssignPendingDispatch();
      toast('Auto assignment complete.', 'success');
      return;
    }
    if (button.dataset.action === 'pending-assign-selected') {
      await assignSelectedPendingDispatch();
      toast('Selected pending request(s) assigned.', 'success');
      return;
    }
    if (button.dataset.action === 'pending-clear-filters') {
      state.pendingDispatchPriorityFilter = 'all';
      state.pendingDispatchSearch = '';
      state.pendingDispatchFilters = { priority: 'all', propertyType: 'all', clientId: 'all', requestedTime: 'all', status: 'all' };
      state.pendingDispatchPage = 1;
      state.selectedPendingRequestId = '';
      render();
      return;
    }
    if (button.dataset.action === 'pending-toggle-filters') {
      state.pendingDispatchFiltersOpen = !state.pendingDispatchFiltersOpen;
      render();
      return;
    }
    if (button.dataset.action === 'pending-refresh') {
      await loadData();
      render();
      toast('Pending dispatch refreshed.', 'success');
      return;
    }
    if (button.dataset.action === 'pending-page-prev') {
      state.pendingDispatchPage = Math.max(1, (state.pendingDispatchPage || 1) - 1);
      render();
      return;
    }
    if (button.dataset.action === 'pending-page-next') {
      const maxPage = Math.max(1, Math.ceil(filteredPendingDispatchRequests().length / Number(state.pendingDispatchPerPage || 6)));
      state.pendingDispatchPage = Math.min(maxPage, (state.pendingDispatchPage || 1) + 1);
      render();
      return;
    }
    if (button.dataset.action === 'pending-request-menu') {
      state.selectedPendingRequestId = button.dataset.requestId || state.selectedPendingRequestId;
      render();
      toast('Request action menu selected for review.', 'success');
      return;
    }
    if (button.dataset.action === 'view-pending-request-details') {
      state.selectedPendingRequestId = button.dataset.requestId || state.selectedPendingRequestId;
      toast('Full request details panel is selected for the next detail build.', 'success');
      return;
    }
    if (button.dataset.action === 'clear-selected-pending') {
      state.selectedPendingRequestId = '';
      render();
      return;
    }
    if (button.dataset.action === 'select-guard') {
      state.selectedGuardId = button.dataset.guardId || '';
      render();
      return;
    }
    if (button.dataset.action === 'message-guard') {
      const guard = state.guards.find(g => String(g.id) === String(button.dataset.guardId)) || selectedGuard();
      if (guard) {
        syncDispatchGuardMessages();
        state.selectedThreadId = dispatchThreadIdForGuard(guard);
      }
      state.view = 'messages';
      render();
      return;
    }
    if (button.dataset.action === 'view-guard-route') {
      state.selectedGuardId = button.dataset.guardId || state.selectedGuardId;
      liveGps.dispatchSelectedGuardId = button.dataset.guardId || '';
      liveGps.selectedMapCard = 'guard';
      state.view = 'live-gps';
      render();
      setTimeout(() => updateDispatchMapCardOnly(), 80);
      return;
    }
    if (button.dataset.action === 'assign-guard-patrol') {
      state.selectedGuardId = button.dataset.guardId || state.selectedGuardId;
      state.view = 'pending-dispatch';
      render();
      toast('Choose a pending request to assign this guard.', 'success');
      return;
    }
    if (button.dataset.action === 'view-guard-profile') {
      state.selectedGuardId = button.dataset.guardId || state.selectedGuardId;
      state.guardProfileMode = 'profile';
      render();
      toast('Guard profile selected in the detail rail.', 'success');
      return;
    }
    if (button.dataset.action === 'guard-menu') {
      state.selectedGuardId = button.dataset.guardId || state.selectedGuardId;
      render();
      toast('Guard actions selected.', 'success');
      return;
    }
    if (button.dataset.action === 'guards-refresh') {
      await loadData();
      render();
      toast('Guards refreshed.', 'success');
      return;
    }
    if (button.dataset.action === 'guards-clear-filters') {
      state.guardsSearch = '';
      state.guardsStatusFilter = 'all';
      state.guardsDutyFilter = 'all';
      state.guardsRankFilter = 'all';
      state.guardsApprovalFilter = 'all';
      state.guardsPage = 1;
      state.selectedGuardId = '';
      render();
      return;
    }
    if (button.dataset.action === 'guards-page-prev') {
      state.guardsPage = Math.max(1, (state.guardsPage || 1) - 1);
      render();
      return;
    }
    if (button.dataset.action === 'guards-page-next') {
      const maxPage = Math.max(1, Math.ceil(filteredGuards().length / Number(state.guardsPerPage || 10)));
      state.guardsPage = Math.min(maxPage, (state.guardsPage || 1) + 1);
      render();
      return;
    }
    if (button.dataset.approvalTab) {
      state.guardApprovalTab = button.dataset.approvalTab || 'all';
      state.guardApprovalPage = 1;
      state.selectedGuardApprovalId = '';
      render();
      return;
    }
    if (button.dataset.action === 'select-guard-approval' || button.dataset.action === 'view-approval') {
      state.selectedGuardApprovalId = button.dataset.approvalId || '';
      render();
      return;
    }
    if (button.dataset.action === 'approve-guard') {
      await approveGuardApplication(button.dataset.approvalId);
      return;
    }
    if (button.dataset.action === 'reject-guard') {
      await rejectGuardApplication(button.dataset.approvalId);
      return;
    }
    if (button.dataset.action === 'request-guard-info') {
      await requestGuardMoreInfo(button.dataset.approvalId);
      return;
    }
    if (button.dataset.action === 'schedule-guard-interview') {
      await scheduleGuardInterview(button.dataset.approvalId);
      return;
    }
    if (button.dataset.action === 'message-approval') {
      state.selectedGuardApprovalId = button.dataset.approvalId || state.selectedGuardApprovalId;
      state.view = 'messages';
      render();
      toast('Applicant message thread selected.', 'success');
      return;
    }
    if (button.dataset.action === 'edit-approval-notes') {
      state.selectedGuardApprovalId = button.dataset.approvalId || state.selectedGuardApprovalId;
      toast('Notes editor selected for next modal build.', 'success');
      return;
    }
    if (button.dataset.action === 'clear-selected-approval') {
      state.selectedGuardApprovalId = '';
      render();
      return;
    }
    if (button.dataset.action === 'guard-approval-clear-filters') {
      state.guardApprovalSearch = '';
      state.guardApprovalTab = 'all';
      state.guardApprovalFilters = { status: 'all', rank: 'all', experience: 'all', background: 'all', sort: 'newest' };
      state.guardApprovalPage = 1;
      state.selectedGuardApprovalId = '';
      render();
      return;
    }
    if (button.dataset.action === 'guard-approvals-refresh') {
      await loadData();
      render();
      toast('Guard approvals refreshed.', 'success');
      return;
    }
    if (button.dataset.action === 'approval-page-prev') {
      state.guardApprovalPage = Math.max(1, (state.guardApprovalPage || 1) - 1);
      render();
      return;
    }
    if (button.dataset.action === 'approval-page-next') {
      const maxPage = Math.max(1, Math.ceil(filteredGuardApprovals().length / Number(state.guardApprovalPerPage || 5)));
      state.guardApprovalPage = Math.min(maxPage, (state.guardApprovalPage || 1) + 1);
      render();
      return;
    }
    if (button.dataset.action === 'clear-selected-guard') {
      state.selectedGuardId = '';
      state.guardProfileMode = 'overview';
      render();
      return;
    }
    if (button.dataset.action === 'zoom-guard-mini-map' || button.dataset.action === 'recenter-guard-mini-map') {
      toast('Mini live-location control selected.', 'success');
      return;
    }
    if (button.dataset.action === 'save-settings') {
      toast('Settings saved for this development session.', 'success');
      return;
    }
    if (button.dataset.action === 'update-settings-password') {
      toast('Password update workflow will connect to auth next.', 'success');
      return;
    }
    if (button.dataset.action === 'settings-login-history' || button.dataset.action === 'settings-quick-action') {
      toast('Settings action queued for the next build.', 'success');
      return;
    }
    if (button.dataset.action === 'export-client-reports') {
      toast('Reports export is queued for the next reporting build.', 'success');
      return;
    }
    if (button.dataset.action === 'view-client-report') {
      const row = clientReportSourceRows().find(r => String(r.id) === String(button.dataset.reportId));
      if (row?.url) window.open(row.url, '_blank', 'noopener');
      else toast('Report preview panel is the next reports feature to build.', 'success');
      return;
    }
    if (button.dataset.action === 'download-client-report') {
      const row = clientReportSourceRows().find(r => String(r.id) === String(button.dataset.reportId));
      if (row?.url) window.open(row.url, '_blank', 'noopener');
      else toast('Download will be available when the final report PDF is generated.', 'success');
      return;
    }
    if (button.dataset.action === 'view-all-report-activity') {
      toast('Full report activity timeline coming next.', 'success');
      return;
    }
    if (button.dataset.action === 'client-report-page-prev') {
      state.clientReportPage = Math.max(1, (state.clientReportPage || 1) - 1);
      render();
      return;
    }
    if (button.dataset.action === 'client-report-page-next') {
      state.clientReportPage = (state.clientReportPage || 1) + 1;
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
    if (button.dataset.action === 'live-gps-search') {
      toast('Use the guard roster or browser search to find live GPS records.', 'success');
      return;
    }
    if (button.dataset.action === 'live-gps-refresh') {
      await loadData();
      state.liveGpsLayersOpen = false;
      render();
      toast('Live GPS refreshed.', 'success');
      return;
    }
    if (button.dataset.action === 'live-gps-layers') {
      state.liveGpsLayersOpen = !state.liveGpsLayersOpen;
      render();
      return;
    }
    if (button.dataset.action === 'live-gps-fullscreen') {
      const panel = document.querySelector('.live-gps-map-panel');
      if (panel?.requestFullscreen) {
        await panel.requestFullscreen();
        return;
      }
      toast('Fullscreen is not available in this browser preview.', 'success');
      return;
    }
    if (button.dataset.action === 'select-live-gps-guard') {
      liveGps.dispatchSelectedGuardId = button.dataset.guardId || '';
      liveGps.selectedMapCard = 'guard';
      updateDispatchMapCardOnly();
      render();
      return;
    }
    if (button.dataset.action === 'select-live-gps-property') {
      liveGps.dispatchSelectedPropertyId = button.dataset.propertyId || '';
      liveGps.selectedMapCard = 'property';
      updateDispatchMapCardOnly();
      render();
      return;
    }
    if (button.dataset.action === 'dispatch-map-default') {
      resetDispatchMapToDefault();
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
      if (state.role === 'client') sendClientDispatchMessage(button.dataset.text || '');
      else sendDispatchGuardMessage(button.dataset.text || '');
      render();
      toast('Message sent.', 'success');
      return;
    }
    if (button.dataset.action === 'select-client-thread') {
      state.selectedThreadId = button.dataset.threadId || '';
      markCurrentClientThreadRead();
      render();
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
    if (form.dataset.form === 'client-dispatch-message') {
      sendClientDispatchMessage(form.message.value);
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

  if (input && input.hasAttribute('data-guard-approval-search')) {
    state.guardApprovalSearch = input.value || '';
    state.guardApprovalPage = 1;
    state.selectedGuardApprovalId = '';
    render();
    return;
  }
  if (input && input.hasAttribute('data-guard-approval-search')) {
    state.guardApprovalSearch = input.value || '';
    state.guardApprovalPage = 1;
    state.selectedGuardApprovalId = '';
    render();
    return;
  }
  if (input && input.hasAttribute('data-approval-filter')) {
    const key = input.dataset.approvalFilter;
    state.guardApprovalFilters = { ...(state.guardApprovalFilters || {}), [key]: input.value || 'all' };
    state.guardApprovalPage = 1;
    state.selectedGuardApprovalId = '';
    render();
    return;
  }
  if (input && input.hasAttribute('data-approval-check')) {
    const id = input.dataset.approvalCheck;
    const set = new Set((state.guardApprovalSelectedIds || []).map(String));
    if (input.checked) set.add(String(id)); else set.delete(String(id));
    state.guardApprovalSelectedIds = [...set];
    return;
  }
  if (input && input.hasAttribute('data-approval-per-page')) {
    state.guardApprovalPerPage = Number(input.value || 5);
    state.guardApprovalPage = 1;
    render();
    return;
  }
  if (input && input.hasAttribute('data-guards-search')) {
    state.guardsSearch = input.value || '';
    state.guardsPage = 1;
    state.selectedGuardId = '';
    render();
    return;
  }
  if (input && input.hasAttribute('data-pending-search')) {
    state.pendingDispatchSearch = input.value || '';
    state.pendingDispatchPage = 1;
    render();
    return;
  }
  if (input && input.hasAttribute('data-scheduled-search')) {
    state.scheduledQueueSearch = input.value || '';
    state.scheduledQueuePage = 1;
    render();
    return;
  }
  if (input && input.hasAttribute('data-pending-filter')) {
    const key = input.dataset.pendingFilter;
    state.pendingDispatchFilters = { ...(state.pendingDispatchFilters || {}), [key]: input.value || 'all' };
    state.pendingDispatchPage = 1;
    state.selectedPendingRequestId = '';
    render();
    return;
  }
  if (input && input.hasAttribute('data-pending-per-page')) {
    state.pendingDispatchPerPage = Number(input.value || 6);
    state.pendingDispatchPage = 1;
    render();
    return;
  }
  if (input && input.hasAttribute('data-pending-request-check')) {
    const id = input.dataset.pendingRequestCheck;
    const set = new Set((state.pendingDispatchSelectedIds || []).map(String));
    if (input.checked) set.add(String(id)); else set.delete(String(id));
    state.pendingDispatchSelectedIds = [...set];
    return;
  }
  if (input && input.hasAttribute('data-scheduled-filter')) {
    const key = input.dataset.scheduledFilter;
    state.scheduledQueueFilters = { ...(state.scheduledQueueFilters || {}), [key]: input.value || 'all' };
    state.scheduledQueuePage = 1;
    state.selectedScheduledRequestId = '';
    render();
    return;
  }
  if (input && input.hasAttribute('data-scheduled-per-page')) {
    state.scheduledQueuePerPage = Number(input.value || 10);
    state.scheduledQueuePage = 1;
    render();
    return;
  }
  if (input && input.hasAttribute('data-scheduled-check')) {
    const id = input.dataset.scheduledCheck;
    const set = new Set((state.scheduledQueueSelectedIds || []).map(String));
    if (input.checked) set.add(String(id)); else set.delete(String(id));
    state.scheduledQueueSelectedIds = [...set];
    return;
  }
  if (input && input.hasAttribute('data-assign-guard') && state.role === 'admin' && state.view === 'pending-dispatch') {
    const requestId = input.dataset.assignGuard;
    state.pendingDispatchGuardSelections = { ...(state.pendingDispatchGuardSelections || {}), [requestId]: input.value || '' };
    const req = state.patrolRequests.find(r => String(r.id) === String(requestId));
    if (req) {
      const entry = dispatchMapOnlineGuards().find(e => String(e.guard.id) === String(input.value));
      const end = getPropertyCoords(req);
      if (entry?.coords && end) ensureDispatchRoute(entry.coords, end);
    }
    render();
    return;
  }
  if (input && input.hasAttribute('data-live-gps-view-mode')) {
    state.liveGpsViewMode = input.value || 'default';
    liveGps.selectedMapCard = null;
    render();
    return;
  }
  if (input && input.name === 'live_gps_layer') {
    state.liveGpsViewMode = input.value || 'default';
    liveGps.selectedMapCard = null;
    render();
    return;
  }
  if (input && input.hasAttribute('data-client-report-property-filter')) {
    state.clientReportPropertyFilter = input.value || 'all';
    state.clientReportPage = 1;
    render();
    return;
  }
  if (input && input.hasAttribute('data-client-report-status-filter')) {
    state.clientReportStatusFilter = input.value || 'all';
    state.clientReportPage = 1;
    render();
    return;
  }
  if (input && input.hasAttribute('data-client-request-type-select')) {
    state.clientRequestType = input.value || 'immediate';
    updateClientRequestSummaryFromForm(input.closest('[data-form="client-patrol-request"]'));
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
  if (input && input.hasAttribute('data-client-report-search')) {
    state.clientReportSearch = input.value || '';
    state.clientReportPage = 1;
    render();
  }
  if (input && input.closest?.('[data-form="client-patrol-request"]')) {
    syncClientRequestFormStateFromInput(input);
  }
});

document.addEventListener('change', event => {
  const input = event.target;
  if (input && input.hasAttribute('data-guards-search')) {
    state.guardsSearch = input.value || '';
    state.guardsPage = 1;
    state.selectedGuardId = '';
    render();
    return;
  }
  if (input && input.hasAttribute('data-guards-search')) {
    state.guardsSearch = input.value || '';
    state.guardsPage = 1;
    state.selectedGuardId = '';
    render();
    return;
  }
  if (input && input.hasAttribute('data-guards-filter')) {
    const key = input.dataset.guardsFilter;
    if (key === 'status') state.guardsStatusFilter = input.value || 'all';
    if (key === 'duty') state.guardsDutyFilter = input.value || 'all';
    if (key === 'rank') state.guardsRankFilter = input.value || 'all';
    if (key === 'approval') state.guardsApprovalFilter = input.value || 'all';
    state.guardsPage = 1;
    state.selectedGuardId = '';
    render();
    return;
  }
  if (input && input.hasAttribute('data-guards-per-page')) {
    state.guardsPerPage = Number(input.value || 10);
    state.guardsPage = 1;
    render();
    return;
  }
  if (input && input.hasAttribute('data-pending-search')) {
    state.pendingDispatchSearch = input.value || '';
    state.pendingDispatchPage = 1;
    render();
    return;
  }
  if (input && input.hasAttribute('data-scheduled-search')) {
    state.scheduledQueueSearch = input.value || '';
    state.scheduledQueuePage = 1;
    render();
    return;
  }
  if (input && input.hasAttribute('data-pending-filter')) {
    const key = input.dataset.pendingFilter;
    state.pendingDispatchFilters = { ...(state.pendingDispatchFilters || {}), [key]: input.value || 'all' };
    state.pendingDispatchPage = 1;
    state.selectedPendingRequestId = '';
    render();
    return;
  }
  if (input && input.hasAttribute('data-pending-per-page')) {
    state.pendingDispatchPerPage = Number(input.value || 6);
    state.pendingDispatchPage = 1;
    render();
    return;
  }
  if (input && input.hasAttribute('data-pending-request-check')) {
    const id = input.dataset.pendingRequestCheck;
    const set = new Set((state.pendingDispatchSelectedIds || []).map(String));
    if (input.checked) set.add(String(id)); else set.delete(String(id));
    state.pendingDispatchSelectedIds = [...set];
    return;
  }
  if (input && input.hasAttribute('data-scheduled-filter')) {
    const key = input.dataset.scheduledFilter;
    state.scheduledQueueFilters = { ...(state.scheduledQueueFilters || {}), [key]: input.value || 'all' };
    state.scheduledQueuePage = 1;
    state.selectedScheduledRequestId = '';
    render();
    return;
  }
  if (input && input.hasAttribute('data-scheduled-per-page')) {
    state.scheduledQueuePerPage = Number(input.value || 10);
    state.scheduledQueuePage = 1;
    render();
    return;
  }
  if (input && input.hasAttribute('data-scheduled-check')) {
    const id = input.dataset.scheduledCheck;
    const set = new Set((state.scheduledQueueSelectedIds || []).map(String));
    if (input.checked) set.add(String(id)); else set.delete(String(id));
    state.scheduledQueueSelectedIds = [...set];
    return;
  }
  if (input && input.hasAttribute('data-assign-guard') && state.role === 'admin' && state.view === 'pending-dispatch') {
    const requestId = input.dataset.assignGuard;
    state.pendingDispatchGuardSelections = { ...(state.pendingDispatchGuardSelections || {}), [requestId]: input.value || '' };
    const req = state.patrolRequests.find(r => String(r.id) === String(requestId));
    if (req) {
      const entry = dispatchMapOnlineGuards().find(e => String(e.guard.id) === String(input.value));
      const end = getPropertyCoords(req);
      if (entry?.coords && end) ensureDispatchRoute(entry.coords, end);
    }
    render();
    return;
  }
  if (input && input.hasAttribute('data-live-gps-view-mode')) {
    state.liveGpsViewMode = input.value || 'default';
    liveGps.selectedMapCard = null;
    render();
    return;
  }
  if (input && input.name === 'live_gps_layer') {
    state.liveGpsViewMode = input.value || 'default';
    liveGps.selectedMapCard = null;
    render();
    return;
  }
  if (input && input.hasAttribute('data-client-report-property-filter')) {
    state.clientReportPropertyFilter = input.value || 'all';
    state.clientReportPage = 1;
    render();
    return;
  }
  if (input && input.hasAttribute('data-client-report-status-filter')) {
    state.clientReportStatusFilter = input.value || 'all';
    state.clientReportPage = 1;
    render();
    return;
  }
  if (input && input.hasAttribute('data-client-request-type-select')) {
    state.clientRequestType = input.value || 'immediate';
    updateClientRequestSummaryFromForm(input.closest('[data-form="client-patrol-request"]'));
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
  if (input && input.hasAttribute('data-settings-photo-file')) {
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast('Profile photo must be an image file.');
      input.value = '';
      return;
    }
    const preview = document.querySelector('[data-settings-photo-preview]');
    if (preview) {
      const url = URL.createObjectURL(file);
      preview.innerHTML = `<img src="${esc(url)}" alt="Profile photo preview"><em>📷</em>`;
    }
  }
});

setInterval(ensureBadge, 1000);
initialize();
