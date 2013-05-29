$(function () {
  'use strict';
  function createTemplate(id) {
    var source = $('#' + id).find('script').html();
    return Handlebars.compile(source)
  }
  function showStage(index) {
    if (index >= CONFIG.length) {
      showFinalPopup();
      $('#options').off('click');
      return;
    }
    var stageData = CONFIG[index];
    stageData.index = hanzi[index];
    $('#question').html(outputQuestion(stageData));
    $('#options').html(outputOptions(stageData));
  }
  function showRightPopup() {

  }
  function showWrongPopup() {

  }
  function showFinalPopup() {

  }

  var stage = 0,
      right = 0,
      hanzi = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
      outputQuestion = createTemplate('question'),
      outputOptions = createTemplate('options'),
      outputPopup = createTemplate('popup');
  $('#template, #options').empty();

  // events
  $('#options').on('click', 'li', function (event) {
    if (event.currentTarget.className === 'bingo') {
      right += 1;
      showRightPopup();
    } else {
      showWrongPopup();
    }
    stage += 1;
  });

  // statr
  showStage(stage);
});