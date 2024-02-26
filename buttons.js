/**
 * Represents an array of sliders.
 * @type {Array}
 */
var sliders = [];
var outputs = [];
// Loop through the sliders and push them into the sliders array.
for (var i = 1; i <= 9; i++) {
  var slider = document.getElementById("slider" + i);
  var output = document.getElementById("value" + i);

  sliders.push(slider); // Push the slider into the sliders array.
  outputs.push(output); // Push the output into the outputs array.
}

// Resets the value of each slider to its default value.
document.getElementById("resetButton").onclick = function () {
  sliders.forEach(function (slider) {
    sliders.forEach(function (slider, index) {
      slider.value = slider.defaultValue;
      outputs[index].value = slider.defaultValue;
      slider9.style.background = `linear-gradient(90deg, hsla(${slider4.value}, 100%, 50%, 0), hsla(${slider4.value}, 100%, 50%, 1)`;
    });
    outputs[sliders.indexOf(slider)].value = slider.value;
  });
  console.log("Sliders reset!");
  reset();
};

// Event handler for closeButton click event.
document.getElementById("closeButton").onclick = function () {
  var menu2 = document.getElementById("settingsMenu");
  var icon = document.getElementById("settings");
  // var profileBoxDiv = document.getElementsByClassName("profile-box-flex")[0];
  menu2.style.display = "none";
  icon.style.display = "flex";
  // profileBoxDiv.style.display = "flex";

  //   alert("Button 2 clicked!");
};

//Event handler for Settings icon click event.
document.getElementById("settings").onclick = function () {
  var menu = document.getElementById("settingsMenu");
  var icon = document.getElementById("settings");
  // var profileBoxDiv = document.getElementsByClassName("profile-box-flex")[0];
  if (menu.style.display === "none") {
    menu.style.display = "block";
    icon.style.display = "none";
    // profileBoxDiv.style.display = "none";
  } else {
    menu.style.display = "none";
    icon.style.display = "flex";
    // profileBoxDiv.style.display = "flex";
  }
};

//Event handler for Pause button click event.
var isPaused = false;

document.getElementById("pauseButton").onclick = function () {
  if (isPaused) {
    isPaused = false;
    this.textContent = "pause"; // Change the text of the button to pause.
    draw(); // Start the loop again.
  } else {
    isPaused = true;
    this.textContent = "run"; // Change the text of the button to run.
    cancelAnimationFrame(requestId); // Stop the loop.
  }
};
