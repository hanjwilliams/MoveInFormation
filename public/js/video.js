document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("banner");
  video.playbackRate = 1;
 
// Verify the current speed
console.log("Current speed:", video.playbackRate);

document.getElementById('controls').addEventListener('click', function() {

    if (this.classList.contains('on')) {
      this.classList.remove('on');
      this.innerHTML = "Play Animation";
      video.pause();
    } else {
      this.classList.add('on');
      this.innerHTML = "Stop Animation";
      video.play();
    }
  });
});