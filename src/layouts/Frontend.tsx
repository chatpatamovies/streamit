import React, { use, useEffect, useState } from "react";

//router
import Link from "next/link";

// header
import HeaderDefault from "../components/partials/HeaderDefault";

// footer
import FooterDefault from "../components/partials/FooterDefault";

//breadcrumb
import BreadCrumbWidget from "@/components/BreadcrumbWidget";

//seetingoffCanvas
// import SettingOffCanvas from "../components/setting/SettingOffCanvas";
import pb from "@/lib/pocketbase";
// import { useRouter } from "next/navigation";
import { useRouter } from "next/router";

const Frontend = (({ children }: any) => {

  const router = useRouter();
  const [animationClass, setAnimationClass] = useState("animate__fadeIn");

  // Check if we are on an episode page (streaming page)
  const isEpisodePage = router.pathname.includes("/episode/");

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
      <main className={`main-content ${isEpisodePage ? 'p-0' : ''}`} style={isEpisodePage ? { paddingTop: '0', marginTop: '0' } : {}}>
        {!isEpisodePage && <BreadCrumbWidget />}
        {!isEpisodePage && (
          <HeaderDefault profile={
            {
              name: pb.authStore.record?.name,
              avatar: pb.authStore.record?.avatar,
              uid: pb.authStore.record?.id || "",
              collectionId: pb.authStore.record?.collectionId || ""
            }
          }
            onLogout={() => {
              pb.authStore.clear();
              router.push("/");
            }
            }
          />
        )}

        {children}
      </main>
      {!isEpisodePage && <FooterDefault />}
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
      {/* <SettingOffCanvas /> */}
    </>
  )
})

export default Frontend