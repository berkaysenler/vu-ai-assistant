import { jwtVerify } from "jose";

// JWT verification for Edge Runtime (middleware)
export async function verifyJWTEdge(token: string): Promise<any> {
  try {
    console.log(
      "Edge: Verifying JWT token (first 20 chars):",
      token.substring(0, 20)
    );
    console.log("Edge: JWT_SECRET exists:", !!process.env.JWT_SECRET);

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    console.log("Edge: JWT verification successful:", payload);
    return payload;
  } catch (error) {
    console.error("Edge: JWT verification failed:", error);
    return null;
  }
}
