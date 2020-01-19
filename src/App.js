import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import DateRange from './DateRange';
import GameGrid from './GameGrid';
import TEAMS from './teams';
import './style.css';

const moment = extendMoment(Moment);

function App() {
  const DAY_FORMAT = 'YYYY-MM-DD';
  const today = moment();
  const weekFromNow = moment().add(7, 'days');
  const [from, setFrom] = useState(today.format(DAY_FORMAT));
  const [to, setTo] = useState(weekFromNow.format(DAY_FORMAT));
  const [games, setGames] = useState([]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get(`https://statsapi.web.nhl.com/api/v1/schedule?startDate=${from}&endDate=${to}`);
      const tempTeams = [];
      const dateRange = Array.from(moment.range(from, to).by('days'));
      const tempDates = dateRange.map(date => date.format(DAY_FORMAT));

      TEAMS.forEach((team, index) => {
        tempTeams.push({ ...team, games: [] });
        for (let j = 0; j < dateRange.length; j++) {
          tempTeams[index].games[j] = '';
        }
      });

      response.data.dates.forEach(date => {
        const dateIndex = tempDates.indexOf(date.date);
        date.games.forEach(game => {
          const homeTeamId = game.teams.home.team.id;
          const awayTeamId = game.teams.away.team.id;
          const homeTeam = tempTeams.find(team => team.id === homeTeamId);
          const awayTeam = tempTeams.find(team => team.id === awayTeamId);
          if (homeTeam && awayTeam) {
            homeTeam.games[dateIndex] = { against: awayTeam, isAway: false };
            awayTeam.games[dateIndex] = { against: homeTeam, isAway: true };
          }
        });
      });

      setDates(dateRange.map(day => day.format('MMM Do')));
      setGames(tempTeams);
    })();
  }, [from, to]);

  const handleFromChange = day => {
    setGames([]);
    const newFrom = moment(day).format(DAY_FORMAT);
    if (moment(newFrom).isBefore(to)) {
      setFrom(newFrom);
    }
  };

  const handleToChange = day => {
    setGames([]);
    const newTo = moment(day).format(DAY_FORMAT);
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
        <div className="game-content">{gameContent}</div>
      </div>
    </div>
  );
}

export default App;
