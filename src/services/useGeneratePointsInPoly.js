import bbox from '@turf/bbox';
import pointsWithinPolygon from '@turf/points-within-polygon';
import { randomPoint } from '@turf/random';

export const useGeneratePointsInPoly = async (pointsQty, poly) => {
  if (pointsQty <= 0) return [];

  const points = randomPoint(pointsQty, { bbox: bbox(poly) });
  const pointsWithin = pointsWithinPolygon(points, poly);

  if (pointsWithin.features.length) {
    const res = pointsWithin.features.reduce((acc, curr) => {
      const {
        geometry: {
          coordinates: [lng, lat],
        },
      } = curr;

      acc.push([lat, lng]);

      return acc;
    }, []);

    const rest = await useGeneratePointsInPoly(
      pointsQty - pointsWithin.features.length,
      poly
    );

    return [...res, ...rest];
  }

  return useGeneratePointsInPoly(pointsQty, poly);
};

export default useGeneratePointsInPoly;
