import { useState, useEffect } from 'react';
import Pack from './Pack.jsx';

export default function Pull() {
  const [isPulled, setIsPulled] = useState(false)

  const handlePull = () => {
    setIsPulled(true);
  };

  return (
    <>
      {isPulled ? (
        <Pack />
      ) : (
        <div className="bg-white flex justify-center items-center h-[90vh] rounded-2xl relative overflow-hidden">
          <h1 className="absolute top-4 right-4 text-5xl font-extrabold text-gray-800">
            Gacha title
          </h1>
          <div className="absolute bottom-4 right-4 flex gap-4">
            <button className="px-16 py-3 bg-amber-200 text-white rounded-lg text-lg font-semibold hover:bg-amber-300">
              Buy
            </button>
            <button
              className="px-16 py-3 bg-amber-200 text-white rounded-lg text-lg font-semibold hover:bg-amber-300"
              onClick={handlePull}
            >
              Pull
            </button>
          </div>
        </div>
      )}
    </>
  );
}
