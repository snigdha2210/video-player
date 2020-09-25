import React, { useRef, useState } from 'react';
import './App.css';
import screenfull from "screenfull";
import ReactPlayer from "react-player";
import Duration from './components/Duration';
import { Col, Dropdown, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import "./common/scss/video.scss"
import fullScreenOn from "./common/images/fullscreen.svg"
import fullScreenExit from "./common/images/fullscreen-exit.svg"
import volumeUp from "./common/images/volume-up.svg"
import { Slider, Direction } from 'react-player-controls'
function App() {

  const [state, setState] = useState({
    url: null,
    pip: false,
    playing: false,
    controls: false,
    light: false,
    volume: 0.8,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
    volumeOpen: false,
    dropdownOpen: false,
    fullscreen: false,
  });

  const load = (url) => {
    setState({
      ...state,
      url,
      played: 0,
      loaded: 0,
      pip: false,
    });
  };
  const player = useRef(null);
  const playerWrapper = useRef(null);

  const handlePlayPause = () => {
    setState({ ...state, playing: !state.playing });
  };

  const handleStop = () => {
    setState({ ...state, url: null, playing: false });
  };

  const handleToggleControls = () => {
    const { url } = state;
    setState({
      ...state,
      controls: !state.controls,
      url: null,
    }, () => this.load(url));
  };

  const handleToggleLight = () => {
    setState({ ...state, light: !state.light });
  };

  const handleToggleLoop = () => {
    setState({ ...state, loop: !state.loop });
  };

  const handleVolumeChange = (e) => {
    setState({ ...state, volume: parseFloat(e.target.value) });
  };

  const handleToggleMuted = () => {
    setState({ ...state, muted: !state.muted });
  };

  const handleSetPlaybackRate = (e) => {
    console.log("state.playbackRate");
    setState({ ...state, playbackRate: parseFloat(e.target.value), dropdownOpen: !state.dropdownOpen });
  };

  const handleTogglePIP = () => {
    setState({ ...state, pip: !state.pip });
  };

  const handlePlay = () => {
    console.log("onPlay");
    if (!state.playing) {
      setState({ ...state, playing: true });
    }
  };

  const handleEnablePIP = () => {
    console.log("onEnablePIP");
    setState({ ...state, pip: true });
  };

  const handleDisablePIP = () => {
    console.log("onDisablePIP");
    setState({ ...state, pip: false });
  };

  const handlePause = () => {
    console.log("onPause");
    setState({ ...state, playing: false });
  };

  const handleSeekMouseDown = (e) => {
    setState({ ...state, seeking: true });
  };

  const handleSeekChange = (e) => {
    setState({ ...state, played: parseFloat(e.target.value) });
  };

  const handleSeekMouseUp = (e) => {
    setState({ ...state, seeking: false });
    if (player?.current) {
      player.current.seekTo(parseFloat(e.target.value));
    }
  };

  const handleProgress = (stateIn) => {
    console.log("onProgress", state.playbackRate);
    // We only want to update time slider if we are not currently seeking
    if (!state.seeking) {
      setState({ ...state, ...stateIn });
    }
  };

  const handleEnded = () => {
    console.log("onEnded");
    setState({ ...state, playing: false });
  };

  const handleDuration = (duration) => {
    console.log("onDuration", duration);
    setState({ ...state, duration });
  };

  const toggleVolume = () => {
    setState({ ...state, volumeOpen: !state.volumeOpen });
  };

  const toggleDropdown = (value) => {
    setState({ ...state, dropdownOpen: !state.dropdownOpen });
  };

  const handleClickFullscreen = () => {
    if (playerWrapper?.current) {
      if (screenfull.isFullscreen) {
        screenfull.exit(playerWrapper.current);
      } else {
        screenfull.request(playerWrapper.current);
      }
    }
    setState({ ...state, fullscreen: !state.fullscreen });
  };
  const SliderBar = ({ direction, value, style }) => (
    <div
      style={Object.assign({}, {
        position: 'absolute',
        background: "GRAY",
        borderRadius: 4,
      }, direction === Direction.HORIZONTAL ? {
        top: 0,
        bottom: 0,
        left: 0,
        width: `${value * 100}%`,
      } : {
          right: 0,
          bottom: 0,
          left: 0,
          height: `${value * 100}%`,
        }, style)}
    />
  )

  return (
    <div className="App App-header" >
      <Row className="pt-5 justify-content-center align-items-end">
        <Col xs="7" className="title">
          <span>React player</span>
        </Col>
      </Row>
      <Row className="justify-content-center h-100 align-items-center">
        <Col xs="7" className="h-50">
          <div className="player-wrapper h-100 d-flex justify-content-center" ref={playerWrapper}>
            <ReactPlayer
              className="react-player"
              ref={player}
              url="https://www.youtube.com/watch?v=Sv6dMFF_yts"
              width="100%"
              height="100%"
              light="https://img.youtube.com/vi/Sv6dMFF_yts/0.jpg"
              pip={state.pip}
              playing={state.playing}
              controls={state.controls}
              loop={state.loop}
              playbackRate={state.playbackRate}
              volume={state.volume}
              muted={state.muted}
              onStart={() => setState({ ...state, visible_button_refresh: true })}
              onPlay={handlePlay}
              onEnablePIP={handleEnablePIP}
              onDisablePIP={handleDisablePIP}
              onPause={handlePause}
              onBuffer={() => console.log("onBuffer")}
              onSeek={(e) => console.log("onSeek", e)}
              onEnded={handleEnded}
              onError={(e) => console.log("onError", e)}
              onProgress={handleProgress}
              onDuration={handleDuration}
              onReady={() => handlePlayPause()}
            />
            {state.visible_button_refresh && (
              <Row className="video-controller justify-content-between">
                <div className=" pl-1 d-flex align-items-center ">
                  <button type="button" onClick={() => handlePlayPause()} className="play-pause pr-2">{state.playing ? "Pause" : "Play"}</button>
                </div>
                <div className={` d-flex align-items-center ${state.volumeOpen ? "volume" : ""}`}>
                  <img src={volumeUp} alt="" onClick={() => toggleVolume()} />
                  {state.volumeOpen && <input className="slider" width="50px" type="range" min={0} max={1} step="any" value={state.volume} onChange={handleVolumeChange} />}
                </div>
                <div className=" d-flex align-items-center">
                  <input
                    type="range"
                    className="slider"
                    min={0}
                    max={0.999999}
                    step="any"
                    value={state.played}
                    onMouseDown={handleSeekMouseDown}
                    onChange={handleSeekChange}
                    onMouseUp={handleSeekMouseUp}
                  />
                  <Duration seconds={state.duration * (1 - state.played)} className="time pl-2" />
                </div>
                <div className="">
                  <Dropdown group isOpen={state.dropdownOpen} size="sm" direction="up" inNavbar toggle={toggleDropdown}>
                    <DropdownToggle caret>
                      {`${state.playbackRate}x`}
                    </DropdownToggle>
                    <DropdownMenu>
                      <div>
                        <button onClick={handleSetPlaybackRate} value={0.5}>0.5x</button>
                      </div>
                      <div>
                        <button onClick={handleSetPlaybackRate} value={1}>1x</button>
                      </div>
                      <div>
                        <button onClick={handleSetPlaybackRate} value={1.5}>1.5x</button>
                      </div>
                      <div>
                        <button onClick={handleSetPlaybackRate} value={2}>2x</button>
                      </div>
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <div className="">
                  {!state.fullscreen ? <img src={fullScreenOn} alt="" onClick={() => handleClickFullscreen()} />
                    : <img src={fullScreenExit} alt="" onClick={() => handleClickFullscreen()} />}
                </div>
              </Row>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default App;
