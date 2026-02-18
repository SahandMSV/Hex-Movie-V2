"use client";

import { useMemo, useRef } from "react";
import styles from "./Carousel.module.css";
import Button from "../ui/Button";
import Icon from "../Icon/Icon";

type CarouselItem = {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
};

export default function Carousel({
  title,
  items,
}: {
  title: string;
  items: CarouselItem[];
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const gradientClasses = useMemo(
    () => [styles.g1, styles.g2, styles.g3, styles.g4, styles.g5],
    [],
  );

  const scrollByAmount = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({
      left: Math.round(el.clientWidth * 0.6) * dir,
      behavior: "smooth",
    });
  };

  return (
    <section className={styles.section}>
      <div className={styles.topRow}>
        <h2 className={styles.h2}>{title}</h2>

        <div className={styles.controls}>
          <Button
            className={styles.ctrlBtn}
            onClick={() => scrollByAmount(-1)}
            aria-label="Scroll left"
            type="button"
          >
            <Icon name="arrow-left" className={styles.ctrlIcon} />
          </Button>

          <Button
            className={styles.ctrlBtn}
            onClick={() => scrollByAmount(1)}
            aria-label="Scroll right"
            type="button"
          >
            <Icon name="arrow-right" className={styles.ctrlIcon} />
          </Button>
        </div>
      </div>

      <div ref={scrollerRef} className={styles.scroller}>
        {items.map((item, i) => (
          <article key={item.id} className={styles.card}>
            <div
              className={`${styles.thumb} ${gradientClasses[i % gradientClasses.length]}`}
            >
              {item.badge ? (
                <span className={styles.badge}>{item.badge}</span>
              ) : null}
            </div>

            <div className={styles.meta}>
              <p className={styles.title}>{item.title}</p>
              {item.subtitle ? (
                <p className={styles.sub}>{item.subtitle}</p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
