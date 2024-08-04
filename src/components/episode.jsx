import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import VideoPlayer from './videoplayer';
import Navbar from './navbar';
import img from '../assets/hxh.png';
import { IoIosWarning } from "react-icons/io";
import Loader from './loader';
import { motion } from 'framer-motion';
import Footer from './footer';
import { IoArrowUndo } from "react-icons/io5";
import { IoArrowRedoSharp } from "react-icons/io5";

const ProxyApi = "https://proxy1.jackparquez1.workers.dev/?u=";
const episodeapi = "/episode/";
const AvailableServers = ['https://1.jackparquez1.workers.dev'];

function getApiServer() {
  return AvailableServers[Math.floor(Math.random() * AvailableServers.length)];
}

async function getJson(path, errCount = 0) {
  const ApiServer = getApiServer();
  let url = ApiServer + path;

  if (errCount > 2) {
    throw new Error(`Too many errors while fetching ${url}`);
  }

  if (errCount > 0) {
    console.log("Retrying fetch using proxy");
    url = ProxyApi + encodeURIComponent(url);  // Encode URL for safety
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok ${response.statusText}`);
    }
    return await response.json();
  } catch (errors) {
    console.error(errors);
    await new Promise(resolve => setTimeout(resolve, 2000));  // Add a delay before retrying
    return getJson(path, errCount + 1);
  }
}

const EpisodePage = () => {
  const { id, episode_id } = useParams();
  const location = useLocation();
  const { animeData, totalEpisodes, idfromprev, namefromprev } = location.state || {}; // Destructure the totalEpisodes

  const [episodeData, setEpisodeData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadEpisodeData = async () => {
      try {
        setLoading(true);
        const episodeResponse = await getJson(episodeapi + episode_id);
        console.log('Episode data:', episodeResponse);

        if (episodeResponse?.results) {
          setEpisodeData(episodeResponse.results);
        } else {
          throw new Error("Failed to fetch episode data");
        }
      } catch (err) {
        console.error(`Error loading data:`, err);
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (episode_id) {
      loadEpisodeData();
    } else {
      setError("Invalid episode ID");
      setLoading(false);
    }
  }, [episode_id]);

  const getCurrentEpisodeNumber = () => {
    const match = episode_id.match(/-episode-(\d+)$/);
    return match ? parseInt(match[1], 10) : null;
  };

  const handleEpisodeClick = (episodeNumber) => {
    setLoading(true);
    navigate(`/episode/${idfromprev}/${idfromprev}-episode-${episodeNumber}`, {
      state: { animeData, totalEpisodes, idfromprev }
    });
  };

  const handleNextEpisode = () => {
    const currentEpisodeNumber = getCurrentEpisodeNumber();
    if (currentEpisodeNumber < totalEpisodes) {
      handleEpisodeClick(currentEpisodeNumber + 1);
    }
  };

  const handlePrevEpisode = () => {
    const currentEpisodeNumber = getCurrentEpisodeNumber();
    if (currentEpisodeNumber > 1) {
      handleEpisodeClick(currentEpisodeNumber - 1);
    }
  };

  const currentEpisodeNumber = getCurrentEpisodeNumber();

  if (loading) return <div><Loader /></div>;

  return (
    <>
      <Navbar />
      <div className="flex flex-col h-screen justify-between">
        <div className='bg-zinc-900 pt-16 px-0 xl:px-56 sm:px-2 lg:px-40 md:px-32'>
          {error ? (
            <div className='flex flex-col justify-center py-36 items-center'>
              <motion.img
                src={img}
                alt="Error"
                className="h-28"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              />
              <IoIosWarning className='text-6xl mx-auto text-violet-400' />
              <p className='text-white font-bold text-center'>
                <span>An error occurred.</span>
                <span className='text-violet-500'> Please try again later.</span>
              </p>
            </div>
          ) : episodeData ? (
            <>
              {episodeData.stream && episodeData.stream.sources && episodeData.stream.sources.length > 0 ? (
                <VideoPlayer source={episodeData.stream.sources[0].file} id={episode_id} />
              ) : (
                <div className='h-64 flex items-center'>
                  <p className='text-white text-sm mx-8'>No video source available, please try to click episode in the main anime page.</p>
                </div>
              )}
              <div className="px-auto mt-6 mb-2 text-center">
                <p className='text-violet-400 font-custom'>You are watching...</p>
                <p className='text-base font-bold text-gray-300'>{episodeData.name}</p>
              </div>
              <p className='text-center text-xs text-zinc-600 font-semibold'>Refresh the page if video is not working properly.</p>
              <div className="flex justify-center space-x-4 mt-4 mb-6">
                <button
                  onClick={handlePrevEpisode}
                  disabled={currentEpisodeNumber <= 1}
                  className={`bg-violet-400 px-3 font-custom tracking-widest text-sm  text-white rounded flex items-center justify-center ${currentEpisodeNumber <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <IoArrowUndo className='mr-1'/>
                  Prev episode
                </button>
                <button
                  onClick={handleNextEpisode}
                  disabled={currentEpisodeNumber >= totalEpisodes}
                  className={`bg-violet-400 text-sm px-4 py-2 font-custom tracking-widest text-white rounded flex items-center justify-center ${currentEpisodeNumber >= totalEpisodes ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                 
                  Next episode
                  <IoArrowRedoSharp className='ml-1'  />
                </button>
              </div>
            </>
          ) : (
            <div className='text-white'>No episode data available</div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default EpisodePage;
