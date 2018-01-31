const remote = require('electron').remote;
// const {ipcRenderer} = require('electron');
var fs = remote.require("fs");

// var home = ipcRenderer.sendSync('give-storage-path', 'home');
const homeDir = remote.app.getPath('home');
const noteStoreDir = homeDir + "/.xnote";
if (!fs.existsSync(noteStoreDir)){
    fs.mkdirSync(noteStoreDir);
}

var xnote = angular.module('xNote', []);
xnote.controller('xCtrl', function($scope) {
  $scope.version = "0.1.0";

  // settings
  $scope.font = {
    family: "monospace",
    size: 12
  };

  var stylesFromLocalStorage = JSON.parse(localStorage.getItem("styles"));
  $scope.fontStyle = (stylesFromLocalStorage != null)
                      ? stylesFromLocalStorage
                      : { 'font-family': $scope.font.family, 'font-size': $scope.font.size + "px" };
  // $scope.fontSize = {  };

  $scope.applySettings = function() {
    $scope.fontStyle = { 'font-family': $scope.font.family, 'font-size': $scope.font.size + "px" };
    localStorage.setItem("styles", JSON.stringify($scope.fontStyle));
  };

  var filenameList = JSON.parse(localStorage.getItem('filenames'));

  $scope.filenames = (filenameList != null) ? filenameList : [];
  $scope.note = {
    title: "",
    content: ""
  };

  init();

  function init() {
    var filename = $scope.filenames[$scope.filenames.length - 1];
    $scope.note.title = filename;
    $scope.note.content = loadFromFile(filename);
  }

  window.addEventListener('beforeunload', function(event) {
    saveToFile($scope.note.title, $scope.note.content);
  });

  $scope.saveTitle = function() {
    if (!$scope.filenames.includes($scope.note.title))
      $scope.filenames.push($scope.note.title);
  };

  $scope.createNew = function() {
    saveToFile($scope.note.title, $scope.note.content);

    $scope.note.title = "";
    $scope.note.content = "";
  };

  $scope.loadNote = function(noteTitle) {
    console.log("loadNote: " + noteTitle);
    saveToFile($scope.note.title, $scope.note.content);

    $scope.note.title = noteTitle;
    $scope.note.content = loadFromFile(noteTitle);
  };

  $scope.deleteNote = function(noteTitle) {
    var path = noteStoreDir + "/" + noteTitle;
    deleteFile(path);

    $scope.filenames.splice($scope.filenames.indexOf(noteTitle), 1);

    $scope.note.title = "";
    $scope.note.content = "";
  };

  function loadFromFile(filename) {
    var inputFile = noteStoreDir + "/" + filename;
    var content = fs.readFileSync(inputFile, 'utf8');
    return content;
  }

  function saveToFile(filename, content) {
    if (filename != "") {
      var outputFile = noteStoreDir + "/" + filename;
      fs.writeFileSync(outputFile, content, 'utf8');
      localStorage.setItem('filenames', JSON.stringify($scope.filenames));
    }
  }

  function deleteFile(path) {
    fs.unlinkSync(path);
  }

});
