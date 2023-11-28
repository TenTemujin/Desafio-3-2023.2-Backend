// Returning GET by the JSON file
async function fetchGET(url) {
  try {
    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Propagate the error to the caller
  }
}

// Changing image by the url
function updateImage(id, url) {
  document.getElementById(id).src = url;
}

// Function that changes the text by the ID and the text
function updateText(id, text) {
  document.getElementById(id).innerText = text.charAt(0).toUpperCase() + text.slice(1);
}

// Pokedex operations
const Pokedex = {
  apiUrl: "https://pokeapi.co/api/v2/pokemon/",
  numMaxPokemon: 151,
  currentPokemonIndex: 0,
  pokemons: [],

  // Pokedex initialization
  async initialize() {
    await this.fetchPokemons();
    this.renderPokemon();
    this.setupEventListeners();
  },

  // GET the database of the Pokedex
  async fetchPokemons() {
    try {
      const data = await fetchGET(`${this.apiUrl}?offset=0&limit=${this.numMaxPokemon}`);
      this.pokemons = data.results;
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
      throw error; // Propagate the error to the caller
    }
  },

  // Render information about the current Pokemon
  renderPokemon() {
    const currentPokemon = this.pokemons[this.currentPokemonIndex];
    this.fetchAndRenderPokemon(currentPokemon.url);
  },

  // Fetch and render information about a specific Pokemon
  async fetchAndRenderPokemon(url) {
    try {
      const pokemon = await fetchGET(url);
      this.updateImage("img_sprite_front_default", pokemon.sprites.front_default);
      this.updateText("name", pokemon.name);
    } catch (error) {
      console.error("Error fetching and rendering Pokemon data:", error);
      throw error; // Propagate the error to the caller
    }
  },

  // Navigate through the Pokedex
  async navigatePokemon(offset) {
    this.currentPokemonIndex = (this.currentPokemonIndex + offset + this.numMaxPokemon) % this.numMaxPokemon;
    await this.renderPokemon();
  },

  // Setup event listeners for the buttons
  setupEventListeners() {
    document.getElementById("previous").addEventListener("click", () => this.navigatePokemon(-1));
    document.getElementById("next").addEventListener("click", () => this.navigatePokemon(1));
  },
};

// Initialize the Pokedex on page load
document.addEventListener("DOMContentLoaded", () => Pokedex.initialize());
