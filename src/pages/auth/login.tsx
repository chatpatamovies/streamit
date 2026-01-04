"use client"
import React, { Fragment } from 'react'

//react bootstrap
import { Col, Container, Row } from 'react-bootstrap'

//router
import Link from 'next/link';

//components
import Logo from '../../components/logo'
import pb from '@/lib/pocketbase';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import useProfileStore from '@/store/profile';

const Login = () => {

  const router = useRouter();
  const { setProfile } = useProfileStore();

  const handleGoogleSignIn = async () => {
    // setIsLoading(true);
    // setError(null);

    try {
      // Trigger PocketBase Google OAuth2 authentication
      await pb.collection("users").authWithOAuth2({
        provider: "google",
      });

      // Log auth data for debugging
      console.log("Auth valid:", pb.authStore.isValid);
      console.log("Auth token:", pb.authStore.token);
      console.log("Auth Record", pb.authStore.record)

      // Export auth store to cookie
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

        // Set the cookie using js-cookie
        setCookie("pb_auth", cookieString, {
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        });

        console.log("User record:", record);
        router.replace("/");

      }



    } catch (err) {
      console.error("Google Sign-In Error:", err);
      // setError("Failed to sign in with Google. Please try again.");
    } finally {
      // setIsLoading(false);
    }
  };

  return (
    <Fragment>
      <main className='main-content'>
        <div className='vh-100' style={{ backgroundImage: "url(/assets/images/tv-show/tharki-sarapanch/tharkisarapanchbanner.jpg)", backgroundSize: 'cover', backgroundRepeat: "no-repeat", position: 'relative', minHeight: '500px' }}>
          <Container>
            <Row className='justify-content-center align-items-center height-self-center vh-100'>
              <Col lg="5" md="12" className='align-self-center'>
                <div className='user-login-card bg-body'>
                  <div className='text-center'>
                    <Logo />
                  </div>
                  {/* <Form action='post'>
                    <Form.Group className='mb-3'>
                      <Form.Label className='text-white fw-500 mb-2'>Username or Email Address</Form.Label>
                      <Form.Control type='text' className='rounded-0' required />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                      <Form.Label className='text-white fw-500 mb-2'>PassWord</Form.Label>
                      <Form.Control type='password' className='rounded-0' required />
                    </Form.Group>
                    <Form.Group className="text-end mb-3">
                      <Link href="/auth/lost-password" className="text-primary fw-semibold fst-italic">Forgot
                        Password?</Link>
                    </Form.Group>
                    <Form.Label className='list-group-item d-flex align-items-center mb-3 font-size-14 text-white fw-500'>
                      <Form.Check.Input type='checkbox' className='m-0 me-2' />
                      Remember Me
                    </Form.Label>
                    <div className="full-button">
                      <div className="iq-button">
                        <Link href="#" className="btn text-uppercase position-relative">
                          <span className="button-text">log in</span>
                          <i className="fa-solid fa-play"></i>
                        </Link>
                      </div>
                    </div>
                  </Form> */}
                  {/* <p className="my-4 text-center fw-500 text-white">New to ChatpataMovies? <Link href="/auth/sign-up" className="text-primary ms-1">Register</Link></p> */}
                  <div className="text-center mt-4">
                    <button
                      onClick={handleGoogleSignIn}
                      className="btn btn-hover iq-button w-100 d-flex align-items-center justify-content-center gap-2"
                      style={{
                        padding: "12px 24px",
                        fontSize: "16px",
                        fontWeight: "600",
                        background: "white",
                        color: "#333",
                        border: "none",
                        borderRadius: "4px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        textTransform: "none"
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#FBC02D"></path>
                        <path d="M3.15283 7.3455L6.43833 9.755C7.32733 7.554 9.48033 6 11.9998 6C13.5293 6 14.9208 6.577 15.9803 7.5195L18.8088 4.691C17.0228 3.0265 14.6338 2 11.9998 2C8.15883 2 4.82783 4.1685 3.15283 7.3455Z" fill="#E53935"></path>
                        <path d="M12.0002 22.0001C14.5832 22.0001 16.9302 21.0116 18.7047 19.4041L15.6097 16.7851C14.6057 17.5456 13.3577 18.0001 12.0002 18.0001C9.39916 18.0001 7.19066 16.3416 6.35866 14.0271L3.09766 16.5396C4.75266 19.7781 8.11366 22.0001 12.0002 22.0001Z" fill="#4CAF50"></path>
                        <path d="M21.8055 10.0415L21.7975 10H21H12V14H17.6515C17.2555 15.1185 16.536 16.083 15.608 16.7855C15.6085 16.785 15.609 16.785 15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#1565C0"></path>
                      </svg>
                      Sign in with Google
                    </button>
                    <p className="mt-4 mb-0 text-white font-size-14">
                      By signing in, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </main>
    </Fragment>
  );
};

Login.layout = "Blank";
export default Login;
