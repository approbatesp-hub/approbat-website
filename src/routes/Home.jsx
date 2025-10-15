import React from "react";
import Banner from "../components/Acceuil/Banner";
import Partners from "../components/Acceuil/Partners";
import Categories from "../components/Acceuil/Categories";
import WhyWorkingWithUs from "../components/Acceuil/WhyWorkingWithUs";
import FAQ from "../components/Acceuil/FAQ";

const Home = () => {
  return (
    <div>
      <Banner />
      <Partners />
      <Categories />
      <WhyWorkingWithUs />
      <FAQ />
    </div>
  );
};

export default Home;
