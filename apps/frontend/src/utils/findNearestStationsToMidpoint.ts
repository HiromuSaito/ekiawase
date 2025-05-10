import { Station } from "@/types";

/**
 * Haversine 公式で2地点の距離を計算（km単位）
 */
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // 地球の半径 (km)
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * 複数の駅コードに基づき、中間に近い駅を3件返す
 */
export function findNearestStationsToMidpoint(
  inputCodes: string[],
  allStations: Station[]
): Station[] {
  if (inputCodes.length < 2 || inputCodes.length > 5) {
    throw new Error("駅コードは2～5個指定してください。");
  }

  const inputStations = allStations.filter(st => inputCodes.includes(st.code));

  if (inputStations.length !== inputCodes.length) {
    throw new Error("一部の駅コードが駅データに存在しません。");
  }

  // 緯度・経度の合計を求める
  const sum = inputStations.reduce<{ lat: number; lon: number }>((acc, st) => {
    acc.lat += st.lat;
    acc.lon += st.lon;
    return acc;
  }, { lat: 0, lon: 0 });

  const midpointLat = sum.lat / inputStations.length;
  const midpointLon = sum.lon / inputStations.length;

  // 各駅の中間点からの距離を計算
  const stationsWithDistance = allStations.map(st => ({
    ...st,
    distance: haversineDistance(
      midpointLat,
      midpointLon,
      st.lat,
      st.lon,
    )
  }));

  // 入力駅は除外して、距離が近い順にソート → 上位5件
  const uniqueStations = stationsWithDistance
    .filter(st => !inputCodes.includes(st.code))
    .sort((a, b) => a.distance - b.distance)
    .reduce((acc, current) => {
      const exists = acc.find(item => item.name === current.name);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, [] as typeof stationsWithDistance)
    .slice(0, 5);

  return uniqueStations;
}