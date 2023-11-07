import React, { useEffect, useState } from 'react';
import PokemonThumbnails from './PokemonThumbnails';
import Header from './Header';

function App() {
  const [allPokemons, setAllPokemons] = useState([]);
  const [nextUrl, setNextUrl] = useState(
    'https://pokeapi.co/api/v2/pokemon?limit=20'
  );
  const [isLoading, setIsLoading] = useState(false);

  async function fetchPokemons(url) {
    setIsLoading(true);
    try {
      const response = await fetch(url);
      const data = await response.json();
      setNextUrl(data.next);
      await createPokemonObject(data.results);
    } catch (error) {
      console.error('Error fetching pokemon data: ', error);
    } finally {
      setIsLoading(false);
    }
  }

  const createPokemonObject = async (results) => {
    let newPokemons = [];
    for (let pokemon of results) {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
      );
      const data = await res.json();
      newPokemons.push({
        id: data.id,
        name: data.name,
        image: data.sprites.other['official-artwork'].front_default,
        iconImage: data.sprites.other.dream_world.front_default,
        type: data.types[0].type.name,
      });
    }

    setAllPokemons((currentList) => {
      const pokemonsToAdd = newPokemons.filter(
        (newPoke) =>
          !currentList.some((currentPoke) => currentPoke.id === newPoke.id)
      );

      const updatedList = [...currentList, ...pokemonsToAdd].sort(
        (a, b) => a.id - b.id
      );
      return updatedList;
    });
  };

  useEffect(() => {
    fetchPokemons(nextUrl);
  }, []);

  const loadMorePokemons = () => {
    if (!isLoading && nextUrl) {
      fetchPokemons(nextUrl);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <div className="pokemon-container">
        <div className="all-container">
          {allPokemons.map((pokemon) => (
            <PokemonThumbnails
              id={pokemon.id}
              name={pokemon.name}
              image={pokemon.image}
              iconImage={pokemon.iconImage}
              type={pokemon.type}
              key={pokemon.id}
            />
          ))}
        </div>
        {isLoading ? (
          <div className="load-more">Loading...</div>
        ) : (
          <button className="load-more" onClick={loadMorePokemons}>
            もっと見る！
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
