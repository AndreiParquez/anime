import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import img from '../assets/hxh.jpg';
import { HiPlay } from "react-icons/hi2";
import Navbar from './navbar';
import Loader from './loader';
import Errorpage from './notfound';
import Footer from './footer';

const ProxyApi = "https://proxy1.jackparquez1.workers.dev/?u=";
const animeapi = "/anime/";
const recomendationapi = "/recommendations/";
const AvailableServers = ['https://anime.jackparquez1.workers.dev'];

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



const formatTitle = (title) => {
  return title
    .replace(/\[.*?\]/g, '') // Remove text within square brackets
    .replace(/\{.*?\}/g, '') // Remove text within curly braces
    .replace(/["']/g, '') // Remove single and double quotation marks
    .replace(/[:]/g, '') // Remove colons
    .replace(/[^\w\s-]/g, '') // Remove all symbols except hyphens and whitespace
    .trim() // Trim whitespace
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .toLowerCase(); // Convert to lowercase
};

const AnimePage = () => {
  const { id } = useParams();
  const [animeData, setAnimeData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendationError, setRecommendationError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);  // Set loading to true on every id change
    window.scrollTo(0, 0);
    async function loadData() {
      console.log(`Loading data for anime ID: ${id}`);
      try {
        const data = await getJson(animeapi + id);

        if (data && data.results) {
          const anime = data.results;
          console.log('Anime data:', anime);

          setAnimeData({
            title: anime.name || anime.title?.userPreferred || "Unknown",
            image: anime.image || anime.coverImage?.large || "",
            lang: anime.episodes ? `EP ${anime.episodes.length || 0}` : "",
            type: anime.type || anime.format || "Unknown",
            synopsis: anime.plot_summary || anime.description || "No description available",
            other: anime.other_name || "Unknown",
            total: anime.episodes ? `EP ${anime.episodes.length || 0}` : "Unknown",
            year: anime.released || anime.seasonYear || "Unknown",
            status: anime.status || "Unknown",
            genres: anime.genre ? anime.genre.split(",") : anime.genres || ["Unknown"],
            source: anime.source || "Unknown",
            episodes: Array.isArray(anime.episodes) ? anime.episodes.map(ep => ({ number: ep[0], link: ep[1] })) : Array.from({ length: anime.episodes }, (_, i) => ({ number: i + 1, link: `episode-${i + 1}` }))
            
          });

          // Fetch recommendations
          try {
            const recommendationsData = await getJson(recomendationapi + id);
            setRecommendations(recommendationsData?.results || []);
          } catch (recError) {
            console.error(`Error loading recommendations:`, recError);
            setRecommendationError("No recommendations available.");
          }
        } else {
          throw new Error("No data returned");
        }
        setLoading(false);
      } catch (err) {
        console.error(`Error loading data:`, err);
        setError(err.message || "An unexpected error occurred");
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleEpisodeClick = (episodeId) => {
    navigate(`/episode/${id}/${episodeId}`, { 
      state: { 
        animeData,totalEpisodes: animeData.episodes.length,
        idfromprev: id,
        namefromprev: animeData.title,

         // Pass the total number of episodes
      }
    });
  };

  const handleWatchNow = () => {
    if (animeData && animeData.episodes.length > 0) {
      const firstEpisodeLink = animeData.episodes[0].link;
      handleEpisodeClick(firstEpisodeLink);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col justify-center">
        <Errorpage message={error} />
      </div>
    );
  }

  if (!animeData) {
    return (
      <div className="error-page">
        <p>No anime data available.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="main-content bg-zinc-900 text-white md:px-80">
      <section>
  <motion.div
    className="anime-container"
    key={id}  // Add key here
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="anime row">
      <div className="relative w-full h-64">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${animeData.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900"></div>
        <div className="absolute bottom-0 left-0 z-10 p-4 w-full">
          <div className="flex items-center space-x-3">
            <h1 className="text-white text-xl font-bold">{animeData.title}</h1>
            <span className="text-[9px] font-semibold border px-1 rounded">HD</span>
            <span className="text-xs tracking-widest font-bold text-nowrap text-gray-300">{animeData.lang}</span>
          </div>
          <div className="flex text-gray-300 space-x-2">
            <span className="year">{animeData.type}</span>
            <span className="">Genre: <span className='text-sm text-violet-300 ml-2 tracking-widest'>{animeData.genres.join(' | ')}</span></span>
          </div>
        </div>
      </div>
      <div className="details col-6 px-3">
        <div className="mid" style={{ margin: '20px 0' }}></div>
        <div className="mid">
          <button onClick={handleWatchNow} className="rounded bg-violet-600 p-2 w-full flex justify-center items-center font-bold text-white hover:bg-white hover:text-violet-600 transition-colors duration-300 ease-in-out transform">
            <HiPlay className='size-5' /> <span>Watch Now</span>
          </button>
        </div>
        <div className="text-gray-400 text-sm mt-2">
          <p className="text-base font-bold text-gray-300">Synopsis:</p>
          <div className="mx-2 indent-4">{animeData.synopsis}</div>
        </div>
        <div className="grid grid-cols-2 my-3">
          <div className="space-x-2">
            <span className="item-head">Other Names:</span>
            <span className="text-gray-400 text-sm">{animeData.other}</span>
          </div>
          <div className="space-x-2">
            <span className="item-head">Episodes:</span>
            <span className="text-gray-400 text-sm">{animeData.total}</span>
          </div>
          <div className="space-x-2">
            <span className="item-head">Release Year:</span>
            <span className="text-gray-400 text-sm">{animeData.year}</span>
          </div>
          <div className="space-x-2">
            <span className="item-head">Type:</span>
            <span className="text-gray-400 text-sm">{animeData.type}</span>
          </div>
          <div className="space-x-2">
            <span className="item-head">Status:</span>
            <span className="text-gray-400 text-sm">{animeData.status}</span>
          </div>
        </div>
        <section id="watch">
          <div className="episode-container">
            <h1 className="text-base font-bold text-gray-300">Episodes:</h1>
            <motion.div
              className="font-bold mt-1 grid grid-cols-6 px-3 gap-2 py-2 rounded sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-12"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {animeData.episodes.map((episode) => (
                <button
                  key={episode.link}
                  className="bg-zinc-700 w-12 h-12 text-white rounded flex items-center justify-center"
                  onClick={() => handleEpisodeClick(episode.link)}
                >
                  {episode.number}
                </button>
              ))}
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  </motion.div>
</section>


        {/* Recommendations Section */}
        <section className="p-4">
          <div>
            <h2 id="recommendations" className="text-lg font-custom tracking-widest font-semibold mb-4">
              Recommended <span className='text-blue-300'>Anime</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommendationError ? (
                <p className="text-white">{recommendationError}</p>
              ) : recommendations.length > 0 ? (
                recommendations.map((recAnime, index) => {
                  // Extract the preferred title and format it
                  const title = formatTitle(recAnime.title?.userPreferred || 'Unknown Title');

                  return (
                    <Link to={`/anime/${title}`} key={recAnime.id} className="block">
                      <motion.div
                        className="poster bg-zinc-900 overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <div id="shadow2" className="shadow">
                          <img
                            className="lzy_img w-full h-64 object-cover"
                            src={recAnime.coverImage?.large || img}
                            alt={recAnime.title?.userPreferred || 'Unknown Title'}
                          />
                        </div>
                        <div className="la-details p-2 text-white">
                          <div className="items-center">
                            <p className="text-xs font-semibold">{recAnime.title?.userPreferred || 'Unknown Title'}</p>
                            <div className="flex justify-between items-center text-gray-400">
                              <div className="text-xs font-custom">
                                EP {recAnime.episodes || 'N/A'}
                              </div>
                              <div className="p-1 font-custom rounded-lg text-xs font-bold text-red-500 tracking-wider">
                                {recAnime.title?.userPreferred.toLowerCase().includes("dub") ? "DUB" : "SUB"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })
              ) : (
                <p className="text-white">No recommendations available.</p>
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AnimePage;
