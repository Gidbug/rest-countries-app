const API_URL = 'https://restcountries.com/v3.1/all?fields=name,capital,region,flags,population';
const container = document.getElementById('countryContainer');
const searchInput = document.getElementById('search');
const regionSelect = document.getElementById('regionFilter');
const sortSelect = document.getElementById('sortPopulation');
const loadMoreBtn = document.getElementById('loadMore');

let countriesData = [];
let displayedCount = 0;
const itemsPerPage = 20;

fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    countriesData = data;
    renderCountries();
  });

function renderCountries(reset = true) {
  if (reset) {
    container.innerHTML = '';
    displayedCount = 0;
  }

  let filtered = countriesData.filter(c => {
    const matchesSearch = c.name.common.toLowerCase().includes(searchInput.value.toLowerCase());
    const matchesRegion = regionSelect.value ? c.region === regionSelect.value : true;
    return matchesSearch && matchesRegion;
  });

  if (sortSelect.value === 'asc') {
    filtered.sort((a, b) => a.population - b.population);
  } else if (sortSelect.value === 'desc') {
    filtered.sort((a, b) => b.population - a.population);
  }

  const toDisplay = filtered.slice(displayedCount, displayedCount + itemsPerPage);
  displayedCount += toDisplay.length;

  toDisplay.forEach(country => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${country.flags.png}" alt="Flag of ${country.name.common}" />
      <h3>${country.name.common}</h3>
      <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
      <p><strong>Region:</strong> ${country.region}</p>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    `;
    container.appendChild(div);
  });

  loadMoreBtn.style.display = displayedCount < filtered.length ? 'block' : 'none';
}

searchInput.addEventListener('input', () => renderCountries());
regionSelect.addEventListener('change', () => renderCountries());
sortSelect.addEventListener('change', () => renderCountries());
loadMoreBtn.addEventListener('click', () => renderCountries(false));
