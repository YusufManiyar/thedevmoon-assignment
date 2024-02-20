import { useState, useEffect } from 'react';

const useTokenSupplyStats = (chainId, isOldToken) => {
  const [supplies, setSupplies] = useState({});
  const [allSupplies, setAllSupplies] = useState([]);
  const [coinData, setCoinData] = useState({});

  useEffect(() => {
    const fetchTokenSupplyStats = async () => {
      try {
        // Fetch token supply stats
        const stats = await fetchTokenStats(chainId, isOldToken);
        setSupplies(stats.supplies);
        setAllSupplies(stats.allSupplies);
      } catch (error) {
        console.error('Error fetching token supply stats:', error);
      }
    };

    const fetchCoinData = async () => {
      try {
        const data = await CoinGeckoApi.fetchCoinData();
        setCoinData(data?.market_data);
      } catch (error) {
        console.error('Error fetching coin data:', error);
      }
    };

    fetchTokenSupplyStats();
    fetchCoinData();
  }, [chainId, isOldToken]);

  return {
    supplies,
    allSupplies,
    coinData
  };
};

export default useTokenSupplyStats;
