/*globals model, view, console*/
// CONTROLLER
var game,
  clickKillCell,
  mouseDown = false,
  theCanvas = document.getElementById('canvas'),
  clearButton = document.getElementById('clear'),
  stepButton = document.getElementById('step'),
  runPauseButton = document.getElementById('runPause');
/*
keydown
    A key is pressed down.
keypress
    A character key is pressed.
keyup
    A key is released.
**/

(function () {
  'use strict';
  game = {
    init: function () {
      view.render();

      //      theCanvas.addEventListener('dragstart', game.mouseDownHandler);
      theCanvas.addEventListener('mousedown', game.mouseDownHandler);
      theCanvas.addEventListener('mousemove', game.mouseDragHandler);
      theCanvas.addEventListener('mouseup', game.mouseUpHandler);
      clearButton.addEventListener('click', game.clearButtonHandler);
      stepButton.addEventListener('click', game.stepButtonHandler);
      runPauseButton.addEventListener('click', game.runPauseButtonHandler);
    },

    getCellCoordinates: function (e) {
      var pixelX = e.layerX,
        pixelY = e.layerY,
        // get row and cell in the view
        row = view.getModelRefY(pixelY),
        col = view.getModelRefX(pixelX);

      return model.getCoord(col, row);
    },

    setStateDrawCell: function (cellCoord) {
      if (clickKillCell) {
        model.killCell(cellCoord);
      } else {
        model.createCell(cellCoord);
      }
      view.render();
    },

    stepButtonHandler: function () {
      game.running = false;
      game.step();
    },

    mouseDownHandler: function (e) {
      var cellCoord = game.getCellCoordinates(e);
      console.log('click: ' + e.layerX + ':' + e.layerY + ' ' + cellCoord);
      clickKillCell = model.isAlive(cellCoord);
      mouseDown = true;
      game.setStateDrawCell(cellCoord);
    },

    mouseDragHandler: function (e) {
      if (mouseDown) {

        var cellCoord = game.getCellCoordinates(e);
        console.log('drag: ' + e.layerX + ':' + e.layerY + ' ' + cellCoord);
        game.setStateDrawCell(cellCoord);
      }
    },

    mouseUpHandler: function (e) {
      mouseDown = false;
    },

    running: false,

    clearButtonHandler: function () {
      if (game.running) {
        window.requestAnimationFrame(game.step);
      }
      model.reset();
      view.render();
      game.stop();
    },

    step: function () {
      model.next();
      view.render();

      if (model.liveCells.length === 0) {
        game.stop();
      }
      if (game.running) {
        window.requestAnimationFrame(game.step);
      }
    },

    run: function () {
      game.running = true;
      game.step();
    },

    runPauseButtonHandler: function () {
      game.running = !game.running;
      if (game.running === true) {
        game.step();
      }
    },

    stop: function () {
      game.running = false;
    }
  };

  game.init();
}());