import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export default NextAuth({
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: false,
                domain: process.env.SESSION_TOKEN_DOMAIN
            }
        }
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        })
    ],
    jwt: {
        signingKey: Buffer.from(process.env.JWT_SIGNING_KEY || '', 'base64').toString('ascii'),
        verificationOptions: {
            algorithms: ['PS256']
        }
    }
})
