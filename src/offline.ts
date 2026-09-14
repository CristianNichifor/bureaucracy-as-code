export async function registerOfflineDemo(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator) || import.meta.env.DEV) {
    return null;
  }

  const registration = await navigator.serviceWorker.register(new URL("sw.js", document.baseURI), {
    scope: new URL("./", document.baseURI).pathname,
  });

  await navigator.serviceWorker.ready;
  return registration;
}
