import React, { Fragment, useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner, Badge } from "react-bootstrap";
import { useRouter } from "next/router";
import pb from "@/lib/pocketbase";
import { useEnterExit } from "@/utilities/usePage";
import Swal from "sweetalert2";
import { deleteCookie } from "cookies-next";

// Define the User interface based on expected PocketBase record structure
interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar: string;
    collectionId: string;
    created: string;
    plan_name?: string;
    plan_expiry?: string;
    [key: string]: any;
}

const ProfilePage = () => {
    useEnterExit();
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (!pb.authStore.isValid || !pb.authStore.record) {
                router.push("/auth/login");
                return;
            }

            try {
                // Refresh the user record to get the latest data
                const record = await pb.collection("users").getOne<UserProfile>(pb.authStore.record.id);
                setUser(record);
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
                // Fallback to authStore record if fetch fails
                setUser(pb.authStore.record as unknown as UserProfile);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out of your account.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e50914",
            cancelButtonColor: "#141414",
            confirmButtonText: "Yes, logout!",
            background: "#191919",
            color: "#fff"
        }).then((result) => {
            if (result.isConfirmed) {
                pb.authStore.clear();
                deleteCookie("pb_auth");
                window.localStorage.removeItem("pocketbase_auth"); // Ensure local storage is cleared too
                router.push("/auth/login");
            }
        });
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect in useEffect
    }

    const avatarUrl = user.avatar
        ? `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/${user.collectionId}/${user.id}/${user.avatar}`
        : "/assets/images/user/user.png"; // Fallback image

    // Calculate subscription status
    const isPlanActive = user.plan_expiry ? new Date(user.plan_expiry) > new Date() : false;

    return (
        <Fragment>
            <div className="profile-page-wrapper py-5" style={{ minHeight: "80vh", paddingTop: "120px" }}>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8} md={10}>
                            <Card className="bg-dark text-white border-0 shadow-lg position-relative overflow-hidden" style={{ borderRadius: "20px" }}>
                                {/* Decorative Background Blur */}
                                <div style={{
                                    position: "absolute",
                                    top: "-50%",
                                    left: "-50%",
                                    width: "200%",
                                    height: "200%",
                                    background: "radial-gradient(circle, rgba(229,9,20,0.15) 0%, rgba(0,0,0,0) 70%)",
                                    pointerEvents: "none"
                                }}></div>

                                <Card.Body className="p-5 position-relative z-index-1">
                                    <div className="text-center mb-5">
                                        <h2 className="fw-bold mb-1">My Profile</h2>
                                        <p className="text-secondary">Manage your account details and subscription</p>
                                    </div>

                                    <Row className="align-items-center">
                                        <Col md={4} className="text-center mb-4 mb-md-0">
                                            <div className="profile-avatar-wrapper position-relative d-inline-block">
                                                <div style={{
                                                    width: "150px",
                                                    height: "150px",
                                                    borderRadius: "50%",
                                                    overflow: "hidden",
                                                    border: "4px solid #141414",
                                                    boxShadow: "0 0 0 3px #e50914"
                                                }}>
                                                    <img
                                                        src={avatarUrl}
                                                        alt={user.name}
                                                        className="w-100 h-100"
                                                        style={{ objectFit: "cover" }}
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = "/assets/images/user/user.png";
                                                        }}
                                                    />
                                                </div>
                                                {isPlanActive && (
                                                    <Badge bg="warning" text="dark" className="position-absolute bottom-0 start-50 translate-middle-x mb-2 rounded-pill px-3 py-1">
                                                        <i className="fa-solid fa-crown me-1"></i> Premium
                                                    </Badge>
                                                )}
                                            </div>
                                        </Col>

                                        <Col md={8}>
                                            <div className="user-details ps-md-4">
                                                <div className="mb-4">
                                                    <label className="d-block text-secondary small text-uppercase fw-bold mb-1">Full Name</label>
                                                    <h4 className="fw-500">{user.name || "User"}</h4>
                                                </div>

                                                <div className="mb-4">
                                                    <label className="d-block text-secondary small text-uppercase fw-bold mb-1">Email Address</label>
                                                    <h5 className="fw-500 text-white-50">{user.email}</h5>
                                                </div>

                                                <div className="mb-4 p-3 rounded" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                                    <label className="d-block text-primary small text-uppercase fw-bold mb-2">
                                                        <i className="fa-solid fa-ticket me-2"></i> Current Plan
                                                    </label>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <span className="d-block fs-5 fw-bold">{user.plan_name || "Free Plan"}</span>
                                                            {isPlanActive && (
                                                                <small className="text-secondary">Expires on: {new Date(user.plan_expiry!).toLocaleDateString()}</small>
                                                            )}
                                                        </div>
                                                        <div>
                                                            {isPlanActive ? (
                                                                <Badge bg="success">Active</Badge>
                                                            ) : (
                                                                <Badge bg="secondary">Inactive</Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {!isPlanActive && (
                                                        <div className="mt-3">
                                                            <Button variant="outline-primary" size="sm" onClick={() => router.push("/extra/pricing-plan")}>
                                                                Upgrade Plan
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-5">
                                                    <Button
                                                        variant="danger"
                                                        className="px-4 py-2 fw-bold d-flex align-items-center gap-2"
                                                        onClick={handleLogout}
                                                    >
                                                        <i className="fa-solid fa-right-from-bracket"></i> Logout
                                                    </Button>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Fragment>
    );
};

export default ProfilePage;
