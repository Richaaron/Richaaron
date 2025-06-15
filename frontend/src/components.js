import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, ThumbsUp, ChevronDown, Search, Bell, User, ChevronLeft, ChevronRight, X } from 'lucide-react';

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

// Netflix Header Component
export const NetflixHeader = ({ onSearch }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm transition-all duration-300">
      <div className="flex items-center justify-between px-4 py-3 md:px-12">
        <div className="flex items-center space-x-8">
          <div className="text-red-600 text-2xl font-bold">NETFLIX</div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-white hover:text-gray-300 transition-colors">Home</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">TV Shows</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">Movies</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">New & Popular</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">My List</a>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="bg-black border border-white px-3 py-1 text-white placeholder-gray-400 focus:outline-none"
                  autoFocus
                />
                <button type="button" onClick={() => setIsSearchOpen(false)} className="ml-2 text-white">
                  <X size={20} />
                </button>
              </form>
            ) : (
              <button onClick={() => setIsSearchOpen(true)} className="text-white hover:text-gray-300">
                <Search size={20} />
              </button>
            )}
          </div>
          <Bell className="text-white hover:text-gray-300 cursor-pointer" size={20} />
          <User className="text-white hover:text-gray-300 cursor-pointer" size={20} />
        </div>
      </div>
    </header>
  );
};

