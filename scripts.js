/**
 * Represents an array of sliders.
 * @type {Array}
 */
var sliders = [];
var outputs = [];
// Loop through the sliders and push them into the sliders array.
for (var i = 1; i <= 6; i++) {
  var slider = document.getElementById("slider" + i);
  var output = document.getElementById("value" + i);

  // Set the default value of the slider as the value of the corresponding <output>.
  output.value = slider.value;

  sliders.push(slider);
  outputs.push(output);
}

sliders.forEach(function (slider, index) {
  slider.oninput = function () {
    outputs[index].value = this.value;
  };
});

// Resets the value of each slider to its default value.
document.getElementById("resetButton").onclick = function () {
  sliders.forEach(function (slider) {
    sliders.forEach(function (slider, index) {
      slider.value = slider.defaultValue;
      outputs[index].value = slider.defaultValue;
    });
    outputs[sliders.indexOf(slider)].value = slider.value;
  });
};

// Event handler for closeButton click event.
document.getElementById("closeButton").onclick = function () {
  var menu2 = document.getElementById("settingsMenu");
  var icon = document.getElementById("settings");
  var profileBoxDiv = document.getElementsByClassName("profile-box-flex")[0];
  menu2.style.display = "none";
  icon.style.display = "flex";
  profileBoxDiv.style.display = "flex";

  //   alert("Button 2 clicked!");
};

//Event handler for Settings icon click event.
document.getElementById("settings").onclick = function () {
  var menu = document.getElementById("settingsMenu");
  var icon = document.getElementById("settings");
  var profileBoxDiv = document.getElementsByClassName("profile-box-flex")[0];
  if (menu.style.display === "none") {
    menu.style.display = "block";
    icon.style.display = "none";
    profileBoxDiv.style.display = "none";
    setup();
    draw();
  } else {
    menu.style.display = "none";
    icon.style.display = "flex";
    profileBoxDiv.style.display = "flex";
  }
};

//Event handler for Pause button click event.
var isPaused = false;

document.getElementById("pauseButton").onclick = function () {
  if (isPaused) {
    isPaused = false;
    this.textContent = "pause"; // Change the text of the button to pause.
    loop(); // Start the loop again.
  } else {
    isPaused = true;
    this.textContent = "run"; // Change the text of the button to run.
    noLoop(); // Stop the loop.
  }
};
