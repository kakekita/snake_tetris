var set_bd = {};
var set_pl = {};
var set_sounds = {};
var bd = [];
let bg_color = "#003366";

function game_start() {
  set_bd = {
    //off_x: 150,
    off_x: 20,
    off_y: 50,
    x: 14,
    y: 21,
    w: 25,
    h: 25,
    t: 2,
    col_1: "#f8f8ff",
    col_2: "#ffd700",
    col_3: "#c0c0c0",
    col_4: "#ff0000",
    col_5: "#32cd32",
    col_6: "#a9a9a9",
  };
  bd = Array.from(new Array(set_bd.y), () => new Array(set_bd.x).fill(0));
  for (var dy = 0; dy < bd.length; dy++) {
    if (dy < bd.length - 1) {
      bd[dy][0] = 1;
      bd[dy][bd[0].length - 1] = 1;
    } else {
      for (var dx = 0; dx < bd[dy].length; dx++) {
        bd[dy][dx] = 1;
      }
    }
  }

  set_sounds = {
    se_1: loadSound("assets/sounds/se_1.mp3"),
    se_2: loadSound("assets/sounds/se_2.mp3"),
    se_3: loadSound("assets/sounds/se_3.mp3"),
  };

  /*set_pl = {
    st_x: set_bd.x / 2,
    st_y: 0,
    long: 5,
    dicts: [
      [0, -1], //上
      [1, 0], //右
      [0, 1], //下
      [-1, 0], //左
    ], // x,y
    now_x: -1,
    now_y: -1,
    now_d: 1,
    now_k: 1,
    history: [],
    def_speed: 16,
    speed: 16,
    decided: false,
  };*/

  document.addEventListener("keydown", keydownEvent, false);
  document.addEventListener("keyup", keyupEvent, false);
}

function setup() {
  frameRate(16);
  game_start();
  createCanvas(set_bd.off_x * 2 + set_bd.x * set_bd.w, set_bd.off_y * 2 + set_bd.y * set_bd.h);
  colorMode(RGB, 255);
  background(bg_color);
  document.body.style.backgroundColor = bg_color;
  player_spawn();
}

function draw() {
  if (set_pl.g_over) {
    repaint();
    return false;
  }
  if (frameCount % set_pl.speed == 0) {
    if (
      !set_pl.now_k ||
      bd[set_pl.now_y + set_pl.dicts[set_pl.now_k][1]][
        set_pl.now_x + set_pl.dicts[set_pl.now_k][0]
      ] != 5
    )
      set_pl.now_d = set_pl.now_k;
    if (!set_pl.decided) player_move(set_pl.now_d);
    repaint();
  }
}

function keyPressed() {
  //console.log(keyCode);
  var key_list = [87, 68, 83, 65];
  if (key_list.indexOf(parseInt(keyCode)) == -1) return false;

  for (k in key_list) {
    if (parseInt(keyCode) == key_list[k]) set_pl.now_k = parseInt(k);
  }
  if (parseInt(keyCode) == key_list[0]) return false;
  setTimeout(set_sounds.se_2.play(), 1);
}

function keydownEvent(e) {
  if (e.shiftKey) set_pl.speed = 4;
}

function keyupEvent(e) {
  if (!e.shiftKey) set_pl.speed = set_pl.def_speed;
}

function repaint() {
  clear();
  for (var dy = 0; dy < bd.length; dy++) {
    for (var dx = 0; dx < bd[dy].length; dx++) {
      if (!bd[dy][dx]) continue;
      fill(set_bd["col_" + String(bd[dy][dx])]);
      rect(
        dx * set_bd.w + set_bd.off_x,
        dy * set_bd.h + set_bd.off_y,
        set_bd.w,
        set_bd.h,
        set_bd.t
      );
    }
  }
}

