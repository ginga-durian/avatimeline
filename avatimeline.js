var autoScroll = function(tl, is_auto) {
  if (is_auto == true) {
    tl.moveTo(tl.getCurrentTime(), {
      animate: false
    });
  }
}

function refresh(tl, time) {
  tl.setCurrentTime(BASE_TIME.clone().add(time_half_canvas, 's').add(time, 's'));
}

// time to phase
function t2ph(time) {
  for (var i = 0; i < ph_tab.length; i++) {
    if (ph_tab[i] > time) {
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


var critSpanSetter = function(time, crit) {
  crit_tab[t2ph(time) - 1].push(crit);
}

var widget = function(tl, hmt) {
  var timeline = tl;
  var hm_tab = hmt;
  var currentTimeToSec = function() {
    var curr_time = moment(timeline.getCurrentTime()).unix() - BASE_TIME.unix() - time_half_canvas;
    return curr_time;
  }

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

    var l = tw_tab[phase - 1].length;
    for (var i = 0; i < 4; i++) {
      if (i < l) {
        $("p#tw" + (i + 1) + " > span.tw_mark").html(tw_tab[phase - 1][i].mark);
        $("p#tw" + (i + 1) + " > span.player").html(tw_tab[phase - 1][i].player);
        if (crit_tab[phase - 1][i] != null) {
          var t = crit_tab[phase - 1][i].since - curr_time;
          if (t >= 0) {
            $("p#tw" + (i + 1) + " > span.critical").html(crit_tab[phase - 1][i].player + '(' + t + 's)');
          } else {
            $("p#tw" + (i + 1) + " > span.critical").html(crit_tab[phase - 1][i].player);
          }
        } else {
          $("p#tw" + (i + 1) + " > span.critical").html("");
        }
      } else {
        $("p#tw" + (i + 1) + " > span.tw_mark").html("");
        $("p#tw" + (i + 1) + " > span.critical").html("");
      }

    }
  };
  return update;
}

function setCriticalSpan(items, time_start, time_end, mb, group) {
  items.add([{
    id: group + c_slack,
    group: group,
    start: BASE_TIME.clone().add(time_start, 's'),
    end: BASE_TIME.clone().add(time_end, 's'),
    content: mb,
    type: 'range'
  }]);
  c_slack++;
}
c_slack = 0;

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
    setter('', start + 2, start + 30);
  }
  return set;
})();

var ballisticMissileSetter = (function() {
  var setter = itemSetterTemplate(items, 'b_missile_', 'b_missile', 'BM', 'range');

  function set(start) {
    setter('', start, start + 3);
  }
  return set;
})();

var mineTowerSetter = (function() {
  var bSetter = itemSetterTemplate(items, 'tw_mine_', 'tw_mine', '', 'background');
  var rSetter = itemSetterTemplate(items, 'mine_', 'mine', '地雷', 'range');

  function set(start, end, player) {
    bSetter(player, start, end);
    rSetter('', end, end + 15);
    twTabSetter('○', start, player);
  }
  return set;
})();

