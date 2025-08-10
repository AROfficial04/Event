// Global Authentication and Navbar State Handler for EvAnia

(function () {
  const AUTH_STORAGE_KEY = 'evania_auth_user';

  document.addEventListener('DOMContentLoaded', () => {
    renderAuthState();
    wireLoginForm();
    wireSignupForm();
    wireLogoutInMobile();
  });

  function getAuthUser() {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setAuthUser(user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }

  function clearAuthUser() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  function isLoggedIn() {
    return !!getAuthUser();
  }

  // Render navbar/account area for both desktop and mobile
  function renderAuthState() {
    const utilityNav = document.querySelector('.utility-nav');
    if (utilityNav) {
      const accountEl = utilityNav.querySelector('.account');
      let loginBtn = utilityNav.querySelector('.login-btn');

      if (!isLoggedIn()) {
        // Show Login button, hide account icon
        if (accountEl) accountEl.style.display = 'none';
        if (!loginBtn) {
          loginBtn = document.createElement('button');
          loginBtn.className = 'login-btn';
          loginBtn.textContent = 'Login';
          loginBtn.addEventListener('click', () => {
            // Remember current page to return after login
            try { sessionStorage.setItem('evania_auth_redirect', location.href); } catch (e) {}
            window.location.href = 'login.html';
          });
          // Insert login before cart icon
          const cart = utilityNav.querySelector('.cart');
          utilityNav.insertBefore(loginBtn, cart || null);
        } else {
          loginBtn.style.display = 'inline-flex';
        }
        // Remove any existing account dropdown
        removeAccountDropdown(accountEl);
      } else {
        // Show Account icon + dropdown, hide Login button
        if (loginBtn) loginBtn.style.display = 'none';
        if (accountEl) {
          accountEl.style.display = 'flex';
          ensureAccountDropdown(accountEl);
        }
      }
    }

    // Update mobile account section
    const mobileAccount = document.querySelector('.mobile-account');
    if (mobileAccount) {
      if (!isLoggedIn()) {
        mobileAccount.innerHTML = `
          <a href="login.html"><i class="fas fa-sign-in-alt"></i> Login</a>
          <a href="signup.html"><i class="fas fa-user-plus"></i> Create Account</a>
          <a href="#"><i class="fas fa-shopping-cart"></i> Cart (0)</a>
        `;
      } else {
        mobileAccount.innerHTML = `
          <a href="#"><i class="fas fa-user"></i> My Profile</a>
          <a href="#"><i class="fas fa-receipt"></i> Orders / Bookings</a>
          <a href="#" class="mobile-logout"><i class="fas fa-sign-out-alt"></i> Logout</a>
          <a href="#"><i class="fas fa-shopping-cart"></i> Cart (0)</a>
        `;
      }
    }
  }

  function removeAccountDropdown(accountEl) {
    if (!accountEl) return;
    const existing = accountEl.querySelector('.account-menu');
    if (existing) existing.remove();
    accountEl.onclick = null;
    document.removeEventListener('click', handleOutsideClick);
  }

  function ensureAccountDropdown(accountEl) {
    if (!accountEl) return;
    accountEl.style.position = 'relative';

    let menu = accountEl.querySelector('.account-menu');
    if (!menu) {
      menu = document.createElement('div');
      menu.className = 'account-menu';
      menu.innerHTML = `
        <ul>
          <li><a href="profile.html">Profile</a></li>
          <li><a href="orders.html">Orders / Bookings</a></li>
          <li><button type="button" class="logout-btn">Logout</button></li>
        </ul>
      `;
      accountEl.appendChild(menu);
    }

    // Toggle on icon click
    accountEl.onclick = (e) => {
      e.stopPropagation();
      menu.classList.toggle('open');
    };

    // Logout
    const logoutBtn = menu.querySelector('.logout-btn');
    if (logoutBtn) {
      logoutBtn.onclick = (e) => {
        e.preventDefault();
        clearAuthUser();
        renderAuthState();
      };
    }

    // Close when clicking outside
    document.addEventListener('click', handleOutsideClick);

    function handleOutsideClick(ev) {
      if (!accountEl.contains(ev.target)) {
        menu.classList.remove('open');
      }
    }
  }

  function wireLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    const idInput = form.querySelector('#loginId');
    const passwordInput = form.querySelector('#loginPassword');
    const showToggle = form.querySelector('[data-toggle="password"]');
    const errorBox = form.querySelector('.form-error');

    if (showToggle && passwordInput) {
      showToggle.addEventListener('click', () => {
        passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
        showToggle.classList.toggle('revealed');
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearError();

      const idValue = (idInput.value || '').trim();
      const passwordValue = (passwordInput.value || '').trim();

      if (!idValue) return showError('Please enter your email or phone number.');
      if (passwordValue.length < 6) return showError('Password must be at least 6 characters.');

      // Simulate successful login
      const displayName = idValue.includes('@') ? idValue.split('@')[0] : `User_${idValue.slice(-4)}`;
      setAuthUser({ id: idValue, name: displayName });
      renderAuthState();

      // Redirect back or home
      let target = 'index.html';
      try {
        const stored = sessionStorage.getItem('evania_auth_redirect');
        if (stored) target = stored;
      } catch (e) {}
      setTimeout(() => { window.location.href = target; }, 400);
    });

    function showError(msg) {
      if (!errorBox) return;
      errorBox.textContent = msg;
      errorBox.style.display = 'block';
    }
    function clearError() {
      if (!errorBox) return;
      errorBox.textContent = '';
      errorBox.style.display = 'none';
    }
  }

  function wireSignupForm() {
    const form = document.getElementById('signupForm');
    if (!form) return;

    const nameInput = form.querySelector('#signupName');
    const idInput = form.querySelector('#signupId');
    const passwordInput = form.querySelector('#signupPassword');
    const showToggle = form.querySelector('[data-toggle="password"]');
    const errorBox = form.querySelector('.form-error');

    if (showToggle && passwordInput) {
      showToggle.addEventListener('click', () => {
        passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
        showToggle.classList.toggle('revealed');
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearError();

      const nameValue = (nameInput.value || '').trim();
      const idValue = (idInput.value || '').trim();
      const passwordValue = (passwordInput.value || '').trim();

      if (!nameValue) return showError('Please enter your full name.');
      if (!idValue) return showError('Please enter your email or phone number.');
      if (passwordValue.length < 6) return showError('Password must be at least 6 characters.');

      // Simulate successful signup → logged in
      setAuthUser({ id: idValue, name: nameValue });
      renderAuthState();

      // Redirect to home
      setTimeout(() => { window.location.href = 'index.html'; }, 400);
    });

    function showError(msg) {
      if (!errorBox) return;
      errorBox.textContent = msg;
      errorBox.style.display = 'block';
    }
    function clearError() {
      if (!errorBox) return;
      errorBox.textContent = '';
      errorBox.style.display = 'none';
    }
  }

  function wireLogoutInMobile() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('.mobile-logout');
      if (target) {
        e.preventDefault();
        clearAuthUser();
        renderAuthState();
      }
    });
  }
})();


