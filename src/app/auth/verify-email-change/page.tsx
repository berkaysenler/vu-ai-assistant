// src/app/auth/verify-email-change/page.tsx
import Link from "next/link";

interface Props {
  searchParams: { token?: string };
}

async function verifyEmailChange(token: string) {
  try {
    const baseUrl = process.env.APP_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/auth/verify-email-change?token=${token}`,
      {
        cache: "no-store",
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Email change verification fetch error:", error);
    return { success: false, message: "Verification failed" };
  }
}

export default async function VerifyEmailChangePage({ searchParams }: Props) {
  const token = searchParams.token;

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-8 text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Link</h1>
          <p className="text-gray-600 mb-4">
            No verification token provided in the link.
          </p>
          <Link
            href="/profile"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Back to Profile Settings
          </Link>
        </div>
      </div>
    );
  }

  const result = await verifyEmailChange(token);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8 text-center">
        {result.success ? (
          <>
            <div className="text-green-600 text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Email Changed Successfully!
            </h1>
            <p className="text-gray-600 mb-4">{result.message}</p>
            {result.data?.newEmail && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-800">
                  <strong>New email address:</strong>
                  <br />
                  {result.data.newEmail}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Link
                href="/dashboard"
                className="block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Continue to Dashboard
              </Link>
              <Link
                href="/profile"
                className="block border border-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-50 transition-colors"
              >
                Go to Profile Settings
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="text-red-600 text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600 mb-4">{result.message}</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800">
                <strong>Common reasons for failure:</strong>
              </p>
              <ul className="text-xs text-red-700 mt-2 text-left">
                <li>
                  • The verification link has expired (links expire after 24
                  hours)
                </li>
                <li>• The link has already been used</li>
                <li>• The link was malformed or incomplete</li>
              </ul>
            </div>
            <div className="space-y-2">
              <Link
                href="/profile"
                className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Try Again - Go to Profile Settings
              </Link>
              <Link
                href="/dashboard"
                className="block border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
