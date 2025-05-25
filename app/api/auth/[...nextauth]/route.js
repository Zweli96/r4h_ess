import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { authOptions } from "../../../../utils/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
