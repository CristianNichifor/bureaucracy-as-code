import { BrowserIdentityProvider } from "./BrowserIdentityProvider";

export async function createDemoIdentities() {
  const provider = new BrowserIdentityProvider();

  const citizen = await provider.createIdentity({
    displayName: "Citizen Demo",
    role: "Citizen",
  });

  const registryBot = await provider.createIdentity({
    displayName: "Registry Bot",
    role: "RegistryBot",
    institution: "Ministry of Finance",
  });

  const director = await provider.createIdentity({
    displayName: "Director Demo",
    role: "Director",
    institution: "Ministry of Finance",
  });

  const publicServant = await provider.createIdentity({
    displayName: "Public Servant Demo",
    role: "PublicServant",
    institution: "Ministry of Finance",
  });

  return { provider, citizen, registryBot, director, publicServant };
}
