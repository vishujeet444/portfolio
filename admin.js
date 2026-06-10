/**
 * ============================================================
 * VISHWAJEET KUMAR — PORTFOLIO ADMIN PANEL
 * admin.js — Full Supabase Auth + CRUD logic
 * ============================================================
 */

// ─── Supabase Config ────────────────────────────────────────
// Replace with your real project values from:
// Supabase Dashboard → Project Settings → API
const SUPABASE_URL     = 'https://xslladmcnbjmyyzlwswn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_YZUprzU3fI6EGEVEA_VVkw_2RHKvUVG';

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Auth Token ─────────────────────────────────────────────
let currentSession = null;

function getAuthHeaders() {
    if (!currentSession) return {};
    return { 'Authorization': `Bearer ${currentSession.access_token}` };
}

// ─── Toast Notification ──────────────────────────────────────
function toast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info'}"></i>
        <span>${message}</span>
    `;
    container.appendChild(el);
    setTimeout(() => el.classList.add('show'), 10);
    setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => el.remove(), 400);
    }, 3500);
}

// ─── Screen Switcher ─────────────────────────────────────────
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// ─── Background Particle Canvas ──────────────────────────────
(function initParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 60 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.5 + 0.3,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        color: Math.random() > 0.5 ? '#00d4ff' : '#bf00ff',
        o: Math.random() * 0.4 + 0.1
    }));

    function draw() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            p.x += p.dx; p.y += p.dy;
            if (p.x < 0 || p.x > W) p.dx *= -1;
            if (p.y < 0 || p.y > H) p.dy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.o;
            ctx.fill();
        });
        ctx.globalAlpha = 1;
        requestAnimationFrame(draw);
    }
    draw();
})();

// ─── Tab Navigation ──────────────────────────────────────────
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');

        // Load tab data on switch
        if (btn.dataset.tab === 'messages') loadMessages();
        if (btn.dataset.tab === 'projects') loadProjects();
        if (btn.dataset.tab === 'models') loadModels();
        if (btn.dataset.tab === 'experience') loadExperience();
    });
});

// ─── LOGIN ────────────────────────────────────────────────────
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn      = e.target.querySelector('button[type="submit"]');

    btn.disabled = true;
    btn.innerHTML = '<span>Authenticating...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

    const { data, error } = await sb.auth.signInWithPassword({ email, password });

    if (error) {
        toast(`Login failed: ${error.message}`, 'error');
        btn.disabled = false;
        btn.innerHTML = '<span>Login Securely</span> <i class="fa-solid fa-key"></i>';
        return;
    }

    currentSession = data.session;
    document.getElementById('user-email-display').innerHTML =
        `<i class="fa-regular fa-user"></i> ${data.user.email}`;

    showScreen('dashboard-screen');
    loadMessages();
    loadStats();
    toast('Welcome back! You are logged in.', 'success');
});

// ─── LOGOUT ──────────────────────────────────────────────────
document.getElementById('btn-logout').addEventListener('click', async () => {
    await sb.auth.signOut();
    currentSession = null;
    showScreen('login-screen');
    toast('Logged out successfully.', 'info');
});

// ─── AUTO-RESTORE SESSION ────────────────────────────────────
(async function restoreSession() {
    const { data: { session } } = await sb.auth.getSession();
    if (session) {
        currentSession = session;
        document.getElementById('user-email-display').innerHTML =
            `<i class="fa-regular fa-user"></i> ${session.user.email}`;
        showScreen('dashboard-screen');
        loadMessages();
        loadStats();
    }
})();

// ─── STATS (dashboard badge counts) ─────────────────────────
async function loadStats() {
    try {
        const res  = await fetch('/api/stats', { headers: getAuthHeaders() });
        const data = await res.json();
        if (!res.ok || !data.stats) return;

        const badge = document.getElementById('message-badge');
        if (badge) badge.textContent = data.stats.messages.unread || 0;
    } catch (e) {
        // stats are non-critical — fail silently
        console.warn('[stats] Could not load stats:', e.message);
    }
}

// ════════════════════════════════════════════════════════════
// MESSAGES
// ════════════════════════════════════════════════════════════
async function loadMessages(page = 1) {
    const list = document.getElementById('messages-list');
    list.innerHTML = `<div class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i> Loading messages...</div>`;

    try {
        const res  = await fetch(`/api/messages?page=${page}&limit=20`, { headers: getAuthHeaders() });
        const json = await res.json();

        if (!res.ok) throw new Error(json.error || 'Failed to load messages');

        // New paginated response: { data: [...], pagination: {...} }
        const data       = json.data       || json; // backward compat
        const pagination = json.pagination || null;

        // Update badge from stats (unread count)
        loadStats();

        if (data.length === 0) {
            list.innerHTML = `<div class="empty-state"><i class="fa-regular fa-envelope-open"></i><p>No messages yet. Check back after sharing your portfolio!</p></div>`;
            return;
        }

        list.innerHTML = data.map(msg => `
            <div class="message-card glass-panel${msg.is_read ? '' : ' msg-unread'}" id="msg-${msg.id}">
                <div class="message-meta">
                    <div>
                        <strong>${escHtml(msg.name)}</strong>
                        <a href="mailto:${escHtml(msg.email)}" class="msg-email">${escHtml(msg.email)}</a>
                    </div>
                    <div style="display:flex;gap:8px;align-items:center">
                        ${!msg.is_read ? `<span class="unread-dot" title="Unread"></span>` : ''}
                        <span class="msg-date">${formatDate(msg.created_at)}</span>
                    </div>
                </div>
                <p class="msg-body">${escHtml(msg.message)}</p>
                <div class="message-actions">
                    ${!msg.is_read ? `<button class="btn btn-secondary btn-sm" onclick="markRead('${msg.id}')">
                        <i class="fa-solid fa-check"></i> Mark Read
                    </button>` : ''}
                    <a href="mailto:${escHtml(msg.email)}?subject=Re: Your message&body=Hi ${escHtml(msg.name)},%0D%0A%0D%0A" class="btn btn-secondary btn-sm">
                        <i class="fa-solid fa-reply"></i> Reply
                    </a>
                    <button class="btn btn-danger btn-sm" onclick="deleteMessage('${msg.id}')">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');

        // Pagination controls
        if (pagination && pagination.pages > 1) {
            list.innerHTML += `
                <div class="pagination" style="display:flex;gap:8px;justify-content:center;margin-top:16px">
                    ${page > 1 ? `<button class="btn btn-secondary btn-sm" onclick="loadMessages(${page - 1})">← Prev</button>` : ''}
                    <span style="line-height:32px;opacity:.6">Page ${pagination.page} of ${pagination.pages}</span>
                    ${page < pagination.pages ? `<button class="btn btn-secondary btn-sm" onclick="loadMessages(${page + 1})">Next →</button>` : ''}
                </div>
            `;
        }
    } catch (err) {
        list.innerHTML = `<div class="error-state"><i class="fa-solid fa-triangle-exclamation"></i><p>${err.message}</p></div>`;
        toast(err.message, 'error');
    }
}

