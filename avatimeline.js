function autoScroll(tl, is_auto) {
  if (is_auto == true) {
    tl.moveTo(tl.getCurrentTime(), {
      animate: false
    });
  }
}

function refresh(tl, time) {
  tl.setCurrentTime(base_time.clone().add(time, 's'));
}

function setDiffusionRay(items, time) {
  items.add({
    id: 'diff_ray_' + c_diff_ray,
    group: 'diff_ray',
    content: 'レイ',
    start: base_time.clone().add(time, 's'),
    type: 'point'
  });
  c_diff_ray++;
}

function setHomingMissile(items, time, pusher) {
  items.add([{
    id: 'h_missile_' + c_h_missile,
    group: 'h_missile',
    content: 'ホーミング',
    start: base_time.clone().add(time, 's'),
    type: 'point'
  }, {
    id: 'h_missile_' + c_h_missile + '_bg',
    group: 'h_missile',
    content: pusher,
    start: base_time.clone().add(time, 's').subtract(5, 's'),
    end: base_time.clone().add(time, 's'),
    type: 'background'
  }]);
  c_h_missile++;
}

function setGaseousBomb(items, time) {
  items.add([{
    id: 'g_bomb_' + c_g_bomb,
    group: 'g_bomb',
    content: '気化',
    start: base_time.clone().add(time, 's'),
    type: 'point'
  }, {
    id: 'g_bomb_' + c_g_bomb + '_bg',
    group: 'g_bomb',
    start: base_time.clone().add(time, 's').subtract(5, 's'),
    end: base_time.clone().add(time, 's'),
    type: 'background'
  }]);
  c_g_bomb++;
}

function setAllaganField(items, time) {
  items.add({
    id: 'a_field_' + c_a_field,
    group: 'a_field',
    content: 'AF',
    start: base_time.clone().add(time, 's').add(2, 's'),
    end: base_time.clone().add(time, 's').add(30, 's'),
    type: 'range'
  });
  c_a_field++;
}

function setBallisticMissile(items, time) {
  items.add({
    id: 'b_missile_' + c_b_missile,
    group: 'b_missile',
    content: 'BM',
    start: base_time.clone().add(time, 's'),
    end: base_time.clone().add(time, 's').add(3, 's'),
    type: 'range'
  });
  c_b_missile++;
}

function spawnMine(items, time_start) {
  items.add({
    id: 'mine_' + c_mine,
    group: 'mine',
    content: '地雷',
    start: base_time.clone().add(time_start, 's'),
    end: base_time.clone().add(time_start, 's').add(15, 's'),
    type: 'range'
  });
  c_mine++;
}

function spawnDreadnaught(items, time_start) {
  items.add([{
    id: 'dnaught_' + c_dnaught,
    group: 'dnaught',
    content: 'ドレッド',
    start: base_time.clone().add(time_start, 's'),
    end: base_time.clone().add(time_start, 's').add(30, 's'),
    type: 'range'
  }]);
  c_dnaught++;
}

function setMineTower(items, time_start, time_enter, mb, quarter) {
  var duration = quarter * (4 - mb.length);
  items.add([{
      id: 'tw_mine_' + c_tw_mine,
      group: 'tw_mine',
      content: mb,
      start: base_time.clone().add(time_start, 's'),
      end: base_time.clone().add(time_start, 's').add(duration, 's'),
      type: 'background'
    }
    //    { id: 'tw_mine_'+c_tw_mine+'_ent', group: 'tw_mine', content: mb, start: base_time.clone().add(time_enter,'s'), type: 'point' }
  ]);
  spawnMine(items, time_start + duration);
  c_tw_mine++;
}

function setDreadnaughtTower(items, time_start, time_enter, mb, quarter) {
  var duration = quarter * (4 - mb.length);
  items.add([{
      id: 'tw_dnaught_' + c_tw_dnaught,
      group: 'tw_dnaught',
      content: mb,
      start: base_time.clone().add(time_start, 's'),
      end: base_time.clone().add(time_start, 's').add(duration, 's'),
      type: 'background'
    }
    //    { id: 'tw_dnaught_'+c_tw_dnaught+'_ent', group: 'tw_dnaught', content: mb, start: base_time.clone().add(time_enter,'s'), type: 'point' }
  ]);
  spawnDreadnaught(items, time_start + duration);
  c_tw_dnaught++;
}

function setHpdownTower1(items, time_start, mb, quarter) {
  var duration = quarter * (4 - mb.length);
  items.add([{
    id: 'tw_hpdown_' + c_tw_hpdown,
    group: 'tw_hpdown1',
    start: base_time.clone().add(time_start, 's'),
    end: base_time.clone().add(time_start, 's').add(duration, 's'),
    content: mb,
    type: 'background'
  }]);
  c_tw_hpdown++;
}

