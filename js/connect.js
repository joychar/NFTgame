let web3;
let JoFTcontract;

async function initWeb3() {
  if (typeof window.ethereum !== "undefined") {
    web3 = new Web3(window.ethereum);
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('disconnect', handleDisconnect);
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider("https://devnet2openapi.platon.network/rpc"));
    console.log("No wallet detected.");
  }
  return web3;
}

async function initContract() {
  JoFTcontract = new web3.eth.Contract(ABI, Address);
}

async function connectWallet() {
  await singleconnect();
  await swap();
  showAddress();
  initContract();
  signMessage();
}

async function heyue() {
  const accounts = await web3.eth.getAccounts();
  await JoFTcontract.methods.mint().send({ from: accounts[0] });
}

async function singleconnect() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      localStorage.setItem('walletAddress', accounts[0]);
      console.log(accounts[0]);
    } catch (error) {
      console.error(error);
      console.log("Failed to connect to wallet.");
    }
  } else {
    console.log("No wallet detected.");
  }
}

async function swap() {
  const currentChainId = await ethereum.request({ method: "eth_chainId" });
  if (currentChainId !== PlatONDevTestnet2.chainId) {
      try {
          // 尝试切换到目标网络
          await ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: PlatONDevTestnet2.chainId }],
          });
          console.log(`Switched to network: ${PlatONDevTestnet2.chainName}`);
      } catch (switchError) {
          // 错误代码 4902 表示目标网络未添加
          if (switchError.code === 4902) {
              try {
                  await ethereum.request({
                      method: "wallet_addEthereumChain",
                      params: [
                          {
                              chainId: PlatONDevTestnet2.chainId,
                              chainName: PlatONDevTestnet2.chainName,
                              nativeCurrency: PlatONDevTestnet2.nativeCurrency,
                              rpcUrls: PlatONDevTestnet2.rpcUrls,
                              blockExplorerUrls: PlatONDevTestnet2.blockExplorerUrls,
                          },
                      ],
                  });
                  console.log(`Network added successfully: ${PlatONDevTestnet2.chainName}`);
              } catch (addError) {
                  console.error("Error adding network:", addError);
              }
          } else {
              console.error("Error switching network:", switchError);
          }
      }
  } else {
      console.log(`Already on the target network: ${PlatONDevTestnet2.chainName}`);
  }
}


async function signMessage() {
  try {
    const accounts = await web3.eth.getAccounts();
    const message = "Welcome to NFTGame. ";
    await web3.eth.personal.sign(message, accounts[0], "");
  } catch (error) {
    console.error("Error signing message:", error);
  }
}

async function showAddress() {
  const accounts = await web3.eth.getAccounts();
  const shortenedAddress = `${accounts[0].slice(0, 5)}...${accounts[0].slice(-5)}`;
  document.getElementById("walletAddress").textContent = shortenedAddress;
}

function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    handleDisconnect();
  } else {
    localStorage.setItem('walletAddress', accounts[0]);
    useimage();
  }
}

function handleDisconnect() {
  localStorage.removeItem('walletAddress');
  useimage();
}

// 在页面加载时初始化Web3并设置事件监听器
window.addEventListener('DOMContentLoaded', () => {
  initWeb3(); // 初始化Web3并设置事件监听器
  showAddress();// 检查本地存储中的钱包地址并更新UI
  initContract();
});
