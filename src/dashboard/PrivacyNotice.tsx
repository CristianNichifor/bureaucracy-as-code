import { useEffect, useRef } from "react";
import type { Dictionary } from "../i18n";

export const ISSUES_URL = "https://github.com/CristianNichifor/bureaucracy-as-code/issues";

export function PrivacyNotice({ labels }: { labels: Dictionary["privacy"] }) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    // Lets the notice be linked to directly, for example from the hub's privacy page.
    if (window.location.hash === "#privacy") dialog.current?.showModal();
  }, []);

  return (
    <>
      <a
        className="privacyLink"
        href="#privacy"
        onClick={(event) => {
          event.preventDefault();
          dialog.current?.showModal();
        }}
      >
        {labels.link}
      </a>
      <dialog aria-labelledby="privacy-title" className="privacyDialog" id="privacy" ref={dialog}>
        <h2 id="privacy-title">{labels.title}</h2>
        <p>{labels.intro}</p>
        <ul>
          {labels.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <p>{labels.operator}</p>
        <p>
          {labels.contact}{" "}
          <a href={ISSUES_URL} rel="noreferrer" target="_blank">
            {labels.contactLink}
          </a>
          .
        </p>
        <button className="civicButton civicButtonSecondary" onClick={() => dialog.current?.close()} type="button">
          {labels.close}
        </button>
      </dialog>
    </>
  );
}