// Hero Banner Component
export const HeroBanner = ({ movie, onPlay }) => {
  if (!movie) return null;

  return (
    <div className="relative h-screen flex items-center">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${movie.backdrop_path ? BACKDROP_BASE_URL + movie.backdrop_path : 'https://images.pexels.com/photos/8058392/pexels-photo-8058392.jpeg'})`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
      </div>
      
      <div className="relative z-10 px-4 md:px-12 max-w-2xl">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold text-white mb-4"
        >
          {movie.title || movie.name}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-white mb-8 leading-relaxed"
        >
          {movie.overview}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex space-x-4"
        >
          <button 
            onClick={() => onPlay(movie)}
            className="bg-white text-black px-6 py-3 rounded font-semibold hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <Play size={20} fill="black" />
            <span>Play</span>
          </button>
          <button className="bg-gray-600 bg-opacity-70 text-white px-6 py-3 rounded font-semibold hover:bg-opacity-50 transition-colors flex items-center space-x-2">
            <Plus size={20} />
            <span>More Info</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

// Movie Card Component
export const MovieCard = ({ movie, onPlay, onHover, onLeave }) => {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div
      className="relative min-w-[200px] h-[300px] cursor-pointer group"
      onMouseEnter={() => onHover && onHover(movie)}
      onMouseLeave={() => onLeave && onLeave()}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={imageError || !movie.poster_path 
          ? 'https://images.pexels.com/photos/8058392/pexels-photo-8058392.jpeg' 
          : IMAGE_BASE_URL + movie.poster_path
        }
        alt={movie.title || movie.name}
        className="w-full h-full object-cover rounded"
        onError={handleImageError}
      />
      
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 rounded flex items-center justify-center">
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          onClick={() => onPlay(movie)}
          className="opacity-0 group-hover:opacity-100 bg-white text-black p-3 rounded-full hover:bg-gray-200 transition-all duration-300"
        >
          <Play size={24} fill="black" />
        </motion.button>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-white font-semibold text-sm">{movie.title || movie.name}</h3>
        <div className="flex items-center space-x-2 mt-2">
          <span className="text-green-500 font-semibold">{Math.round(movie.vote_average * 10)}% Match</span>
          <span className="text-gray-300 text-xs">{movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0]}</span>
        </div>
      </div>
    </motion.div>
  );
};

// Movie Row Component
export const MovieRow = ({ title, movies, onPlay }) => {
  const scrollRef = useRef(null);
  
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="px-4 md:px-12 mb-8">
      <h2 className="text-white text-xl md:text-2xl font-semibold mb-4">{title}</h2>
      <div className="relative group">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-70"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div 
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onPlay={onPlay} />
          ))}
        </div>
        
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-70"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

// Video Player Modal Component
export const VideoPlayerModal = ({ movie, trailerKey, isOpen, onClose }) => {
  const opts = {
    height: '600',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 1,
      rel: 0,
      showinfo: 0,
      mute: 0,
    },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-black rounded-lg overflow-hidden max-w-4xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            >
              <X size={24} />
            </button>
            
            {trailerKey ? (
              <YouTube videoId={trailerKey} opts={opts} />
            ) : (
              <div className="bg-gray-800 h-96 flex items-center justify-center">
                <p className="text-white text-xl">No trailer available for {movie?.title || movie?.name}</p>
              </div>
            )}
          </div>
          
          <div className="p-6">
            <h2 className="text-white text-2xl font-bold mb-2">{movie?.title || movie?.name}</h2>
            <p className="text-gray-300 mb-4">{movie?.overview}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <span>Rating: {movie?.vote_average?.toFixed(1)}/10</span>
              <span>Release: {movie?.release_date?.split('-')[0] || movie?.first_air_date?.split('-')[0]}</span>
              {movie?.runtime && <span>Duration: {movie.runtime} min</span>}
            </div>
            
            <div className="flex space-x-4 mt-6">
              <button className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 transition-colors flex items-center space-x-2">
                <Play size={16} fill="black" />
                <span>Play</span>
              </button>
              <button className="border border-gray-600 text-white px-6 py-2 rounded font-semibold hover:bg-gray-600 transition-colors flex items-center space-x-2">
                <Plus size={16} />
                <span>My List</span>
              </button>
              <button className="border border-gray-600 text-white px-6 py-2 rounded font-semibold hover:bg-gray-600 transition-colors flex items-center space-x-2">
                <ThumbsUp size={16} />
                <span>Like</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Main Netflix Clone Component
export const NetflixClone = () => {
  const [heroMovie, setHeroMovie] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data as fallback
  const mockMovies = [
    {
      id: 1,
      title: "The Amateur",
      overview: "After his life is turned upside down when his wife is killed in a London terrorist attack, a brilliant but introverted CIA decoder takes matters into his own hands when his supervisors refuse to take action.",
      backdrop_path: "/6van4BavoNXaZhCPdzLHNQ4Uc8H.jpg",
      poster_path: "/SNEoUInCa5fAgwuEBMIMBGvkkh.jpg",
      vote_average: 6.9,
      release_date: "2025-04-09"
    },
    {
      id: 2,
      title: "Deep Cover",
      overview: "Kat is an improv comedy teacher beginning to question if she's missed her shot at success. When an undercover cop offers her the role of a lifetime, she recruits two of her students to infiltrate London's gangland by impersonating dangerous criminals.",
      backdrop_path: "/sNpoGjbV2a65HfZXCtTvf313cBT.jpg",
      poster_path: "/euM8fJvfH28xhjGy25LiygxfkWc.jpg",
      vote_average: 6.9,
      release_date: "2025-06-04"
    },
    {
      id: 3,
      title: "Final Destination Bloodlines",
      overview: "Plagued by a violent recurring nightmare, college student Stefanie heads home to track down the one person who might be able to break the cycle and save her family from the grisly demise that inevitably awaits them all.",
      backdrop_path: "/uIpJPDNFoeX0TVml9smPrs9KUVx.jpg",
      poster_path: "/6WxhEvFsauuACfv8HyoVX6mZKFj.jpg",
      vote_average: 7.0,
      release_date: "2025-05-14"
    },
    {
      id: 4,
      title: "How to Train Your Dragon",
      overview: "On the rugged isle of Berk, where Vikings and dragons have been bitter enemies for generations, Hiccup stands apart, defying centuries of tradition when he befriends Toothless, a feared Night Fury dragon.",
      backdrop_path: "/7HqLLVjdjhXS0Qoz1SgZofhkIpE.jpg",
      poster_path: "/q5pXRYTycaeW6dEgsCrd4mYPmxM.jpg",
      vote_average: 8.0,
      release_date: "2025-06-06"
    },
    {
      id: 5,
      title: "The Accountant²",
      overview: "When an old acquaintance is murdered, Wolff is compelled to solve the case. Realizing more extreme measures are necessary, Wolff recruits his estranged and highly lethal brother, Brax, to help.",
      backdrop_path: "/yBDvgpyynDsbMyK21FoQu1c2wYR.jpg",
      poster_path: "/kMDUS7VmFhb2coRfVBoGLR8ADBt.jpg",
      vote_average: 7.2,
      release_date: "2025-04-23"
    }
  ];

  // Fetch movies from TMDB
  const fetchMovies = async (endpoint) => {
    try {
      const separator = endpoint.includes('?') ? '&' : '?';
      const response = await axios.get(`${TMDB_BASE_URL}${endpoint}${separator}api_key=${TMDB_API_KEY}`);
      return response.data.results;
    } catch (error) {
      console.error('Error fetching movies:', error);
      // Return mock data as fallback
      return mockMovies;
    }
  };

  // Fetch movie trailer
  const fetchTrailer = async (movieId) => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`);
      const trailer = response.data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
      return trailer ? trailer.key : null;
    } catch (error) {
      console.error('Error fetching trailer:', error);
      // Return a sample trailer key for demo
      return 'dQw4w9WgXcQ'; // Sample YouTube video ID
    }
  };

  // Search movies
  const searchMovies = async (query) => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${query}`);
      setSearchResults(response.data.results);
    } catch (error) {
      console.error('Error searching movies:', error);
      // Filter mock data for search
      const filtered = mockMovies.filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    }
  };

  // Handle play button click
  const handlePlay = async (movie) => {
    setSelectedMovie(movie);
    const trailer = await fetchTrailer(movie.id);
    setTrailerKey(trailer);
    setIsModalOpen(true);
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      
      // Set a shorter timeout for API calls
      const timeout = setTimeout(() => {
        console.log('API timeout, using mock data');
        setTrendingMovies(mockMovies);
        setPopularMovies(mockMovies);
        setTopRatedMovies(mockMovies);
        setActionMovies(mockMovies);
        setComedyMovies(mockMovies);
        setHeroMovie(mockMovies[0]);
        setIsLoading(false);
      }, 3000); // 3 second timeout

      try {
        const [trending, popular, topRated, action, comedy] = await Promise.all([
          fetchMovies('/trending/movie/week'),
          fetchMovies('/movie/popular'),
          fetchMovies('/movie/top_rated'),
          fetchMovies('/discover/movie?with_genres=28'), // Action
          fetchMovies('/discover/movie?with_genres=35'), // Comedy
        ]);

        clearTimeout(timeout);
        
        setTrendingMovies(trending.length > 0 ? trending : mockMovies);
        setPopularMovies(popular.length > 0 ? popular : mockMovies);
        setTopRatedMovies(topRated.length > 0 ? topRated : mockMovies);
        setActionMovies(action.length > 0 ? action : mockMovies);
        setComedyMovies(comedy.length > 0 ? comedy : mockMovies);
        
        // Set hero movie to first trending movie
        if (trending && trending.length > 0) {
          setHeroMovie(trending[0]);
        } else {
          setHeroMovie(mockMovies[0]);
        }
        
        setIsLoading(false);
      } catch (error) {
        clearTimeout(timeout);
        console.error('Error initializing data:', error);
        // Use mock data as fallback
        setTrendingMovies(mockMovies);
        setPopularMovies(mockMovies);
        setTopRatedMovies(mockMovies);
        setActionMovies(mockMovies);
        setComedyMovies(mockMovies);
        setHeroMovie(mockMovies[0]);
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-4xl font-bold animate-pulse">NETFLIX</div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      <NetflixHeader onSearch={searchMovies} />
      
      <main className="pt-16">
        <HeroBanner movie={heroMovie} onPlay={handlePlay} />
        
        <div className="relative z-10 -mt-32">
          {searchResults.length > 0 ? (
            <MovieRow title="Search Results" movies={searchResults} onPlay={handlePlay} />
          ) : (
            <>
              <MovieRow title="Trending Now" movies={trendingMovies} onPlay={handlePlay} />
              <MovieRow title="Popular Movies" movies={popularMovies} onPlay={handlePlay} />
              <MovieRow title="Top Rated" movies={topRatedMovies} onPlay={handlePlay} />
              <MovieRow title="Action Movies" movies={actionMovies} onPlay={handlePlay} />
              <MovieRow title="Comedy Movies" movies={comedyMovies} onPlay={handlePlay} />
            </>
          )}
        </div>
      </main>

      <VideoPlayerModal
        movie={selectedMovie}
        trailerKey={trailerKey}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMovie(null);
          setTrailerKey(null);
        }}
      />
    </div>
  );
};