import React, { useState } from 'react';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { IoMenu } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/hxh.png';
import { IoSearchCircle } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { Fa0 } from 'react-icons/fa6';

const Navbar = ({ toggleLoginModal }) => {
    const [nav, setNav] = useState(false);
    const [searchVisible, setSearchVisible] = useState(false);
    const navigate = useNavigate();

    const toggleNav = () => {
        setNav(!nav);
    };

    const closeNav = () => {
        setNav(false);
    };

    const handleSearchClick = () => {
        setSearchVisible(true);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        const query = event.target.query.value;
        navigate(`/search/${query}`);
    };

    return (
        <div className='fixed top-0 left-0 w-full nav text-white z-50'>
            <div className='flex md:justify-between items-center justify-between md:px-10 h-16 mx-auto px-2'>
                <div onClick={toggleNav} className='md:hidden z-30'>
                    {nav ? <AiOutlineClose size={30} className='text-violet-400 drop-shadow-lg' /> : <IoMenu size={30} className='drop-shadow-lg text-violet-400 icon' />}
                </div>
                <Link to='/'>
                    <div className='flex md:mx-0 mx-auto drop-shadow-md'>
                        <a className='md:text-xl items-center text-center text-base icon'>
                            <p className='font-bold font-custom tracking-wider'>Anime</p>
                            <p className='mt-[-10px] text-[10px] font-extrabold text-violet-300'>Tambayan</p>
                        </a>
                        <img src={logo} alt='logo' className='h-9 w-9' />
                    </div>
                </Link>
                <div className='md:flex items-center'>
                    {!searchVisible ? (
                        <button
                            onClick={handleSearchClick}
                            className='flex items-center text-white'
                        >
                            <FaSearch className='size-9 rounded-full bg bg-zinc-900 bg-opacity-55 p-2 text-violet-500 drop-shadow-sm' />
                        </button>
                    ) : (
                        <div id="search-div" className='relative '>
                            <form onSubmit={handleSearchSubmit}>
                                <input
                                    type="text"
                                    name="query"
                                    id="query"
                                    placeholder="Search"
                                    required
                                    className='bg-zinc-700 bg-opacity-60 pl-1 pr-4 py-2 placeholder:font-semibold placeholder:text-center placeholder:text-violet-300 placeholder:text-sm text-sm text-center rounded-3xl'
                                />
                                <button
                                    name="search"
                                    type="submit"
                                    className='absolute text-zinc-400 right-1 top-1/2 transform -translate-y-1/2'
                                >
                                         <FaSearch className='size-9 rounded-full bg bg-zinc-900 bg-opacity-55 p-2 text-violet-500 drop-shadow-sm' />
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
            <div className={`fixed top-0 left-0 w-full h-full darkblue flex flex-col justify-center  transform ${nav ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-20`}>
                <div className="nav2 w-full h-full pt-12 p-4">
                    <p className='text-xs text-zinc-400'>BROWSE</p>
                    <div className="flex flex-col  mt-2   h-full">
                        <Link to="/" onClick={closeNav} className="border-l-4 bg-zinc-800 bg-opacity-50 border-violet-400 text-violet-400  py-3 font-custom tracking-widest px-10">Home</Link>
                        <Link to="/anime" onClick={closeNav} className=" bg-opacity-50 py-4 font-custom tracking-widest px-10">Anime</Link>
                        <Link to="/manga" onClick={closeNav} className=" bg-opacity-50 py-4 font-custom tracking-widest px-10">Manga</Link>
                        <Link to="/favorites" onClick={closeNav} className=" bg-opacity-50 py-4 font-custom tracking-widest px-10">Favorites</Link>
                        <Link to="/about" onClick={closeNav} className=" bg-opacity-50 py-4 font-custom tracking-widest px-10">About</Link>
                    </div>

                    
                </div>
            </div>
        </div>
    );
};

export default Navbar;
