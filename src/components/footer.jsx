import React from 'react';
import img from '../assets/mangga.jpg';
import { motion } from 'framer-motion';
import { TbBrandGithubFilled } from "react-icons/tb";
import { FaFacebookSquare } from "react-icons/fa";
import logo from '../assets/hxh.png';
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
    const splitText = (text) => text.split('').map((char, index) => (
        <motion.span
            key={index}
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{
                repeat: Infinity,
                repeatType: 'loop',
                duration: 2,
                delay: index * 0.1
            }}
            className="inline-block"
        >
            {char}
        </motion.span>
    ));

    return (
        <div className='px-0 xl:px-56 sm:px-2 lg:px-40 md:px-32'>
            <div
                className="relative bg-cover bg-center h-36 w-full"
                style={{ backgroundImage: `url(${img})` }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center">
                    <div className="bg-zinc-950 p-4 relative rounded">
                        <img src={logo} alt='logo' className='h-12 absolute left-[-20px] top-[-20px]' />
                        <div className="flex">
                            <p className="text-zinc-500 text-center font-bold text-xs">
                                Developed by 
                                <span className='tracking-widest font-custom font-bold text-sm drop-shadow ml-4 text-violet-300'>
                                    {splitText('Andrei')}
                                </span>
                                <span className='tracking-widest font-custom font-bold drop-shadow ml-1 text-sm text-violet-300'>
                                    {splitText('R.')}
                                </span>
                                <span className='tracking-widest font-custom font-bold drop-shadow ml-1 text-sm text-violet-300'>
                                    {splitText('Parquez')}
                                </span>
                            </p>
                        </div>
                        <p className='text-zinc-500 text-center font-bold text-xs'>Contact Me</p>
                        <div className="flex justify-center">
                            <a href="https://www.facebook.com/andrei.parquez.5" target="_blank" rel="noopener noreferrer">
                                <FaFacebookSquare className='size-6 text-blue-500 mx-2' />
                            </a>
                            <a href="https://github.com/AndreiParquez" target="_blank" rel="noopener noreferrer">
                                <TbBrandGithubFilled className='size-6 text-zinc-600 mx-2' />
                            </a>
                            <a href="https://www.twitter.com/yourprofile" target="_blank" rel="noopener noreferrer">
                                <FaSquareXTwitter className='size-6 text-white mx-2' />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
