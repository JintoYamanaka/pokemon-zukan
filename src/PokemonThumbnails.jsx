import React, { useState, useEffect } from 'react';
import pokemonJson from './pokemon.json';
import pokemonTypeJson from './pokemonType.json';

const PokemonThumbnails = ({ id, name, image, iconImage, type }) => {
  const style = `thumb-container ${type}`;

  const [jpName, setJpName] = useState('');
  const [jpType, setJpType] = useState('');

  useEffect(() => {
    const targetPokemon = pokemonJson.find(
      (pokemon) => pokemon.en.toLowerCase() === name.toLowerCase()
    );
    setJpName(targetPokemon ? targetPokemon.ja : '???');

    const targetTypeName = pokemonTypeJson[type];
    setJpType(targetTypeName ? targetTypeName : type);
  }, [name, type]);

  return (
    <div className={style}>
      <div className="number">
        <small>#0{id}</small>
      </div>
      <img src={image} alt={name} />
      <img src={iconImage} alt={name} className="icon-image" />
      <div className="detail-wrapper">
        <h4>{jpName}</h4>
        <h3>{jpType}</h3>
      </div>
    </div>
  );
};

export default PokemonThumbnails;
