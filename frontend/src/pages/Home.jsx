import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-page">

      {/* ================= NAVBAR ================= */}

      <nav className="home-navbar">
        <div className="home-container navbar-inner">

          <Link to="/" className="home-brand">
            <div className="brand-icon">
              <i className="bi bi-shield-fill-check"></i>
            </div>

            <div>
              <div className="brand-title">Silent SOS</div>
              <div className="brand-subtitle">
                Safety Network
              </div>
            </div>
          </Link>

          <div className="desktop-nav">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#safety">Safety</a>
          </div>

          <div className="navbar-actions">
            <Link to="/login" className="login-btn">
              Sign in
            </Link>

            <Link to="/register" className="get-started-btn">
              Get started
              <i className="bi bi-arrow-up-right"></i>
            </Link>
          </div>

        </div>
      </nav>


      {/* ================= HERO ================= */}

      <section className="hero-section">

        <div className="home-container">

          <div className="hero-grid">

            {/* LEFT */}

            <div className="hero-content">

              <div className="hero-badge">
                <span className="live-dot"></span>
                Your personal safety network
              </div>

              <h1>
                Safety when
                <span> you need it most.</span>
              </h1>

              <p className="hero-description">
                Silent SOS helps you quickly activate an
                emergency alert and share your location
                with your trusted safety network.
              </p>

              <div className="hero-buttons">

                <Link
                  to="/register"
                  className="primary-cta"
                >
                  Get started free
                  <i className="bi bi-arrow-right"></i>
                </Link>

                <a
                  href="#how-it-works"
                  className="secondary-cta"
                >
                  <i className="bi bi-play-circle"></i>
                  See how it works
                </a>

              </div>

              <div className="hero-trust">

                <div>
                  <i className="bi bi-check-circle-fill"></i>
                  Easy to use
                </div>

                <div>
                  <i className="bi bi-shield-check"></i>
                  Secure
                </div>

                <div>
                  <i className="bi bi-phone"></i>
                  Mobile ready
                </div>

              </div>

            </div>


            {/* RIGHT — SOS UI */}

            <div className="hero-visual">

              <div className="floating-card location-card">
                <div className="floating-icon green">
                  <i className="bi bi-geo-alt-fill"></i>
                </div>

                <div>
                  <strong>Location ready</strong>
                  <small>Permission granted</small>
                </div>

                <i className="bi bi-check-circle-fill check"></i>
              </div>


              <div className="sos-device">

                <div className="device-top">
                  <div className="device-brand">
                    <i className="bi bi-shield-fill-check"></i>
                    Silent SOS
                  </div>

                  <span className="online-status">
                    <span></span>
                    Online
                  </span>
                </div>


                <div className="sos-content">

                  <div className="sos-label">
                    EMERGENCY ACTION
                  </div>

                  <div className="sos-circle">
                    <div className="sos-inner">
                      <i className="bi bi-broadcast-pin"></i>
                    </div>
                  </div>

                  <h3>Silent SOS</h3>

                  <p>
                    Press and hold for
                    <strong> 3 seconds</strong>
                  </p>

                  <div className="hold-progress">
                    <div></div>
                  </div>

                  <small className="hold-text">
                    Hold to activate emergency alert
                  </small>

                </div>


                <div className="device-footer">

                  <div>
                    <i className="bi bi-people-fill"></i>
                    <span>Contacts ready</span>
                  </div>

                  <div>
                    <i className="bi bi-geo-alt-fill"></i>
                    <span>Location ready</span>
                  </div>

                </div>

              </div>


              <div className="floating-card contact-card">

                <div className="contact-avatar">
                  <i className="bi bi-person-fill"></i>
                </div>

                <div>
                  <strong>Safety network</strong>
                  <small>1 trusted contact</small>
                </div>

                <span className="ready-badge">
                  Ready
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= TRUST STRIP ================= */}

      <section className="trust-strip">

        <div className="home-container">

          <div className="trust-strip-inner">

            <span>BUILT FOR EVERYDAY SAFETY</span>

            <div>
              <i className="bi bi-shield-check"></i>
              Secure account
            </div>

            <div>
              <i className="bi bi-geo-alt"></i>
              Location aware
            </div>

            <div>
              <i className="bi bi-lightning-charge"></i>
              Quick activation
            </div>

            <div>
              <i className="bi bi-clock-history"></i>
              Alert history
            </div>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section
        id="features"
        className="features-section"
      >

        <div className="home-container">

          <div className="section-heading">

            <div className="section-eyebrow">
              SAFETY FEATURES
            </div>

            <h2>
              Everything you need,
              <span> in one place.</span>
            </h2>

            <p>
              Simple safety tools designed to help
              you stay connected with the people
              you trust.
            </p>

          </div>


          <div className="feature-grid">

            <Feature
              icon="bi-broadcast-pin"
              color="red"
              title="Silent SOS"
              text="Activate an emergency alert with a simple press-and-hold action."
            />

            <Feature
              icon="bi-geo-alt-fill"
              color="green"
              title="Live Location"
              text="Share your latest available location with your safety network."
            />

            <Feature
              icon="bi-people-fill"
              color="blue"
              title="Trusted Contacts"
              text="Keep important emergency contacts configured and ready."
            />

            <Feature
              icon="bi-clock-history"
              color="orange"
              title="Alert History"
              text="Review your previous emergency activity and alert status."
            />

            <Feature
              icon="bi-person-check-fill"
              color="purple"
              title="Safety Profile"
              text="Manage your account and keep your safety information updated."
            />

            <Feature
              icon="bi-shield-lock-fill"
              color="dark"
              title="Secure Access"
              text="Your account and emergency information are protected."
            />

          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section
        id="how-it-works"
        className="how-section"
      >

        <div className="home-container">

          <div className="section-heading">

            <div className="section-eyebrow">
              HOW IT WORKS
            </div>

            <h2>
              Ready in
              <span> three simple steps.</span>
            </h2>

          </div>


          <div className="steps-grid">

            <Step
              number="01"
              icon="bi-person-plus"
              title="Create your account"
              text="Set up your profile and add your trusted emergency contacts."
            />

            <Step
              number="02"
              icon="bi-hand-index-thumb"
              title="Activate Silent SOS"
              text="Press and hold the SOS action for three seconds when needed."
            />

            <Step
              number="03"
              icon="bi-broadcast"
              title="Stay connected"
              text="Your emergency information can be shared with your configured safety network."
            />

          </div>

        </div>

      </section>


      {/* ================= SAFETY ================= */}

      <section
        id="safety"
        className="safety-section"
      >

        <div className="home-container">

          <div className="safety-box">

            <div className="safety-icon">
              <i className="bi bi-shield-exclamation"></i>
            </div>

            <div>

              <div className="section-eyebrow">
                IMPORTANT SAFETY NOTICE
              </div>

              <h3>
                Your safety comes first.
              </h3>

              <p>
                Silent SOS is a safety-support prototype
                and does not replace official emergency
                services. In immediate danger, contact
                the appropriate emergency service
                whenever possible.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section className="cta-section">

        <div className="home-container">

          <div className="cta-box">

            <div className="cta-icon">
              <i className="bi bi-shield-fill-check"></i>
            </div>

            <h2>
              Build your safety network today.
            </h2>

            <p>
              Set up your trusted contacts and keep
              your safety tools ready when you need them.
            </p>

            <Link
              to="/register"
              className="primary-cta"
            >
              Get started
              <i className="bi bi-arrow-right"></i>
            </Link>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="home-footer">

        <div className="home-container footer-inner">

          <div className="home-brand">

            <div className="brand-icon">
              <i className="bi bi-shield-fill-check"></i>
            </div>

            <div>
              <div className="brand-title">
                Silent SOS
              </div>

              <div className="brand-subtitle">
                Safety Network
              </div>
            </div>

          </div>

          <p>
            © {new Date().getFullYear()} Silent SOS.
            Safety-support prototype.
          </p>

        </div>

      </footer>

    </div>
  );
}


/* ================= FEATURE COMPONENT ================= */

function Feature({
  icon,
  color,
  title,
  text,
}) {
  return (
    <div className="feature-card">

      <div className={`feature-icon ${color}`}>
        <i className={`bi ${icon}`}></i>
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

      <span className="feature-arrow">
        <i className="bi bi-arrow-up-right"></i>
      </span>

    </div>
  );
}


/* ================= STEP COMPONENT ================= */

function Step({
  number,
  icon,
  title,
  text,
}) {
  return (
    <div className="step-card">

      <div className="step-top">

        <span>{number}</span>

        <div className="step-icon">
          <i className={`bi ${icon}`}></i>
        </div>

      </div>

      <h3>{title}</h3>

      <p>{text}</p>

    </div>
  );
}


export default Home;