export default function GetAMap() {
  const url =
    "https://webapi.amap.com/maps?v=1.4.12&key=cf8c020fb22562f1009dfe4d31202449&plugin=AMap.MarkerClusterer";
  const jsapi = document.createElement("script");
  jsapi.charset = "utf-8";
  jsapi.src = url;
  document.head.appendChild(jsapi);
  const url2 = "//webapi.amap.com/ui/1.0/main.js?v=1.0.11";
  const jsapi2 = document.createElement("script");
  jsapi.charset = "utf-8";
  jsapi.src = url2;
  document.head.appendChild(jsapi2);
}
