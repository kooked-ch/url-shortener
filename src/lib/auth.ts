import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { IUser, UserModel } from '@/models/User';
import db from '@/lib/mongo';
import { isPasswordValid } from '@/lib/hash';

// Define NextAuth options
export const authOptions: NextAuthOptions = {
	pages: {
		signIn: '/login',
		signOut: '/logout',
	},
	providers: [
		CredentialsProvider({
			id: 'credentials',
			name: 'Credentials',
			credentials: {
				email: { label: 'Email Address', type: 'email', placeholder: 'name.lastname@example.com' },
				password: { label: 'Password', type: 'password', placeholder: 'Your password' },
			},
			async authorize(credentials: any) {
				await db.connect();

				const user = await UserModel.findOne<IUser>({ email: credentials.email });

				if (!user) {
					return null;
				}

				const isPasswordMatch = await isPasswordValid(credentials.password, user.password as string);

				if (!isPasswordMatch) {
					return null;
				}

				return {
					id: user._id.toString(),
					name: user.name,
					email: user.email,
					isTwoFactorComplete: false,
				};
			},
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_ID || '',
			clientSecret: process.env.GITHUB_SECRET || '',
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_ID || '',
			clientSecret: process.env.GOOGLE_SECRET || '',
		}),
	],
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60, // 30 Days
	},
	callbacks: {
		async signIn({ user, account, profile }) {
			await db.connect();
			const dbUser = await UserModel.findOne<IUser>({ email: user.email });
			const provider = account?.provider || 'credentials';

			if (!dbUser) {
				const newUser = new UserModel({
					email: user.email,
					username: profile?.name || (profile as any)?.login || null,
					image: user.image || profile?.image || null,
					provider: provider,
					name: profile?.name || user.name || (profile as any)?.login || null,
					verified: provider === 'google' || provider === 'github' ? true : false,
				});
				await newUser.save();
			}

			return true;
		},
	},
};

export default NextAuth(authOptions);
