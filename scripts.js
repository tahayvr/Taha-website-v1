var settingsDiv = document.getElementById("settings");

settingsDiv.addEventListener("click", function () {
  var profileBoxDiv = document.getElementsByClassName("profile-box-flex")[0];

  // Toggle visibility of main-section
  if (profileBoxDiv.style.display === "none") {
    profileBoxDiv.style.display = "flex";
  } else {
    profileBoxDiv.style.display = "none";
  }
  setup();
  draw();
});
