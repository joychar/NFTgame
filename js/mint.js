document.addEventListener('DOMContentLoaded', function () {
  const fileInput = document.getElementById('file');
  const cropModal = document.getElementById('cropModal');
  const imageToCrop = document.getElementById('imageToCrop');
  const cropButton = document.getElementById('cropButton');
  const cancelButton = document.getElementById('cancelButton');
  const uploadContainer = document.querySelector('.icon');
  let cropper;

  fileInput.addEventListener('change', function (event) {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = function (e) {
        imageToCrop.src = e.target.result;
        cropModal.style.display = 'block';
        if (cropper) {
          cropper.replace(e.target.result);
        } else {
          cropper = new Cropper(imageToCrop, {
            aspectRatio: 1,
            viewMode: 1,
            responsive: true,
            autoCropArea: 1
          });
        }
      };
      reader.readAsDataURL(file);
    }
  });

  cropButton.addEventListener('click', function () {
    const croppedCanvas = cropper.getCroppedCanvas();
    croppedCanvas.toBlob(function (blob) {
      displayCroppedImage(URL.createObjectURL(blob)); // Display cropped image
      cropper.destroy();
      closeCropModal();
    });
  });

  cancelButton.addEventListener('click', closeCropModal);

  function closeCropModal() {
    cropModal.style.display = 'none';
    if (cropper) {
      cropper.destroy();
    }
    fileInput.value = '';
  }

  function displayCroppedImage(imageUrl) {
    const croppedImageElement = document.createElement('img');
    croppedImageElement.src = imageUrl;
    croppedImageElement.style.maxWidth = '400px';
    croppedImageElement.style.height = 'auto';
    uploadContainer.innerHTML = '';
    uploadContainer.appendChild(croppedImageElement);
  }
});

function uploadImage() {
  const uploadContainer = document.querySelector('.icon');
  const imageElement = uploadContainer.querySelector('img');
  if (!imageElement) {
    alert("Please crop an image first");
    return;
  }

  imageElement.src = imageElement.src;
  imageElement.onload = function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(function (blob) {
      if (!blob) {
        console.error('Failed to create blob from canvas');
        return;
      }
      
      const formData = new FormData();
      formData.append('file', blob, 'cropped_image.jpg');

      fetch('/api/image1', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        console.log('Upload response:', data);
        if (data.success) {
          alert("Image uploaded successfully");
        } else {
          console.error('Upload failed:', data.error);
          alert("Failed to upload image");
        }
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        alert("Failed to upload image");
      });
    }, 'image/jpeg');
  };
}

async function mintNFT() {
  const uploadContainer = document.querySelector('.icon');
  const imageElement = uploadContainer.querySelector('img');
  if (!imageElement) {
    return;
  }
  const accounts = await web3.eth.getAccounts();
  await JoFTcontract.methods.mint().send({from: accounts[0]});
}

async function mint() {
  await mintNFT();
    uploadImage();
  }