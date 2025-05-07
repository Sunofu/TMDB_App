
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

const form = document.getElementById('searchForm');
const input = document.getElementById('searchInput');
const results = document.getElementById('results');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = input.value.trim();
  console.log(query);
  if (!query) return;

  try {
    const res = await fetch(`${BASE_URL}?query=${encodeURIComponent(query)}&language=ru-RU`,{
        headers: {
          authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json;charset=utf-8',
    }} );
    const data = await res.json();

    results.innerHTML = '';
    if (data.results.length === 0) {
      results.innerHTML = '<p>Ничего не найдено</p>';
      return;
    }

    data.results.forEach((movie) => {
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
  } catch (err) {
    results.innerHTML = '<p>Произошла ошибка при получении данных</p>';
    console.error(err);
  }
});
