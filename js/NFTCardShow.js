async function fetchImageCountAndGenerateCards() {
    try {
        const response = await fetch('/api/image1');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const imageCount = data.count;

        console.log('Image count:', imageCount); // 添加调试日志

        const container = document.querySelector('.NFTlist');
        container.innerHTML = ''; // 清空现有内容

        for (let i = 0; i < imageCount; i++) {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="/image1/${i}.png" alt="NFT Image ${i}">
                <div class="card__content">
                  <p class="card__title">ID: ${i}</p>
                  <p class="card__description" id="address-${i}">address:</p>
                </div>
            `;
            container.appendChild(card);
            getaddress(i);
        }
    } catch (error) {
        console.error('获取图片数量时出错:', error); // 添加错误处理
    }
}

async function getaddress(id) {
    try {
        const address = await JoFTcontract.methods.ownerOf(id).call();
        document.getElementById(`address-${id}`).textContent = `address: ${address}`;
    } catch (error) {
        console.error('Error fetching NFT address:', error); // Error handling
    }
}

// 页面加载时获取图片数量并生成卡片
window.onload = fetchImageCountAndGenerateCards;

// 点击页面时重新获取图片数量并生成卡片
document.body.addEventListener('click', fetchImageCountAndGenerateCards);