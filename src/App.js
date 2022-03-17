import MomentUtils from "@date-io/moment";
import axios from 'axios';
import React, { useEffect } from 'react';
import './App.css';

function App() {
  const [searchValue, setSearchValue] = React.useState("")
  const [playerList, setPlayerList] = React.useState(null)
  const [response, setResponse] = React.useState(null)
  const dateFormat = "DD-MM-YYYY h:mm:ss a"
  useEffect(() => {
    axios.get("https://api.npoint.io/20c1afef1661881ddc9c")
      .then((response) => {
        if (response.data) {
          setResponse(response.data)
          setPlayerList(response.data.playerList)
        }
      })
  }, [])

  useEffect(() => {
    const newPlayerArray = response && response.playerList && response.playerList.filter(player => (player.TName.includes(searchValue) || player.PFName.includes(searchValue)))
    if (newPlayerArray && newPlayerArray.length > 0) {
      setPlayerList(newPlayerArray)
    }
  }, [searchValue])
  return (
    <div className="App">
      <div className='header'>
        <h1>List of Players</h1>

        <input name="searchInput" className="search-input" value={searchValue} placeholder='Search Player' onChange={event => {
          setSearchValue(event.target.value)
        }} />
      </div>
      <div className="row">
        {playerList && playerList.map((player) => (
          <>
            <div className="column">
              {/* Below code can be converted to component */}
              <div className="card">
                <img src={`/player-images/${player.Id}.jpg`} alt="Player" />
                <div>
                  <h3>Name : {player.PFName}</h3>
                  <h4>Skill : {player.SkillDesc}</h4>
                  <h2>Value : $ {player.Value}</h2>
                  {player.UpComingMatchesList && player.UpComingMatchesList.map((match) => (
                    <div>
                      <p>Upcoming : {match.CCode} V/S {match.VsCCode}</p>
                      <p>Match Time : {match.MDate && convertDateFormat(match.MDate, dateFormat)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  )
}

function convertDateFormat(date, format) {
  let stringToDate = new Date(date)
  let newDate = new Date(stringToDate.getTime() + stringToDate.getTimezoneOffset() * 60 * 1000);

  let offset = stringToDate.getTimezoneOffset() / 60;
  let hours = stringToDate.getHours();

  newDate.setHours(hours - offset);
  try {
    return new MomentUtils().date(newDate.toLocaleString()).format(format).toString()
  } catch (error) {
    return date && date.toString();
  }
}
export default App;