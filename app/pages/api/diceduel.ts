// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import axiosRetry from "axios-retry";
import { NextApiRequest, NextApiResponse } from "next";
import { RawData, RawTransaction } from "../../data/helius/types";
import { parsedDiceDuelData } from "../../helpers/backend/parsedDiceDuelData";
import { getEnrichedTransactions } from "../../helpers/backend/getEnrichedTransactions";
import fetchLinkedNftsInWallet from "../../helpers/backend/fetchLinkedNftsInWallet";
import { PublicKey } from "@solana/web3.js";
import addOrUpdateDataInLinkedNft from "../../helpers/backend/addOrUpdateDataInLinkedNft";
import fetchDataFromLinkedNft from "../../helpers/backend/fetchDataFromLinkedNft";
import { db } from "../../intializeDb";
import { doc, getDoc, setDoc } from "firebase/firestore";

const apiURL = "https://api.helius.xyz/v0/addresses";
const resource = "transactions";
const options = `?api-key=${process.env.HELIUS_API_KEY}`;

axiosRetry(axios, {
  retries: 3, // number of retries
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return retryCount * 2000; // time interval between retries
  },
  retryCondition: (error) => {
    // if retry condition is not specified, by default idempotent requests are retried
    return error.response!.status === 429;
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    let body = req.body as [RawTransaction];
    console.log(body);
    body.forEach(async (data) => {
      // let result = parsedDiceDuelData(data);
      console.log(data.meta.logMessages);
      let P1 = null;
      let P2 = null;
      let winner = "";
      let winnings = 0.1;
      data.meta.logMessages.forEach((logs, index) => {
        if (logs.includes("Program log: P1:")) {
          P1 = logs.split(" ")[3];
        } else if (logs.includes("Program log: P2:")) {
          P2 = logs.split(" ")[3];
        } else if (logs.includes("Program log: Winner:")) {
          winner = logs.split(" ")[3];
          if (data.meta.logMessages[index + 1].split(",")[0].includes("1")) {
            winnings = 0.5;
          } else if (
            data.meta.logMessages[index + 1].split(",")[0].includes("2")
          ) {
            winnings = 1;
          } else {
            winnings = 5;
          }
        }
      });
      if (P1 != null && P2 != null && winner != "") {
        await updateResultToMainLinkedNFTInWallet(
          winner.includes("P1") ? P2 : P1,
          -winnings
        );
        await updateResultToMainLinkedNFTInWallet(
          winner.includes("P1") ? P1 : P2,
          0.97 * winnings
        );
      }

      // if (
      //   result.state == "Game Completed!" &&
      //   result.escrowAccount.length == 2
      // ) {
      //   const winner = result.feePayer;
      //   result.escrowAccount.forEach(async (account) => {
      //     const url = `${apiURL}/${account}/${resource}${options}`;
      //     const transactions = (await (await fetch(url)).json()) as [RawData]; // get fee payer from the escrow account
      //     console.log(transactions);
      //     if (transactions != undefined && transactions.length > 0) {
      //       const loser = transactions[0].feePayer;
      //       if (loser != undefined && loser != winner) {
      //         console.log(loser);
      //         await updateResultToMainLinkedNFTInWallet(
      //           loser,
      //           -result.winnings
      //         );
      //         console.log(winner);
      //         await updateResultToMainLinkedNFTInWallet(
      //           winner,
      //           result.winnings - result.feeCollected
      //         );
      //       }
      //     }
      //   });
      // }
    });
    res.status(200).send("Success");
  } else if (req.method == "GET") {
    res.status(200).send("API ENDPOINT");
  }
}

async function updateResultToMainLinkedNFTInWallet(
  wallet: string,
  winnings: number
) {
  console.log(wallet);
  console.log(winnings);
  const walletLinkedNfts = await fetchLinkedNftsInWallet(new PublicKey(wallet));
  console.log(walletLinkedNfts);
  if (walletLinkedNfts != undefined && walletLinkedNfts.length > 0) {
    //fetch data in the first linkedNFT
    const mainNFT = walletLinkedNfts[0];
    const result = await fetchDataFromLinkedNft(mainNFT);
    const name = "Dice Duel";
    const url = `https://firestore.googleapis.com/v1/projects/${
      process.env.FIREBASE_PROJECT_ID
    }/databases/(default)/documents/mint/${mainNFT.toString()}`;
    const filteredResult = result.filter((data) => {
      data.name == name && data.url == url;
    });
    console.log(filteredResult);
    //main nft does not contain the same metadata
    if (filteredResult.length == 0) {
      const ix = await addOrUpdateDataInLinkedNft(name, url, mainNFT);
      console.log(ix);
    } else {
      //just update the centralised db instead
      const docRef = doc(db, "mint", mainNFT.toString());
      const docSnap = await getDoc(docRef);
      let currentWinnings = winnings;
      let currentGamesPlayed = 1;
      if (docSnap.exists()) {
        currentWinnings = docSnap.data().winnings + currentWinnings;
        currentGamesPlayed = docSnap.data().gamesPlayed + currentGamesPlayed;
      }
      await setDoc(docRef, {
        mint: mainNFT.toString(),
        winnings: currentWinnings,
        gamesPlayed: currentGamesPlayed,
      });
    }
  }
}
