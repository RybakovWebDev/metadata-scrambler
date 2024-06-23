import styles from "./Hero.module.css";

function Hero() {
  return (
    <section className={styles.wrapper}>
      <h2>Do you care about your privacy?</h2>
      <p>
        This website allows you to remove or randomize any metadata for the file that you upload, helping you stay
        anonymous.
      </p>
    </section>
  );
}

export default Hero;
