/* ============================================================
   ZHA BILL — admin shell
   Include AFTER ../data.js on every /admin/* page except login.
   Guards the route, then renders sidebar + header into
   #adminSidebarSlot / #adminHeaderSlot placeholders.
   ============================================================ */
(function guard(){
  if(!ZB.adminExists() ){
    window.location.href = 'login.html';
    return;
  }
  if(!ZB.hasValidSession()){
    window.location.href = 'login.html';
  }
})();

const NAV_ITEMS = [
  { href:'dashboard.html', icon:'📊', label:'Dashboard' },
  { href:'users.html',     icon:'👤', label:'Users' },
  { href:'products.html',  icon:'📦', label:'Products/Services' },
  { href:'orders.html',    icon:'🧾', label:'Orders' },
  { href:'messages.html',  icon:'💬', label:'Messages' },
  { href:'content.html',   icon:'📝', label:'Website Content' },
  { href:'settings.html',  icon:'⚙️', label:'Settings' },
];

function renderAdminShell(activeFile, pageTitle){
  document.body.classList.add('admin-body');
  const admin = ZB._get(ZB_KEYS.admin, {email:'admin'});

  document.body.insertAdjacentHTML('afterbegin', `
    <div class="admin-shell">
      <div class="sidebar-backdrop" id="sidebarBackdrop"></div>
      <aside class="admin-sidebar" id="adminSidebar">
        <div class="side-brand">
          <div class="stamp">🧾</div>
          <div><b>ழா BILL</b><small>Admin Panel</small></div>
        </div>
        <nav class="admin-nav">
          ${NAV_ITEMS.map(i=>`<a href="${i.href}" class="${i.href===activeFile?'active':''}">${i.icon} ${i.label}</a>`).join('')}
          <div class="logout"><a href="#" id="logoutLink">🚪 Logout</a></div>
        </nav>
      </aside>
      <div class="admin-main">
        <header class="admin-header">
          <div style="display:flex;align-items:center;gap:10px">
            <button class="hamburger" id="hamburgerBtn">☰</button>
            <h1>${pageTitle}</h1>
          </div>
          <div style="display:flex;align-items:center;gap:12px">
            <a href="/" class="btn btn-outline" style="padding:6px 12px;font-size:12px" target="_blank">🌐 View site</a>
            <span class="who">${admin.email||'admin'}</span>
          </div>
        </header>
        <div class="admin-content" id="adminContent"></div>
      </div>
    </div>
  `);

  document.getElementById('hamburgerBtn').addEventListener('click', ()=>{
    document.getElementById('adminSidebar').classList.toggle('open');
    document.getElementById('sidebarBackdrop').classList.toggle('show');
  });
  document.getElementById('sidebarBackdrop').addEventListener('click', ()=>{
    document.getElementById('adminSidebar').classList.remove('open');
    document.getElementById('sidebarBackdrop').classList.remove('show');
  });
  document.getElementById('logoutLink').addEventListener('click', (e)=>{
    e.preventDefault();
    ZB.endSession();
    window.location.href = 'login.html';
  });

  return document.getElementById('adminContent');
}

function money(n){ return '₹' + Number(n||0).toLocaleString('en-IN', {maximumFractionDigits:2}); }
function toast(msg){
  let t = document.getElementById('toast');
  if(!t){ t = document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 1800);
}
function confirmDelete(label){
  return confirm(`Delete "${label}"? This action cannot be undone.`);
}
