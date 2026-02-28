export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

export function isValidCoordinate(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

export function isValidKoreaCoordinate(lat: number, lng: number): boolean {
  return lat >= 33 && lat <= 43 && lng >= 124 && lng <= 132;
}

export function isValidRadius(radius: number): boolean {
  return radius >= 100 && radius <= 2000;
}
