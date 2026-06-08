import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "kakadon-store-secret-key-2024";

export async function createToken(payload: { id: number; username: string; role: string }): Promise<string> {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

export async function verifyToken(token: string): Promise<{ id: number; username: string; role: string }> {
  return jwt.verify(token, JWT_SECRET) as { id: number; username: string; role: string };
}

export function getAuthTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  const cookie = request.headers.get("Cookie");
  if (cookie) {
    const match = cookie.match(/admin_token=([^;]+)/);
    if (match) return match[1];
  }
  return null;
}

export async function isAdmin(request: Request): Promise<boolean> {
  const token = getAuthTokenFromRequest(request);
  if (!token) return false;
  try {
    await verifyToken(token);
    return true;
  } catch {
    return false;
  }
}
