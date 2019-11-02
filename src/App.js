import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import DateRange from './DateRange';
import GameGrid from './GameGrid';
import TEAMS from './teams';
import './style.css';

function App() {
  const today = moment();
  const weekFromNow = moment().add(7, 'days');
  const [from, setFrom] = useState(today.format('YYYY-MM-DD'));
  const [to, setTo] = useState(weekFromNow.format('YYYY-MM-DD'));
  const [games, setGames] = useState([]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get(`https://statsapi.web.nhl.com/api/v1/schedule?startDate=${from}&endDate=${to}`);
      const tempTeams = [];
      const tempDates = [];

      TEAMS.forEach((team, index) => {
        tempTeams.push({ ...team, games: [] });
        for (let j = 0; j < response.data.dates.length; j++) {
          tempTeams[index].games[j] = undefined;
        }
      });

      response.data.dates.forEach((date, dateIndex) => {
        tempDates.push(moment(date.date).format('MMM Do'));
        date.games.forEach(game => {
          const homeTeamId = game.teams.home.team.id;
          const awayTeamId = game.teams.away.team.id;
          const homeTeam = tempTeams.find(team => team.id === homeTeamId);
          const awayTeam = tempTeams.find(team => team.id === awayTeamId);
          homeTeam.games[dateIndex] = { against: awayTeam, isAway: false };
          awayTeam.games[dateIndex] = { against: homeTeam, isAway: true };
        });
      });

      setGames(tempTeams);
      setDates(tempDates);
    })();
  }, [from, to]);

  const handleFromChange = day => {
    setGames([]);
    const newFrom = moment(day).format('YYYY-MM-DD');
    if (moment(newFrom).isBefore(to)) {
      setFrom(newFrom);
    }
  };

  const handleToChange = day => {
    setGames([]);
    const newTo = moment(day).format('YYYY-MM-DD');
    if (moment(newTo).isAfter(from)) {
      setTo(newTo);
    }
  };

  const toDate = moment(to).toDate();
  const fromDate = moment(from).toDate();
  let gameContent = <div className="spinner" />;

  if (games.length > 0) {
    gameContent = <GameGrid games={games} dates={dates} />;
  }

  return (
    <div>
      <h1>NHL Schedule</h1>
      <div>
        <DateRange fromDate={fromDate} toDate={toDate} onFromDayChange={handleFromChange} onToDayChange={handleToChange} />
        <div className="game-content">
          {gameContent}
        </div>
      </div>
    </div>
  );;
}

export default App;
