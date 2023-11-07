import React, { useEffect, useState, useRef} from 'react';
import PokemonThumbnails from './PokemonThumbnails';
import Header from './Header';

function App() {
  const [allPokemons, setAllPokemons] = useState([]);
  // APIからデータを取得する
  // パラメータにlimitを設定し、20件取得する
  const [isLoading, setIsLoading] = useState(false);
  const nextUrl = useRef('https://pokeapi.co/api/v2/pokemon?limit=20');

  const getAllPokemons = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(nextUrl.current);
      const data = await response.json();
      nextUrl.current = data.next; // useRefを更新
      await createPokemonObject(data.results);
    } catch (error) {
      console.error('Error fetching pokemon data: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createPokemonObject = async (results) => {
    // 各ポケモンに対して非同期のAPIコールを準備
    const pokemonDataPromises = results.map(async (pokemon) => {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
      );
      return response.json();
    });

    // すべてのポケモンのデータが取得できたら実行
    const pokemonDatas = await Promise.all(pokemonDataPromises);

    const newPokemons = pokemonDatas.map((data) => ({
      id: data.id,
      name: data.name,
      image: data.sprites.other['official-artwork'].front_default,
      iconImage: data.sprites.other.dream_world.front_default,
      type: data.types[0].type.name,
    }));

    setAllPokemons((currentList) => {
      // 重複を除外する
      const pokemonsToAdd = newPokemons.filter(
        (newPoke) =>
          !currentList.some((currentPoke) => currentPoke.id === newPoke.id)
      );

      // 新しいリストと既存のリストを結合し、ソートする
      const updatedList = [...currentList, ...pokemonsToAdd];
      return updatedList.sort((a, b) => a.id - b.id);
    });
  };

  useEffect(() => {
    getAllPokemons();
  }, []);

  return (
    <div className="app-container">
      <Header />
      <div className="pokemon-container">
        <div className="all-container">
          {allPokemons.map((pokemon, index) => (
            <PokemonThumbnails
              id={pokemon.id}
              name={pokemon.name}
              image={pokemon.image}
              iconImage={pokemon.iconImage}
              type={pokemon.type}
              key={index}
            />
          ))}
        </div>
        {isLoading ? (
          <div className="load-more">now loading...</div>
        ) : (
          <button className="load-more" onClick={getAllPokemons}>
            もっとみる！
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
