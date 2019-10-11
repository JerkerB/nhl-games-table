import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TEAMS from './teams';

function App() {
  const [games, setGames] = useState([]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get('https://statsapi.web.nhl.com/api/v1/schedule?startDate=2019-10-08&endDate=2019-10-27');
      const g = [];
      const d = [];

      for (let i = 0; i < TEAMS.length; i++) {
        g[i] = [];
        for (let j = 0; j < response.data.dates.length; j++) {
          g[i][j] = '';
        }
      }

      response.data.dates.forEach((date, dateIndex) => {
        d.push(date.date);

        date.games.forEach(game => {
          const homeTeamIndex = TEAMS.findIndex(team => team.id === game.teams.home.team.id);
          const awayTeamIndex = TEAMS.findIndex(team => team.id === game.teams.away.team.id);
          g[homeTeamIndex][dateIndex] = { gamePk: game.gamePk, against: TEAMS[awayTeamIndex].logo };
          g[awayTeamIndex][dateIndex] = { gamePk: game.gamePk, against: TEAMS[homeTeamIndex].logo };
        });
      });
      setGames(g);
      setDates(d);
    })();
  }, []);

  const renderHeaderRow = () => (
    <tr>
      <th>TEAM</th>
      {dates.map(date => {
        return <th key={date}>{date}</th>;
      })}
      <th>GAMES</th>
    </tr>
  );

  const renderGameRows = () =>
    TEAMS.map((team, teamIndex) => {
      const totalGamesForTeam = games[teamIndex].filter(Boolean).length;
      return (
        <tr key={team.id}>
          <td>{team.logo}</td>
          {games[teamIndex].map((game, gameIndex) => {
            return <td key={`${teamIndex}${gameIndex}`}>{game.against}</td>;
          })}
          <td>{totalGamesForTeam}</td>
        </tr>
      );
    });

  if (games.length > 0) {
    return (
      <div>
        <h1>NHL Games</h1>
        <div>
          <table>
            <thead>{renderHeaderRow()}</thead>
            <tbody>{renderGameRows()}</tbody>
          </table>
        </div>
      </div>
    );
  }

  return <div>No games</div>;
}

export default App;
