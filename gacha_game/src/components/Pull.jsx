import { useState, useEffect } from 'react';
import Pack from './GachaPuller.jsx';
import Button from './Button.jsx';

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
            <Button variant='golden'>
              Acheter un booster (1$)
            </Button>
            <Button variant='golden' href='/gacha/pull'>
              Pull
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
