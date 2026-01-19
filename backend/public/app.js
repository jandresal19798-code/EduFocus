// EduFocus App - Main JavaScript
(function() {
    'use strict';
    
    const API_URL = window.location.origin + '/api';
    let token = localStorage.getItem('edufocus_token');
    let focusInterval = null;
    let focusTime = 25 * 60;
    let focusRunning = false;

    function init() {
        checkApiStatus();
        attachEventListeners();
        if (token) {
            loadUserProfile();
        }
    }

    function attachEventListeners() {
        document.getElementById('registerBtn').addEventListener('click', register);
        document.getElementById('loginBtn').addEventListener('click', login);
        document.getElementById('logoutBtn').addEventListener('click', logout);
        document.getElementById('tutorSendBtn').addEventListener('click', sendTutorMessage);
        document.getElementById('createTaskBtn').addEventListener('click', createTask);
        document.getElementById('focusStartBtn').addEventListener('click', startFocus);
        document.getElementById('focusPauseBtn').addEventListener('click', pauseFocus);
        document.getElementById('focusStopBtn').addEventListener('click', stopFocus);
        
        var tutorInput = document.getElementById('tutorInput');
        if (tutorInput) {
            tutorInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') sendTutorMessage();
            });
        }
    }

    function showToast(message, type) {
        type = type || 'success';
        var toast = document.getElementById('toast');
        var icon = document.getElementById('toastIcon');
        var msg = document.getElementById('toastMessage');
        
        toast.className = 'toast';
        toast.classList.add(type === 'success' ? 'toast-success' : 'toast-error');
        icon.textContent = type === 'success' ? '✓' : '✗';
        msg.textContent = message;
        toast.classList.add('show');
        
        setTimeout(function() {
            toast.classList.remove('show');
        }, 3000);
    }

    async function checkApiStatus() {
        try {
            var res = await fetch(API_URL + '/health');
            var data = await res.json();
            var healthEl = document.getElementById('apiHealth');
            var dbEl = document.getElementById('apiDb');
            
            if (data.status === 'ok') {
                healthEl.innerHTML = '<span style="color:#48bb78">● Conectado</span>';
            } else {
                healthEl.innerHTML = '<span style="color:#f56565">● Error</span>';
            }
            
            if (data.database === 'connected') {
                dbEl.innerHTML = '<span style="color:#48bb78">● Conectada</span>';
            } else {
                dbEl.innerHTML = '<span style="color:#ecc94b">● Desconectada</span>';
            }
        } catch (e) {
            document.getElementById('apiHealth').innerHTML = '<span style="color:#f56565">● Error</span>';
            document.getElementById('apiDb').innerHTML = '<span style="color:#f56565">● Error</span>';
        }
    }

    async function register() {
        var email = document.getElementById('regEmail').value;
        var password = document.getElementById('regPassword').value;
        var birthDate = document.getElementById('regBirthDate').value;
        var role = document.getElementById('regRole').value;

        if (!email || !password || !birthDate) {
            showToast('Por favor completa todos los campos', 'error');
            return;
        }

        if (password.length < 6) {
            showToast('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }

        try {
            var res = await fetch(API_URL + '/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password, birthDate: birthDate, role: role })
            });
            var data = await res.json();
            
            if (res.ok) {
                token = data.token;
                localStorage.setItem('edufocus_token', token);
                showToast('¡Cuenta creada exitosamente!');
                loadUserProfile();
            } else {
                showToast(data.error || 'Error al registrar', 'error');
            }
        } catch (e) {
            showToast('Error de conexión', 'error');
        }
    }

    async function login() {
        var email = document.getElementById('loginEmail').value;
        var password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            showToast('Email y contraseña requeridos', 'error');
            return;
        }

        try {
            var res = await fetch(API_URL + '/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password })
            });
            var data = await res.json();
            
            if (res.ok) {
                token = data.token;
                localStorage.setItem('edufocus_token', token);
                showToast('¡Bienvenido!');
                loadUserProfile();
            } else {
                showToast(data.error || 'Credenciales inválidas', 'error');
            }
        } catch (e) {
            showToast('Error de conexión', 'error');
        }
    }

    function logout() {
        localStorage.removeItem('edufocus_token');
        token = null;
        location.reload();
    }

    async function loadUserProfile() {
        if (!token) return;

        try {
            var res = await fetch(API_URL + '/users/profile', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            var data = await res.json();
            
            if (res.ok) {
                document.getElementById('authSection').classList.add('hidden');
                document.getElementById('dashboard').classList.remove('hidden');
                document.getElementById('userInfo').classList.remove('hidden');
                document.getElementById('userInfo').classList.add('user-info');
                
                var email = document.getElementById('loginEmail') ? document.getElementById('loginEmail').value : '';
                var displayName = data.profile && data.profile.displayName ? data.profile.displayName : (email.split('@')[0] || 'Usuario');
                document.getElementById('userNameDisplay').textContent = displayName;
                
                updateStats(data.profile);
                loadTasks();
            } else {
                localStorage.removeItem('edufocus_token');
                token = null;
            }
        } catch (e) {
            console.error('Error loading profile:', e);
        }
    }

    function updateStats(profile) {
        if (!profile) return;
        var level = profile.level || 1;
        var xp = profile.totalXP || 0;
        var streak = profile.currentStreak || 0;
        
        document.getElementById('level').textContent = level;
        document.getElementById('xp').textContent = xp;
        document.getElementById('streak').textContent = streak;
        
        document.getElementById('levelDisplay').textContent = 'Nivel ' + level;
        document.getElementById('xpDisplay').textContent = xp + ' XP';
        document.getElementById('streakDisplay').textContent = streak;
    }

    async function loadTasks() {
        try {
            var res = await fetch(API_URL + '/tasks', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            var data = await res.json();
            
            if (res.ok) {
                var tasks = data.tasks || [];
                document.getElementById('tasksCount').textContent = tasks.length;
                document.getElementById('tasksBadge').textContent = tasks.length;
                
                var list = document.getElementById('tasksList');
                if (tasks.length === 0) {
                    list.innerHTML = '<p style="color:#888;text-align:center;padding:30px">No tienes tareas pendientes</p>';
                } else {
                    list.innerHTML = tasks.map(function(t) {
                        var checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.checked = t.isCompleted;
                        checkbox.addEventListener('change', (function(taskId, completed) {
                            return function() { toggleTask(taskId, completed); };
                        })(t.id, !t.isCompleted));
                        
                        var item = document.createElement('div');
                        item.className = 'task-item' + (t.isCompleted ? ' completed' : '');
                        item.appendChild(checkbox);
                        
                        var span = document.createElement('span');
                        span.textContent = t.title;
                        item.appendChild(span);
                        
                        var label = document.createElement('span');
                        label.style.fontSize = '12px';
                        label.style.color = '#888';
                        label.style.marginLeft = 'auto';
                        label.textContent = t.subject;
                        item.appendChild(label);
                        
                        return item;
                    }).map(function(el) { return el.outerHTML; }).join('');
                }
            }
        } catch (e) {
            console.error('Error loading tasks:', e);
        }
    }

    async function createTask() {
        var title = document.getElementById('taskTitle').value.trim();
        var subject = document.getElementById('taskSubject').value;

        if (!title) {
            showToast('Escribe el título de la tarea', 'error');
            return;
        }

        try {
            var res = await fetch(API_URL + '/tasks', {
                method: 'POST',
                headers: { 
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title,
                    subject: subject,
                    description: 'Tarea creada desde app',
                    estimatedMinutes: 30,
                    difficulty: 3
                })
            });

            if (res.ok) {
                document.getElementById('taskTitle').value = '';
                showToast('¡Tarea agregada!');
                loadTasks();
            } else {
                showToast('Error al crear tarea', 'error');
            }
        } catch (e) {
            showToast('Error de conexión', 'error');
        }
    }

    async function toggleTask(id, completed) {
        try {
            await fetch(API_URL + '/tasks/' + id, {
                method: 'PUT',
                headers: { 
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isCompleted: completed })
            });
            loadTasks();
            if (completed) showToast('¡Tarea completada!');
        } catch (e) {
            console.error('Error toggling task:', e);
        }
    }

    async function sendTutorMessage() {
        var input = document.getElementById('tutorInput');
        var message = input.value.trim();
        if (!message) return;

        var chat = document.getElementById('tutorChat');
        
        var userMsg = document.createElement('div');
        userMsg.className = 'message user';
        userMsg.style.marginLeft = 'auto';
        userMsg.style.maxWidth = '85%';
        userMsg.textContent = message;
        chat.appendChild(userMsg);
        
        input.value = '';
        chat.scrollTop = chat.scrollHeight;

        try {
            var res = await fetch(API_URL + '/tutor/conversations', {
                method: 'POST',
                headers: { 
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subject: 'General',
                    topic: 'Ayuda',
                    initialMessage: message
                })
            });
            var data = await res.json();

            if (res.ok) {
                var botMsg = document.createElement('div');
                botMsg.className = 'message bot';
                botMsg.style.maxWidth = '85%';
                botMsg.textContent = data.tutorResponse;
                chat.appendChild(botMsg);
                
                var hint = document.createElement('p');
                hint.style.fontSize = '12px';
                hint.style.color = '#667eea';
                hint.style.margin = '5px 0 15px 0';
                hint.textContent = '💡 ' + data.nextQuestion;
                chat.appendChild(hint);
            } else {
                var errorMsg = document.createElement('div');
                errorMsg.className = 'message bot';
                errorMsg.style.maxWidth = '85%';
                errorMsg.style.background = '#fed7d7';
                errorMsg.style.color = '#c53030';
                errorMsg.textContent = data.error || 'No se pudo procesar';
                chat.appendChild(errorMsg);
            }
        } catch (e) {
            var connError = document.createElement('div');
            connError.className = 'message bot';
            connError.style.maxWidth = '85%';
            connError.style.background = '#fed7d7';
            connError.style.color = '#c53030';
            connError.textContent = 'Error de conexión';
            chat.appendChild(connError);
        }
        chat.scrollTop = chat.scrollHeight;
    }

    function startFocus() {
        if (focusRunning) return;
        focusRunning = true;
        
        if (focusInterval) clearInterval(focusInterval);
        focusInterval = setInterval(function() {
            focusTime--;
            var min = Math.floor(focusTime / 60);
            var sec = focusTime % 60;
            document.getElementById('pomodoroDisplay').textContent = 
                (min.toString().padStart(2, '0') + ':' + sec.toString().padStart(2, '0'));
            
            if (focusTime <= 0) {
                clearInterval(focusInterval);
                focusRunning = false;
                showToast('¡Tiempo completado! Descansa 5 minutos');
                focusTime = 25 * 60;
                document.getElementById('pomodoroDisplay').textContent = '25:00';
            }
        }, 1000);
        showToast('¡Focus started!');
    }

    function pauseFocus() {
        if (focusInterval) {
            clearInterval(focusInterval);
            focusInterval = null;
            focusRunning = false;
        }
        showToast('Focus pausado');
    }

    function stopFocus() {
        if (focusInterval) clearInterval(focusInterval);
        focusTime = 25 * 60;
        focusRunning = false;
        document.getElementById('pomodoroDisplay').textContent = '25:00';
        showToast('Focus reiniciado');
    }

    document.addEventListener('DOMContentLoaded', init);
})();
