const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

const form = document.getElementById('searchForm');
const input = document.getElementById('searchInput');
const results = document.getElementById('results');
const pagination = document.getElementById('pagination');

let currentPage = 1;
let totalPages = 1;
let currentQuery = '';

form.addEventListener('submit', (e) => {
  e.preventDefault();
  currentQuery = input.value.trim();
  if (!currentQuery) {
    results.innerHTML = '<p>Введите название</p>';
  }
  currentPage = 1;
  fetchMovies();
});

async function fetchMovies() {
  try {
    const res = await fetch(`${BASE_URL}?query=${encodeURIComponent(currentQuery)}&language=ru-RU&page=${currentPage}`, {
      headers: {
        authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
    });
    const data = await res.json();

    results.innerHTML = '';
    if (data.results.length === 0) {
      results.innerHTML = '<p>Ничего не найдено</p>';
      pagination.innerHTML = '';
      return;
    }

    totalPages = data.total_pages;
    renderMovies(data.results);
    renderPagination();
  } catch (err) {
    results.innerHTML = '<p>Произошла ошибка при получении данных</p>';
    console.error(err);
  }
}

function renderMovies(movies) {
  results.innerHTML = '';
  movies.forEach((movie) => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');
    movieElement.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}" />
      <div>
        <h2>${movie.title}</h2>
        <p>${movie.overview || 'Описание недоступно'}</p>
        <p><strong>Дата релиза:</strong> ${movie.release_date || 'Неизвестно'}</p>
      </div>
    `;
    results.appendChild(movieElement);
  });
}

function renderPagination() {
  pagination.innerHTML = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const createButton = (text, page, isActive = false, disabled = false) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    if (isActive) btn.classList.add('active');
    if (disabled) btn.disabled = true;
    btn.addEventListener('click', () => {
      currentPage = page;
      fetchMovies();
    });
    pagination.appendChild(btn);
  };

  if (currentPage > 1) createButton('← Назад', currentPage - 1);

  if (currentPage > 3) {
    createButton('1', 1);
    if (currentPage > 4) {
      const dots = document.createElement('span');
      dots.textContent = '...';
      pagination.appendChild(dots);
    }
  }

  const start = Math.max(1, currentPage - 1);
  const end = Math.min(totalPages, currentPage + 1);

  for (let i = start; i <= end; i++) {
    createButton(i, i, i === currentPage);
  }

  if (currentPage < totalPages - 2) {
    if (currentPage < totalPages - 3) {
      const dots = document.createElement('span');
      dots.textContent = '...';
      pagination.appendChild(dots);
    }
    createButton(totalPages, totalPages);
  }

  if (currentPage < totalPages) createButton('Вперёд →', currentPage + 1);
}
