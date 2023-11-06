import React from "react";
import "./Header.css"; // CSSを適切にインポートしてください

const Header = () => {
  return (
    <header className="header">
      <div className="monsterball-container">
        <div className="monsterball-top"></div>
        <div className="monsterball-bottom"></div>
        <div className="monsterball-center">
          <div className="monsterball-center-inner"></div>
        </div>
      </div>
      <h1>ポケモン図鑑</h1>
    </header>
  );
};

export default Header;
