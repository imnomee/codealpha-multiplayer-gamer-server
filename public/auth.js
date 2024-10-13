// Register
document.getElementById('register-btn').addEventListener('click', async () => {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
        document.getElementById('register-message').innerText =
            'Registration successful!';
        localStorage.setItem('token', data.token);
        window.location.href = '/game'; // Redirect to the game after successful registration
    } else {
        document.getElementById('register-message').innerText =
            data.message || 'Registration failed!';
    }
});

// Login
document.getElementById('login-btn').addEventListener('click', async () => {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
        document.getElementById('login-message').innerText =
            'Login successful!';
        localStorage.setItem('token', data.token);
        window.location.href = '/'; // Redirect to the game after successful login
    } else {
        document.getElementById('login-message').innerText =
            data.message || 'Login failed!';
    }
});
