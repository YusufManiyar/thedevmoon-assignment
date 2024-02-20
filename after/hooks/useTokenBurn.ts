import { useState } from 'react';

const useTokenBurn = (walletChain) => {
  const [burnAmount, setBurnAmount] = useState("");
  const [txButton, setTxButton] = useState(BurnTxProgress.default);
  const [txProgress, setTxProgress] = useState(false);
  const [burnTxHash, setBurnTxHash] = useState(null);
  const { openConnectModal } = useChainSelector();
  const { supplies, allSupplies, fetchSupplies, tokenAddress } = useAppSupplies(true);

  const refetchTransactions = () => {
    Promise.all(
      ChainScanner.fetchAllTxPromises(isChainTestnet(walletChain?.id))
    )
      .then((results: any) => {
        //console.log(res);
        let res = results.flat();
        res = ChainScanner.sortOnlyBurnTransactions(res);
        res = res.sort((a: any, b: any) => b.timeStamp - a.timeStamp);
        setBurnTransactions(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const executeBurn = async () => {
    if (!isWalletConnected) {
      openConnectModal();
    }
    if (burnAmount === "") {
      console.log("Enter amount to migrate");
      showToast("Enter amount to migrate", ToastSeverity.warning);
      return;
    }
    const newTokenAddress = fetchAddressForChain(walletChain?.id, "newToken");
    const oftTokenContract = new Contract(
      newTokenAddress,
      oftAbi,
      ethersSigner
    );
    let amount = parseEther(burnAmount);
    setTxButton(BurnTxProgress.burning);
    setTxProgress(true);
    try {
      const burnTx = await oftTokenContract.burn(amount);
      setBurnTxHash(burnTx.hash);
      console.log(burnTx, burnTx.hash);
      await burnTx.wait();
      setTxButton(BurnTxProgress.default);
      setTxProgress(false);
      refetchTransactions();
      fetchSupplies();
    } catch (err) {
      console.log(err);
      setTxButton(BurnTxProgress.default);
      setTxProgress(false);
      showToast("Burn Failed!", ToastSeverity.error);
      return;
    }
  };

  const onChangeBurnAmount = (e) => {
    if (e.target.value == "") setBurnAmount("");
    if (isNaN(parseFloat(e.target.value))) return;
    setBurnAmount(e.target.value);
  };

  return {
    burnAmount,
    txButton,
    txProgress,
    burnTxHash,
    executeBurn,
    onChangeBurnAmount
  };
};

export default useTokenBurn;
