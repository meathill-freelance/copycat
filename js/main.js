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
    stageData.options = _.shuffle(stageData.options);
    $('#question').html(outputQuestion(stageData));
    $('#options').html(outputOptions(stageData));
  }
  function getBasicInfo(stage) {
    return {
      stage: stage,
      i: String.fromCharCode($('.bingo').index() + 65),
      description: CONFIG[stage].description
    };
  }
  function showRightPopup() {
    var success = getBasicInfo(stage);
    showPopup(success);
  }
  function showWrongPopup() {
    var error = getBasicInfo(stage);
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
    var output = popup === 'popup' ? outputPopup : outputFinal;
    $('#cover').removeClass('hidden');
    $('#' + popup)
      .html(output(data))
      .removeClass('hidden')
      .addClass('animated fadeInUp');
  }

  var stage = 0,
      right = 0,
      hanzi = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
      outputQuestion = createTemplate('question'),
      outputOptions = createTemplate('options'),
      outputPopup = createTemplate('popup'),
      outputFinal = createTemplate('final-popup');
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
      $('#popup')
        .addClass('hidden')
        .removeClass('fadeInUp fadeOutDown');
    }, 1000);
  })

  // start
  showStage(stage);
});