function setHpdownTower2(items, time_start, mb, quarter) {
  var duration = quarter * (4 - mb.length);
  items.add([{
    id: 'tw_hpdown_' + c_tw_hpdown,
    group: 'tw_hpdown2',
    start: base_time.clone().add(time_start, 's'),
    end: base_time.clone().add(time_start, 's').add(duration, 's'),
    content: mb,
    type: 'background'
  }]);
  c_tw_hpdown++;
}

function setSnowflakeTower1(items, time_start, time_end, mb) {
  items.add([{
    id: 'tw_sflake_' + c_tw_sflake,
    group: 'tw_sflake1',
    start: base_time.clone().add(time_start, 's'),
    end: base_time.clone().add(time_end, 's'),
    content: mb,
    type: 'background'
  }]);
  c_tw_sflake++;
}

function setSnowflakeTower2(items, time_start, time_end, mb) {
  items.add([{
    id: 'tw_sflake_' + c_tw_sflake,
    group: 'tw_sflake2',
    start: base_time.clone().add(time_start, 's'),
    end: base_time.clone().add(time_end, 's'),
    content: mb,
    type: 'background'
  }]);
  c_tw_sflake++;
}


function setSlackTime(items, time_start, time_end, mb, group) {
  items.add([{
    id: group + c_slack,
    group: group,
    start: base_time.clone().add(time_start, 's'),
    end: base_time.clone().add(time_end, 's'),
    content: mb,
    type: 'range'
  }]);
  c_slack++;
}



c_diff_ray = 0;
c_h_missile = 0;
c_g_bomb = 0;
c_a_field = 0;
c_b_missile = 0;
c_mine = 0;
c_dnaught = 0;
c_tw_mine = 0;
c_tw_dnaught = 0;
c_tw_sflake = 0;
c_tw_hpdown = 0;
c_slack = 0;

var is_auto = true;
base_time = moment([2015, 1, 1, 0, 0, 0, 0]);

// create a data set with groups
var names = ['HM', '気化', 'AF', 'BM', 'ドレッド', '地雷○', '全体攻撃×', 'ドレッド□', '低下△'];
var member = ['戦', 'ナ', '白', '学', 'モ', '竜', '詩', '黒'];
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



// create a dataset with items
// homing_missile:ホーミングミサイル, gaseous_bomb:気化爆弾, 防衛反応:diffensive reaction, HPダウン:hpdown, af爆発: critical surge
// ballistic_missle: バリスティックミサイル
var items = new vis.DataSet([]);

/* ディフュージョンレイ */
setDiffusionRay(items, 5); // P1
setDiffusionRay(items, 26);
setDiffusionRay(items, 41);
setDiffusionRay(items, 56);
setDiffusionRay(items, 75);
setDiffusionRay(items, 94); // P2
setDiffusionRay(items, 111);
setDiffusionRay(items, 125);
setDiffusionRay(items, 142);
setDiffusionRay(items, 174); // P3
setDiffusionRay(items, 191);
setDiffusionRay(items, 205);
setDiffusionRay(items, 222);
setDiffusionRay(items, 255); // P4
setDiffusionRay(items, 271);
setDiffusionRay(items, 285);
setDiffusionRay(items, 302);
setDiffusionRay(items, 316);
setDiffusionRay(items, 356); // P5
setDiffusionRay(items, 396);
setDiffusionRay(items, 436);
setDiffusionRay(items, 477); // P6
setDiffusionRay(items, 516);
setDiffusionRay(items, 556); // P7
setDiffusionRay(items, 597);
setDiffusionRay(items, 637);

/* ホーミングミサイル */
setHomingMissile(items, 25, 'ナ'); // P1
setHomingMissile(items, 65, '詩');
setHomingMissile(items, 102, 'ナ'); // P2
setHomingMissile(items, 121, '戦');
setHomingMissile(items, 141, '戦');
setHomingMissile(items, 161, 'ナ');
setHomingMissile(items, 181, 'ナ'); // P3
setHomingMissile(items, 201, '全');
setHomingMissile(items, 221, 'ナ');
setHomingMissile(items, 236, 'ナ');
setHomingMissile(items, 262, '詩'); // P4
setHomingMissile(items, 276, '戦');
setHomingMissile(items, 301, '戦');
setHomingMissile(items, 338, 'ナ');
setHomingMissile(items, 379, '黒'); // P5
setHomingMissile(items, 419, '戦');
setHomingMissile(items, 459, 'ナ'); // P6
setHomingMissile(items, 499, 'ナ');
setHomingMissile(items, 539, 'ナ');
setHomingMissile(items, 579, 'ナ'); // P7
setHomingMissile(items, 619, 'ナ');

