import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import { formatDate, parseDate } from 'react-day-picker/moment';
import TEAMS from './teams';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import './style.css';

function App() {
  const toEl = useRef(null);
  const today = moment();
  const weekFromNow = moment().add(7, 'days');
  const [from, setFrom] = useState(today.format('YYYY-MM-DD'));
  const [to, setTo] = useState(weekFromNow.format('YYYY-MM-DD'));
  const [games, setGames] = useState([]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get(`https://statsapi.web.nhl.com/api/v1/schedule?startDate=${from}&endDate=${to}`);
      const g = [];
      const d = [];

      for (let i = 0; i < TEAMS.length; i++) {
        g[i] = [];
        for (let j = 0; j < response.data.dates.length; j++) {
          g[i][j] = '';
        }
      }

      response.data.dates.forEach((date, dateIndex) => {
        d.push(moment(date.date).format('MMM Do'));

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
  }, [from, to]);

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

  const handleFromChange = day => {
    const newFrom = moment(day).format('YYYY-MM-DD');
    if (moment(newFrom).isBefore(to)) {
      setFrom(newFrom);
    }
  };

  const handleToChange = day => {
    const newTo = moment(day).format('YYYY-MM-DD');
    if (moment(newTo).isAfter(from)) {
      setTo(newTo);
    }
  };

  const toDate = moment(to).toDate();
  const fromDate = moment(from).toDate();
  const modifiers = { start: fromDate, end: toDate };

  if (games.length > 0) {
    return (
      <div>
        <h1>NHL Schedule</h1>
        <div>
          <div>
            <DayPickerInput
              value={fromDate}
              format="LL"
              formatDate={formatDate}
              parseDate={parseDate}
              onDayChange={handleFromChange}
              dayPickerProps={{
                selectedDays: [fromDate, { from: fromDate, to: toDate }],
                disabledDays: { after: toDate },
                toMonth: toDate,
                modifiers,
                onDayClick: () => toEl.current.getInput().focus()
              }}
            />
            {' - '}
            <DayPickerInput
              ref={toEl}
              value={toDate}
              format="LL"
              formatDate={formatDate}
              parseDate={parseDate}
              onDayChange={handleToChange}
              dayPickerProps={{
                selectedDays: [fromDate, { from: fromDate, to: toDate }],
                disabledDays: { before: fromDate },
                modifiers,
                month: fromDate,
                fromMonth: fromDate
              }}
            />
          </div>
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