async function markRead(id) {
    try {
        const res = await fetch('/api/messages', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify({ id })
        });
        if (!res.ok) throw new Error('Could not mark as read');
        // Update UI in place
        const card = document.getElementById(`msg-${id}`);
        if (card) {
            card.classList.remove('msg-unread');
            card.querySelector('.unread-dot')?.remove();
            card.querySelector('[onclick*="markRead"]')?.remove();
        }
        loadStats(); // update badge
        toast('Marked as read.', 'info');
    } catch (err) {
        toast(err.message, 'error');
    }
}

async function deleteMessage(id) {
    if (!confirm('Delete this message? This cannot be undone.')) return;
    try {
        const res  = await fetch('/api/messages', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Delete failed');
        document.getElementById(`msg-${id}`)?.remove();
        toast('Message deleted.', 'success');
        const badge = document.getElementById('message-badge');
        badge.textContent = Math.max(0, parseInt(badge.textContent || '0') - 1);
    } catch (err) {
        toast(err.message, 'error');
    }
}

document.getElementById('btn-refresh-messages').addEventListener('click', () => {
    loadMessages();
    toast('Messages refreshed.', 'info');
});

// ════════════════════════════════════════════════════════════
// PROJECTS
// ════════════════════════════════════════════════════════════
async function loadProjects() {
    const list = document.getElementById('projects-list');
    list.innerHTML = `<div class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i> Loading projects...</div>`;

    try {
        const res  = await fetch('/api/projects', { headers: getAuthHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load projects');

        if (data.length === 0) {
            list.innerHTML = `<div class="empty-state"><i class="fa-regular fa-image"></i><p>No projects yet. Add your first project!</p></div>`;
            return;
        }

        list.innerHTML = data.map(p => `
            <div class="project-card glass-panel" id="proj-${p.id}">
                <div class="project-thumb">
                    <img src="${escHtml(p.beauty_image)}" alt="${escHtml(p.title)}" loading="lazy"
                        onerror="this.src='https://via.placeholder.com/400x220?text=No+Image'">
                    <span class="project-badge">${escHtml(p.category)}</span>
                </div>
                <div class="project-info">
                    <h4>${escHtml(p.title)}</h4>
                    <p>${escHtml(p.description).substring(0, 100)}${p.description.length > 100 ? '…' : ''}</p>
                </div>
                <div class="project-actions">
                    <button class="btn btn-secondary btn-sm" onclick="openProjectModal(${JSON.stringify(p).replace(/"/g, '&quot;')})">
                        <i class="fa-solid fa-pen-to-square"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProject('${p.id}')">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        list.innerHTML = `<div class="error-state"><i class="fa-solid fa-triangle-exclamation"></i><p>${err.message}</p></div>`;
        toast(err.message, 'error');
    }
}

function openProjectModal(project = null) {
    const modal  = document.getElementById('project-modal');
    const title  = document.getElementById('project-modal-title');
    const form   = document.getElementById('project-form');

    form.reset();
    document.getElementById('project-id').value = '';

    if (project) {
        title.textContent = 'Edit Project';
        document.getElementById('project-id').value          = project.id;
        document.getElementById('project-title').value       = project.title;
        document.getElementById('project-category').value    = project.category;
        document.getElementById('project-description').value = project.description;
        document.getElementById('project-beauty-url').value  = project.beauty_image || '';
        document.getElementById('project-wire-url').value    = project.wire_image   || '';
        document.getElementById('project-clay-url').value    = project.clay_image   || '';
    } else {
        title.textContent = 'Add New Project';
    }

    modal.classList.add('active');
}

function closeProjectModal() {
    document.getElementById('project-modal').classList.remove('active');
}

document.getElementById('btn-add-project').addEventListener('click', () => openProjectModal());
document.getElementById('btn-cancel-project').addEventListener('click', closeProjectModal);
document.getElementById('btn-close-project-modal').addEventListener('click', closeProjectModal);
document.getElementById('project-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeProjectModal();
});

document.getElementById('project-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id          = document.getElementById('project-id').value;
    const beautyFile  = document.getElementById('project-beauty-file').files[0];
    const wireFile    = document.getElementById('project-wire-file').files[0];
    const clayFile    = document.getElementById('project-clay-file').files[0];

    const submitBtn = document.getElementById('btn-submit-project');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Saving...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

    try {
        // Upload files to Supabase Storage if provided
        let beautyUrl = document.getElementById('project-beauty-url').value.trim();
        let wireUrl   = document.getElementById('project-wire-url').value.trim();
        let clayUrl   = document.getElementById('project-clay-url').value.trim();

        if (beautyFile) beautyUrl = await uploadFile(beautyFile);
        if (wireFile)   wireUrl   = await uploadFile(wireFile);
        if (clayFile)   clayUrl   = await uploadFile(clayFile);

        const payload = {
            title:        document.getElementById('project-title').value.trim(),
            category:     document.getElementById('project-category').value,
            description:  document.getElementById('project-description').value.trim(),
            beauty_image: beautyUrl,
            wire_image:   wireUrl || null,
            clay_image:   clayUrl || null,
        };

        const method = id ? 'PUT' : 'POST';
        if (id) payload.id = id;

        const res  = await fetch('/api/projects', {
            method,
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Save failed');

        toast(id ? 'Project updated!' : 'Project added!', 'success');
        closeProjectModal();
        loadProjects();
    } catch (err) {
        toast(err.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Save Project</span> <i class="fa-solid fa-save"></i>';
    }
});

async function deleteProject(id) {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    try {
        const res  = await fetch('/api/projects', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Delete failed');
        document.getElementById(`proj-${id}`)?.remove();
        toast('Project deleted.', 'success');
    } catch (err) {
        toast(err.message, 'error');
    }
}

// ════════════════════════════════════════════════════════════
// EXPERIENCE / EDUCATION
// ════════════════════════════════════════════════════════════
async function loadExperience() {
    const list = document.getElementById('experience-list');
    list.innerHTML = `<div class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i> Loading milestones...</div>`;

    try {
        const res  = await fetch('/api/experience', { headers: getAuthHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load experience');

        if (data.length === 0) {
            list.innerHTML = `<div class="empty-state"><i class="fa-solid fa-briefcase"></i><p>No milestones yet. Add your education or work history!</p></div>`;
            return;
        }

        list.innerHTML = data.map(item => `
            <div class="experience-item glass-panel" id="exp-${item.id}">
                <div class="exp-icon">
                    <i class="fa-solid ${item.type === 'work' ? 'fa-briefcase' : 'fa-graduation-cap'}"></i>
                </div>
                <div class="exp-body">
                    <div class="exp-header">
                        <div>
                            <h4>${escHtml(item.role)}</h4>
                            <span class="exp-company">${escHtml(item.company)}</span>
                        </div>
                        <div class="exp-meta">
                            <span class="exp-date">${escHtml(item.duration)}</span>
                            <span class="exp-type-badge ${item.type}">${item.type === 'work' ? 'Work' : 'Education'}</span>
                        </div>
                    </div>
                    <p>${escHtml(item.description)}</p>
                </div>
                <div class="exp-actions">
                    <button class="btn btn-secondary btn-sm" onclick="openExpModal(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                        <i class="fa-solid fa-pen-to-square"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteExperience('${item.id}')">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        list.innerHTML = `<div class="error-state"><i class="fa-solid fa-triangle-exclamation"></i><p>${err.message}</p></div>`;
        toast(err.message, 'error');
    }
}

function openExpModal(item = null) {
    const modal = document.getElementById('experience-modal');
    const title = document.getElementById('experience-modal-title');
    const form  = document.getElementById('experience-form');

    form.reset();
    document.getElementById('experience-id').value = '';

    if (item) {
        title.textContent = 'Edit Milestone';
        document.getElementById('experience-id').value    = item.id;
        document.getElementById('exp-role').value         = item.role;
        document.getElementById('exp-type').value         = item.type;
        document.getElementById('exp-company').value      = item.company;
        document.getElementById('exp-duration').value     = item.duration;
        document.getElementById('exp-description').value  = item.description;
    } else {
        title.textContent = 'Add Milestone';
    }

    modal.classList.add('active');
}

function closeExpModal() {
    document.getElementById('experience-modal').classList.remove('active');
}

document.getElementById('btn-add-experience').addEventListener('click', () => openExpModal());
document.getElementById('btn-cancel-experience').addEventListener('click', closeExpModal);
document.getElementById('btn-close-experience-modal').addEventListener('click', closeExpModal);
document.getElementById('experience-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeExpModal();
});

document.getElementById('experience-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id         = document.getElementById('experience-id').value;
    const submitBtn  = document.getElementById('btn-submit-experience');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Saving...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

    try {
        const payload = {
            role:        document.getElementById('exp-role').value.trim(),
            type:        document.getElementById('exp-type').value,
            company:     document.getElementById('exp-company').value.trim(),
            duration:    document.getElementById('exp-duration').value.trim(),
            description: document.getElementById('exp-description').value.trim(),
        };

        const method = id ? 'PUT' : 'POST';
        if (id) payload.id = id;

        const res  = await fetch('/api/experience', {
            method,
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Save failed');

        toast(id ? 'Milestone updated!' : 'Milestone added!', 'success');
        closeExpModal();
        loadExperience();
    } catch (err) {
        toast(err.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Save Milestone</span> <i class="fa-solid fa-save"></i>';
    }
});

async function deleteExperience(id) {
    if (!confirm('Delete this milestone? This cannot be undone.')) return;
    try {
        const res  = await fetch('/api/experience', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Delete failed');
        document.getElementById(`exp-${id}`)?.remove();
        toast('Milestone deleted.', 'success');
    } catch (err) {
        toast(err.message, 'error');
    }
}

// ════════════════════════════════════════════════════════════
// 3D MODELS (Interactive Lab)
// ════════════════════════════════════════════════════════════
let pendingModelFile = null;

async function loadModels() {
    const list = document.getElementById('models-list');
    if (!list) return;
    list.innerHTML = `<div class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i> Loading models...</div>`;

    try {
        const res = await fetch('/api/models', { headers: getAuthHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load models');

        if (!data.length) {
            list.innerHTML = `<div class="empty-state"><i class="fa-solid fa-cube"></i><p>No 3D models yet. Upload your first asset.</p></div>`;
            return;
        }

        list.innerHTML = data.map(m => `
            <div class="project-card glass-panel" id="model-${m.id}">
                <div class="project-thumb">
                    <img src="${escHtml(m.thumbnail || 'https://via.placeholder.com/400x220?text=3D+Model')}" alt="${escHtml(m.title)}" loading="lazy"
                        onerror="this.src='https://via.placeholder.com/400x220?text=3D+Model'">
                    <span class="project-badge">${escHtml(m.category)}</span>
                    ${m.featured ? '<span class="project-badge" style="right:auto;left:8px;background:var(--neon)">Featured</span>' : ''}
                </div>
                <div class="project-info">
                    <h4>${escHtml(m.title)}</h4>
                    <p>${escHtml((m.description || '').substring(0, 80))}${(m.description || '').length > 80 ? '…' : ''}</p>
                    <p class="type-hint"><i class="fa-solid fa-eye"></i> ${m.views || 0} views · ${(m.file_format || 'glb').toUpperCase()}</p>
                </div>
                <div class="project-actions">
                    <button class="btn btn-secondary btn-sm" onclick="toggleModelFeatured('${m.id}', ${!m.featured})">
                        <i class="fa-solid fa-star"></i> ${m.featured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="openModelModal(${JSON.stringify(m).replace(/"/g, '&quot;')})">
                        <i class="fa-solid fa-pen"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteModel('${m.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        list.innerHTML = `<div class="error-state"><p>${err.message}</p></div>`;
        toast(err.message, 'error');
    }
}

function openModelModal(model = null) {
    const modal = document.getElementById('model-modal');
    const form = document.getElementById('model-form');
    form.reset();
    pendingModelFile = null;
    document.getElementById('model-id').value = '';
    document.getElementById('model-file-name').textContent = '';
    document.getElementById('model-visibility').checked = true;

    if (model) {
        document.getElementById('model-modal-title').textContent = 'Edit 3D Model';
        document.getElementById('model-id').value = model.id;
        document.getElementById('model-title').value = model.title;
        document.getElementById('model-category').value = model.category || 'Abstract';
        document.getElementById('model-software').value = model.software || '';
        document.getElementById('model-description').value = model.description || '';
        document.getElementById('model-polycount').value = model.polycount || 0;
        document.getElementById('model-tags').value = (model.tags || []).join(', ');
        document.getElementById('model-thumbnail-url').value = model.thumbnail || '';
        document.getElementById('model-featured').checked = !!model.featured;
        document.getElementById('model-visibility').checked = model.visibility !== false;
    } else {
        document.getElementById('model-modal-title').textContent = 'Upload 3D Model';
    }
    modal.classList.add('active');
}

function closeModelModal() {
    document.getElementById('model-modal')?.classList.remove('active');
    pendingModelFile = null;
}

function setModelFile(file) {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    const allowed = ['glb', 'gltf', 'fbx', 'obj', 'usdz'];
    if (!allowed.includes(ext)) {
        toast('Unsupported format. Use GLB, GLTF, FBX, OBJ, or USDZ.', 'error');
        return;
    }
    pendingModelFile = file;
    document.getElementById('model-file-name').textContent = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
    if (!document.getElementById('model-title').value) {
        document.getElementById('model-title').value = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    }
}

document.getElementById('btn-add-model')?.addEventListener('click', () => openModelModal());
document.getElementById('btn-cancel-model')?.addEventListener('click', closeModelModal);
document.getElementById('btn-close-model-modal')?.addEventListener('click', closeModelModal);
document.getElementById('model-modal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModelModal();
});
document.getElementById('btn-pick-model')?.addEventListener('click', () => document.getElementById('model-file')?.click());
document.getElementById('model-file')?.addEventListener('change', (e) => setModelFile(e.target.files[0]));

const dropZone = document.getElementById('model-drop-zone');
if (dropZone) {
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        setModelFile(file);
    });
}

document.getElementById('model-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('model-id').value;
    const btn = document.getElementById('btn-submit-model');
    btn.disabled = true;
    btn.innerHTML = '<span>Publishing…</span> <i class="fa-solid fa-spinner fa-spin"></i>';

    try {
        let modelUrl = null;
        let thumbUrl = document.getElementById('model-thumbnail-url').value.trim();
        const thumbFile = document.getElementById('model-thumbnail-file').files[0];

        if (pendingModelFile) {
            modelUrl = await uploadModelFile(pendingModelFile);
        } else if (!id) {
            throw new Error('Select a 3D file to upload');
        }

        if (thumbFile) thumbUrl = await uploadFile(thumbFile, 'models/thumbnails');

        const tags = document.getElementById('model-tags').value
            .split(',')
            .map(t => t.trim())
            .filter(Boolean);

        const payload = {
            title: document.getElementById('model-title').value.trim(),
            description: document.getElementById('model-description').value.trim(),
            software: document.getElementById('model-software').value.trim(),
            category: document.getElementById('model-category').value,
            polycount: parseInt(document.getElementById('model-polycount').value, 10) || 0,
            tags,
            thumbnail: thumbUrl || null,
            featured: document.getElementById('model-featured').checked,
            visibility: document.getElementById('model-visibility').checked,
        };

        if (modelUrl) {
            payload.model_url = modelUrl;
            payload.file_format = pendingModelFile.name.split('.').pop().toLowerCase();
            payload.file_size = pendingModelFile.size;
        }

        let res;
        if (id) {
            payload.id = id;
            res = await fetch('/api/models', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify(payload),
            });
        } else if (modelUrl) {
            res = await fetch('/api/models/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify(payload),
            });
        } else {
            res = await fetch('/api/models', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify(payload),
            });
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Save failed');

        toast(id ? 'Model updated.' : 'Model published.', 'success');
        closeModelModal();
        loadModels();
    } catch (err) {
        toast(err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>Publish</span> <i class="fa-solid fa-save"></i>';
    }
});

async function toggleModelFeatured(id, featured) {
    try {
        const res = await fetch('/api/models', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify({ action: 'feature', id, featured }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        toast(featured ? 'Model featured.' : 'Removed from featured.', 'success');
        loadModels();
    } catch (err) {
        toast(err.message, 'error');
    }
}

async function deleteModel(id) {
    if (!confirm('Delete this 3D model?')) return;
    try {
        const res = await fetch('/api/models', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify({ id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Delete failed');
        document.getElementById(`model-${id}`)?.remove();
        toast('Model deleted.', 'success');
    } catch (err) {
        toast(err.message, 'error');
    }
}

async function uploadModelFile(file) {
    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;
    const path = `models/${filename}`;

    const { error } = await sb.storage
        .from('portfolio-assets')
        .upload(path, file, { cacheControl: '3600', upsert: false });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const { data: urlData } = sb.storage.from('portfolio-assets').getPublicUrl(path);
    return urlData.publicUrl;
}

// ════════════════════════════════════════════════════════════
// SUPABASE STORAGE UPLOAD
// ════════════════════════════════════════════════════════════
async function uploadFile(file, folder = 'projects') {
    const ext      = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;
    const path     = `${folder}/${filename}`;

    const { data, error } = await sb.storage
        .from('portfolio-assets')
        .upload(path, file, { cacheControl: '3600', upsert: false });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const { data: urlData } = sb.storage.from('portfolio-assets').getPublicUrl(path);
    return urlData.publicUrl;
}

// ════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════
function escHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

console.log('%c🎬 VK Admin Portal', 'color:#00d4ff; font-size:16px; font-weight:bold;');
