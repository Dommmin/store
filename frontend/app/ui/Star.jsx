import {StarIcon} from '@heroicons/react/24/outline';

export default function Star({ onRate, full, onHoverIn, onHoverOut, color, size }) {
    const starStyle = {
        width: `${size}px`,
        height: `${size}px`,
        display: 'block',
        cursor: 'pointer',
    };

    return (
        <span role="button" style={starStyle} onClick={onRate} onMouseEnter={onHoverIn} onMouseLeave={onHoverOut}>
            {full ? (
                <StarIcon fill={color} stroke={color} />
            ) : (
                <StarIcon stroke={color} />
            )}
        </span>
    );
}
