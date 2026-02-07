import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ProtectedRoutes from '../component/ProtectedRoutes';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../store/slices/authSlice';
import { updateProfile } from '../api/userApi';

// Network configurations for different currencies
const NETWORKS = {
  ethereum: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
  polygon: {
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  bsc: {
    chainId: '0x38',
    chainName: 'BNB Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com'],
  },
  avalanche: {
    chainId: '0xa86a',
    chainName: 'Avalanche Network',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://snowtrace.io'],
  },
};

const CURRENCIES = [
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', network: 'ethereum' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC', network: 'polygon' },
  { id: 'bsc', name: 'BNB Smart Chain', symbol: 'BNB', network: 'bsc' },
  { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', network: 'avalanche' },
];

function Wallet() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState('0');
  const [selectedCurrency, setSelectedCurrency] = useState('ethereum');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  
  // Exchange form
  const [exchangeAmount, setExchangeAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('ethereum');
  const [toCurrency, setToCurrency] = useState('polygon');
  const [exchangeRate, setExchangeRate] = useState(1.5); // Mock exchange rate
  
  // Transfer form
  const [transferAmount, setTransferAmount] = useState('');
  const [transferAddress, setTransferAddress] = useState('');

  useEffect(() => {
    checkConnection();
  }, []);

  useEffect(() => {
    if (account && provider) {
      fetchBalance();
    }
  }, [account, provider, selectedCurrency]);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await connectWallet();
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask or another Web3 wallet');
      return;
    }

    setIsConnecting(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        setProvider(provider);
        setSigner(signer);
        setAccount(address);

        // Save wallet address to profile
        if (user && user.id) {
          try {
            await updateProfile(user.id, { walletAddress: address });
            dispatch(updateUser({ walletAddress: address }));
          } catch (error) {
            console.error('Failed to save wallet address:', error);
          }
        }

        // Switch to selected network
        await switchNetwork(selectedCurrency);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet: ' + error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const switchNetwork = async (currencyId) => {
    if (!window.ethereum) return;

    setIsSwitching(true);
    try {
      const currency = CURRENCIES.find(c => c.id === currencyId);
      const network = NETWORKS[currency.network];

      try {
        // Try to switch to the network
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: network.chainId }],
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          // Add the network
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [network],
          });
        } else {
          throw switchError;
        }
      }

      setSelectedCurrency(currencyId);
      
      // Update provider and fetch balance
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      const signer = await provider.getSigner();
      setSigner(signer);
      
      await fetchBalance();
    } catch (error) {
      console.error('Error switching network:', error);
      alert('Failed to switch network: ' + error.message);
    } finally {
      setIsSwitching(false);
    }
  };

  const fetchBalance = async () => {
    if (!account || !provider) return;

    try {
      const balance = await provider.getBalance(account);
      const formattedBalance = ethers.formatEther(balance);
      setBalance(parseFloat(formattedBalance).toFixed(4));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleExchange = async () => {
    if (!exchangeAmount || parseFloat(exchangeAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (fromCurrency === toCurrency) {
      alert('Please select different currencies');
      return;
    }

    // This is a mock exchange - in a real app, you'd integrate with a DEX or exchange API
    const amount = parseFloat(exchangeAmount);
    const convertedAmount = (amount * exchangeRate).toFixed(4);
    
    alert(`Exchange: ${amount} ${CURRENCIES.find(c => c.id === fromCurrency)?.symbol} = ${convertedAmount} ${CURRENCIES.find(c => c.id === toCurrency)?.symbol}\n\nNote: This is a demo. In production, this would execute a real exchange transaction.`);
    
    // Reset form
    setExchangeAmount('');
  };

  const handleTransfer = async () => {
    if (!transferAmount || !transferAddress) {
      alert('Please enter amount and recipient address');
      return;
    }

    if (!signer) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const amount = ethers.parseEther(transferAmount);
      const tx = await signer.sendTransaction({
        to: transferAddress,
        value: amount,
      });

      alert(`Transaction sent! Hash: ${tx.hash}\n\nWaiting for confirmation...`);
      
      await tx.wait();
      alert('Transaction confirmed!');
      
      // Refresh balance
      await fetchBalance();
      
      // Reset form
      setTransferAmount('');
      setTransferAddress('');
    } catch (error) {
      console.error('Error transferring:', error);
      alert('Transfer failed: ' + error.message);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setBalance('0');
  };

  return (
    <ProtectedRoutes>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Wallet Connection</h1>

        {/* Wallet Connection Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Wallet Status</h2>
          
          {!account ? (
            <div>
              <p className="mb-4 text-gray-600">Connect your wallet to get started</p>
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Connected Address:</p>
                <p className="font-mono text-sm break-all">{account}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Current Network:</p>
                <p className="font-semibold">{NETWORKS[CURRENCIES.find(c => c.id === selectedCurrency)?.network]?.chainName}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Balance:</p>
                <p className="text-2xl font-bold">{balance} {CURRENCIES.find(c => c.id === selectedCurrency)?.symbol}</p>
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium">Select Currency/Network:</label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => switchNetwork(e.target.value)}
                  disabled={isSwitching}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency.id} value={currency.id}>
                      {currency.name} ({currency.symbol})
                    </option>
                  ))}
                </select>
                {isSwitching && <p className="mt-2 text-sm text-gray-600">Switching network...</p>}
              </div>

              <button
                onClick={disconnectWallet}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Disconnect Wallet
              </button>
            </div>
          )}
        </div>

        {/* Currency Exchange Section */}
        {account && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Currency Exchange</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2 font-medium">From</label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency.id} value={currency.id}>
                      {currency.name} ({currency.symbol})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block mb-2 font-medium">To</label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency.id} value={currency.id}>
                      {currency.name} ({currency.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Amount</label>
              <input
                type="number"
                value={exchangeAmount}
                onChange={(e) => setExchangeAmount(e.target.value)}
                placeholder="Enter amount"
                step="0.0001"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {exchangeAmount && fromCurrency !== toCurrency && (
              <div className="mb-4 p-3 bg-gray-100 rounded-md">
                <p className="text-sm text-gray-600">
                  Exchange Rate: 1 {CURRENCIES.find(c => c.id === fromCurrency)?.symbol} = {exchangeRate} {CURRENCIES.find(c => c.id === toCurrency)?.symbol}
                </p>
                <p className="text-lg font-semibold mt-1">
                  You will receive: {(parseFloat(exchangeAmount) * exchangeRate).toFixed(4)} {CURRENCIES.find(c => c.id === toCurrency)?.symbol}
                </p>
              </div>
            )}

            <button
              onClick={handleExchange}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Exchange
            </button>
          </div>
        )}

        {/* Transfer Section */}
        {account && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Transfer Balance</h2>
            
            <div className="mb-4">
              <label className="block mb-2 font-medium">Recipient Address</label>
              <input
                type="text"
                value={transferAddress}
                onChange={(e) => setTransferAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Amount ({CURRENCIES.find(c => c.id === selectedCurrency)?.symbol})</label>
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="Enter amount"
                step="0.0001"
                min="0"
                max={balance}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-600">Available: {balance} {CURRENCIES.find(c => c.id === selectedCurrency)?.symbol}</p>
            </div>

            <button
              onClick={handleTransfer}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Transfer
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 mr-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="px-4 py-2 mr-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Profile
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="px-4 py-2 mr-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Settings
          </button>
        </div>
      </div>
    </ProtectedRoutes>
  );
}

export default Wallet;
