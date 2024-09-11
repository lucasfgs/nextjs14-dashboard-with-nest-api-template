import { cookies } from "next/headers";

// Verifier that expects valid access tokens:

function getTokenFromCookies(): string | null {
  const cookieStore = cookies();

  const storedCookies = cookieStore.getAll();

  const token = storedCookies.find((cookie) => {
    if (
      !cookie.name.includes(
        `CognitoIdentityServiceProvider.${process.env.COGNITO_APP_CLIENT_ID}.`
      )
    ) {
      return null;
    }

    return cookie.name.includes("accessToken") ? cookie.value : null;
  });

  if (!token) {
    return null;
  }

  return token.value;
}

export async function validateAuthenticatedUser() {
  return true;
  // const token = await getTokenFromCookies();
  // if (!token) {
  //   return null;
  // }
  // try {
  //   return await verifier.verify(token);
  // } catch (error) {
  //   if (error instanceof JwtExpiredError) {
  //     return "ACCESS_TOKEN_EXPIRED";
  //   }
  //   return null;
  // }
}
