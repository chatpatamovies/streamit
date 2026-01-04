// This is the top navbar
import { memo, Fragment, useState, useEffect } from "react";

// react-bootstrap
import { Button, Nav, Collapse, Navbar, Offcanvas, Container, Dropdown } from "react-bootstrap";

//router
import Link from "next/link";
import { useRouter } from "next/router";


// components
import Logo from "../logo";
import CustomToggle from "../CustomToggle";
import pb from "@/lib/pocketbase";
import { setCookie } from 'cookies-next';
import useProfileStore from '@/store/profile';

interface HeaderProps {
  profile: { name: string, avatar: string, uid: string, collectionId: string } | null;
  onLogout?: () => void;
}


const HeaderDefault = memo((
  { profile, onLogout }: HeaderProps
) => {
  const [isMega, setIsMega] = useState(true);
  const location = useRouter();
  const { setProfile } = useProfileStore();

  const handleGoogleSignIn = async () => {
    try {
      await pb.collection("users").authWithOAuth2({
        provider: "google",
      });

      const cookieString = pb.authStore.token;
      const record = pb.authStore.record;
      if (record) {
        setProfile({
          uid: record.id,
          email: record.email,
          avatar: record.avatar,
          updated: record.updated,
          name: record.name,
          token: pb.authStore.token,
          username: record.id
        })

        setCookie("pb_auth", cookieString, {
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        });

        window.location.reload();
      }
    } catch (err) {
      console.error("Google Sign-In Error:", err);
    }
  };

  const [show1, setShow1] = useState(false);
  const [show, setShow] = useState(false);

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const headerSticky = document.querySelector(".header-sticky");
      if (headerSticky) {
        if (window.scrollY > 1) {
          headerSticky.classList.add("sticky");
        } else {
          headerSticky.classList.remove("sticky");
        }
      }
    };

    const updateIsMega = () => {
      setIsMega(location.asPath === "/");
    };

    window.addEventListener("scroll", handleScroll);
    updateIsMega();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location]);
  return (
    <Fragment>
      <header className="header-center-home header-default header-sticky">
        {/* Style for mobile logo centering */}
        <style jsx>{`
          @media (max-width: 1199px) {
            .mobile-logo-center {
              position: absolute;
              left: 50%;
              transform: translateX(-50%);
              z-index: 10;
            }
          }
        `}</style>
        <Navbar
          expand="xl"
          className="nav navbar-light iq-navbar header-hover-menu py-xl-0"
        >
          <Container fluid className="navbar-inner">
            <div className="d-flex align-items-center justify-content-between w-100 landing-header position-relative">
              <div className="d-flex gap-3 gap-xl-0 align-items-center">
                <div>
                  <button
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#navbar_main"
                    aria-controls="navbar_main"
                    className="d-xl-none btn btn-primary rounded-pill p-1 pt-0 toggle-rounded-btn"
                    onClick={() => setShow1(!show1)}
                  >
                    <svg width="20px" className="icon-20" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"
                      ></path>
                    </svg>
                  </button>
                </div>
                <div className="mobile-logo-center">
                  <Logo></Logo>
                </div>
              </div>
              <Navbar
                expand="xl"
                className={`offcanvas mobile-offcanvas nav hover-nav horizontal-nav py-xl-0 ${show1 === true ? "show" : ""
                  } ${isMega ? "mega-menu-content" : ""}`}
                style={{
                  visibility: `${show1 === true ? "visible" : "hidden"}`,
                }}
                id="navbar_main"
              >
                <Container fluid className="container-fluid p-lg-0">
                  <Offcanvas.Header className="px-0" closeButton onClick={() => setShow1(false)}>
                    <div className="navbar-brand ms-3">
                      <Logo></Logo>
                    </div>
                  </Offcanvas.Header>
                  <ul
                    className="navbar-nav iq-nav-menu list-unstyled"
                    id="header-menu"
                  >
                    <Nav.Item as="li">
                      <Nav.Link
                        href="/"
                        aria-expanded={open}
                        onClick={() => setOpen(!open)}
                        className={`${location.asPath === "/" ||
                          location.asPath === "/home" ||
                          location.asPath === "/movies" ||
                          location.asPath === "/tv-shows" ||
                          location.asPath === "/videos" ||
                          location.asPath === "/merchandise"
                          ? "active"
                          : ""
                          }`}
                      >
                        <span className="item-name">Home</span>
                      </Nav.Link>

                    </Nav.Item>

                    <Nav.Item as="li">
                      <Nav.Link
                        aria-expanded={open2}
                        href=""
                        onClick={() => setOpen2(!open2)}
                        className={`${location.asPath.split('/').includes('extra')
                          ? "active"
                          : ""
                          }`}
                      >
                        <span className="item-name">More</span>
                        <span className="menu-icon ms-2">
                          <i
                            className="fa fa-caret-down toggledrop-desktop right-icon"
                            aria-hidden="true"
                          ></i>
                          <span className="toggle-menu">
                            <i
                              className="fa fa-plus  arrow-active text-white"
                              aria-hidden="true"
                            ></i>
                            <i
                              className="fa fa-minus  arrow-hover text-white"
                              aria-hidden="true"
                            ></i>
                          </span>
                        </span>
                      </Nav.Link>
                      <Collapse in={open2} className="sub-nav list-unstyled">
                        <ul>
                          <Nav.Item as="li">
                            <Link
                              href="/extra/about-us"
                              className={`${location.asPath === "/extra/about-us"
                                ? "active"
                                : ""
                                } nav-link`}
                            >
                              {" "}
                              About Us{" "}
                            </Link>
                          </Nav.Item>
                          <Nav.Item as="li">
                            <Link
                              href="/contact-us"
                              className={`${location.asPath === "/contact-us"
                                ? "active"
                                : ""
                                } nav-link`}
                            >
                              {" "}
                              Contact Us{" "}
                            </Link>
                          </Nav.Item>
                          <Nav.Item as="li">
                            <Link
                              href="/extra/faq"
                              className={`${location.asPath === "/extra/faq" ? "active" : ""
                                } nav-link`}
                            >
                              {" "}
                              FAQ{" "}
                            </Link>
                          </Nav.Item>
                          <Nav.Item as="li">
                            <Link
                              href="/privacy-policy"
                              className={`${location.asPath === "/privacy-policy"
                                ? "active"
                                : ""
                                } nav-link`}
                            >
                              {" "}
                              Privacy Policy{" "}
                            </Link>
                          </Nav.Item>
                          <Nav.Item as="li">
                            <Link
                              href="/extra/pricing-plan"
                              className={`${location.asPath === "/extra/pricing-plan" ? "active" : ""
                                } nav-link`}
                            >
                              {" "}
                              Pricing{" "}
                            </Link>
                          </Nav.Item>

                        </ul>
                      </Collapse>
                    </Nav.Item>
                  </ul>
                </Container>
              </Navbar>
              <div className="right-panel">
                <Button
                  id="navbar-toggle"
                  bsPrefix="navbar-toggler"
                  type="button"
                  aria-expanded={show}
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                  onClick={() => setShow(!show)}
                >
                  <span className="navbar-toggler-btn">
                    <span className="navbar-toggler-icon"></span>
                  </span>
                </Button>
                <div
                  className={`navbar-collapse ${show === true ? "collapse show" : "collapse"
                    }`}
                  id="navbarSupportedContent"
                >
                  <ul className="navbar-nav align-items-center ms-auto mb-2 mb-xl-0">
                    {mounted && profile && profile.uid ? (
                      <Dropdown as="li" className="nav-item">
                        <Dropdown.Toggle
                          as={CustomToggle}
                          href="#"
                          variant=" nav-link d-flex align-items-center"
                          size="sm"
                          id="dropdownMenuButton1"
                        >
                          {profile.avatar ? (
                            <img
                              src={`${pb.baseURL}/api/files/${profile.collectionId}/${profile.uid}/${profile.avatar}`}
                              className="img-fluid rounded-circle"
                              alt="user"
                              loading="lazy"
                              style={{ height: '40px', width: '40px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="btn-icon rounded-pill user-icons">
                              <span className="btn-inner">
                                <svg
                                  className="icon-18"
                                  width="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M9.87651 15.2063C6.03251 15.2063 2.74951 15.7873 2.74951 18.1153C2.74951 20.4433 6.01251 21.0453 9.87651 21.0453C13.7215 21.0453 17.0035 20.4633 17.0035 18.1363C17.0035 15.8093 13.7415 15.2063 9.87651 15.2063Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  ></path>
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M9.8766 11.886C12.3996 11.886 14.4446 9.841 14.4446 7.318C14.4446 4.795 12.3996 2.75 9.8766 2.75C7.3546 2.75 5.3096 4.795 5.3096 7.318C5.3006 9.832 7.3306 11.877 9.8456 11.886H9.8766Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  ></path>
                                  <path
                                    d="M19.2036 8.66919V12.6792"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  ></path>
                                  <path
                                    d="M21.2497 10.6741H17.1597"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  ></path>
                                </svg>
                              </span>
                            </div>
                          )}
                        </Dropdown.Toggle>
                        <Dropdown.Menu
                          as="ul"
                          className="dropdown-menu-end dropdown-user border-0 p-0 m-0"
                        >
                          <li className="user-info d-flex align-items-center gap-3 mb-3">
                            <img
                              src={`${pb.baseURL}/api/files/${profile.collectionId}/${profile.uid}/${profile.avatar}`}
                              className="img-fluid"
                              alt=""
                              loading="lazy"
                            />
                            <span className="font-size-14 fw-500 text-capitalize text-white">
                              {profile?.name}
                            </span>
                          </li>
                          <li>
                            <Link
                              href="/extra/pricing-plan"
                              className="iq-sub-card d-flex align-items-center gap-3"
                            >
                              <svg
                                width="16"
                                height="16"
                                strokeWidth="1.5"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M8.58737 8.23597L11.1849 3.00376C11.5183 2.33208 12.4817 2.33208 12.8151 3.00376L15.4126 8.23597L21.2215 9.08017C21.9668 9.18848 22.2638 10.0994 21.7243 10.6219L17.5217 14.6918L18.5135 20.4414C18.6409 21.1798 17.8614 21.7428 17.1945 21.3941L12 18.678L6.80547 21.3941C6.1386 21.7428 5.35909 21.1798 5.48645 20.4414L6.47825 14.6918L2.27575 10.6219C1.73617 10.0994 2.03322 9.18848 2.77852 9.08017L8.58737 8.23597Z"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <h6 className="mb-0 font-size-14 fw-normal">
                                Subscription
                              </h6>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href={"/"}
                              onClick={onLogout}
                              className="iq-sub-card iq-logout-2 mt-1 d-flex justify-content-center gap-2"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                              >
                                <path
                                  d="M1.82209 15.9999C1.46654 15.9999 1.16283 15.874 0.910981 15.6221C0.659129 15.3703 0.533203 15.0666 0.533203 14.711V1.73322C0.533203 1.37767 0.659129 1.07397 0.910981 0.822114C1.16283 0.570262 1.46654 0.444336 1.82209 0.444336H7.95543V1.44434H1.82209C1.74802 1.44434 1.68135 1.47397 1.62209 1.53322C1.56283 1.59248 1.5332 1.65915 1.5332 1.73322V14.711C1.5332 14.7851 1.56283 14.8517 1.62209 14.911C1.68135 14.9703 1.74802 14.9999 1.82209 14.9999H7.95543V15.9999H1.82209ZM12.0888 11.5999L11.3554 10.8888L13.5332 8.73322H5.68876V7.711H13.511L11.3332 5.55545L12.0665 4.82211L15.4665 8.24434L12.0888 11.5999Z"
                                  fill="currentColor"
                                ></path>
                              </svg>
                              <h6 className="mb-0 font-size-14 fw-normal">
                                Logout
                              </h6>
                            </Link>
                          </li>
                        </Dropdown.Menu>
                      </Dropdown>
                    ) : (
                      <li className="nav-item d-flex align-items-center ms-3">
                        <button
                          onClick={handleGoogleSignIn}
                          className="btn btn-hover iq-button"
                          style={{
                            padding: "8px 24px",
                            fontSize: "14px",
                            fontWeight: "600",
                            background: "linear-gradient(135deg, #e50914 0%, #b20710 100%)",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            boxShadow: "0 4px 12px rgba(229, 9, 20, 0.3)",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                          }}
                        >
                          Login
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </Container>
        </Navbar>
      </header>
    </Fragment>
  );
});

HeaderDefault.displayName = "HeaderDefault";
export default HeaderDefault;
