const circleIntersect = (
  x1: number,
  y1: number,
  r1: number,
  x2: number,
  y2: number,
  r2: number
) => {
  // Calculate the distance between the two circles
  let squareDistance = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);

  // When the distance is smaller or equal to the sum
  // of the two radius, the circles touch or overlap
  return squareDistance <= (r1 + r2) * (r1 + r2);
};

export default circleIntersect;
