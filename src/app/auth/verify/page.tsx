import Link from "next/link";

interface Props {
  searchParams: { token?: string };
}

async function verifyEmail(token: string) {
  try {
    // Use the same port as the current request
    const baseUrl = process.env.APP_URL || "http://localhost:3000";
    console.log(
      "Calling verification API:",
      `${baseUrl}/api/auth/verify?token=${token.substring(0, 10)}...`
    );

    const response = await fetch(`${baseUrl}/api/auth/verify?token=${token}`, {
      cache: "no-store",
    });
    const result = await response.json();
    console.log("Verification result:", result);
    return result;
  } catch (error) {
    console.error("Verification fetch error:", error);
    return { success: false, message: "Verification failed" };
  }
}

export default async function VerifyPage({ searchParams }: Props) {
  console.log("Verify page accessed with searchParams:", searchParams);

  const token = searchParams.token;

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">No Token</h1>
          <p className="text-gray-600 mb-4">No verification token provided</p>
          <Link
            href="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Register Again
          </Link>
        </div>
      </div>
    );
  }

  const result = await verifyEmail(token);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8 text-center">
        {result.success ? (
          <>
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Email Verified!
            </h1>
            <p className="text-gray-600 mb-4">{result.message}</p>
            {result.data?.email && (
              <p className="text-sm text-gray-500 mb-4">
                Email: {result.data.email}
              </p>
            )}
            <Link
              href="/auth/login"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Continue to Login
            </Link>
          </>
        ) : (
          <>
            <div className="text-red-600 text-6xl mb-4">✗</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600 mb-4">{result.message}</p>
            <div className="space-y-2">
              <Link
                href="/register"
                className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Register Again
              </Link>
              <Link
                href="/auth/login"
                className="block border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50"
              >
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