/* 気化爆弾 */
setGaseousBomb(items, 34); // P1
setGaseousBomb(items, 74);
setGaseousBomb(items, 110); // P2
setGaseousBomb(items, 150);
setGaseousBomb(items, 190); // P3
setGaseousBomb(items, 230);
setGaseousBomb(items, 270); // P4
setGaseousBomb(items, 309);
setGaseousBomb(items, 391); // P5
setGaseousBomb(items, 466); // P6
setGaseousBomb(items, 550);
setGaseousBomb(items, 629); // P7

/* アラガンフィールド */
/* 詠唱開始の時間を入れる */
setAllaganField(items, 89); // P2
setAllaganField(items, 128);
setAllaganField(items, 170); // P3
setAllaganField(items, 210);
setAllaganField(items, 251); // P4
setAllaganField(items, 290);
setAllaganField(items, 325);
setAllaganField(items, 329);
setAllaganField(items, 365); // P5
setAllaganField(items, 369);
setAllaganField(items, 405);
setAllaganField(items, 409);
setAllaganField(items, 445);
setAllaganField(items, 449);
setAllaganField(items, 485); // P6
setAllaganField(items, 489);
setAllaganField(items, 525);
setAllaganField(items, 529);
setAllaganField(items, 565); // P7
setAllaganField(items, 569);
setAllaganField(items, 605);
setAllaganField(items, 609);

/* バリスティックミサイル */
setBallisticMissile(items, 81);
setBallisticMissile(items, 162);
setBallisticMissile(items, 243);
setBallisticMissile(items, 344);
setBallisticMissile(items, 422);
setBallisticMissile(items, 502);
setBallisticMissile(items, 581);

/* 地雷塔○ */
/* items, 塔が始まる時刻, 入る時刻, 入る人, メーターが上がる時間 */
setMineTower(items, 15, 26, ['戦'], 15);
setMineTower(items, 164, 167, ['詩', '学'], 15);
setMineTower(items, 243, 247, [], 15);
setMineTower(items, 352, 355, ['モ', '竜', '黒'], 15);
setMineTower(items, 548, 551, ['白', '学'], 15);
/* ドレッド塔□ */
setDreadnaughtTower(items, 15, 18, ['白', '学', '詩'], 15);
setDreadnaughtTower(items, 86, 89, ['竜', 'ナ'], 15);
setDreadnaughtTower(items, 243, 247, ['竜', 'ナ'], 15);
setDreadnaughtTower(items, 352, 247, ['白', '学'], 20);
setDreadnaughtTower(items, 548, 548, [], 20);
/* HP低下塔△ */
setHpdownTower1(items, 86, [], 15);
setHpdownTower1(items, 164, [], 15);
setHpdownTower1(items, 352, [], 20);
setHpdownTower1(items, 450, ['竜', '詩', '黒'], 20);
setHpdownTower2(items, 450, ['モ'], 20);
/* 防衛反応塔× */
setSnowflakeTower1(items, 86, 130, ['モ']);
setSnowflakeTower1(items, 164, 209, ['白']);
setSnowflakeTower1(items, 243, 288, ['モ']);
setSnowflakeTower1(items, 352, 406, ['ナ']);
setSnowflakeTower1(items, 450, 486, ['白', '学']);
setSnowflakeTower2(items, 450, 526, []);
setSnowflakeTower1(items, 548, 567, ['竜', '詩', '黒']);
setSnowflakeTower2(items, 548, 609, ['モ']);


/* 防衛反応塔で特別に踏む時間の指定がある場合 */
setSlackTime(items, 123, 130, '黒', 'tw_sflake1');
setSlackTime(items, 403, 407, '戦', 'tw_sflake1');
setSlackTime(items, 483, 486, 'ナ', 'tw_sflake1');
setSlackTime(items, 523, 526, '戦', 'tw_sflake2');
setSlackTime(items, 563, 567, 'ナ', 'tw_sflake1');
setSlackTime(items, 603, 607, '戦', 'tw_sflake2');

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
timeline.setCurrentTime(base_time);

setInterval("autoScroll(timeline,is_auto)", 1000);
setInterval("timeline.setCustomTime(timeline.getCurrentTime())", 1000);

document.getElementById('auto_scroll').onclick = function() {
  is_auto = !is_auto
};
document.getElementById('refresh').onclick = function() {
  refresh(timeline, 0)
};
document.getElementById('refresh_10s').onclick = function() {
  refresh(timeline, -10)
};
