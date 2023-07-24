import React, { useState, useRef } from 'react';
import axios from 'axios';

import styles from './styles/App.module.css';

import pause from './assets/pause.svg';
import play from './assets/play.svg';

const App = () => {
  const audioRefs = useRef([]);
  const [playingStates, setPlayingStates] = useState([]);
  const [list, setList] = useState([]);
  const [activeSongIndex, setActiveSongIndex] = useState(null);

  const searchSongs = async (event) => {
    audioRefs.current = [];
    setActiveSongIndex(null);
    const query = event.target.value;
    if (query.trim() !== '') {
      const response = await axios.get('http://localhost:5000/search', { params: { query: query } });
      const songsMap = response.data.map(item => {
        return { id: item.id, name: item.name, preview: item.preview_url };
      });
      setPlayingStates(new Array(songsMap.length).fill(false));
      setList(songsMap);
    } else {
      setList([]);
    }
  };

  const handleAudio = (index) => {
    const newPlayingStates = [...playingStates];

    if (activeSongIndex !== null) {
      audioRefs.current[activeSongIndex].pause();
      newPlayingStates[activeSongIndex] = false;
    }

    if (activeSongIndex === index) {
      audioRefs.current[index].pause();
      newPlayingStates[index] = false;
      setActiveSongIndex(null);
    } else {
      audioRefs.current[index].play();
      newPlayingStates[index] = true;
      setActiveSongIndex(index);
    }

    setPlayingStates(newPlayingStates);
  };

  return (
    <div className={styles.container}>
      <div>
        <input
          className={styles.controller}
          onChange={searchSongs}
          placeholder="¿Qué te apetece escuchar?"
        ></input>
      </div>
      <div className={styles.listSongs}>
        {list.map((item, index) => (
          <div className={styles.song} key={index}>
            <button onClick={() => handleAudio(index)}>
              {playingStates[index] ? (
                <img src={pause} alt='Pause'/>
              ) : (
                <img src={play} alt='Play'/>
              )}
            </button>
            <audio src={item.preview} ref={(audio) => (audioRefs.current[index] = audio)} />
            <label>{item.name}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
