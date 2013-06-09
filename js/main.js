$(function () {
  'use strict';
  function init() {
    outputQuestion = createTemplate('question');
    outputOptions = createTemplate('options');
    outputPopup = createTemplate('popup');
    outputFinal = createTemplate('final-popup');
    $('#template, #options').empty();
  }
  function createTemplate(id) {
    var source = $('#' + id).find('script').html();
    return Handlebars.compile(source)
  }
  function createSign(target, type) {
    var sign = $('<div class="sign ' + type + ' animated pulse"></div>'),
        position = $(target).position();
    sign
      .css({
        left: position.left - 30,
        top: position.top - 20
      })
      .appendTo('#options');
  }
  function showStage(index) {
    if (index >= CONFIG.length) {
      showFinalPopup();
      return;
    }
    var stageData = CONFIG[index];
    stageData.index = hanzi[index];
    stageData.options = _.shuffle(stageData.options);
    $('#question').html(outputQuestion(stageData));
    $('#options')
      .html(outputOptions(stageData))
      .removeClass('active');
  }
  function getBasicInfo(stage) {
    return {
      stage: stage,
      isLast: stage === CONFIG.length - 1,
      i: String.fromCharCode($('.bingo').index() + 65),
      description: CONFIG[stage].description
    };
  }
  function showRightPopup(target) {
    var success = getBasicInfo(stage);
    success.heading = '回答正确！+10 分';

    createSign(target, 'success');

    setTimeout(function () {
      showPopup(success);
    }, 1000);
  }
  function showWrongPopup(target) {
    var error = getBasicInfo(stage);
    error.heading = '正确答案：' + error.i;
    error.options = _.reject(CONFIG[stage].options, function (obj) {
      return obj.isRight;
    });

    createSign(target, 'error');

    setTimeout(function () {
      showPopup(error);
    }, 1000);
  }
  function showFinalPopup() {
    var final;
    if (right < 6) {
      final = FINAL_WORD[0];
    } else if (right < 10) {
      final = FINAL_WORD[1];
    } else {
      final = FINAL_WORD[2];
    }
    final.right = right * 10;
    showPopup(final, 'final-popup');
    $('#final-popup textarea').val($('#final-popup textarea').val().replace('@@', final.right));
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
  function showUI() {
    $('#loading').remove();

    $('body').addClass('bg animated fadeIn');

    setTimeout(function () {
      $('#main-body')
        .removeClass('hidden')
        .addClass('bg animated fadeInUp');
    }, 500);

    setTimeout(function () {
      var img = queue.getResult('heading');
      $('header')
        .append(img)
        .removeClass('hidden')
        .addClass('bg animated bounceInDown');
    }, 1000);

    setTimeout(function () {
      var img = queue.getResult('logo');
      $('#logo')
        .append(img)
        .removeClass('hidden')
        .addClass('animated bounceIn');

      init();
      showStage(stage);
    }, 2000);
  }
  function checkFileType(event) {
    var type = event.item.type;
    if (type === createjs.LoadQueue.JAVASCRIPT) {
      document.head.appendChild(event.result);
    }
  }

  var stage = 0,
      right = 0,
      hanzi = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
      outputQuestion = null,
      outputOptions = null,
      outputPopup = null,
      outputFinal = null;

  // events
  $('#options').on('click', 'li', function (event) {
    if ($('#options').hasClass('active')) {
      return;
    }
    if (event.currentTarget.className === 'bingo') {
      right += 1;
      showRightPopup(event.target);
    } else {
      showWrongPopup(event.target);
    }
    stage += 1;
    $('#options').addClass('active');
  });
  $('#popup').on('click', '.close,.next-button', function (event) {
    if ($('#popup').hasClass('fadeOutDown')) {
      return;
    }
    $('#cover').addClass('hidden');
    $('#popup').addClass('fadeOutDown');
    showStage(stage);
    setTimeout(function () {
      $('#popup')
        .addClass('hidden')
        .removeClass('fadeInUp fadeOutDown');
    }, 1000);
  });
  $('#final-popup').on('click', '.replay-button', function (event) {
    stage = right = 0;
    $('#cover').addClass('hidden');
    $('#final-popup')
      .addClass('hidden')
      .removeClass('fadeInUp');
    showStage(stage);
  });

  // start
  var queue = new createjs.LoadQueue();
  queue.addEventListener('complete', showUI);
  queue.addEventListener('fileload', checkFileType);
  queue.loadFile('css/animate.min.css');
  queue.loadFile('js/vendor/handlebars.js');
  queue.loadFile('js/vendor/underscore-min.js');
  queue.loadFile('js/config.js');
  queue.loadFile('js/plugins.js');
  queue.loadFile({id: 'bg', src: 'img/bg.jpg'});
  queue.loadFile({id: 'container', src: 'img/container.png'});
  queue.loadFile({id: 'heading', src: 'img/heading.png'});
  queue.loadFile({id: 'logo', src: 'img/logo.png'});
});

function postToWb() {
  var _url = encodeURIComponent(document.location);
  var _assname = encodeURI("qqdigi");//你注册的帐号，不是昵称
  var _appkey = encodeURI("100678265");//你从腾讯获得的appkey
  var _pic = encodeURI('http://roudemos.sinaapp.com/copycat/img/share.jpg');//（例如：var _pic='图片url1|图片url2|图片url3....）
  var _t = $('#final-popup textarea').val();//标题和描述信息
  if(_t.length > 120){
    _t= _t.substr(0,117)+'...';
  }
  _t = encodeURIComponent(_t);

  var _u = 'http://share.v.t.qq.com/index.php?c=share&a=index&url='+_url+'&appkey='+_appkey+'&pic='+_pic+'&assname='+_assname+'&title='+_t;
  window.open( _u,'', 'width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no' );
}
function postToWeibo() {
  var pic = encodeURIComponent('http://roudemos.sinaapp.com/copycat/img/share.jpg'),
      title = encodeURIComponent($('#final-popup textarea').val()),
      url = 'http://v.t.sina.com.cn/share/share.php?appkey=',
      link = encodeURIComponent(document.location),
      param = '&url=' +  link + '&title=' + title + '&source=&sourceUrl=&content=UTF-8&pic=' + pic;
  function go() {
    if (!window.open(url + param, 'mb', 'toolbar=0, status=0, resizable=1, width=440, height=430, left=' + (screen.width - 440) / 2 + ',top=' + (screen.height - 430) / 2)) {
      location.href = url + param;
    }
  };
  if (/Firefox/.test(navigator.userAgent)) {
    setTimeout(go, 0);
  } else {
    go();
  }
}
