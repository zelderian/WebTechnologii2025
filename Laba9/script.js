const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
const phoneRegex = /^\+380\d{9}$/;
const usernameRegex = /^(?=(.*\d){2,}).{6,}$/;

function showForm(formId) {
    document.querySelectorAll('.form').forEach(form => form.classList.remove('active'));
    const activeForm = document.getElementById(formId);
    activeForm.classList.add('active');

    activeForm.querySelectorAll('input, select').forEach(input => {
        input.value = '';
        input.classList.remove('valid', 'invalid');
        const messageEl = input.closest('.form-group')?.querySelector('.form-text');
        if (messageEl) {
            messageEl.textContent = '';
            messageEl.classList.remove('valid', 'invalid');
        }
    });

    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
    document.querySelector(`.tab-button[data-form="${formId}"]`)?.classList.add('active');
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
}

function populateCities() {
    const countrySelect = document.getElementById('signup-country');
    const citySelect = document.getElementById('signup-city');
    const country = countrySelect.value;

    citySelect.disabled = country === '';

    const cities = {
        'Ukraine': ['Kyiv', 'Lviv', 'Odesa'],
        'USA': ['New York', 'Los Angeles', 'Chicago'],
    };

    citySelect.innerHTML = '<option value="">Select City</option>';
    if (cities[country]) {
        cities[country].forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
}

function validateSignup(event) {
    event.preventDefault();

    const form = document.getElementById('signup');
    const formDataObj = {};
    const formDataRaw = new FormData(form);

    for (const [key, value] of formDataRaw.entries()) {
        formDataObj[key] = value.trim();
    }

    const fields = [
        { id: 'signup-firstname', regex: nameRegex, error: 'First name can only contain letters and spaces' },
        { id: 'signup-lastname', regex: nameRegex, error: 'Last name can only contain letters and spaces' },
        { id: 'signup-email', regex: /^\S+@\S+\.\S+$/, error: 'Invalid email format', allowEmpty: false },
        { id: 'signup-password', minLength: 6, error: 'Password must be at least 6 characters' },
        { id: 'signup-confirm', matchWith: 'signup-password', error: 'Passwords do not match' },
        { id: 'signup-phone', regex: phoneRegex, error: 'Please provide a valid Ukrainian phone number (+380XXXXXXXXX)' },
        { id: 'signup-dob', allowEmpty: false, error: 'Please provide your date of birth' },
        { id: 'signup-country', allowEmpty: false, error: 'Please select your country' },
        { id: 'signup-city', allowEmpty: false, error: 'Please select your city' },
    ];

    let valid = true;
    let validatedData = {};

    fields.forEach(field => {
        const input = document.getElementById(field.id);
        const value = input.value.trim();

        if (!field.allowEmpty && value === '') {
            setError(input, 'This field is required');
            valid = false;
        } else if (field.regex && !field.regex.test(value)) {
            setError(input, field.error);
            valid = false;
        } else if (field.minLength && value.length < field.minLength) {
            setError(input, field.error);
            valid = false;
        } else if (field.matchWith && value !== document.getElementById(field.matchWith).value) {
            setError(input, field.error);
            valid = false;
        } else {
            setSuccess(input, 'Looks good');
            validatedData[field.id] = value;
        }
    });

    if (valid) {
        console.log('Validated Form Data (Signup):', validatedData);
        console.log('Raw FormData object:', formDataObj);
        alert('Registration successful!');
    }
}

function validateLogin(event) {
    event.preventDefault();

    const username = document.getElementById('login-username');
    const password = document.getElementById('login-password');
    const rememberMe = document.getElementById('remember-me');

    let valid = true;

    if (username.value.trim() === '') {
        setError(username, 'Please enter your username');
        valid = false;
    } else if (!usernameRegex.test(username.value.trim())) {
        setError(username, 'Username must be at least 6 characters long and contain at least 2 digits');
        valid = false;
    } else {
        setSuccess(username, 'Looks good!');
    }

    if (password.value.length < 6) {
        setError(password, 'Password must be at least 6 characters');
        valid = false;
    } else {
        setSuccess(password, 'Looks good!');
    }

    if (!rememberMe.checked) {
        setError(rememberMe, 'Please accept the terms');
        valid = false;
    }

    if (valid) {
        console.log('Form data (Login):', {
            username: username.value.trim(),
            password: password.value
        });

        alert('Login successful!');
        document.getElementById('login').reset();
        clearValidation('login');
    }
}

function setError(input, message) {
    input.classList.add('invalid');
    input.classList.remove('valid');
    const messageEl = input.closest('.form-group')?.querySelector('.form-text');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.classList.add('invalid');
        messageEl.classList.remove('valid');
    }
}

function setSuccess(input, message) {
    input.classList.add('valid');
    input.classList.remove('invalid');
    const messageEl = input.closest('.form-group')?.querySelector('.form-text');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.classList.add('valid');
        messageEl.classList.remove('invalid');
    }
}

function clearValidation(formId) {
    const form = document.getElementById(formId);
    form.querySelectorAll('input, select').forEach(input => {
        input.classList.remove('valid', 'invalid');
    });
    form.querySelectorAll('.form-text').forEach(text => {
        text.textContent = '';
        text.classList.remove('valid', 'invalid');
    });
}
