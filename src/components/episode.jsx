import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import VideoPlayer from './videoplayer';
import Navbar from './navbar';
import img from '../assets/hxh.png';
import { IoIosWarning } from "react-icons/io";
import Loader from './loader';
import { motion } from 'framer-motion';
import Footer from './footer';

const ProxyApi = "https://proxy1.jackparquez1.workers.dev/?u=";
const episodeapi = "/episode/";
const AvailableServers = ['https://a.jackparquez1.workers.dev','https://b.jackparquez1.workers.dev','https://c.jackparquez1.workers.dev','https://d.jackparquez1.workers.dev'];

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
  const { animeData, totalEpisodes,idfromprev,namefromprev } = location.state || {}; // Destructure the totalEpisodes

  const [episodeData, setEpisodeData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadEpisodeData = async () => {
      try {
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

 

  const handleEpisodeClick = (episodeNumber) => {
    
    navigate(`/episode/${idfromprev}/${idfromprev}-episode-${episodeNumber}`, {
      state: { animeData, totalEpisodes,idfromprev }
    });
    console.log('id from prev:' + idfromprev);
  };

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
                <div className='h-64 flex  items-center' >
                  <p className='text-white text-sm mx-8'>No video source available, please try to click episode in the main anime page.
                  </p>

                </div>
                
              )}
              <div className="px-auto text-center">
                <p className='text-violet-400 font-custom'>You are watching...</p>
                <p className='text-base font-bold text-gray-300'>{episodeData.name}</p>
              </div>
              <p className='text-center text-xs text-zinc-600 font-semibold'>Refresh the page if video is not working properly.</p>
              {totalEpisodes && !isNaN(parseInt(totalEpisodes)) ? (
                <section id="watch">
                  <div className="episode-container px-4 py-2">
                    <h1 className="text-base font-bold text-gray-300">Episodes:</h1>
                    <div className="font-bold mt-1 grid grid-cols-6 px-3 gap-2 py-2 rounded sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-12">
                      {Array.from({ length: parseInt(totalEpisodes) }).map((_, index) => {
                        const episodeNumber = index + 1;
                        const isActive = episodeNumber === parseInt(episode_id.split('-').pop());
                        return (
                          <button
                            key={episodeNumber}
                            className={`w-12 h-12 text-white rounded flex items-center justify-center ${isActive ? 'bg-violet-500' : 'bg-zinc-800'}`}
                            onClick={() => handleEpisodeClick(episodeNumber)}
                          >
                            {episodeNumber}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </section>
              ) : (
                <div className='text-white'>No episodes available</div>
              )}
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
