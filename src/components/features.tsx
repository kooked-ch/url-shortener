import { Link, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
	{
		title: 'Lightning Fast',
		description: 'Generate short URLs instantly with our optimized service.',
		icon: Zap,
	},
	{
		title: 'Secure Links',
		description: 'All shortened URLs are secure and protected against abuse.',
		icon: Shield,
	},
	{
		title: 'Easy Sharing',
		description: 'Share your shortened links across any platform with ease.',
		icon: Link,
	},
];

export function Features() {
	return (
		<section className="grid md:grid-cols-3 gap-6 w-2/3 mx-auto">
			{features.map((feature) => (
				<Card key={feature.title} className="border-2">
					<CardHeader className="space-y-1">
						<feature.icon className="h-8 w-8 text-emerald-500" />
						<CardTitle className="text-xl">{feature.title}</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-gray-600">{feature.description}</p>
					</CardContent>
				</Card>
			))}
		</section>
	);
}
