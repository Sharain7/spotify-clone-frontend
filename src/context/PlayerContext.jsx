import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();
    const [track, setTrack] = useState(songsData[0]);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: {
            second: 0,
            minute: 0
        },
        totalTime: {
            second: 0,
            minute: 0
        }
    });

    const play = () => {
        if (audioRef.current ) {
            audioRef.current.play();
            setPlayStatus(true);
        }
    };

    const pause = () => {
        if (audioRef.current && audioRef.current.play) {
            audioRef.current.pause();
            setPlayStatus(false);
        }
    };

    const playWithId = async (id) => {
        if (audioRef.current) {
            audioRef.current.pause();
            const newTrack = songsData[id];
            setTrack(newTrack);
            audioRef.current.src = newTrack.file;
            await audioRef.current.play();
            setPlayStatus(true);
        }
    };

    const previous = async () => {
        if(track.id > 0) {
            await setTrack(songsData[track.id-1]);
            await audioRef.current.play();
            setPlayStatus(true); 
        }
    }
    const next = async () => {
        if(track.id < songsData.length -1) {
            await setTrack(songsData[track.id+1]);
            await audioRef.current.play();
            setPlayStatus(true); 
        }
    }
    const seekSong = async(e) => {
        audioRef.current.currentTime = ((e.nativeEvent.offsetX/seekBg.current.offsetWidth)*audioRef.current.duration)

    }

    useEffect(() => {
        const updateTime = () => {
            if (audioRef.current) {
                seekBar.current.style.width = (Math.floor(audioRef.current.currentTime / audioRef.current.duration * 100)) + "%";
                setTime({
                    currentTime: {
                        second: Math.floor(audioRef.current.currentTime % 60),
                        minute: Math.floor(audioRef.current.currentTime / 60)
                    },
                    totalTime: {
                        second: Math.floor(audioRef.current.duration % 60),
                        minute: Math.floor(audioRef.current.duration / 60)
                    }
                });
            }
        };

        const handleMetadata = () => {
            if (audioRef.current) {
                setTime(prevTime => ({
                    ...prevTime,
                    totalTime: {
                        second: Math.floor(audioRef.current.duration % 60),
                        minute: Math.floor(audioRef.current.duration / 60)
                    }
                }));
            }
        };

        if (audioRef.current) {
            audioRef.current.addEventListener('timeupdate', updateTime);
            audioRef.current.addEventListener('loadedmetadata', handleMetadata);
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('timeupdate', updateTime);
                audioRef.current.removeEventListener('loadedmetadata', handleMetadata);
            }
        };
    }, []);

    const contextValue = {
        audioRef,
        seekBg,
        seekBar,
        track,
        setTrack,
        playStatus,
        setPlayStatus,
        time,
        setTime,
        play,
        pause,
        playWithId,
        previous,
        next,
        seekSong
    };

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    );
};

export default PlayerContextProvider;
