import { getServerSession } from 'next-auth';

export async function MyShortPage() {
	const session = await getServerSession();
	return <div>{JSON.stringify(session)}</div>;
}
