import { Fragment, memo, useState } from "react";

//react bootstrap
import { Col, Container, Row } from "react-bootstrap";

//custom hook
import { useBreadcrumb } from "@/utilities/usePage";

const FAQPage = memo(() => {
  const [faq, setfaq] = useState("1");
  useBreadcrumb('FAQ')
  return (
    <Fragment>
      <div className="section-padding">
        <Container>
          <Row>
            <Col lg="12" sm="12">
              <div className="iq-accordian iq-accordian-square">
                <div
                  className={`iq-accordian-block ${faq === "1" ? "iq-active" : ""
                    }`}
                  onClick={() => {
                    setfaq("1");
                  }}
                >
                  <div className="iq-accordian-title">
                    <div className="iq-icon-right">
                      <i aria-hidden="true" className="fa fa-minus active"></i>
                      <i aria-hidden="true" className="fa fa-plus inactive"></i>
                    </div>
                    <h4 className="mb-0 accordian-title iq-heading-title">
                      What Is ChatpataMovies?
                    </h4>
                  </div>
                  <div
                    className={`iq-accordian-details ${faq === "1" ? "d-block" : "d-none"
                      }`}
                  >
                    <p className="mb-0">
                      ChatpataMovies is a premier streaming service offering a vast library of movies, TV shows, and exclusive originals. We provide high-quality entertainment curated for every mood, from blockbuster hits to hidden gems.
                    </p>
                  </div>
                </div>

                <div
                  className={`iq-accordian-block 2  ${faq === "2" ? "iq-active" : ""
                    }`}
                  onClick={() => {
                    setfaq("2");
                  }}
                >
                  <div className="iq-accordian-title">
                    <div className="iq-icon-right">
                      <i aria-hidden="true" className="fa fa-minus active"></i>
                      <i aria-hidden="true" className="fa fa-plus inactive"></i>
                    </div>
                    <h4 className="mb-0 accordian-title iq-heading-title">
                      Will My Account Work Outside My Country?
                    </h4>
                  </div>
                  <div
                    className={`iq-accordian-details ${faq === "2" ? "d-block" : "d-none"
                      }`}
                  >
                    <p className="mb-0">
                      Yes, your ChatpataMovies account travels with you! You can access your subscription and watch content from anywhere in the world, provided you have a stable internet connection. Some specific titles may vary by region due to licensing agreements.
                    </p>
                  </div>
                </div>

                <div
                  className={`iq-accordian-block 3  ${faq === "3" ? "iq-active" : ""
                    }`}
                  onClick={() => {
                    setfaq("3");
                  }}
                >
                  <div className="iq-accordian-title">
                    <div className="iq-icon-right">
                      <i aria-hidden="true" className="fa fa-minus active"></i>
                      <i aria-hidden="true" className="fa fa-plus inactive"></i>
                    </div>
                    <h4 className="mb-0 accordian-title iq-heading-title">
                      I Am Facing Video Playback Issues. What Do I Do?
                    </h4>
                  </div>
                  <div
                    className={`iq-accordian-details ${faq === "3" ? "d-block" : "d-none"
                      }`}
                  >
                    <p className="mb-0">
                      If you experience buffering or playback errors, please try the following:<br />
                      1. Check your internet connection speed (we recommend at least 5 Mbps for HD).<br />
                      2. Reload the page or restart your app.<br />
                      3. Clear your browser cache or app data.<br />
                      4. Ensure your device or browser is up to date.<br />
                      If the issue persists, please contact our support team.
                    </p>
                  </div>
                </div>

                <div
                  className={`iq-accordian-block 4 ${faq === "4" ? "iq-active" : ""
                    }`}
                  onClick={() => {
                    setfaq("4");
                  }}
                >
                  <div className="iq-accordian-title">
                    <div className="iq-icon-right">
                      <i aria-hidden="true" className="fa fa-minus active"></i>
                      <i aria-hidden="true" className="fa fa-plus inactive"></i>
                    </div>
                    <h4 className="mb-0 accordian-title iq-heading-title">
                      How Can I Manage Notifications?
                    </h4>
                  </div>
                  <div
                    className={`iq-accordian-details ${faq === "4" ? "d-block" : "d-none"
                      }`}
                  >
                    <p className="mb-0">
                      You can manage your notification preferences in your Profile settings. We send updates about new releases, subscription alerts, and special offers. You can opt-in or opt-out at any time.
                    </p>
                  </div>
                </div>

                <div
                  className={`iq-accordian-block 5 ${faq === "5" ? "iq-active" : ""
                    }`}
                  onClick={() => {
                    setfaq("5");
                  }}
                >
                  <div className="iq-accordian-title">
                    <div className="iq-icon-right">
                      <i aria-hidden="true" className="fa fa-minus active"></i>
                      <i aria-hidden="true" className="fa fa-plus inactive"></i>
                    </div>
                    <h4 className="mb-0 accordian-title iq-heading-title">
                      What Benefits Do I Get With The Packs?
                    </h4>
                  </div>
                  <div
                    className={`iq-accordian-details ${faq === "5" ? "d-block" : "d-none"
                      }`}
                  >
                    <p className="mb-0">
                      Our subscription packs offer:<br />
                      - Ad-free unlimited streaming.<br />
                      - High-Definition (HD) and 4K viewing options.<br />
                      - Offline downloads on mobile devices.<br />
                      - Access to exclusive premium content and early releases.<br />
                      - Simultaneous streaming on multiple devices (depending on the plan).
                    </p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
});

FAQPage.displayName = "FAQPage";
export default FAQPage;
