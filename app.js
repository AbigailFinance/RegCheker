const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const regText = document.getElementById("reg");
const goBtn = document.getElementById("go");

document.getElementById("openCamera").onclick = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" }
  });
  video.srcObject = stream;

  setTimeout(captureAndRead, 3000);
};

async function captureAndRead() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  const result = await Tesseract.recognize(canvas, "eng");

  const text = result.data.text
    .replace(/[^A-Z0-9]/gi, "")
    .match(/[A-Z]{2}\d{2}[A-Z]{3}/); // UK reg format

  if (text) {
    regText.textContent = text[0];
    navigator.clipboard.writeText(text[0]);
    goBtn.disabled = false;
  }
}

goBtn.onclick = () => {
  window.open("https://cartaxcheck.co.uk/car-tax-calculator/", "_blank");
};
