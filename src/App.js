import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TEAMS from './teams';

function App() {
  const [games, setGames] = useState([]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get('https://statsapi.web.nhl.com/api/v1/schedule?startDate=2019-10-08&endDate=2019-10-21');
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
          g[homeTeamIndex][dateIndex] = { gamePk: game.gamePk, against: TEAMS[awayTeamIndex].shortName };
          g[awayTeamIndex][dateIndex] = { gamePk: game.gamePk, against: TEAMS[homeTeamIndex].shortName };
        });
      });
      setGames(g);
      setDates(d);
    })();
  }, []);

  const renderHeaderRow = () => {
    return (
      <tr>
        <th>TEAM</th>
        {dates.map(date => {
          return <th key={date}>{date}</th>;
        })}
      </tr>
    );
  };

  const renderGameRows = () => {
    return TEAMS.map((team, index) => {
      return (
        <tr>
          <td>{team.shortName}</td>
          {games[index].map(game => (
            <td key={game.gamePk}>{game.against}</td>
          ))}
        </tr>
      );
    });
  };

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
