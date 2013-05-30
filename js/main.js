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
    var success = {
      stage: stage,
      i: 'D',
      description: CONFIG[stage].description
    }
    showPopup(success);
  }
  function showWrongPopup() {
    var error = {
      stage: stage,
      i: 'D',
      description: CONFIG[stage].description
    };
    error.options = CONFIG[stage].options.slice(1);
    showPopup(error);
  }
  function showFinalPopup() {
    var final = {
      right: right * 10
    }
    if (right < 6) {
      final.description = FINAL_WORD[0].description;
    } else if (right < 10) {
      final.description = FINAL_WORD[1].description;
    } else {
      final.description = FINAL_WORD[2].description;
    }
    showPopup(final, 'final-popup');
  }
  function showPopup(data, popup) {
    popup = popup || 'popup';
    $('#cover').removeClass('hidden');
    $('#' + popup)
      .html(outputPopup(data))
      .removeClass('hidden')
      .addClass('animated fadeInUp');
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
  $('#popup').on('click', '.close,.next-button', function (event) {
    $('#cover').addClass('hidden');
    $('#popup').addClass('fadeOutDown');
    showStage(stage);
    setTimeout(function () {
      $('#popup').addClass('hidden');
    }, 1000);
  })

  // statr
  showStage(stage);
});