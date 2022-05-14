import { ethers } from "ethers";
import React, { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spin from "./components/Loader";
import abi from "./utils/WavePortal.json";

function App() {
  const [getWavesLoading, setGetWavesLoading] = useState(false);
  const [waveLoading, setWaveLoading] = useState(false);
  const contractAddress = process.env
    .REACT_APP_GOERLI_CONTRACT_ADDRESS as string;
  const contractABI = abi.abi;

  const [totalWaves, setTotalWaves] = useState(0);

  const wave = async () => {
    setWaveLoading(true);

    try {
      const { ethereum }: any = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        toast.success(`Count: ${count.toNumber()}`);

        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setTotalWaves(count.toNumber());
        setWaveLoading(false);
        toast.success(`Count: ${count.toNumber()}`);
      } else {
        setWaveLoading(false);
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      setWaveLoading(false);
      console.log(error);
    }
  };

  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window as any;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        toast.warn("No Metatmask Present");
      } else {
        console.log("We have the ethereum object", ethereum);
        toast.success("Wallet Present");
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        toast.success(`Found an authorized account ${account}`);
      } else {
        console.log("No authorized account found");
        toast.warn("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentAccount !== "") {
      (async () => {
        setGetWavesLoading(true);
        try {
          const { ethereum }: any = window;

          if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const wavePortalContract = new ethers.Contract(
              contractAddress,
              contractABI,
              signer
            );

            let count = await wavePortalContract.getTotalWaves();
            console.log("Retrieved total wave count...", count.toNumber());
            toast.success(`Count: ${count.toNumber()}`);
            setTotalWaves(count.toNumber());

            setGetWavesLoading(false);
            toast.success(`Count: ${count.toNumber()}`);
          } else {
            setGetWavesLoading(false);
            console.log("Ethereum object doesn't exist!");
          }
        } catch (error) {
          setGetWavesLoading(false);
          console.log(error);
        }
      })();
    }
  }, [currentAccount]);

  const connectWallet = async () => {
    try {
      const { ethereum } = window as any;

      if (!ethereum) {
        toast.warn("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      toast.success(`Wallet ${accounts[0]} Connected`);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="relative">
        <div className="absolute top-[5%] right-[5%]">
          {currentAccount ? (
            <button className="px-5 py-2 bg-green-500 rounded text-white">
              Wallet Connected
            </button>
          ) : (
            <button
              onClick={connectWallet}
              className="px-5 py-2 bg-blue-500 rounded text-white hover:opacity-60 transition ease-out duration-300"
            >
              Connect Wallet
            </button>
          )}
        </div>
        <div className=" text-center space-y-5 mt-5">
          <div className=" font-bold text-3xl">Hey there</div>
          <div className="text-xl">Hey I'm Samuel and I just got into web3</div>
          <button
            onClick={wave}
            className="px-5 py-2 bg-blue-500 rounded text-white  hover:opacity-60 transition ease-out duration-300"
          >
            {waveLoading ? <Spin color="white" /> : "Wave at me"}
          </button>
        </div>
        <div className="flex justify-center mt-5">
          Total Waves: {getWavesLoading ? <Spin color="blue" /> : totalWaves}
        </div>
      </div>
    </>
  );
}

export default App;
