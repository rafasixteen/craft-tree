'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field';
import { providers } from '@/domain/auth/providers';
import { signIn } from 'next-auth/react';

export default function SignInPage()
{
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<div className="flex flex-col gap-6">
					<Card>
						<CardHeader className="text-center">
							<CardTitle className="text-xl">Welcome back</CardTitle>
							<CardDescription>Choose one of the following providers</CardDescription>
						</CardHeader>
						<CardContent>
							<FieldGroup>
								<Field>
									{providers.map((provider) => (
										<Button
											key={provider.id}
											type="button"
											name="provider"
											value={provider.id}
											className="flex min-w-30 items-center justify-center"
											onClick={() => signIn(provider.id, { callbackUrl: '/' })}
										>
											{provider.icon}
											{provider.name}
										</Button>
									))}
								</Field>
							</FieldGroup>
						</CardContent>
					</Card>
					<FieldDescription className="px-6 text-center">
						By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
					</FieldDescription>
				</div>
			</div>
		</div>
	);
}
