import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { dates } from "../../data/dates";
import "swiper/swiper-bundle.css";
import "./MainPage.scss";

export const MainPage = () => {
    const totalEvents = dates.length;
    const dotAngle = 360 / totalEvents;
    const defaultRotationTime = 300;
    const sliderContainerRef = useRef<HTMLDivElement>(null);
    const centralCircleRef = useRef<HTMLDivElement>(null);
    const startYearRef = useRef<HTMLDivElement>(null);
    const endYearRef = useRef<HTMLDivElement>(null);
    const [rotationAngle, setRotationAngle] = useState<number>(dotAngle);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [rotationDuration, setRotationDuration] =
        useState<number>(defaultRotationTime);
    const [startYear, setStartYear] = useState<number>(
        Number(dates[0].events[0].date)
    );
    const [endYear, setEndYear] = useState<number>(
        Number(dates[0].events[dates.length - 1].date)
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            sliderContainerRef.current?.classList.add("slider_show");
            clearTimeout(timer);
        }, 300);
    }, [currentIndex]);

    const formatTotal = (total: number, current: number): string => {
        return `${String(current + 1).padStart(2, "0")}/${String(
            total
        ).padStart(2, "0")}`;
    };

    const fadeOutAndExecute = (callback: VoidFunction): void => {
        sliderContainerRef.current?.classList.remove("slider_show");
        const timer = setTimeout(() => {
            callback();
            clearTimeout(timer);
        }, 300);
    };

    const loadPreviousEvent = (): void => {
        loadEvent(currentIndex - 1);
    };

    const loadNextEvent = (): void => {
        loadEvent(currentIndex + 1);
    };

    const animateDateRange = (index: number): void => {
        const newStartYear = Number(dates[index].events[0].date);
        const startYearDifference = newStartYear - startYear;
        const newEndYear = Number(dates[index].events[dates.length - 1].date);
        const endYearDifference = newEndYear - endYear;
        const animationDuration = (rotationDuration + 300) / 1000;

        gsap.to(startYearRef.current, {
            duration: animationDuration,
            textContent: `+=${startYearDifference}`,
            roundProps: "textContent",
            ease: "none",
            onUpdate: () => setStartYear(newStartYear),
        });
        gsap.to(endYearRef.current, {
            duration: animationDuration,
            textContent: `+=${endYearDifference}`,
            roundProps: "textContent",
            ease: "none",
            onUpdate: () => setEndYear(newEndYear),
        });
    };

    const loadEvent = (index: number): void => {
        if (currentIndex === index || loading) return;

        setLoading(true);
        animateDateRange(index);

        centralCircleRef.current?.children[index].classList.add(
            "spinner__shoulder_active"
        );

        const newRotationAngle = dotAngle - index * dotAngle;
        setRotationDuration(
            Math.abs(currentIndex - index) * defaultRotationTime
        );
        const timer = setTimeout(() => {
            setRotationAngle(newRotationAngle);
            setLoading(false);
            clearTimeout(timer);
        }, 300);

        fadeOutAndExecute(() => setCurrentIndex(index));
    };

    return (
        <main className="main">
            <section className="historic-dates">
                <h1 className="historic-dates__heading">Исторические даты</h1>
                <div className="historic-dates__range range">
                    <p className="range_start" ref={startYearRef}>
                        {startYear}
                    </p>
                    <p className="range_end" ref={endYearRef}>
                        {endYear}
                    </p>
                </div>
                <div className="historic-dates__spinner spinner">
                    <div
                        ref={centralCircleRef}
                        className="spinner__main-circle"
                        style={
                            {
                                "--count": totalEvents,
                                "--angle": rotationAngle + "deg",
                                "--time": rotationDuration + "ms",
                                "--delay": rotationDuration + 300 + "ms",
                            } as React.CSSProperties
                        }
                    >
                        {dates.map((item, index) => {
                            const { title } = item;
                            const idx = index + 1;
                            return (
                                <div
                                    key={index}
                                    className={
                                        "spinner__shoulder " +
                                        (currentIndex === index
                                            ? "spinner__shoulder_active"
                                            : "")
                                    }
                                    style={
                                        { "--i": idx } as React.CSSProperties
                                    }
                                    onClick={() => loadEvent(index)}
                                >
                                    <div className="spinner__circle-area">
                                        <p className="spinner__circle">
                                            {idx}
                                            <span className="spinner__title">
                                                {title}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="historic-dates__navigation navigation">
                    <p className="navigation__total">
                        {formatTotal(totalEvents, currentIndex)}
                    </p>
                    <div className="navigation__buttons control-buttons">
                        <button
                            className="control-buttons__default control-buttons__prev"
                            onClick={loadPreviousEvent}
                            disabled={currentIndex === 0}
                        />
                        <button
                            className="control-buttons__default control-buttons__next"
                            onClick={loadNextEvent}
                            disabled={currentIndex === totalEvents - 1}
                        />
                    </div>
                </div>
                <div
                    ref={sliderContainerRef}
                    className="historic-dates__slider slider"
                >
                    <p className="slider__mobile-title">
                        {dates[currentIndex].title}
                    </p>
                    <button className="slider__btn slider__btn_prev"></button>
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={80}
                        slidesPerView={4}
                        breakpoints={{
                            320: { slidesPerView: 1.5, spaceBetween: 25 },
                            769: { slidesPerView: 3, spaceBetween: 80 },
                            1025: { slidesPerView: 4, spaceBetween: 80 },
                        }}
                        navigation={{
                            prevEl: ".slider__btn_prev",
                            nextEl: ".slider__btn_next",
                        }}
                        pagination={{ clickable: true }}
                    >
                        {dates[currentIndex].events.map((item, index) => {
                            const { date, description } = item;
                            return (
                                <SwiperSlide
                                    key={index}
                                    className="slider__slide"
                                >
                                    <p className="slider__year">{date}</p>
                                    <p className="slider__description">
                                        {description}
                                    </p>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                    <button className="slider__btn slider__btn_next"></button>
                </div>
                <div className="events__control-buttons">
                    {dates.map((_, index) => (
                        <button
                            className={
                                "events__button " +
                                (currentIndex === index
                                    ? "events__button_active"
                                    : "")
                            }
                            key={index}
                            onClick={() => loadEvent(index)}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
};
