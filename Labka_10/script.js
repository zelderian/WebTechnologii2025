const API_URL = 'https://randomuser.me/api/?results=100&nat=us,gb,ca,ua';
let users = [];
let filteredUsers = [];
let currentPage = 1;
const usersPerPage = 30;

const authForm = document.getElementById('auth-form');
const mainContent = document.getElementById('main-content');
const cardsContainer = document.getElementById('user-cards');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const login = () => {
  const username = document.getElementById('username').value;
  if (username) {
    localStorage.setItem('username', username);
    renderApp();
  }
};

const logout = () => {
  localStorage.removeItem('username');
  location.reload();
};

const fetchUsers = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    users = data.results.map(u => ({
      name: `${u.name.first} ${u.name.last}`,
      age: u.dob.age,
      phone: u.phone,
      email: u.email,
      location: `${u.location.city}, ${u.location.country}`,
      picture: u.picture.large,
      registered: new Date(u.registered.date)
    }));
    filteredUsers = users;
    renderUsers();
  } catch (error) {
    alert('Помилка при завантаженні користувачів');
  }
};

const renderUsers = () => {
  const start = (currentPage - 1) * usersPerPage;
  const end = start + usersPerPage;
  const pageUsers = filteredUsers.slice(start, end);
  cardsContainer.innerHTML = pageUsers.map(user => `
    <div class="card">
      <img src="${user.picture}" alt="Фото">
      <h3>${user.name}</h3>
      <p>Вік: ${user.age}</p>
      <p>Тел: ${user.phone}</p>
      <p>Email: ${user.email}</p>
      <p>Місце: ${user.location}</p>
    </div>
  `).join('');
  renderPagination();
};

const renderPagination = () => {
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.disabled = true;
    btn.onclick = () => {
      currentPage = i;
      renderUsers();
    };
    pagination.appendChild(btn);
  }
};

const handleSearch = debounce(() => {
  const term = searchInput.value.toLowerCase();
  filteredUsers = users.filter(u => u.name.toLowerCase().includes(term));
  currentPage = 1;
  renderUsers();
}, 300);

const handleSort = () => {
  const value = sortSelect.value;
  if (value === 'name-asc') filteredUsers.sort((a, b) => a.name.localeCompare(b.name));
  if (value === 'name-desc') filteredUsers.sort((a, b) => b.name.localeCompare(a.name));
  if (value === 'age-asc') filteredUsers.sort((a, b) => a.age - b.age);
  if (value === 'age-desc') filteredUsers.sort((a, b) => b.age - a.age);
  renderUsers();
};

const renderApp = () => {
  const username = localStorage.getItem('username');
  if (username) {
    authForm.style.display = 'none';
    mainContent.style.display = 'block';
    fetchUsers();
  }
};

searchInput.addEventListener('input', handleSearch);
sortSelect.addEventListener('change', handleSort);
renderApp();
