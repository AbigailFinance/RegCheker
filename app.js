const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const regText = document.getElementById("reg");
const goBtn = document.getElementById("go");
const scanBtn = document.getElementById("openCamera");

let stream;

scanBtn.onclick = async () => {
  regText.textContent = "Scanning…";
  goBtn.disabled = true;

  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" }
  });

  video.srcObject = stream;

  video.onloadedmetadata = () => {
    video.play();
    setTimeout(captureAndRead, 1200); // SAFE delay
  };
};

async function captureAndRead() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Stop camera after capture (important on iOS)
  stream.getTracks().forEach(track => track.stop());

  try {
    const result = await Tesseract.recognize(
      canvas,
      "eng",
      {
        tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        preserve_interword_spaces: "1"
      }
    );

    const text = result.data.text
      .replace(/\s+/g, "")
      .match(/[A-Z]{2}[0-9]{2}[A-Z]{3}/);

    if (text) {
      regText.textContent = text[0];
      navigator.clipboard.writeText(text[0]);
      goBtn.disabled = false;
    } else {
      regText.textContent = "No plate detected";
    }

  } catch (err) {
    regText.textContent = "Scan failed";
    console.error(err);
  }
}

goBtn.onclick = () => {
  window.open("https://cartaxcheck.co.uk/car-tax-calculator/", "_blank");
};
