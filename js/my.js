async function getaddress(id) {
    try {
        const address = await JoFTcontract.methods.ownerOf(id).call();
        return address;
    } catch (error) {
        console.error('Error fetching NFT address:', error);
        return null;
    }
}

async function showMyNFT() {
    try {
        const response = await fetch('/api/image1');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const imageCount = data.count;

        console.log('Image count:', imageCount);

        const container = document.querySelector('.myNFTList');
        container.innerHTML = '';

        const accounts = await web3.eth.getAccounts();
        const currentAccount = accounts[0];

        for (let i = 0; i < imageCount; i++) {
            const ownerAddress = await getaddress(i);
            if (ownerAddress === currentAccount) {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="/image1/${i}.png" alt="NFT Image ${i}">
                    <div class="card__content">
                        <p class="card__title">ID: ${i}</p>
                        <button class="transfer-button" id="transfer" onclick="openTransferModal(${i})">Transfer</button>
                    </div>
                `;
                container.appendChild(card);
            }
        }
    } catch (error) {
        console.error('Error fetching image count:', error);
    }
}

function openTransferModal(id) {
    const modal = document.getElementById("transferModal");
    modal.style.display = "block";
    const form = document.getElementById("transferForm");
    form.onsubmit = function(event) {
        event.preventDefault();
        const recipientAddress = document.getElementById("recipientAddress").value;
        transferNFT(id, recipientAddress);
    };
}

function closeModal() {
    const modal = document.getElementById("transferModal");
    modal.style.display = "none";
}

async function transferNFT(id, recipientAddress) {
    try {
        const accounts = await web3.eth.getAccounts();
        await JoFTcontract.methods.transferFrom(accounts[0], recipientAddress, id).send({ from: accounts[0] });
        console.log(`NFT ${id} transferred to ${recipientAddress}`);
        closeModal();
    } catch (error) {
        console.error('Error transferring NFT:', error);
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelector(".close").onclick = closeModal;

    window.onclick = function(event) {
        const modal = document.getElementById("transferModal");
        if (event.target === modal) {
            closeModal();
        }
    };

    showMyNFT();
});