var dreadnaughtTowerSetter = (function() {
  var bSetter = itemSetterTemplate(items, 'tw_dnaught_', 'tw_dnaught', '', 'background');
  var rSetter = itemSetterTemplate(items, 'dnaught_', 'dnaught', 'ドレッド', 'range');

  function set(start, end, player) {
    bSetter(player, start, end);
    rSetter('', end, end + 15);
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
  var setter = itemSetterTemplate(items, 'tw_sflake1_', 'tw_sflake1', '', 'background');

  function set(start, end, player, crit) {
    setter(player, start, end);
    twTabSetter('×', start, player);
    crit_tab[t2ph(start) - 1].pop(); // 姑息な手
    if (crit != null) {
      setCriticalSpan(items, crit.since, crit.until, crit.player, 'tw_sflake1'); // 下と統合予定
      critSpanSetter(start, crit);
    }
  }
  return set;
})();

var snowflakeTowerSetter2 = (function() {
  var setter = itemSetterTemplate(items, 'tw_sflake2_', 'tw_sflake2', '', 'background');

  function set(start, end, player, crit) {
    setter(player, start, end);
    twTabSetter('×', start, player);
    crit_tab[t2ph(start) - 1].pop(); // 姑息な手
    if (crit != null) {
      setCriticalSpan(items, crit.since, crit.until, crit.player, 'tw_sflake2'); // 下と統合予定
      critSpanSetter(start, crit);
    }
  }
  return set;
})();

var is_auto = true;
var BASE_TIME = moment([2015, 1, 1, 0, 0, 0, 0]);

// 中央から左端までの距離（時間）
var time_half_canvas = 30;

// create a data set with groups
var names = ['HM', '気化', 'AF', 'BM', 'ドレッド', '地雷○', '全体攻撃×', 'ドレッド□', '低下△'];
var member = ['戦', 'ナ', '白', '学', 'モ', '竜', '詩', '黒'];

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

var ph_tab = [0, 86, 164, 243, 352, 450, 548, 648];
var tw_tab = Array(7);
var crit_tab = Array(7);
for (var i = 0; i < tw_tab.length; i++) {
  tw_tab[i] = Array();
  crit_tab[i] = Array();
}

// create a dataset with items
// homing_missile:ホーミングミサイル, gaseous_bomb:気化爆弾, 防衛反応:diffensive reaction, HPダウン:hpdown, af爆発: critical surge
// ballistic_missle: バリスティックミサイル
var items = new vis.DataSet([]);

/* ディフュージョンレイ */
diffusionRaySetter(5); // P1
diffusionRaySetter(26);
diffusionRaySetter(41);
diffusionRaySetter(56);
diffusionRaySetter(75);
diffusionRaySetter(94); // P2
diffusionRaySetter(111);
diffusionRaySetter(125);
diffusionRaySetter(142);
diffusionRaySetter(174); // P3
diffusionRaySetter(191);
diffusionRaySetter(205);
diffusionRaySetter(222);
diffusionRaySetter(255); // P4
diffusionRaySetter(271);
diffusionRaySetter(285);
diffusionRaySetter(302);
diffusionRaySetter(316);
diffusionRaySetter(356); // P5
diffusionRaySetter(396);
diffusionRaySetter(436);
diffusionRaySetter(477); // P6
diffusionRaySetter(516);
diffusionRaySetter(556); // P7
diffusionRaySetter(597);
diffusionRaySetter(637);

/* ホーミングミサイル */
homingMissileSetter(25, 'ナ'); // P1
homingMissileSetter(65, '詩');
homingMissileSetter(102, 'ナ'); // P2
homingMissileSetter(121, '戦');
homingMissileSetter(141, '戦');
homingMissileSetter(161, 'ナ');
homingMissileSetter(181, 'ナ'); // P3
homingMissileSetter(201, '全');
homingMissileSetter(221, 'ナ');
homingMissileSetter(236, 'ナ');
homingMissileSetter(262, '詩'); // P4
homingMissileSetter(276, '戦');
homingMissileSetter(301, '戦');
homingMissileSetter(338, 'ナ');
homingMissileSetter(379, '黒'); // P5
homingMissileSetter(419, '戦');
homingMissileSetter(459, 'ナ'); // P6
homingMissileSetter(499, 'ナ');
homingMissileSetter(539, 'ナ');
homingMissileSetter(579, 'ナ'); // P7
homingMissileSetter(619, 'ナ');

/* 気化爆弾 */
gaseousBombSetter(34); // P1
gaseousBombSetter(74);
gaseousBombSetter(110); // P2
gaseousBombSetter(150);
gaseousBombSetter(190); // P3
gaseousBombSetter(230);
gaseousBombSetter(270); // P4
gaseousBombSetter(309);
gaseousBombSetter(391); // P5
gaseousBombSetter(466); // P6
gaseousBombSetter(550);
gaseousBombSetter(629); // P7

/* アラガンフィールド */
/* 詠唱開始の時間を入れる */
allaganFieldSetter(89); // P2
allaganFieldSetter(128);
allaganFieldSetter(170); // P3
allaganFieldSetter(210);
allaganFieldSetter(251); // P4
allaganFieldSetter(290);
allaganFieldSetter(325);
allaganFieldSetter(329);
allaganFieldSetter(365); // P5
allaganFieldSetter(369);
allaganFieldSetter(405);
allaganFieldSetter(409);
allaganFieldSetter(445);
allaganFieldSetter(449);
allaganFieldSetter(485); // P6
allaganFieldSetter(489);
allaganFieldSetter(525);
allaganFieldSetter(529);
allaganFieldSetter(565); // P7
allaganFieldSetter(569);
allaganFieldSetter(605);
allaganFieldSetter(609);

/* バリスティックミサイル */
ballisticMissileSetter(81);
ballisticMissileSetter(162);
ballisticMissileSetter(243);
ballisticMissileSetter(344);
ballisticMissileSetter(422);
ballisticMissileSetter(502);
ballisticMissileSetter(581);

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
hpdownTowerSetter1(86, 86+15*4, []);
hpdownTowerSetter1(164, 164+15*4, []);
hpdownTowerSetter1(352, 352+20*4, []);
hpdownTowerSetter1(450, 450+20*1, ['竜', '詩', '黒']);
hpdownTowerSetter2(450, 450+20*3, ['モ']);

/* 防衛反応塔で特別に踏む時間の指定がある場合 */
var critPlayer = [{
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

/* 防衛反応塔× */
snowflakeTowerSetter1(86, 130, ['モ'], critPlayer[0]);
snowflakeTowerSetter1(164, 209, ['白']);
snowflakeTowerSetter1(243, 288, ['モ']);
snowflakeTowerSetter1(352, 406, ['ナ'], critPlayer[1]);
snowflakeTowerSetter1(450, 486, ['白', '学'], critPlayer[2]);
snowflakeTowerSetter2(450, 526, [], critPlayer[3]);
snowflakeTowerSetter1(548, 567, ['竜', '詩', '黒'], critPlayer[4]);
snowflakeTowerSetter2(548, 607, ['モ'], critPlayer[5]);

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
timeline.setCurrentTime(BASE_TIME.clone().add(time_half_canvas, 's').add(440, 's'));
timeline.setWindow(BASE_TIME.clone().subtract(3, 's'), BASE_TIME.clone().add(time_half_canvas * 2, 's'));

hm_tab.unshift([0, ""]);
hm_tab.push([648, ""]);

var widgetUpdater = widget(timeline, hm_tab);

setInterval("autoScroll(timeline,is_auto)", 1000);
setInterval(function() {
  timeline.setCustomTime(moment(timeline.getCurrentTime()).subtract(time_half_canvas, 's').toDate());
}, 1000);
setInterval("widgetUpdater()", 1000);

document.getElementById('auto_scroll').onclick = function() {
  is_auto = !is_auto
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
