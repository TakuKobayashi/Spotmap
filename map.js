var map;
var marker = [];
var infoWindow = [];
var currentInfoWindow = null;
var center = null;
var markerData = [
  {
    name: 'test1',
    lat: 35.6275767,
    lng: 135.0608655,
    img: 'img1.jpg'
  }, {
    name: 'test2',
    lat: 35.6125894,
    lng: 135.0616641,
    img: 'img2.jpg'
  }
];

function getGeo() {
  // 位置情報の取得
  navigator.geolocation.getCurrentPosition(successFunc, errorFunc);
}

function initMap(lat, lng) {
  // 地図の作成
  var mapLatLng = new google.maps.LatLng({lat: markerData[0]['lat'], lng: markerData[0]['lng']}); // 緯度経度のデータ作成
  map = new google.maps.Map(document.getElementById('sample'), { // #sampleに地図を埋め込む
    center: {lat: lat, lng: lng}, // 地図の中心を指定
    zoom: 13 // 地図のズームを指定
  });
  // マーカー毎の処理
  for (var i = 0; i < markerData.length; i++) {
    markerLatLng = new google.maps.LatLng({lat: markerData[i]['lat'], lng: markerData[i]['lng']}); // 緯度経度のデータ作成
    marker[i] = new google.maps.Marker({ // マーカーの追加
      position: markerLatLng, // マーカーを立てる位置を指定
      map: map // マーカーを立てる地図を指定
    });
    infoWindow[i] = new google.maps.InfoWindow({ // 吹き出しの追加
      content: '<div class="sample"><img src="' + markerData[i]['img'] + '" alt="" width="100" height="100" border="0" /></div>' // 吹き出しに表示する内容
    });
    // Event
    infoWindow[i].addListener("closeclick", function(argument) {
      currentInfoWindow = null;
    });
    markerEvent(i); // マーカーにクリックイベントを追加
    marker[i].setOptions({// TAM 東京のマーカーのオプション設定
      icon: {
        url: markerData[i]['img'],// マーカーの画像を変更
        scaledSize: new google.maps.Size(75, 75)
      }
    });
  }
}
// マーカーにクリックイベントを追加
function markerEvent(i) {
  marker[i].addListener('click', function() { // マーカーをクリックしたとき
    if (currentInfoWindow) {
      currentInfoWindow.close();
      currentInfoWindow = null;
    } else {
      infoWindow[i].open(map, marker[i]); // 吹き出しの表示
      currentInfoWindow = infoWindow[i];
    }
  });
}
// 成功した時の関数
function successFunc(position) {
  initMap(position.coords.latitude, position.coords.longitude);
}
// 失敗した時の関数
function errorFunc(error) {
  var errorMessage = {
    0: "原因不明のエラーが発生しました…。" ,
    1: "位置情報の取得が許可されませんでした…。" ,
    2: "電波状況などで位置情報が取得できませんでした…。" ,
    3: "位置情報の取得に時間がかかり過ぎてタイムアウトしました…。" ,
  };
  // エラーコードに合わせたエラー内容をアラート表示
  alert(errorMessage[error.code]);
}
