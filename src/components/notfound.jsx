import img from '../assets/err.png';
import React from 'react';
import gif from '../assets/enk.gif';

const Error = ({ message }) => {
    return (
        <>
        <img src={gif} className='w-full object-cover'></img>
        <div className=" text-white p-4 full space-x-2 justify-center  flex items-center rounded-lg">
            <img src={img} className='h-24'></img>
            <div className="">
            <h2 className="text-xl tracking-widest font-custom font-semibold">404 Not Found</h2>
            <p className='text-xs font-semibold'>{message}</p>
            <p className='text-xs text-right font-extrabold'>- Neferpitou chan</p>

            </div>
            
        </div>
        </>
        
    );
};

export default Error;
