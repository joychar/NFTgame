let platon = {
    chainId: '0x335f9',
    chainName: 'PlatON Mainnet',
    nativeCurrency: {
      name: 'LAT',
      symbol: 'lat',
      decimals: 18
    },
    rpcUrls: ['https://openapi2.platon.network/rpc'],
    blockExplorerUrls: ['https://scan.platon.network']
};

async function swap() {
    const currentChainId = await ethereum.request({ method: "eth_chainId" });
    let targetChain = platon
    if (currentChainId !== targetChain.chainId) {
        try {
            // 尝试切换到目标网络
            await ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: targetChain.chainId }],
            });
            console.log(`Switched to network: ${targetChain.chainName}`);
        } catch (switchError) {
            // 错误代码 4902 表示目标网络未添加
            if (switchError.code === 4902) {
                try {
                    await ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: targetChain.chainId,
                                chainName: targetChain.chainName,
                                nativeCurrency: targetChain.nativeCurrency,
                                rpcUrls: targetChain.rpcUrls,
                                blockExplorerUrls: targetChain.blockExplorerUrls,
                            },
                        ],
                    });
                    console.log(`Network added successfully: ${targetChain.chainName}`);
                } catch (addError) {
                    console.error("Error adding network:", addError);
                }
            } else {
                console.error("Error switching network:", switchError);
            }
        }
    } else {
        console.log('Already on the target network');
    }
  }