function player_spawn() {
  var r_long = [4, 5, 6];
  set_pl = {
    st_x: set_bd.x / 2,
    st_y: 0,
    long: r_long[Math.floor(Math.random() * r_long.length)],
    g_over: false,
    dicts: [
      [0, -1], //上
      [1, 0], //右
      [0, 1], //下
      [-1, 0], //左
    ], // x,y
    now_x: -1,
    now_y: -1,
    now_d: 1,
    now_k: 1,
    history: [],
    def_speed: 10,
    speed: 10,
    decided: false,
  };

  //bd[set_pl.st_y][set_pl.st_x] = 4;

  set_pl.now_x = set_pl.st_x;
  set_pl.now_y = set_pl.st_y;
  set_pl.history = [];
  for (var l = 0; l < set_pl.long; l++) {
    var pos = [set_pl.st_x - l, set_pl.st_y];
    if (bd[pos[1]][pos[0]]) {
      set_pl.g_over = true;
      game_over();
      return false;
    }
    set_pl.history.push(pos);
  }

  player_body();
}

function player_body() {
  if (set_pl.decided) return false;
  for (var l = 0; l < set_pl.history.length; l++) {
    var i = 5;
    if (!l && !set_pl.decided) i = 4;
    if (l >= set_pl.long) i = 0;
    bd[set_pl.history[l][1]][set_pl.history[l][0]] = i;

    if (l == set_pl.long) set_pl.history.pop();
  }
  //console.log(set_pl.history);
  //repaint();
}

function player_move(int_dict) {
  int_dict = parseInt(int_dict);
  if (
    !int_dict ||
    bd[set_pl.now_y + set_pl.dicts[int_dict][1]][set_pl.now_x + set_pl.dicts[int_dict][0]]
  ) {
    set_pl.decided = true;
    set_pl.speed = 1;
    bd[set_pl.history[0][1]][set_pl.history[0][0]] = 5;
    setTimeout(set_sounds.se_1.play(), 1);
    block_down(set_pl.history);
    return false;
  }
  set_pl.now_x += set_pl.dicts[int_dict][0];
  set_pl.now_y += set_pl.dicts[int_dict][1];
  set_pl.history.unshift([set_pl.now_x, set_pl.now_y]);
  player_body();
}

function block_down(list_pos) {
  list_pos.sort(function (a, b) {
    return b[1] - a[1];
  });
  while_bool = true;
  main_while: while (while_bool) {
    main_for: for (var i in list_pos) {
      //console.log(list_pos[i][1]);
      if (bd[list_pos[i][1] + 1][list_pos[i][0]]) {
        //console.log(list_pos);
        var list_pos_str = list_pos.map(function (element) {
          return element.toString();
        });

        if (list_pos_str.indexOf(list_pos[i][0] + "," + parseInt(list_pos[i][1] + 1)) == -1)
          break main_while;
      }
    }
    for (var i in list_pos) {
      bd[list_pos[i][1]][list_pos[i][0]] = 0;
      list_pos[i][1] += 1;
      bd[list_pos[i][1]][list_pos[i][0]] = 5;
    }
  }

  copy_arr = bd.map(function (value) {
    return value.concat();
  });
  is_line(copy_arr);
  player_spawn();
}

function get_block_pos(arr) {
  var list = [];
  for (var i in arr) {
    for (var j in arr[i]) {
      if (arr[i][j] == 5) list.push([j, i]);
    }
  }

  return list;
}

function is_line(arr) {
  var bool = false;
  for (var i in arr) {
    arr[i].pop();
    arr[i].shift();
    //console.log("arr[i]:", arr[i]);
    var n = arr[i].reduce(function (sum, element) {
      return sum + element;
    }, 0);

    if (n == (set_bd.x - 2) * 5) line_clear(i), (bool = true);
  }
  if (bool) {
    setTimeout(set_sounds.se_3.play(), 1);
  }
}

function line_clear(l) {
  bd.splice(l, 1);
  bd.unshift(new Array(set_bd.x).fill(0));
  bd[0][0] = 1;
  bd[0][bd[0].length - 1] = 1;
}

function game_over() {
  var arr = bd.map(function (value) {
    var arr_1 = value.map(function (value2) {
      if (value2) return 6;
    });
    return arr_1;
  });

  bd = arr.map(function (value) {
    return value.concat();
  });

  alert("Game Over");
}
