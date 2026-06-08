/* Attribution / backlink footer. Recolored to the site's light palette so it
   reads as part of the page rather than a dark band. */
export function BacklinkFooter() {
  return (
    <footer className="jbd-backlink-footer">
      <div className="jbd-backlink-footer__inner">
        <p className="jbd-backlink-footer__brand">
          Built by{" "}
          <a href="https://jacobbritten.com" target="_blank" rel="noopener noreferrer">
            Jacob Britten
          </a>{" "}
          — Media Systems Architect
        </p>
        <nav className="jbd-backlink-footer__links" aria-label="Jacob Britten">
          <a href="https://jacobbritten.com" target="_blank" rel="noopener noreferrer">
            Portfolio
          </a>
          <a href="https://jacobbritten.com/projects.html" target="_blank" rel="noopener noreferrer">
            Projects
          </a>
          <a href="https://jacobbritten.com/lab.html" target="_blank" rel="noopener noreferrer">
            The Lab
          </a>
          <a href="https://ko-fi.com/jacobbritten" target="_blank" rel="noopener noreferrer">
            Ko-fi
          </a>
          <a
            href="https://www.paypal.com/donate/?hosted_button_id=47A4JJ4WNBY9U"
            target="_blank"
            rel="noopener noreferrer"
          >
            PayPal
          </a>
        </nav>
      </div>
    </footer>
  );
}
