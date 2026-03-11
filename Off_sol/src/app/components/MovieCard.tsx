import React from 'react';

interface CardProps {
    image: string;
    title: string;
    description?: string;
    onCardClick: () => void;
    className?: string;
    'data-item-id'?: string;
}

export default function MovieCard({ image, title, description, onCardClick, className, 'data-item-id': dataItemId }: CardProps) {
    return (
        <div
            className={`relative w-full aspect-[162/229] rounded-lg overflow-hidden group cursor-pointer ${className || ''}`}
            onClick={onCardClick}
            data-item-id={dataItemId}
        >
            <img
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
                src={image}
                loading="lazy"
                onError={(e) => {
                    console.error("Failed to load image:", image);
                    e.currentTarget.style.backgroundColor = "#333";
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#121212] opacity-100"></div>
            <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                <p className="font-['SF_Pro_Display',sans-serif] font-bold text-white text-sm leading-tight">
                    {title}
                </p>
            </div>
        </div>
    );
}
