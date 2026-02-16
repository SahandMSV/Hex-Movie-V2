import styles from "./page.module.css";
import TopNav from "../components/TopNav/TopNav";
import Carousel from "../components/Carousel";

const makeItems = (prefix: string, count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    title: `${prefix} #${i + 1}`,
    subtitle: "Placeholder subtitle",
    badge: i % 3 === 0 ? "NEW" : i % 3 === 1 ? "HD" : "2026",
  }));

export default function Home() {
  return (
    <div className={styles.page}>
      <TopNav />
      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.intro}>
            <h1 className={styles.h1}>See What's trending</h1>
            <p className={styles.p}>
              The latest movies, shows, and personalized picks all in one place.
            </p>
          </div>
        </div>

        <div className={styles.rails}>
          <Carousel title="Latest releases" items={makeItems("Latest", 12)} />
          <Carousel title="Trending" items={makeItems("Trending", 12)} />
          <Carousel
            title="Recomendations for you"
            items={makeItems("Recommended", 12)}
          />
        </div>

        <div className={styles.footerSpace} />
      </main>
    </div>
  );
}
