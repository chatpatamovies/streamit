import { Fragment, memo, useState } from "react"

// react-bootstrap
import { Col, Container, Row } from "react-bootstrap"

// next link
import Link from "next/link";

//custom hook
import { useBreadcrumb } from "@/utilities/usePage";
import pb from "@/lib/pocketbase";

const PricingPage = () => {
  useBreadcrumb('Pricing Plan')

  const [isSubscribed, setIsSubscribed] = useState(false); // Toggle state
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async () => {
    setLoading(true);
    const res = await fetch('/api/create-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan_id: 'plan_RD1vrLMOPOxx0f', customer_id: pb.authStore.record?.id }),
    });
    const subscription = await res.json();

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert('Razorpay SDK failed to load');
      setLoading(false);
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use public key here
      subscription_id: subscription.id,
      name: 'Streamit',
      description: 'Subscribe for ₹99/month',
      handler: async (response: any) => {
        // Verify on backend if needed, then toggle
        setIsSubscribed(true); // Or fetch status from DB
        alert('Subscription successful!');
      },
      prefill: {
        name: pb.authStore.record?.name,
        email: pb.authStore.record?.email,
        // contact: '8249587552',
      },
      theme: { color: '#F37254' },
    };

    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  return (
    <Fragment>
      {isSubscribed ? (
        <div>Premium Item Visible: Here's the exclusive content!</div>
      ) : (
        <div>Subscribe to view the item.</div>
      )}
      <div className="section-padding">
        <Container>
          <Row>
            <Col lg="4" md="6" className="mb-3 mb-lg-0">
              <div className="pricing-plan-wrapper">
                <div className="pricing-plan-header">
                  <h4 className="plan-name text-capitalize text-body mb-0">Free</h4>
                </div>
                <div className="pricing-details">
                  <div className="pricing-plan-description">
                    <ul className="list-inline p-0">
                      <li>
                        <i className="fas fa-check text-primary"></i>
                        <span className="font-size-18 fw-500">Ads free movies and shows</span>
                      </li>
                      <li>
                        <i className="fas fa-times"></i>
                        <span className="font-size-18 fw-500">Watch on TV or Laptop</span>
                      </li>
                      <li>
                        <i className="fas fa-times"></i>
                        <span className="font-size-18 fw-500">Streamit Special</span>
                      </li>
                      <li>
                        <i className="fas fa-times"></i>
                        <span className="font-size-18 fw-500">Max video quality</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pricing-plan-footer">
                    <button onClick={handleSubscribe} disabled={loading}>
                      Subscribe for ₹129/month
                    </button>
                    <div className="iq-button">
                      <Link href="#" className="btn text-uppercase position-relative">
                        <span className="button-text">select free</span>
                        <i className="fa-solid fa-play"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg="4" md="6" className="mb-3 mb-lg-0">
              <div className="pricing-plan-wrapper">
                <div className="pricing-plan-discount bg-primary p-2 text-center">
                  <span className="text-white">Save 20%</span>
                </div>
                <div className="pricing-plan-header">
                  <h4 className="plan-name text-capitalize text-body">Premium</h4>
                  <span className="sale-price text-decoration-line-through">$49</span>
                  <span className="main-price text-primary">$39</span>
                  <span className="font-size-18">/ 3 Month</span>
                </div>
                <div className="pricing-details">
                  <div className="pricing-plan-description">
                    <ul className="list-inline p-0">
                      <li>
                        <i className="fas fa-check text-primary"></i>
                        <span className="font-size-18 fw-500">Ads free movies and shows</span>
                      </li>
                      <li>
                        <i className="fas fa-check text-primary"></i>
                        <span className="font-size-18 fw-500">Watch on TV or Laptop</span>
                      </li>
                      <li>
                        <i className="fas fa-check text-primary"></i>
                        <span className="font-size-18 fw-500">Streamit Special</span>
                      </li>
                      <li>
                        <i className="fas fa-check text-primary"></i>
                        <span className="font-size-18 fw-500">Max video quality</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pricing-plan-footer">
                    <div className="iq-button">
                      <Link href="#" className="btn text-uppercase position-relative">
                        <span className="button-text">select premium</span>
                        <i className="fa-solid fa-play"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className="pricing-plan-wrapper">
                <div className="pricing-plan-header">
                  <h4 className="plan-name text-capitalize text-body">Basic</h4>
                  <span className="main-price text-primary">$19</span>
                  <span className="font-size-18">/ 1 Month</span>
                </div>
                <div className="pricing-details">
                  <div className="pricing-plan-description">
                    <ul className="list-inline p-0">
                      <li>
                        <i className="fas fa-times"></i>
                        <span className="font-size-18 fw-500">Ads free movies and shows</span>
                      </li>
                      <li>
                        <i className="fas fa-check text-primary"></i>
                        <span className="font-size-18 fw-500">Watch on TV or Laptop</span>
                      </li>
                      <li>
                        <i className="fas fa-check text-primary"></i>
                        <span className="font-size-18 fw-500">Streamit Special</span>
                      </li>
                      <li>
                        <i className="fas fa-check text-primary"></i>
                        <span className="font-size-18 fw-500">Max video quality</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pricing-plan-footer">
                    <div className="iq-button">
                      <Link href="#" className="btn text-uppercase position-relative">
                        <span className="button-text">select basic</span>
                        <i className="fa-solid fa-play"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>
  )
}

PricingPage.displayName = "PricingPage"
export default PricingPage;

