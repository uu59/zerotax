// ==UserScript==
// @name           ZeroTax
// @namespace      http://uu59.org/
// @version        1.0.0
// @include        http://www.nicovideo.jp/watch/*
// @license        MIT License
// ==/UserScript==

var window = unsafeWindow;

var addStyle = function(css) {
  // CSS(<style>)追加
  var s = document.createElement('style');
  document.querySelector('head').appendChild(s);
  if (!window.createPopup) { /* For Safari */  
    s.appendChild(document.createTextNode(''));  
  }
  if(!!css.sort) {
    // if arg is Array
    css = css.join(" \n ");
  }
  s.appendChild(document.createTextNode(css));
}

var evalUnsafe = function(code, args) {
  // 今のとこjQuery.unbindを使う用
  // 将来的にwindow.nicoruとかを参照するために使うかもしれない
  setTimeout(function(){
    var s = document.createElement('script');
    var c = "(" + (code.toString()) + ').apply(this, '+JSON.stringify(args)+')';
    s.innerHTML = c;
    document.body.appendChild(s);
  }, 64);
}

var sel = function() {
  // ショートカット
  return document.querySelector.apply(document, arguments);
}

var click = function(selector) {
  // 要素をクリック
  var ev = document.createEvent('MouseEvents');
  ev.initMouseEvent('click', true, true, window, 0,0,0,0,0, false, false, false, false, 0, null);
  sel(selector).dispatchEvent(ev);
}

var unbind = function() {
  // イベント除去
  var args = Array.prototype.slice.call(arguments);
  evalUnsafe(
    function(){
      var args = Array.prototype.slice.call(arguments);
      var finder = args.shift();
      var self = jQuery(finder);
      self.unbind.apply(self, args);
    },
    args
  );
}

// ----------------------------------------


// ヘッダナビゲーションの幅を最大化
addStyle([
  '#siteHeader #siteHeaderInner {',
    'width: auto !important;',
  '}',
]);

// チラチラと鬱陶しいのでニコニコニュース？かなんかを非表示に
addStyle([
  "#textMarquee { visibility: hidden; height: 32px; }",
  "#textMarquee .textMarqueeOuter { position: absolute; left: -9999px; }"
]);

// プレイヤー下の関連動画？を非表示に
addStyle([
  '#playlist #playlistContainer, #playlistOuter { ',
    'visibility: hidden !important;',
  '}',
  '#playlist #playlistContainer * { width: 0 !important ;}',
]);

// コメント欄を動画プレイヤー下に常時表示
sel('.handler').parentNode.removeChild(sel('.handler'));
addStyle([
  '.commentOuter {',
    'position: static;',
    'display: block !important;',
    'opacity: 1 !important;',
    'margin: 10px;',
  '}'
]);
sel('#textMarquee').parentNode.insertBefore(sel('.commentOuter'), sel('#textMarquee'));
sel('.commandInput input').setAttribute('placeholder', 'コマンド');
// コマンドのポップアップ非表示
sel('.commentInput input[type="text"]').focus();

// 市場要らない
addStyle([
  '#ichibaPanel { left: -9999px; }'
]);
// 市場が消えたぶん広く使う
addStyle([
  '#playerContainer { ',
    'margin: 0;', // kill `margin: 0 auto`
  '}'
]);

// 動画詳細情報をコンパクトにする
addStyle([
  '#videoHeader #videoHeaderDetail h3 {',
    'display: none !important;',
  '}',
  '#videoHeader #videoHeaderDetail h2 {',
    'font-size: inherit !important;',
  '}',
  '#videoHeader #videoHeaderDetail .videoDetailExpand { ',
    'height: auto !important;',
    'min-height: auto !important;',
  '}',
  '#videoHeader #videoHeaderDetail #videoDetailInformation {',
    'max-height: 130px;',
    'overflow: auto;',
    'padding: 0;',
    'background-color: #444;',
  '}',
  '#videoHeader #videoHeaderDetail {',
    'top: -14px !important;',
    'margin-right: 240px;',
    'float: none;',
    'width: auto;',
  '}',
  '#videoHeader #videoTagContainer {',
    'height: 42px;',
  '}',
  '#videoHeader {',
    'width: auto !important;',
    'margin: 0 0 0 10px;',
  '}',
]);


setTimeout(function(){
  // タグを常に全表示
  click('#videoTagContainerPin span');

  // 動画詳細情報を常に表示
  click('.videoDetailExpand h3');
}, 64);

// 検索
sel('#siteHeaderInner').appendChild(sel('#videoHeaderMenu'));
addStyle([
  '#siteHeader .searchContainerTrigger {',
    'margin: 0;',
    'padding: 8px 10px;',
  '}',
  '.searchContainer {',
    'top: 10px;',
    'z-index: 999999;',
    'left: 300px;',
  '}',
]);

// マイリスボタンなど
addStyle([
  '#videoHeader .videoMenuToggle { display: none; }',
  '#videoHeader .videoMenuWrapper {',
    'top: 0;',
    'z-index: 101;', // greater than #playerCommentPanelOuter
  '}',
  '#videoHeader .videoMenuContainer {',
    'width: auto !important;',
    'height: auto !important;',
    'display: block !important;',
  '}',
  '#videoHeader #videoMenuTopList {',
    'width: 210px;',
    'height: 40px;',
    'overflow: hidden;',
    'position: static;',
  '}',
  '#videoHeader #videoMenuTopList:hover {',
    'overflow-y: auto;',
    'height: 200px;',
  '}',
]);
// nicoruButtonが空なのに一番上にあってよくわからないのでとりあえずマイリストを最初にする
var mylist = sel('.defmylistButton').parentNode;
mylist.parentNode.insertBefore(mylist, sel('.nicoruButton'));

// プレイヤー右のコメント欄をきびきびさせる
addStyle([
  '#playerContainer .lightControllFilter { ',
    'display: block !important;',
  '}',
  '#playerContainer:hover .lightControllFilter { ',
    'display: none !important;',
  '}',
]);
unbind("#playerContainer", "hover");
unbind("#playerCommentPanelOuter", "hover");
// TODO: 理想的にはピンをオンオフしたときウィンドウが動くのを抑制したい
sel('#playerCommentPanelOuter').addEventListener('mouseover', function(ev){
  this._originalOffsetLeft = this._originalOffsetLeft || this.offsetLeft;
  var bodyWidth = document.body.offsetWidth;
  this.style.left = (bodyWidth - 10 - this.offsetWidth) + "px";
}, false);
sel('#playerCommentPanelOuter').addEventListener('mouseout', function(ev){
  if(!this._originalOffsetLeft) {
    return ;
  }
  var isPinned = sel('.commentPanelPinOn').style.display == "inline";
  if(!isPinned) {
    this.style.left = "auto";
  }
}, false);

// ----------------------------------------

// 2012-05-14: 本体変更に追従
addStyle([
  '#siteHeader {',
    'height: 36px;',
  '}',
  '#videoHeaderMenu {',
    'position: static;',
    'float: none;',
  '}',
]);
