/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAuthClient } from "better-auth/react";
import {
	organizationClient,
	passkeyClient,
	twoFactorClient,
	adminClient,
	multiSessionClient,
	oneTapClient,
	oidcClient,
	genericOAuthClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
    plugins: [
		organizationClient(),
		twoFactorClient({
			onTwoFactorRedirect() {
				window.location.href = "/two-factor";
			},
		}),
		passkeyClient(),
		adminClient(),
		multiSessionClient(),
		oneTapClient({
			clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
		}),
		oidcClient(),
		genericOAuthClient(),
	],
	fetchOptions: {
		onError(e) {
			if (e.error.status === 429) {
				alert("Too many requests, try again later");
			}
		},
	},
    baseURL: process.env.BETTER_AUTH_URL // the base url of your auth server
})

export const signIn = async () => {
    const data = await authClient.signIn.social({
        provider: "github"
    })

}


export const {
	signUp,
	signOut,
	useSession,
	organization,
	useListOrganizations,
	useActiveOrganization,
} = authClient;