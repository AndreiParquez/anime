import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loader from './loader';
import Navbar from './navbar';
import ErrorPage from './notfound';  // Import the Error component
import { motion } from 'framer-motion';
import Footer from './footer';

// Utility functions
const ProxyApi = "https://proxy1.jackparquez1.workers.dev/?u=";
const searchapi = "/search/";

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
        await new Promise(resolve => setTimeout(resolve, 1000));  // Add a delay before retrying
        return getJson(path, errCount + 1);
    }
}

async function SearchAnime(query, page = 1) {
    const data = await getJson(searchapi + query + "?page=" + page);
    console.log(data);
    return data["results"];
}

const SearchResults = () => {
    const { query } = useParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);  // Track overall loading state
    const [loadingMore, setLoadingMore] = useState(false);  // Track loading for more results
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [error, setError] = useState(null);  // New state for error handling

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            setError(null);  // Reset error state before fetching
            try {
                const results = await SearchAnime(query, 1);
                if (results.length > 0) {
                    setResults(results);
                    setPage(2);
                    setHasNextPage(true);  // Assuming there's a next page if results are found
                } else {
                    setResults([]);
                    setHasNextPage(false);  // No results means no more pages
                }
            } catch (error) {
                console.error('Error fetching search results:', error);
                if (page === 1) {
                    setError('Failed to fetch search results. Please try again later.');  // Set error message
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.scrollY + window.innerHeight >=
                document.documentElement.scrollHeight
            ) {
                if (hasNextPage && !loadingMore) {
                    const fetchMoreResults = async () => {
                        setLoadingMore(true);  // Show loader when fetching more results
                        try {
                            const newResults = await SearchAnime(query, page);
                            if (newResults.length > 0) {
                                setResults(prevResults => [...prevResults, ...newResults]);
                                setPage(prevPage => prevPage + 1);
                            } else {
                                setHasNextPage(false);  // No more pages
                            }
                        } catch (error) {
                            console.error('Error fetching more results:', error);
                            setHasNextPage(false);  // Stop further fetching
                            setError('Failed to fetch more results. Please try again later.');  // Set error message
                        } finally {
                            setLoadingMore(false);  // Hide loader when done
                        }
                    };

                    fetchMoreResults();
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasNextPage, page, query, loadingMore]);  // Added loadingMore to dependencies

    if (loading) {
        return <Loader />;  // Show loader during initial search
    }

    return (
        <>
        <div className="App bg-zinc-900 px-0 xl:px-56 sm:px-2 lg:px-40 md:px-32 text-white">
            <Navbar />
            <section className="p-4 mt-16">
                <div>
                    <h2 className="text-lg font-custom tracking-widest font-semibold mb-4">Search Results for <span className='text-blue-300'>{query}</span></h2>
                    {error && page === 1 ? (  // Render Error component if there's an error on page 1
                        <ErrorPage message={error} />
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {results.map((anime, index) => (
                                <Link to={`/anime/${anime.id}`} key={index} className="block">
                                    <motion.div
                                        className="poster bg-zinc-900 overflow-hidden"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 2, delay: index * 0.1 }}
                                    >
                                        <div id="shadow2" className="shadow">
                                            <img className="lzy_img w-full h-64 object-cover" src={anime.img} alt={anime.title} />
                                        </div>
                                        <div className="la-details p-2 text-white">
                                            <div className="items-center">
                                                <p className="text-xs font-bold">{anime.title}</p>
                                                <div className="flex justify-between items-center text-gray-400">
                                                    <div className="text-xs font-custom tracking-widest">{anime.releaseDate}</div>
                                                    <div className="p-1 font-custom rounded-lg text-xs font-bold text-red-500 tracking-wider">
                                                        {anime.title.toLowerCase().includes("dub") ? "DUB" : "SUB"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            {loadingMore && page > 1 && <Loader />}  {/* Show loader when fetching more results */}
        </div>
        <Footer />
        </>
    );
};

export default SearchResults;
