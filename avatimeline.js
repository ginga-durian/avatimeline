(function() {
  function refresh(tl, time) {
    tl.setCurrentTime(BASE_TIME.clone().add(time, 's'));
  }

  function correctIndex(idx) {
    if (idx < 0) {
      return 0;
    }
    if (idx > 6) {
      return 6;
    }
    return idx;
  }

  // time to phase
  function t2ph(time) {
    for (var i = 0; i < PHASE_TIME_TABLE.length; i++) {
      if (PHASE_TIME_TABLE[i] > time) {
        return i;
      }
    }
    // not found
    return 0;
  }

  var twTabSetter = function(mark, time, player) {
    var idx = t2ph(time) - 1;
    tw_tab[idx].push({
      mark: mark,
      time: time,
      player: player
    });
    crit_tab[idx].push(null);
  }

  function currentTimeToSec() {
    return moment(timeline.getCurrentTime()).unix() - BASE_TIME.unix();
  }

  var widget = function(tl, hmt) {
    var timeline = tl;
    var hm_tab = hmt;
    var curr_time = currentTimeToSec();

    function update() {
      curr_time = currentTimeToSec();
      var phase = t2ph(curr_time);
      for (var i = 0; i < hm_tab.length; i++) {
        if (hm_tab[i][0] > curr_time) {
          $("p#homing").html("HM:" + hm_tab[i][1] + "(" + (hm_tab[i][0] - curr_time) + ")");
          break;
        }
      }

      $("p#phase").html("Phase" + phase);

      var idx = correctIndex(phase - 1);
      var l = tw_tab[idx].length;
      for (var i = 0; i < 4; i++) {
        if (i < l) {
          $("p#tw" + (i + 1) + " > span.tw_mark").html(tw_tab[idx][i].mark);
          $("p#tw" + (i + 1) + " > span.player").html(tw_tab[idx][i].player);
          if (crit_tab[idx][i] != null) {
            var t = crit_tab[idx][i].since - curr_time;
            if (t >= 0) {
              $("p#tw" + (i + 1) + " > span.critical").html(crit_tab[idx][i].player + '(' + t + 's)');
            } else {
              $("p#tw" + (i + 1) + " > span.critical").html(crit_tab[idx][i].player);
            }
          } else {
            $("p#tw" + (i + 1) + " > span.critical").html("");
          }
        } else {
          $("p#tw" + (i + 1) + " > span.tw_mark").html("");
          $("p#tw" + (i + 1) + " > span.player").html("");
          $("p#tw" + (i + 1) + " > span.critical").html("");
        }

      }
    };
    return update;
  }

  function itemSetterTemplate(item, id, group, content, type) {
    var item = item;
    var counter = 0;
    var def = {
      id: id,
      group: group,
      content: content,
      type: type
    }

    function set(content, start, end) {
      if (def.type == 'point') {
        items.add({
          id: def.id + counter,
          group: def.group,
          content: def.content + content,
          start: BASE_TIME.clone().add(start, 's'),
          type: def.type
        });
      } else {
        items.add({
          id: def.id + counter,
          group: def.group,
          content: def.content + content,
          start: BASE_TIME.clone().add(start, 's'),
          end: BASE_TIME.clone().add(end, 's'),
          type: def.type
        });
      }
      counter++;
    }
    return set;
  }

  var diffusionRaySetter = (function() {
    var setter = itemSetterTemplate(items, 'diff_ray_', 'diff_ray', 'レイ', 'point');

    function set(start) {
      setter('', start);
    }
    return set;
  })();

  var homingMissileSetter = (function() {
    var pSetter = itemSetterTemplate(items, 'h_missile_', 'h_missile', 'ホーミング', 'point');
    var bSetter = itemSetterTemplate(items, 'h_missile_bg_', 'h_missile', '', 'background');

    function set(start, player) {
      hm_tab.push([start, player]);
      pSetter('', start);
      bSetter(player, start - 5, start);
    }
    return set;
  })();

  var gaseousBombSetter = (function() {
    var pSetter = itemSetterTemplate(items, 'g_bomb_', 'g_bomb', '気化', 'point');
    var bSetter = itemSetterTemplate(items, 'g_bomb_bg_', 'g_bomb', '', 'background');

    function set(start) {
      pSetter('', start);
      bSetter('', start - 5, start);
    }
    return set;
  })();

  var allaganFieldSetter = (function() {
    var setter = itemSetterTemplate(items, 'a_field_', 'a_field', 'AF', 'range');

    function set(start) {
      setter('', start + 2, start + ALLAGAN_FIELD_EXISTENCE_TERM + 2);
    }
    return set;
  })();

  var ballisticMissileSetter = (function() {
    var setter = itemSetterTemplate(items, 'b_missile_', 'b_missile', 'BM', 'range');

    function set(start) {
      setter('', start, start + BALLISTIC_MISSILE_EXISTENCE_TERM);
    }
    return set;
  })();

  var mineTowerSetter = (function() {
    var bSetter = itemSetterTemplate(items, 'tw_mine_', 'tw_mine', '', 'background');
    var rSetter = itemSetterTemplate(items, 'mine_', 'mine', '地雷', 'range');

    function set(start, end, player) {
      bSetter(player, start, end);
      rSetter('', end, end + MINE_EXISTENCE_TERM);
      twTabSetter('○', start, player);
    }
    return set;
  })();

  var dreadnaughtTowerSetter = (function() {
    var bSetter = itemSetterTemplate(items, 'tw_dnaught_', 'tw_dnaught', '', 'background');
    var rSetter = itemSetterTemplate(items, 'dnaught_', 'dnaught', 'ドレッド', 'range');

    function set(start, end, player) {
      bSetter(player, start, end);
      rSetter('', end, end + DNAUGHT_EXISTENCE_TERM);
      twTabSetter('□', start, player);
    }
    return set;
  })();

  var hpdownTowerSetter1 = (function() {
    var setter = itemSetterTemplate(items, 'tw_hpdown1_', 'tw_hpdown1', '', 'background');

    function set(start, end, player) {
      setter(player, start, end);
      twTabSetter('△', start, player);
    }
    return set;
  })();

  var hpdownTowerSetter2 = (function() {
    var setter = itemSetterTemplate(items, 'tw_hpdown2_', 'tw_hpdown2', '', 'background');

    function set(start, end, player) {
      setter(player, start, end);
      twTabSetter('△', start, player);
    }
    return set;
  })();

  var snowflakeTowerSetter1 = (function() {
    var bSetter = itemSetterTemplate(items, 'tw_sflake1_', 'tw_sflake1', '', 'background');
    var cSetter = itemSetterTemplate(items, 'cspan1_', 'tw_sflake1', '', 'range');

    function set(start, end, player, crit) {
      bSetter(player, start, end);
      twTabSetter('×', start, player);
      crit_tab[t2ph(start) - 1].pop(); // 姑息な手
      if (crit != null) {
        cSetter(crit.player, crit.since, crit.until);
        crit_tab[t2ph(start) - 1].push(crit);
      }
    }
    return set;
  })();

  var snowflakeTowerSetter2 = (function() {
    var bSetter = itemSetterTemplate(items, 'tw_sflake2_', 'tw_sflake2', '', 'background');
    var cSetter = itemSetterTemplate(items, 'cspan2_', 'tw_sflake2', '', 'range');

    function set(start, end, player, crit) {
      bSetter(player, start, end);
      twTabSetter('×', start, player);
      crit_tab[t2ph(start) - 1].pop(); // 姑息な手
      if (crit != null) {
        cSetter(crit.player, crit.since, crit.until);
        crit_tab[t2ph(start) - 1].push(crit);
      }
    }
    return set;
  })();

  /* オートスクロールのためのフラグ */
  var isAutoScroll = true;

  /* 時刻の基点 */
  var BASE_TIME = moment([2015, 1, 1, 0, 0, 0, 0]);

  // ウィジェットのための時刻表
  var hm_tab = [];

  var groups = new vis.DataSet([{
    id: 'diff_ray',
    content: 'レイ',
    subgroupOrder: 'subgroupOrder'
  }, {
    id: 'h_missile',
    content: 'ホミ',
    subgroupOrder: 'subgroupOrder'
  }, {
    id: 'g_bomb',
    content: '気化',
    subgroupOrder: 'subgroupOrder'
  }, {
    id: 'a_field',
    content: 'AF',
    subgroupOrder: function(a, b) {
      return a.subgroupOrder - b.subgroupOrder;
    }
  }, {
    id: 'b_missile',
    content: 'バリ',
    subgroupOrder: 'subgroupOrder'
  }, {
    id: 'dnaught',
    content: 'ドレ',
    subgroupOrder: 'subgroupOrder'
  }, {
    id: 'mine',
    content: '地雷',
    subgroupOrder: 'subgroupOrder'
  }, {
    id: 'tw_mine',
    content: '地雷塔○',
    subgroupOrder: 'subgroupOrder'
  }, {
    id: 'tw_dnaught',
    content: 'ドレ塔□',
    subgroupOrder: 'subgroupOrder'
  }, {
    id: 'tw_sflake1',
    content: '防衛塔×(1)',
    subgroupOrder: 'subgroupOrder'
  }, {
    id: 'tw_sflake2',
    content: '防衛塔×(2)',
    subgroupOrder: 'subgroupOrder'
  }, {
    id: 'tw_hpdown1',
    content: '低下塔△(1)',
    subgroupOrder: 'subgroupOrder'
  }, {
    id: 'tw_hpdown2',
    content: '低下塔△(2)',
    subgroupOrder: 'subgroupOrder'
  }, ]);

  /* ウィジェットのための、フェーズと担当者を格納する配列 */
  var tw_tab = Array(7);
  /* ウィジェットのための、フェーズと特別に踏む期間に指定がある担当者を格納する配列 */
  var crit_tab = Array(7);
  for (var i = 0; i < tw_tab.length; i++) {
    tw_tab[i] = Array();
    crit_tab[i] = Array();
  }

  // タイムラインに表示するデータセットの初期化
  var items = new vis.DataSet([]);

  /*************************************************************
   * 編集可ここから
   ***************************************************************/
  /* 現在時刻バーの左側の空白の長さ（秒数） */
  var CUSTOM_TIME_BAR_PADDING = 3;

  /* ドレッドノート出現から倒すまでの時間 */
  var DNAUGHT_EXISTENCE_TERM = 25;

  /* 地雷散布から処理し終えるまでの時間 */
  var MINE_EXISTENCE_TERM = 10;

  /* イナーシャストリームからバリスティックミサイルの判定が終わるまでの時間 */
  var BALLISTIC_MISSILE_EXISTENCE_TERM = 8;

  /* アラガンフィールド付着から発動までの時間 */
  var ALLAGAN_FIELD_EXISTENCE_TERM = 30;

  /* フェーズ切り替えの時刻 */
  var PHASE_TIME_TABLE = [0, 86, 164, 243, 352, 450, 548, 648];

  /* ディフュージョンレイ発動時刻のテーブル */
  var DIFFUSION_RAY_TIME_TABLE = [
    5, 26, 41, 56, 75,
    94, 111, 125, 142,
    174, 191, 205, 222,
    255, 271, 285, 302, 316,
    356, 396, 436,
    477, 516,
    556, 597, 637
  ];

  /* アラガンフィールド付着時刻のテーブル */
  var ALLAGAN_FIELD_TIME_TABLE = [
    89, 128,
    170, 210,
    251, 290, 325, 329,
    365, 369, 405, 409, 445, 449,
    485, 489, 525, 529,
    565, 569, 605, 609
  ];

  /* 気化爆弾のテーブル */
  var GASEOUS_BOMB_TIME_TABLE = [
    34, 74, 110, 150, 190, 230, 270, 309, 391, 466, 550, 629
  ];

  /* バリスティックミサイルのテーブル */
  var BALLISTIC_MISSILE_TIME_TABLE = [
    81, 162, 243, 344, 422, 502, 581
  ];

  /* ホーミングミサイルが発動する時刻とそれを受ける担当者 */
  var HOMING_MISSILE_TIME_TABLE = [
    [25, 'ナ'],
    [65, '詩'],
    [102, 'ナ'],
    [121, '戦'],
    [141, '戦'],
    [161, 'ナ'],
    [181, 'ナ'],
    [201, '全'],
    [221, 'ナ'],
    [243, 'ナ'],
    [262, '詩'],
    [281, '戦'],
    [301, '戦'],
    [338, 'ナ'],
    [379, '黒'],
    [419, '戦'],
    [459, 'ナ'],
    [499, 'ナ'],
    [539, 'ナ'],
    [579, 'ナ'],
    [619, 'ナ']
  ];

  /* 防衛反応塔で特別に踏む期間の指定がある場合 */
  var CRITICAL_SPAN = [{
    player: '黒',
    since: 123,
    until: 130,
  }, {
    player: '戦',
    since: 403,
    until: 407,
  }, {
    player: 'ナ',
    since: 483,
    until: 486,
  }, {
    player: '戦',
    since: 523,
    until: 526,
  }, {
    player: 'ナ',
    since: 563,
    until: 567,
  }, {
    player: '戦',
    since: 603,
    until: 607,
  }];

  /* 地雷塔○ */
  mineTowerSetter(15, 15 + 15 * 3, ['戦']);
  mineTowerSetter(164, 164 + 15 * 2, ['詩', '学']);
  mineTowerSetter(243, 243 + 15 * 4, []);
  mineTowerSetter(352, 352 + 20 * 1, ['モ', '竜', '黒']);
  mineTowerSetter(548, 548 + 20 * 2, ['白', '学']);

  /* ドレッド塔□ */
  dreadnaughtTowerSetter(15, 15 + 15 * 1, ['白', '学', '詩']);
  dreadnaughtTowerSetter(86, 86 + 15 * 2, ['竜', 'ナ']);
  dreadnaughtTowerSetter(243, 243 + 15 * 2, ['竜', 'ナ']);
  dreadnaughtTowerSetter(352, 352 + 20 * 2, ['白', '学']);
  dreadnaughtTowerSetter(548, 548 + 20 * 4, []);

  /* HP低下塔△ */
  hpdownTowerSetter1(86, 86 + 15 * 4, []);
  hpdownTowerSetter1(164, 164 + 15 * 4, []);
  hpdownTowerSetter1(352, 352 + 20 * 4, []);
  hpdownTowerSetter1(450, 450 + 20 * 1, ['竜', '詩', '黒']);
  hpdownTowerSetter2(450, 450 + 20 * 3, ['モ']);

  /* 防衛反応塔× */
  snowflakeTowerSetter1(86, 130, ['モ'], CRITICAL_SPAN[0]);
  snowflakeTowerSetter1(164, 209, ['白']);
  snowflakeTowerSetter1(243, 288, ['モ']);
  snowflakeTowerSetter1(352, 406, ['ナ'], CRITICAL_SPAN[1]);
  snowflakeTowerSetter1(450, 486, ['白', '学'], CRITICAL_SPAN[2]);
  snowflakeTowerSetter2(450, 526, [], CRITICAL_SPAN[3]);
  snowflakeTowerSetter1(548, 567, ['竜', '詩', '黒'], CRITICAL_SPAN[4]);
  snowflakeTowerSetter2(548, 607, ['モ'], CRITICAL_SPAN[5]);

  /*************************************************************
   * 編集可ここまで
   **************************************************************/

  /* ディフュージョンレイ */
  for (var i = 0; i < DIFFUSION_RAY_TIME_TABLE.length; i++) {
    diffusionRaySetter(DIFFUSION_RAY_TIME_TABLE[i]);
  }

  /* 気化爆弾 */
  for (var i = 0; i < GASEOUS_BOMB_TIME_TABLE.length; i++) {
    gaseousBombSetter(GASEOUS_BOMB_TIME_TABLE[i]);
  }

  /* アラガンフィールド */
  for (var i = 0; i < ALLAGAN_FIELD_TIME_TABLE.length; i++) {
    allaganFieldSetter(ALLAGAN_FIELD_TIME_TABLE[i]);
  }

  /* バリスティックミサイル */
  for (var i = 0; i < BALLISTIC_MISSILE_TIME_TABLE.length; i++) {
    ballisticMissileSetter(BALLISTIC_MISSILE_TIME_TABLE[i]);
  }

  /* ホーミングミサイル */
  for (var i = 0; i < HOMING_MISSILE_TIME_TABLE.length; i++) {
    homingMissileSetter(HOMING_MISSILE_TIME_TABLE[i][0], HOMING_MISSILE_TIME_TABLE[i][1]);
  }

  // create visualization
  var container = document.getElementById('visualization');
  var options = {
    align: 'left',
    format: {
      minorLabels: {
        millisecond: 'mm:ss.SSS',
        second: 'mm:ss',
        minute: 'mm:ss',
        hour: '',
        weekday: '',
        day: '',
        month: '',
        year: 'YYYY'
      },
    },
    showMajorLabels: false,
    showCurrentTime: false,
    showCustomTime: true
  };

  var timeline = new vis.Timeline(container);
  timeline.setOptions(options);
  timeline.setGroups(groups);
  timeline.setItems(items);
  timeline.setCurrentTime(BASE_TIME.clone().add(0, 's'));
  timeline.setCustomTime(BASE_TIME.clone().add(0, 's'));

  var tl_width = 60;
  console.log(tl_width);

  timeline.on('rangechanged', function(properties) {
    if (properties.byUser) {
      tl_width = moment(properties.end).unix() - moment(properties.start).unix();
    }
  });

  hm_tab.unshift([0, ""]);
  hm_tab.push([648, ""]);

  var widgetUpdater = widget(timeline, hm_tab);

  /* 1000ms毎に呼び出す関数 */
  setInterval(function() {
    if (isAutoScroll) {
      var ct = moment(timeline.getCurrentTime());
      timeline.setWindow(
        ct.clone().subtract(CUSTOM_TIME_BAR_PADDING, 's').toDate(),
        ct.clone().add(tl_width - CUSTOM_TIME_BAR_PADDING, 's').toDate(), {
          animate: false
        });
    }
  }, 1000);
  setInterval(function() {
    timeline.setCustomTime(moment(timeline.getCurrentTime()).toDate());
  }, 1000);
  setInterval(widgetUpdater, 1000);


  /* 以下、HTMLのボタン対応 */
  document.getElementById('auto_scroll').onclick = function() {
    isAutoScroll = !isAutoScroll;
  };
  document.getElementById('refresh').onclick = function() {
    refresh(timeline, 0)
  };
  document.getElementById('refresh_10s').onclick = function() {
    refresh(timeline, -10)
  };

  document.getElementById('toggle_widget').onclick = function() {
    $('div#widget').toggle();
  }

  document.getElementById('next_phase').onclick = function() {
    var curr = currentTimeToSec();
    var next_idx = correctIndex((t2ph(curr) - 1) + 1);
    timeline.setCurrentTime(BASE_TIME.clone().add(PHASE_TIME_TABLE[next_idx], 's'));
  }

  document.getElementById('prev_phase').onclick = function() {
    var curr = currentTimeToSec();
    var prev_idx = correctIndex((t2ph(curr) - 1) - 1);
    timeline.setCurrentTime(BASE_TIME.clone().add(PHASE_TIME_TABLE[prev_idx], 's'));
  }

  document.getElementById('curr_phase').onclick = function() {
    var curr = currentTimeToSec();
    var curr_idx = correctIndex(t2ph(curr) - 1);
    timeline.setCurrentTime(BASE_TIME.clone().add(PHASE_TIME_TABLE[curr_idx], 's'));
  }
}());
