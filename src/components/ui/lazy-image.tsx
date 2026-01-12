import { useState, useEffect, useRef } from "react";

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    placeholder?: string;
    width?: number;
    height?: number;
}

const LazyImage = ({
    src,
    alt,
    className = "",
    placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3C/svg%3E",
    width,
    height
}: LazyImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "100px" }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <img
            ref={imgRef}
            src={isInView ? src : placeholder}
            alt={alt}
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            className={`transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"} ${className}`}
            style={{ backgroundColor: isLoaded ? "transparent" : "#f3f4f6" }}
        />
    );
};

export default LazyImage;
