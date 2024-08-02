import img from '../assets/err.png';
import React from 'react';
import gif from '../assets/enk.gif';

const Error = ({ message }) => {
    return (
        <>
        <img src={gif} className='w-full md:w-2/5 mx-auto object-cover'></img>
        <div className=" text-white p-4 full space-x-2 justify-center  flex items-center rounded-lg">
            <img src={img} className='h-24'></img>
            <div className="">
            <h2 className="text-xl tracking-widest font-custom text-red-400 font-semibold">Anime Not Found</h2>
            <p className='text-sm font-bold '>Sorry, we couldn't find the anime you were looking for</p>
            
            <p className='text-xs text-right font-extrabold text-violet-300'>- Neferpitou chan</p>

            </div>
            
        </div>
        </>
        
    );
};

export default Error;
