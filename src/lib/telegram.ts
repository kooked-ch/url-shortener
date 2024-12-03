import { Session } from 'next-auth';

export async function alertNewRedirect(slug: string, url: string) {
	const message = `🆕 **New alias Created** 🆕\nA new alias was created\nAlias: ${new URL(process.env.NEXTAUTH_URL || '').host + '/' + slug}\nURL: ${url}`;

	const chatId = process.env.TELEGRAM_CHAT_ID;
	const botToken = process.env.TELEGRAM_BOT_TOKEN;

	if (!chatId || !botToken) {
		console.error('Telegram credentials are missing');
		return;
	}

	try {
		const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				chat_id: chatId,
				text: message,
				parse_mode: 'Markdown',
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error('Failed to send message:', errorData);
		}
	} catch (error) {
		console.error('Error sending message:', error);
	}
}
