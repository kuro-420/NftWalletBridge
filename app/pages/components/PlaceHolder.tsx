import React from "react";
import { Fragment } from "react";
import { type Connection } from "@solana/web3.js";
import { Nft } from "@metaplex-foundation/js";
import { Menu } from "@headlessui/react";
import NFTItem from "./NFTItem";
import addOrUpdateNftLinksToWallet from "../../helpers/client/addOrUpdateNftLinksToWallet";

export default function PlaceHolder(props: {
  nftsInWallet: Array<Nft>;
  wallet: any;
  connection: Connection;
  callback: (arg0: boolean) => void;
}) {
  return (
    <Menu as="div" className="relative inline-block w-full text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-gray-400 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
          <svg
            className="fill-content w-full h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 122.88 119.9"
          >
            <path d="M56.573,4.868c0-0.655,0.132-1.283,0.37-1.859c0.249-0.6,0.61-1.137,1.056-1.583C58.879,0.545,60.097,0,61.44,0 c0.658,0,1.287,0.132,1.863,0.371c0.012,0.005,0.023,0.011,0.037,0.017c0.584,0.248,1.107,0.603,1.543,1.039 c0.881,0.88,1.426,2.098,1.426,3.442c0,0.03-0.002,0.06-0.006,0.089v51.62l51.619,0c0.029-0.003,0.061-0.006,0.09-0.006 c0.656,0,1.285,0.132,1.861,0.371c0.014,0.005,0.025,0.011,0.037,0.017c0.584,0.248,1.107,0.603,1.543,1.039 c0.881,0.88,1.428,2.098,1.428,3.441c0,0.654-0.133,1.283-0.371,1.859c-0.248,0.6-0.609,1.137-1.057,1.583 c-0.445,0.445-0.98,0.806-1.58,1.055v0.001c-0.576,0.238-1.205,0.37-1.861,0.37c-0.029,0-0.061-0.002-0.09-0.006l-51.619,0.001 v51.619c0.004,0.029,0.006,0.06,0.006,0.09c0,0.656-0.133,1.286-0.371,1.861c-0.006,0.014-0.012,0.025-0.018,0.037 c-0.248,0.584-0.602,1.107-1.037,1.543c-0.883,0.882-2.1,1.427-3.443,1.427c-0.654,0-1.283-0.132-1.859-0.371 c-0.6-0.248-1.137-0.609-1.583-1.056c-0.445-0.444-0.806-0.98-1.055-1.58h-0.001c-0.239-0.575-0.371-1.205-0.371-1.861 c0-0.03,0.002-0.061,0.006-0.09V66.303H4.958c-0.029,0.004-0.059,0.006-0.09,0.006c-0.654,0-1.283-0.132-1.859-0.371 c-0.6-0.248-1.137-0.609-1.583-1.056c-0.445-0.445-0.806-0.98-1.055-1.58H0.371C0.132,62.726,0,62.097,0,61.44 c0-0.655,0.132-1.283,0.371-1.859c0.249-0.6,0.61-1.137,1.056-1.583c0.881-0.881,2.098-1.426,3.442-1.426 c0.031,0,0.061,0.002,0.09,0.006l51.62,0l0-51.62C56.575,4.928,56.573,4.898,56.573,4.868L56.573,4.868z" />
          </svg>
        </Menu.Button>
      </div>
      <Menu.Items className="absolute right-0 z-10 mt-2 max-h-64 w-full overflow-y-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          {props.nftsInWallet &&
            props.nftsInWallet.map((nft, index) => {
              if (nft.json?.image) {
                return (
                  <NFTItem
                    key={`placeholder-index-${index}`}
                    index={index}
                    image={nft.json?.image!}
                    name={nft.name}
                    onClick={async () => {
                      console.log(
                        "Attempting to link nft:",
                        nft.address.toString()
                      );
                      const ix = await addOrUpdateNftLinksToWallet(
                        props.wallet,
                        props.connection,
                        nft.address
                      );
                      if (ix != null) {
                        console.log("Confirmed transaction id:", ix);
                        props.callback(true);
                      }
                    }}
                  />
                );
              }
            })}
        </div>
      </Menu.Items>
    </Menu>
  );
}
