import React, { useState } from 'react';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { IoMenu } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/hxh.png';
import { IoSearchCircle } from "react-icons/io5";
import { Link } from 'react-router-dom';



const Navbar = ({ toggleLoginModal }) => {
    const [nav, setNav] = useState(false);
    const navigate = useNavigate();

    const toggleNav = () => {
        setNav(!nav);
    };

    const closeNav = () => {
        setNav(false);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        const query = event.target.query.value;
        navigate(`/search/${query}`);
    };

    return (
        <div className='fixed top-0 left-0 w-full nav text-white z-50'>
            <div className='flex md:justify-between items-center justify-between md:px-10 h-16 mx-auto  px-2'>
                <div onClick={toggleNav} className='md:hidden z-30'>
                    {nav ? <AiOutlineClose size={30} className='text-violet-400 drop-shadow-lg' /> : <IoMenu size={30} className=' drop-shadow-lg text-violet-400 icon' />}
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
                    <div id="search-div" className='relative '>
                        <form onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                name="query"
                                id="query"
                                placeholder="Search"
                                required
                                className='bg-zinc-700 bg-opacity-60 pl-1 pr-4 py-2  placeholder:font-semibold placeholder:text-center placeholder:text-violet-400  rounded-3xl'
                            />
                            <button
                                name="search"
                                type="submit"
                                className='absolute right-1 top-1/2 transform -translate-y-1/2'
                            >
                                <IoSearchCircle className='size-9 text-violet-300' />
                            </button>
                        </form>
                    </div>
                </div>

            </div>
            <div className={`fixed top-0 left-0 w-full h-full darkblue flex flex-col justify-center items-start transform ${nav ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-20`}>
                <div className="nav2 w-full h-full"></div>
            </div>
        </div>
    );
};

export default Navbar;
