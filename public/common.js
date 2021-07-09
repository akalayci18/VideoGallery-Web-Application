// For home page
var allthumbnails = document.querySelectorAll(".play-btn");

allthumbnails.forEach(function(button, index){
  button.addEventListener("click", function(){
    location.href='/video/'+index;
  })
})



// For upload page
var uploadArea = document.querySelector(".upload-area");
var uploadText = document.querySelector("p");
var filesInput = document.querySelector(".draggedFile");

uploadArea.addEventListener("dragover", function(event) {
  event.preventDefault();
  uploadArea.classList.add("hover");
  uploadText.style.color = "black";
});

uploadArea.addEventListener("dragleave", function(event) {
  event.preventDefault();
  uploadArea.classList.remove("hover");
  uploadText.style.color = "#bebebe";
});

uploadArea.addEventListener("drop", function(event) {
  event.preventDefault();
  uploadText.style.color = "black";

  var video = event.dataTransfer.files;
  filesInput.files = video;

  return uploadSuccess(filesInput.files);

  function uploadSuccess(videoItem) {
    uploadText.innerHTML = "Added " + event.dataTransfer.files[0].name;
  }
});
