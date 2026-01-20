// EduFocus App - Complete JavaScript
(function() {
    'use strict';
    
    const API_URL = window.location.origin + '/api';
    let token = localStorage.getItem('edufocus_token');
    let focusInterval = null;
    let focusTime = 25 * 60;
    let focusRunning = false;
    let todayPlan = JSON.parse(localStorage.getItem('edufocus_todayPlan') || '[]');
    let allTasks = [];
    let currentFilter = 'all';

    // Theme Management
    function initTheme() {
        const savedTheme = localStorage.getItem('edufocus_theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (prefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('edufocus_theme', newTheme);
    }

    function init() {
        initTheme();
        attachEventListeners();
        checkApiStatus();
        if (token) {
            loadUserProfile();
        }
    }

    function attachEventListeners() {
        // Auth forms
        document.getElementById('registerForm').addEventListener('submit', handleRegister);
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
        document.getElementById('demoBtn').addEventListener('click', useDemoAccount);
        
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', toggleTheme);
        
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', logout);
        
        // Actions
        document.getElementById('tutorSendBtn').addEventListener('click', sendTutorMessage);
        document.getElementById('createTaskBtn').addEventListener('click', createTask);
        document.getElementById('seedBtn').addEventListener('click', seedTasks);
        
        // Focus mode
        document.getElementById('focusStartBtn').addEventListener('click', startFocus);
        document.getElementById('focusPauseBtn').addEventListener('click', pauseFocus);
        document.getElementById('focusStopBtn').addEventListener('click', stopFocus);
        
        // Enter key for tutor input
        document.getElementById('tutorInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendTutorMessage();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                renderTasks();
            });
        });

        // Plan buttons
        document.getElementById('startPlanBtn').addEventListener('click', startPlan);
        document.getElementById('clearPlanBtn').addEventListener('click', clearPlan);
        
        // Birth date change - show/hide parental consent
        document.getElementById('regBirthDate').addEventListener('change', function() {
            var birthDate = new Date(this.value);
            var age = Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
            var role = document.getElementById('regRole').value;
            var consentGroup = document.getElementById('parentalConsentGroup');
            if (role === 'STUDENT' && age < 13) {
                consentGroup.style.display = 'block';
            } else {
                consentGroup.style.display = 'none';
                document.getElementById('parentalConsent').checked = false;
            }
        });
        
        // Also listen for role changes
        document.getElementById('regRole').addEventListener('change', function() {
            var role = this.value;
            var consentGroup = document.getElementById('parentalConsentGroup');
            if (role !== 'STUDENT') {
                consentGroup.style.display = 'none';
                document.getElementById('parentalConsent').checked = false;
            } else {
                // Re-check age
                var birthDate = document.getElementById('regBirthDate').value;
                if (birthDate) {
                    var birth = new Date(birthDate);
                    var age = Math.floor((Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
                    consentGroup.style.display = age < 13 ? 'block' : 'none';
                }
            }
        });
        
        // Global event delegation for dynamic content (bypasses CSP)
        document.addEventListener('click', function(e) {
            // Task item click - add/remove from plan
            var taskItem = e.target.closest('.task-item[data-task-id]');
            if (taskItem && !e.target.classList.contains('task-checkbox')) {
                var taskId = taskItem.dataset.taskId;
                var isInPlan = todayPlan.find(function(p) { return p.id === taskId; });
                if (isInPlan) {
                    removeFromPlan(taskId);
                } else {
                    addToPlan(taskId);
                }
                return;
            }
            
            // Plan item remove button
            var planRemove = e.target.closest('.plan-remove[data-plan-remove]');
            if (planRemove) {
                removeFromPlan(planRemove.dataset.planRemove);
                return;
            }
        });
        
        // Checkbox event delegation
        document.addEventListener('change', function(e) {
            // Task checkbox - toggle completion
            if (e.target.classList.contains('task-checkbox')) {
                var toggleId = e.target.dataset.taskToggle;
                var newState = e.target.dataset.taskNewState === 'true';
                if (toggleId) {
                    toggleTask(toggleId, newState);
                }
                return;
            }
            
            // Plan checkbox - toggle plan task completion
            if (e.target.classList.contains('plan-checkbox')) {
                var planToggleId = e.target.dataset.planToggle;
                if (planToggleId) {
                    window.togglePlanTask(planToggleId);
                }
                return;
            }
        });
    }

    function showToast(message, type) {
        type = type || 'success';
        var toast = document.getElementById('toast');
        var icon = document.getElementById('toastIcon');
        var msg = document.getElementById('toastMessage');
        
        toast.className = 'toast';
        if (type !== 'success') {
            toast.classList.add('error');
        }
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
            var apiUrlEl = document.getElementById('apiUrl');
            
            if (data.status === 'ok') {
                healthEl.innerHTML = '<span class="status-dot green"></span> Conectado';
            } else {
                healthEl.innerHTML = '<span class="status-dot red"></span> Error';
            }
            
            if (data.database === 'connected') {
                dbEl.innerHTML = '<span class="status-dot green"></span> Conectada';
            } else {
                dbEl.innerHTML = '<span class="status-dot yellow"></span> Desconectada';
            }
            
            apiUrlEl.textContent = window.location.origin;
        } catch (e) {
            document.getElementById('apiHealth').innerHTML = '<span class="status-dot red"></span> Error';
            document.getElementById('apiDb').innerHTML = '<span class="status-dot red"></span> Error';
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
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

        var birth = new Date(birthDate);
        var age = Math.floor((Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

        if (role === 'STUDENT' && (age < 8 || age > 18)) {
            showToast('La edad debe estar entre 8 y 18 años', 'error');
            return;
        }

        var parentalConsent = false;
        if (role === 'STUDENT' && age < 13) {
            parentalConsent = document.getElementById('parentalConsent').checked;
            if (!parentalConsent) {
                showToast('Se requiere consentimiento parental para menores de 13 años', 'error');
                return;
            }
        }

        try {
            var res = await fetch(API_URL + '/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: email, 
                    password: password, 
                    birthDate: birthDate, 
                    role: role,
                    parentalConsent: parentalConsent
                })
            });
            var data = await res.json();
            
            if (res.ok) {
                token = data.token;
                localStorage.setItem('edufocus_token', token);
                showToast('¡Cuenta creada exitosamente!');
                loadUserProfile();
            } else {
                console.error('Register error:', data);
                var errorMsg = data.error || data.message || 'Error al registrar';
                if (data.hint) {
                    errorMsg += ': ' + data.hint;
                }
                showToast(errorMsg, 'error');
            }
        } catch (e) {
            showToast('Error de conexión', 'error');
        }
    }

    async function handleLogin(e) {
        e.preventDefault();
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

    function useDemoAccount() {
        document.getElementById('loginEmail').value = 'demo1768782439@example.com';
        document.getElementById('loginPassword').value = 'demo123456';
        handleLogin({ preventDefault: function() {} });
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
                renderTodayPlan();
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
                allTasks = data.tasks || [];
                var mainTasks = allTasks.filter(function(t) { return t.subtasks && t.subtasks.length > 0; });
                document.getElementById('tasksCount').textContent = mainTasks.length;
                document.getElementById('tasksBadge').textContent = mainTasks.length;
                
                renderTasks();
            }
        } catch (e) {
            console.error('Error loading tasks:', e);
        }
    }

    function renderTasks() {
        var list = document.getElementById('tasksList');
        var mainTasks = allTasks.filter(function(t) { return t.subtasks && t.subtasks.length > 0; });
        
        if (currentFilter === 'Pendiente') {
            mainTasks = mainTasks.filter(function(t) { return !t.isCompleted; });
        } else if (currentFilter === 'Completada') {
            mainTasks = mainTasks.filter(function(t) { return t.isCompleted; });
        }
        
        if (mainTasks.length === 0) {
            list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📝</div><p>No hay tareas</p></div>';
            return;
        }

        list.innerHTML = mainTasks.slice(0, 10).map(function(t) {
            var isInPlan = todayPlan.find(function(p) { return p.id === t.id; });
            var isSelected = isInPlan ? ' selected' : '';
            var isCompleted = t.isCompleted ? ' completed' : '';
            var isChecked = t.isCompleted ? 'checked' : '';
            var icon = isInPlan ? '✓' : '+';
            var iconColor = isInPlan ? 'var(--secondary)' : 'var(--primary)';
            
            return '<div class="task-item' + isSelected + isCompleted + '" data-task-id="' + t.id + '" data-task-completed="' + t.isCompleted + '">' +
                '<input type="checkbox" class="task-checkbox" data-task-toggle="' + t.id + '" data-task-new-state="' + (!t.isCompleted) + '" ' + isChecked + '>' +
                '<span>' + t.title + '</span>' +
                '<span class="task-subject">' + t.subject + '</span>' +
                '<span style="font-size:18px;font-weight:bold;color:' + iconColor + ';margin-left:8px;">' + icon + '</span>' +
                '</div>';
        }).join('');
        
        if (mainTasks.length > 10) {
            list.innerHTML += '<p style="text-align:center;color:var(--text-muted-light);font-size:13px;margin-top:12px">+ ' + (mainTasks.length - 10) + ' tareas más</p>';
        }
    }

    function renderTodayPlan() {
        var container = document.getElementById('todayPlanList');
        var badge = document.getElementById('planBadge');
        
        badge.textContent = todayPlan.length;
        
        if (todayPlan.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📅</div><p>Agrega tareas a tu plan de hoy</p><p style="font-size: 12px; margin-top: 8px;">Selecciona tareas de "Mis Tareas" o pide ayuda al Tutor</p></div>';
            return;
        }

        container.innerHTML = todayPlan.map(function(task, index) {
            var isCompleted = task.isCompleted || false;
            var isChecked = isCompleted ? 'checked' : '';
            return '<div class="plan-item' + (isCompleted ? ' completed' : '') + '" data-plan-id="' + task.id + '" data-plan-completed="' + isCompleted + '">' +
                '<span class="plan-number">' + (index + 1) + '</span>' +
                '<input type="checkbox" class="plan-checkbox" data-plan-toggle="' + task.id + '" data-plan-new-state="' + (!isCompleted) + '" ' + isChecked + '>' +
                '<span>' + task.title + '</span>' +
                '<span class="plan-subject">' + task.subject + '</span>' +
                '<button class="plan-remove" data-plan-remove="' + task.id + '" style="background:none;border:none;cursor:pointer;font-size:16px;">🗑️</button>' +
                '</div>';
        }).join('');
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
            if (completed) showToast('¡Tarea completada! 🎉');
        } catch (e) {
            console.error('Error toggling task:', e);
        }
    }

    async function seedTasks() {
        try {
            showToast('Agregando tareas...', 'success');
            var res = await fetch(API_URL + '/seed-tasks', {
                method: 'POST',
                headers: { 
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            });
            var data = await res.json();
            
            if (res.ok) {
                showToast('¡100 tareas educativas agregadas! 🎉');
                loadTasks();
            } else {
                showToast(data.error || 'Error al sembrar tareas', 'error');
            }
        } catch (e) {
            showToast('Error de conexión', 'error');
        }
    }

    // Plan Management Functions
    function addToPlan(taskId) {
        var task = allTasks.find(function(t) { return t.id === taskId; });
        if (task && !todayPlan.find(function(p) { return p.id === taskId; })) {
            todayPlan.push(task);
            savePlan();
            renderTodayPlan();
            renderTasks();
            showToast('Tarea agregada al plan ✓');
        }
    }

    function removeFromPlan(taskId) {
        todayPlan = todayPlan.filter(function(p) { return p.id !== taskId; });
        savePlan();
        renderTodayPlan();
        renderTasks();
    }

    function savePlan() {
        localStorage.setItem('edufocus_todayPlan', JSON.stringify(todayPlan));
    }

    function renderTodayPlan() {
        var container = document.getElementById('todayPlanList');
        var badge = document.getElementById('planBadge');
        
        badge.textContent = todayPlan.length;
        
        if (todayPlan.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📅</div><p>Agrega tareas a tu plan de hoy</p><p style="font-size: 12px; margin-top: 8px;">Selecciona tareas de "Mis Tareas" o pide ayuda al Tutor</p></div>';
            return;
        }

        container.innerHTML = todayPlan.map(function(task, index) {
            var isCompleted = task.isCompleted || false;
            var checkAttr = isCompleted ? 'checked' : '';
            var newState = !isCompleted;
            return '<div class="plan-item' + (isCompleted ? ' completed' : '') + '" data-plan-id="' + task.id + '">' +
                '<span class="plan-number">' + (index + 1) + '</span>' +
                '<input type="checkbox" class="plan-checkbox" data-plan-toggle="' + task.id + '" data-plan-new-state="' + newState + '" ' + checkAttr + '>' +
                '<span>' + task.title + '</span>' +
                '<span class="plan-subject">' + task.subject + '</span>' +
                '<button class="plan-remove" data-plan-remove="' + task.id + '" style="background:none;border:none;cursor:pointer;font-size:16px;">🗑️</button>' +
                '</div>';
        }).join('');
    }

    function togglePlanTask(taskId) {
        var task = todayPlan.find(function(p) { return p.id === taskId; });
        if (task) {
            task.isCompleted = !task.isCompleted;
            savePlan();
            renderTodayPlan();
            if (task.isCompleted) {
                showToast('¡Tarea completada! 🎉');
            }
        }
    }

    function startPlan() {
        if (todayPlan.length === 0) {
            showToast('Agrega tareas a tu plan primero', 'error');
            return;
        }
        startFocus();
        showToast('¡Plan iniciado! Focus mode activado 🍅');
    }

    function clearPlan() {
        if (todayPlan.length === 0) return;
        if (confirm('¿Limpiar todas las tareas del plan?')) {
            todayPlan = [];
            savePlan();
            renderTodayPlan();
            renderTasks();
            showToast('Plan limpiado');
        }
    }

    async function sendTutorMessage() {
        var input = document.getElementById('tutorInput');
        var message = input.value.trim();
        if (!message) return;

        var chat = document.getElementById('tutorChat');
        
        var userMsg = document.createElement('div');
        userMsg.className = 'message user';
        userMsg.textContent = message;
        chat.appendChild(userMsg);
        
        input.value = '';
        chat.scrollTop = chat.scrollHeight;
        document.getElementById('tutorStatus').innerHTML = '<span class="status-dot yellow"></span> Pensando...';

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
                botMsg.textContent = data.tutorResponse;
                chat.appendChild(botMsg);
                
                var hint = document.createElement('div');
                hint.className = 'message-hint';
                hint.textContent = '💡 ' + data.nextQuestion;
                chat.appendChild(hint);
                
                document.getElementById('tutorStatus').innerHTML = '<span class="status-dot green"></span> Activo';
            } else {
                var errorMsg = document.createElement('div');
                errorMsg.className = 'message bot';
                errorMsg.style.background = 'rgba(239, 68, 68, 0.1)';
                errorMsg.style.color = '#ef4444';
                errorMsg.textContent = data.error || 'No se pudo procesar';
                chat.appendChild(errorMsg);
                document.getElementById('tutorStatus').innerHTML = '<span class="status-dot yellow"></span> Modo básico';
            }
        } catch (e) {
            var connError = document.createElement('div');
            connError.className = 'message bot';
            connError.style.background = 'rgba(239, 68, 68, 0.1)';
            connError.style.color = '#ef4444';
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
                showToast('¡Tiempo completado! Descansa 5 minutos 🍅');
                focusTime = 25 * 60;
                document.getElementById('pomodoroDisplay').textContent = '25:00';
            }
        }, 1000);
        showToast('¡Focus started! 🎯');
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

    // Make functions globally accessible for inline handlers
    window.togglePlanTask = togglePlanTask;
    window.removeFromPlan = removeFromPlan;
    window.addToPlan = addToPlan;
    window.handleTaskClick = window.handleTaskClick;

    document.addEventListener('DOMContentLoaded', init);
})();
