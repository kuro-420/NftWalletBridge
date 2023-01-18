import React from "react";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import NftModal from "./NftModal";

export default function NFTButton() {
  const wallet = useWallet();
  const [open, setOpen] = useState(false);
  return (
    <div>
      {wallet.connected ? (
        <div>
          <button
            key={"open-button"}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-2 rounded inline-flex items-center"
            onClick={() => setOpen(true)}
          >
            <svg
              className="fill-current w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 122.88 119.9"
            >
              <path d="M7.42,31.66h25a29.14,29.14,0,0,1-7.34-4.6A21.2,21.2,0,0,1,20,20.61a13.78,13.78,0,0,1-1.48-7.79,14.86,14.86,0,0,1,3.8-8.08A14.45,14.45,0,0,1,25,2.25l.1-.08C28.72-.26,32.79-.47,36.81.67A29.55,29.55,0,0,1,47.65,6.9,37.7,37.7,0,0,1,54,14a68,68,0,0,1,4.81,8.47c1,2,1.91,4.1,2.79,6.21.89-2.11,1.81-4.19,2.8-6.21A68,68,0,0,1,69.23,14,37.35,37.35,0,0,1,75.6,6.9,29.55,29.55,0,0,1,86.44.67c4-1.14,8.09-.93,11.68,1.5l.11.08A14.45,14.45,0,0,1,101,4.74a14.94,14.94,0,0,1,3.8,8.08,13.8,13.8,0,0,1-1.48,7.79,21.24,21.24,0,0,1-5.16,6.45,29.09,29.09,0,0,1-7.33,4.6h24.65a7.42,7.42,0,0,1,5.23,2.18l0,0a7.41,7.41,0,0,1,2.17,5.22V50.64a7.37,7.37,0,0,1-2.18,5.24l-.3.28A7.45,7.45,0,0,1,116.1,58v54a7.94,7.94,0,0,1-7.91,7.91H14.82A7.94,7.94,0,0,1,6.92,112V58a7.37,7.37,0,0,1-4.74-2.16,2.7,2.7,0,0,1-.28-.31A7.37,7.37,0,0,1,0,50.64V39.08a7.44,7.44,0,0,1,7.42-7.42Zm43,0h3.36c-.76-1.49-1.71-3.3-2.81-5.23s-2.33-4-3.65-6a54.68,54.68,0,0,0-3.78-5.18,17.93,17.93,0,0,0-4.11-3.72c-3.6-2.2-6.59-2.45-8.5-1.45a4,4,0,0,0-2,2.48,6.91,6.91,0,0,0,.26,4.3c1.64,4.67,7.33,10.27,19.09,14.05l2.18.73Zm19,0h3.36L75,30.93c11.75-3.78,17.45-9.38,19.09-14a7,7,0,0,0,.26-4.3,4.08,4.08,0,0,0-2-2.48c-1.92-1-4.91-.75-8.51,1.45a18.14,18.14,0,0,0-4.11,3.72,56.5,56.5,0,0,0-3.78,5.18c-1.32,2-2.55,4.05-3.64,6s-2.06,3.75-2.81,5.24Zm4.35,22.59V93.51l-12-7.89L49.73,93.51V54.28l-35.09,0V112a.18.18,0,0,0,.18.19h93.37a.19.19,0,0,0,.19-.19V54.21l-34.56,0Zm-12,12.53L64,70.51l4.07,1-2.71,3.33.32,4.36-3.87-1.67L57.9,79.23l.33-4.36-2.72-3.33,4.07-1,2.19-3.73ZM99.94,36.85l2.21,3.76,4.1,1L103.51,45l.33,4.39-3.9-1.68L96,49.39,96.37,45l-2.73-3.36,4.09-1,2.21-3.76ZM61.73,38.33l2.19,3.73,4.06,1-2.71,3.32.32,4.37-3.86-1.67-3.87,1.67.32-4.37-2.71-3.32,4.07-1,2.19-3.73ZM22.5,36.43l2.05,3.5,3.82,1L25.82,44l.31,4.09L22.5,46.53,18.87,48.1,19.18,44l-2.55-3.12,3.82-1,2.05-3.5Z" />
            </svg>
          </button>
          <NftModal open={open} setOpen={setOpen} key={"main-modal"} />
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}
