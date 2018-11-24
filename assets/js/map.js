var map;
var marker = [];
var infoWindow = [];
var currentInfoWindow = null;
var center = null;

var IMAGE_ROOT = 'image/';

var markerData = [{
  name: 'test1',
  lat: 35.6275767,
  lng: 135.0608655,
  img: IMAGE_ROOT + 'img1.jpg'
}, {
  name: 'test2',
  lat: 35.6125894,
  lng: 135.0616641,
  img: IMAGE_ROOT + 'img2.jpg'
}];

function getGeo() {
  // 位置情報の取得
  navigator.geolocation.getCurrentPosition(successFunc, errorFunc);
}

function getFoods(lat, lng, onSuccess) {
  const request = new XMLHttpRequest();
  request.open("GET", "/api/foods?lat=" + lat + "&lng=" + lng);
  request.addEventListener("load", (event) => {
    onSuccess(event.target.responseText);
  });
  request.send();
}

function initMap(lat, lng) {
  getFoods(lat, lng, function (response) {
    markerData = JSON.parse(response);
    // 地図の作成
    var mapLatLng = new google.maps.LatLng({
      lat: lat,
      lng: lng
    }); // 緯度経度のデータ作成
    map = new google.maps.Map(document.getElementById('sample'), { // #sampleに地図を埋め込む
      center: {
        lat: lat,
        lng: lng
      }, // 地図の中心を指定
      zoom: 15 // 地図のズームを指定
    });
    // マーカー毎の処理
    for (var i = 0; i < markerData.length; i++) {
      console.log(markerData[i].lat);
      console.log(markerData[i].lon);
      console.log(markerData[i].name);
      markerLatLng = new google.maps.LatLng({
        lat: parseFloat(markerData[i].lat),
        lng: parseFloat(markerData[i].lon)
      }); // 緯度経度のデータ作成
      marker[i] = new google.maps.Marker({ // マーカーの追加
        position: markerLatLng, // マーカーを立てる位置を指定
        map: map // マーカーを立てる地図を指定
      });
      infoWindow[i] = new google.maps.InfoWindow({ // 吹き出しの追加
        content: '<div class="sample">' + markerData[i].name + '</div><div><button type="button" name="aaa" value="aaa">Reservation</button></div>' // 吹き出しに表示する内容
      });
      // Event
      infoWindow[i].addListener("closeclick", function (argument) {
        currentInfoWindow = null;
      });
      markerEvent(i); // マーカーにクリックイベントを追加
      marker[i].setOptions({ // TAM 東京のマーカーのオプション設定
        icon: {
          url: markerData[i].image,
          // url: 'image/img' + (i % 10) + '_1.png',// マーカーの画像を変更
          scaledSize: new google.maps.Size(75, 75)
        }
      });
    }
  });
}
// マーカーにクリックイベントを追加
function markerEvent(i) {
  marker[i].addListener('click', function () { // マーカーをクリックしたとき
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
  initMap(35.6275767, 135.0608655);
}
// 失敗した時の関数
function errorFunc(error) {
  var errorMessage = {
    0: "原因不明のエラーが発生しました…。",
    1: "位置情報の取得が許可されませんでした…。",
    2: "電波状況などで位置情報が取得できませんでした…。",
    3: "位置情報の取得に時間がかかり過ぎてタイムアウトしました…。",
  };
  // エラーコードに合わせたエラー内容をアラート表示
  alert(errorMessage[error.code]);
}
