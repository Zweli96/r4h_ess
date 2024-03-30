import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        email: { label: "Email Address" },
        password: { label: "Password", type: "password" },
      },
      authorize(credentials, req) {
        const { email, password } = credentials;

        try {
          // Do the login logic here
          if (email !== "zgolowa@r4hmw.org" || password !== "ZestyLemmons1") {
            throw new Error("Invalid Credentials");
          }
          return {
            id: "1234",
            name: "Zwelitihini Golowa",
            email: "zgolowa@r4hmw.org",
          };
        } catch (error) {
          console.error("Error during authorization:", error);
          return null; // Return null in case of any error
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    // signOut: "/auth/signout",
    // error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
