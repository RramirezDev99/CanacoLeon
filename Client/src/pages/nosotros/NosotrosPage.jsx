import React from "react";
import AboutBanner from "../../components/AboutBanner";
import MisionVision from "../../components/MisionVision";
import PresidenteBanner from "../../components/PresidenteBanner";
import DirectorySection from "../../components/DirectorioSection";
import "./NosotrosPage.css";

const NosotrosPage = () => {
  return (
    <div className="nosotros-page-wrapper">
      <AboutBanner />
      <MisionVision />
      <PresidenteBanner />
      <DirectorySection />
    </div>
  );
};

export default NosotrosPage;
