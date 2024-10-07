'use server';

import { getServerSession } from 'next-auth';
import { Nav } from './nav';

export async function Header() {
	const session = await getServerSession();

	return <header className="absolute top-2 w-full flex justify-center">{session && <Nav />}</header>;
}
