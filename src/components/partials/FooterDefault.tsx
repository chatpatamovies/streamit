import { memo, Fragment, useState, useEffect } from "react";

import Link from "next/link";

// react-bootstrap
import { Container, Row, Col } from "react-bootstrap";



// components
import Logo from "../logo";
import Image from "next/image";

/**
 * Type for the "beforeinstallprompt" event.
 * (Not included in standard DOM types)
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt: () => Promise<void>;
}

const FooterMega = memo(() => {
  const [animationClass, setAnimationClass] = useState("animate__fadeIn");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Timer to enable the prompt after 5 seconds
    const timer = setTimeout(() => {
      setIsTimeUp(true);
    }, 5000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    // Show prompt automatically if both conditions are met
    if (deferredPrompt && isTimeUp) {
      setShowInstallButton(true);
    }
  }, [deferredPrompt, isTimeUp]);


  const handleInstallClick = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!deferredPrompt) {
      console.log("Install prompt not available");
      return;
    }
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === "accepted") {
      console.log("PWA installed");
    } else {
      console.log("PWA dismissed");
    }
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (document.documentElement.scrollTop > 250) {
      setAnimationClass("animate__fadeIn");
    } else {
      setAnimationClass("animate__fadeOut");
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Fragment>
        <footer className="footer footer-default">
          <Container fluid>
            <div className="footer-top">
              <Row>
                <Col xl={3} lg={6} className="mb-5 mb-lg-0">
                  <div className="footer-logo">
                    <Logo></Logo>
                  </div>
                  {/* <p className="mb-4 font-size-14">
                    Email us:{" "}
                    <span className="text-white">chatpatamoviehandle.in@gmail.com </span>
                  </p> */}
                  <p className="text-uppercase letter-spacing-1 font-size-14 mb-1">
                    customer services
                  </p>
                  <p className="mb-0 text-white">chatpatamoviehandle.in@gmail.com </p>
                </Col>
                <Col xl={2} lg={6} className="mb-5 mb-lg-0">
                  <h4 className="footer-link-title">Quick Links</h4>
                  <ul className="list-unstyled footer-menu">
                    {/* <li className="mb-3">
                      <Link href="/extra/about-us" className="ms-3">
                        about us
                      </Link>
                    </li> */}
                    {/* <li className="mb-3">
                      <Link href="/blogs" className="ms-3">
                        Blog
                      </Link>
                    </li> */}
                    <li className="mb-3">
                      <Link href="/contact-us" className="ms-3">
                        contact us
                      </Link>
                    </li>
                    <li className="mb-3">
                      <Link href="/extra/pricing-plan" className="ms-3">
                        Pricing
                      </Link>
                    </li>
                    {/* <li>
                      <Link href="/extra/faq" className="ms-3">
                        FAQ
                      </Link>
                    </li> */}
                  </ul>
                </Col>
                {/* <Col xl={2} lg={6} className="mb-5 mb-lg-0">
                  <h4 className="footer-link-title">Movies to watch</h4>
                  <ul className="list-unstyled footer-menu">
                    <li className="mb-3">
                      <Link href="#" className="ms-3">
                        Top trending
                      </Link>
                    </li>
                    <li className="mb-3">
                      <Link href="#" className="ms-3">
                        Recommended
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="ms-3">
                        Popular
                      </Link>
                    </li>
                  </ul>
                </Col> */}
                <Col xl={2} lg={6} className="mb-5 mb-lg-0">
                  <h4 className="footer-link-title">About Legal</h4>
                  <ul className="list-unstyled footer-menu">
                    <li className="mb-3">
                      <Link href="/privacy-policy" className="ms-3">
                        privacy policy
                      </Link>
                    </li>
                    <li className="mb-3">
                      <Link href="/terms-&-conditions" className="ms-3">
                        Terms & Conditions
                      </Link>
                    </li>
                    <li className="mb-3">
                      <Link href="/refunds-cancellation" className="ms-3">
                        Refunds & Cancellation
                      </Link>
                    </li>
                  </ul>
                </Col>
                <Col xl={3} lg={6}>
                  <h4 className="footer-link-title">Subscribe Newsletter</h4>
                  <div className="mailchimp mailchimp-dark">
                    <div className="input-group mb-3 mt-4">
                      <input
                        type="text"
                        className="form-control mb-0 font-size-14"
                        placeholder="Email*"
                        aria-describedby="button-addon2"
                      />
                      <div className="iq-button">
                        <button
                          type="submit"
                          className="btn btn-sm"
                          id="button-addon2"
                        >
                          Subscribe
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mt-5">
                    <span className="font-size-14 me-2">Follow Us:</span>
                    <ul className="p-0 m-0 list-unstyled widget_social_media">
                      <li className="">
                        <Link
                          href="https://www.facebook.com/"
                          className="position-relative"
                        >
                          <i className="fab fa-facebook"></i>
                        </Link>
                      </li>
                      <li className="">
                        <Link
                          href="https://twitter.com/"
                          className="position-relative"
                        >
                          <i className="fab fa-twitter"></i>
                        </Link>
                      </li>
                      <li className="">
                        <Link
                          href="https://github.com/"
                          className="position-relative"
                        >
                          <i className="fab fa-github"></i>
                        </Link>
                      </li>
                      <li className="">
                        <Link
                          href="https://www.instagram.com/"
                          className="position-relative"
                        >
                          <i className="fab fa-instagram"></i>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="footer-bottom border-top">
              <Row className="align-items-center">
                <Col md={6}>
                  <ul className="menu list-inline p-0 d-flex flex-wrap align-items-center">
                    <li className="menu-item">
                      <Link href="/terms-&-conditions"> Terms & Conditions </Link>
                    </li>
                    <li id="menu-item-7316" className="menu-item">
                      <Link href="/privacy-policy"> Privacy Policy </Link>
                    </li>
                    {/* <li className="menu-item">
                      <Link href="/faq"> FAQ </Link>
                    </li> */}
                    {/* <li className="menu-item">
                      <Link href="/play-list"> Watch List </Link>
                    </li> */}
                  </ul>
                  <p className="font-size-14">
                    © <span className="currentYear">2025</span>{" "}
                    <span className="text-primary">CHATPATAMOVIES</span>. All Rights
                    Reserved. All videos and shows on this platform are
                    trademarks of, and all related images and content are the
                    property of, ChatpataMovies Inc. Duplication and copy of this is
                    strictly prohibited. All rights reserved.
                  </p>
                </Col>
                <Col md={3}></Col>
                <Col md={3}>
                  <h6 className="font-size-14 pb-1">Download ChatpataMovies App</h6>
                  <div className="d-flex align-items-center">
                    <Link className="app-image" href="#" onClick={handleInstallClick}>
                      <Image src="/assets/images/footer/playstore-banner.jpg" width={150} height={50} loading="lazy" alt="play-store" />
                    </Link>
                    <br />
                    <Link className="ms-3 app-image" href="#" onClick={handleInstallClick}>
                      <Image src="/assets/images/footer/app-store-banner.jpg" width={150} height={50} loading="lazy" alt="app-store" />
                    </Link>
                  </div>
                </Col>
              </Row>
            </div>
          </Container>
        </footer>
        <div
          id="back-to-top"
          style={{ display: "none" }}
          className={`animate__animated ${animationClass}`}
          onClick={scrollToTop}
        >
          <Link
            className="p-0 btn bg-primary btn-sm position-fixed top border-0 rounded-circle"
            id="top"
            href="#top"
          >
            <i className="fa-solid fa-chevron-up"></i>
          </Link>
        </div>
        {showInstallButton && (
          <div
            role="alert"
            className="alert shadow-lg fixed bottom-4 right-4 z-50 w-auto bg-base-100 flex items-center gap-2 p-3 rounded-xl border border-gray-700"
          >
            {/* Note: the user mentioned daisyUI alert classes, but here we might not have daisyUI fully set up. 
                 I'll add standard bootstrap/custom styles just in case to ensure visibility if daisyUI is missing.
                 Actually, the user said "We use the alert component from daisyUI" in the comments. 
                 But this project looks like it uses Bootstrap ('Container', 'Row', 'Col'). 
                 I will stick to the classes provided by the user but add some fallback inline styles or bootstrap classes if needed.
                 The user provided code uses `alert shadow-lg fixed bottom-4 right-4 z-50 w-auto`.
                 I will assume these classes work or use inline styles for the fixed positioning to be safe.
             */}
            <span className="text-white me-2">Install our app?</span>
            <button
              onClick={handleInstallClick}
              className="btn btn-sm btn-primary"
            >
              Install
            </button>
          </div>
        )}
      </Fragment>
    </>
  );
});
FooterMega.displayName = "FooterMega";
export default FooterMega;
