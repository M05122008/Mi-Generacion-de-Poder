// Admin panel for managing user roles (client/admin)
(function(){
  const firebaseConfig = {
    apiKey: "AIzaSyC77-Yyvo2Bi1L6BEP9qqDbIJs--YdgKn4",
    authDomain: "migeneraciondepoder-75d84.firebaseapp.com",
    projectId: "migeneraciondepoder-75d84",
    storageBucket: "migeneraciondepoder-75d84.firebasestorage.app",
    messagingSenderId: "600928815158",
    appId: "1:600928815158:web:4a81b8c2782f676c697097",
    measurementId: "G-WYSQ5PRV51"
  };

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

  const statusEl = document.getElementById('status');
  const tableBody = document.getElementById('userTable');
  const roleLabel = document.getElementById('userRole');
  const emailLabel = document.getElementById('userEmail');
  const loginLink = document.getElementById('loginLink');
  const logoutBtn = document.getElementById('btnLogout');
  const reloadBtn = document.getElementById('btnReload');
  let unsubscribeUsers = null;

  function setStatus(msg, type){
    if(!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = 'badge ' + (type || 'info');
  }

  async function ensureProfile(user){
    if(!user) return;
    try{
      const ref = db.collection('userRoles').doc(user.uid);
      const snap = await ref.get();
      const data = {
        email: user.email || '',
        displayName: user.displayName || '',
        updatedAt: serverTimestamp()
      };
      if(!snap.exists) data.role = 'client';
      if(!snap.exists) data.createdAt = serverTimestamp();
      await ref.set(data, { merge: true });
    }catch(err){ console.warn('ensureProfile error', err); }
  }

  async function fetchRole(user){
    if(!user) return null;
    try{
      const snap = await db.collection('userRoles').doc(user.uid).get();
      if(snap.exists) return snap.data().role || null;
    }catch(err){ console.warn('fetchRole error', err); }
    return null;
  }

  function renderUsers(snapshot){
    if(!tableBody) return;
    tableBody.innerHTML = '';
    if(snapshot.empty){
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 4;
      td.className = 'empty';
      td.textContent = 'No hay usuarios registrados todavía.';
      tr.appendChild(td);
      tableBody.appendChild(tr);
      return;
    }
    snapshot.forEach(doc => {
      const u = doc.data();
      const tr = document.createElement('tr');
      const emailTd = document.createElement('td'); emailTd.textContent = u.email || '—';
      const nameTd = document.createElement('td'); nameTd.textContent = u.displayName || '—';
      const roleTd = document.createElement('td');
      const chip = document.createElement('span'); chip.className = 'role-chip ' + (u.role === 'admin' ? 'admin' : 'client'); chip.textContent = u.role === 'admin' ? 'Admin' : 'Cliente';
      roleTd.appendChild(chip);
      const actionTd = document.createElement('td');
      const btn = document.createElement('button');
      btn.className = 'btn ghost';
      const targetRole = u.role === 'admin' ? 'client' : 'admin';
      btn.textContent = targetRole === 'admin' ? 'Hacer admin' : 'Hacer cliente';
      btn.addEventListener('click', ()=> changeRole(doc.id, targetRole, u.email));
      actionTd.appendChild(btn);
      tr.appendChild(emailTd); tr.appendChild(nameTd); tr.appendChild(roleTd); tr.appendChild(actionTd);
      tableBody.appendChild(tr);
    });
  }

  async function changeRole(uid, role, email){
    try{
      setStatus('Actualizando rol de ' + (email || uid) + '...', 'info');
      await db.collection('userRoles').doc(uid).update({
        role,
        updatedAt: serverTimestamp()
      });
      // If the current user changed their own role, refresh token
      const current = auth.currentUser;
      if(current && current.uid === uid){
        await current.getIdToken(true);
      }
      setStatus('Rol actualizado a ' + role, 'success');
    }catch(err){
      console.error(err);
      setStatus('Error al actualizar rol: ' + (err.message || err), 'warn');
    }
  }

  function subscribeUsers(){
    if(unsubscribeUsers) unsubscribeUsers();
    unsubscribeUsers = db.collection('userRoles').orderBy('email').onSnapshot(renderUsers, err => {
      console.error(err);
      setStatus('No se pudo leer usuarios (revisa reglas o conexión).', 'warn');
    });
  }

  logoutBtn?.addEventListener('click', ()=> auth.signOut());
  reloadBtn?.addEventListener('click', ()=> auth.currentUser?.getIdToken(true));

  auth.onAuthStateChanged(async user => {
    if(!user){
      roleLabel.textContent = 'No autenticado';
      emailLabel.textContent = '—';
      setStatus('Inicia sesión para continuar.', 'warn');
      if(unsubscribeUsers) unsubscribeUsers();
      if(loginLink) loginLink.style.display = 'inline-flex';
      if(logoutBtn) logoutBtn.style.display = 'none';
      if(tableBody) tableBody.innerHTML = '';
      return;
    }
    emailLabel.textContent = user.email || '—';
    if(loginLink) loginLink.style.display = 'none';
    if(logoutBtn) logoutBtn.style.display = 'inline-flex';
    await ensureProfile(user);
    const token = await user.getIdTokenResult(true);
    const roleFromDb = await fetchRole(user);
    const isAdmin = !!(token.claims && token.claims.admin) || roleFromDb === 'admin';
    roleLabel.textContent = isAdmin ? 'Admin' : (roleFromDb || 'Cliente');
    if(isAdmin){
      setStatus('Eres administrador. Puedes cambiar roles.', 'success');
      subscribeUsers();
    } else {
      setStatus('No eres administrador. Pide a un admin que te asigne rol.', 'warn');
      if(unsubscribeUsers) unsubscribeUsers();
      if(tableBody) tableBody.innerHTML = '';
    }
  });
})();
