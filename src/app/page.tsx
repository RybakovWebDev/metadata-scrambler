import Hero from "@/components/Hero";
import styles from "./page.module.css";

import Header from "@/components/Header";
import UploadArea from "@/components/UploadArea";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        <Header />
        <Hero />
        <UploadArea />
      </div>
      <Footer />
    </main>
  );
}
