import React from 'react';

const GameGrid = ({ games, dates }) => {
  const renderHeaderRow = () => (
    <div className="grid-row">
      <div className="header-item">TEAM</div>
      {dates.map(date => {
        return (
          <div key={date} className="header-item">
            {date}
          </div>
        );
      })}
      <div className="header-item">GAMES</div>
    </div>
  );

  const renderTeamRows = () =>
    games.map((team, teamIndex) => {
      const totalGamesForTeam = team.games.filter(Boolean).length;
      return (
        <div className="grid-row" key={team.id}>
          <div>
            <span className="logo">{team.logo}</span>
          </div>
          {team.games.map((game, gameIndex) => {
            if (game) {
              return (
                <div key={`${teamIndex}${gameIndex}`}>
                  <span>{game.isAway ? '@ ' : ''}</span>
                  <span className="logo">{game.against ? game.against.logo : ''}</span>
                </div>
              );
            }
            return <div key={`${teamIndex}${gameIndex}`} />;
          })}
          <div>{totalGamesForTeam}</div>
        </div>
      );
    });

  return (
    <div className="game-grid">
      {renderHeaderRow()}
      {renderTeamRows()}
    </div>
  );
};

export default GameGrid;
