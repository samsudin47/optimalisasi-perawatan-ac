export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 316 316"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                cx="158"
                cy="158"
                r="150"
                fill="#f0f8ff"
                stroke="#2563eb"
                strokeWidth="8"
            />

            <rect
                x="70"
                y="90"
                width="176"
                height="80"
                rx="8"
                fill="#ffffff"
                stroke="#1e40af"
                strokeWidth="3"
            />

            <rect
                x="85"
                y="105"
                width="60"
                height="25"
                rx="3"
                fill="#0f172a"
                stroke="#1e40af"
                strokeWidth="1"
            />
            <text
                x="115"
                y="122"
                textAnchor="middle"
                fill="#22d3ee"
                fontFamily="Arial, sans-serif"
                fontSize="10"
                fontWeight="bold"
            >
                AUTO
            </text>

            <circle
                cx="175"
                cy="117"
                r="8"
                fill="#22d3ee"
                stroke="#1e40af"
                strokeWidth="2"
            />
            <circle
                cx="200"
                cy="117"
                r="8"
                fill="#22d3ee"
                stroke="#1e40af"
                strokeWidth="2"
            />
            <circle
                cx="225"
                cy="117"
                r="8"
                fill="#22d3ee"
                stroke="#1e40af"
                strokeWidth="2"
            />

            <g stroke="#1e40af" strokeWidth="2" fill="none">
                <line x1="80" y1="145" x2="236" y2="145" />
                <line x1="80" y1="155" x2="236" y2="155" />
                <line x1="80" y1="165" x2="236" y2="165" />
            </g>

            <g stroke="#22d3ee" strokeWidth="2" fill="none" opacity="0.7">
                <path
                    d="M80 180 Q100 190 120 180 T160 180"
                    strokeDasharray="5,5"
                >
                    <animate
                        attributeName="stroke-dashoffset"
                        values="0;10"
                        dur="2s"
                        repeatCount="indefinite"
                    />
                </path>
                <path
                    d="M100 195 Q120 205 140 195 T180 195"
                    strokeDasharray="5,5"
                >
                    <animate
                        attributeName="stroke-dashoffset"
                        values="0;10"
                        dur="2.5s"
                        repeatCount="indefinite"
                    />
                </path>
                <path
                    d="M120 210 Q140 220 160 210 T200 210"
                    strokeDasharray="5,5"
                >
                    <animate
                        attributeName="stroke-dashoffset"
                        values="0;10"
                        dur="3s"
                        repeatCount="indefinite"
                    />
                </path>
            </g>

            <rect
                x="200"
                y="190"
                width="50"
                height="45"
                rx="4"
                fill="#ffffff"
                stroke="#1e40af"
                strokeWidth="2"
            />
            <rect
                x="200"
                y="190"
                width="50"
                height="12"
                rx="4"
                fill="#1e40af"
            />
            <circle cx="210" cy="185" r="2" fill="#1e40af" />
            <circle cx="240" cy="185" r="2" fill="#1e40af" />

            <g stroke="#1e40af" strokeWidth="1" fill="none">
                <line x1="210" y1="205" x2="240" y2="205" />
                <line x1="210" y1="215" x2="240" y2="215" />
                <line x1="210" y1="225" x2="240" y2="225" />
                <line x1="220" y1="202" x2="220" y2="235" />
                <line x1="230" y1="202" x2="230" y2="235" />
            </g>

            <circle cx="215" cy="210" r="1.5" fill="#22d3ee" />
            <circle cx="225" cy="220" r="1.5" fill="#22d3ee" />
            <circle cx="235" cy="230" r="1.5" fill="#22d3ee" />

            <g transform="translate(80,200)">
                <circle
                    cx="15"
                    cy="15"
                    r="12"
                    fill="#ffffff"
                    stroke="#1e40af"
                    strokeWidth="2"
                />
                <circle
                    cx="15"
                    cy="15"
                    r="6"
                    fill="none"
                    stroke="#1e40af"
                    strokeWidth="2"
                />
                <g stroke="#1e40af" strokeWidth="2" fill="#1e40af">
                    <rect x="13" y="2" width="4" height="6" rx="2" />
                    <rect x="13" y="22" width="4" height="6" rx="2" />
                    <rect x="2" y="13" width="6" height="4" rx="2" />
                    <rect x="22" y="13" width="6" height="4" rx="2" />
                    <rect
                        x="6"
                        y="6"
                        width="4"
                        height="4"
                        rx="2"
                        transform="rotate(45 8 8)"
                    />
                    <rect
                        x="20"
                        y="6"
                        width="4"
                        height="4"
                        rx="2"
                        transform="rotate(45 22 8)"
                    />
                    <rect
                        x="6"
                        y="20"
                        width="4"
                        height="4"
                        rx="2"
                        transform="rotate(45 8 22)"
                    />
                    <rect
                        x="20"
                        y="20"
                        width="4"
                        height="4"
                        rx="2"
                        transform="rotate(45 22 22)"
                    />
                </g>
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="0 95 215;360 95 215"
                    dur="8s"
                    repeatCount="indefinite"
                />
            </g>

            <g stroke="#22d3ee" strokeWidth="2" fill="none" opacity="0.6">
                <path d="M130 250 L140 245 L150 255 L160 240 L170 250 L180 235" />
                <circle cx="130" cy="250" r="2" fill="#22d3ee" />
                <circle cx="140" cy="245" r="2" fill="#22d3ee" />
                <circle cx="150" cy="255" r="2" fill="#22d3ee" />
                <circle cx="160" cy="240" r="2" fill="#22d3ee" />
                <circle cx="170" cy="250" r="2" fill="#22d3ee" />
                <circle cx="180" cy="235" r="2" fill="#22d3ee" />
            </g>

            <g opacity="0.4">
                <circle cx="280" cy="120" r="3" fill="#ef4444" />
                <circle cx="285" cy="125" r="2" fill="#ef4444" />
                <circle cx="275" cy="128" r="2" fill="#ef4444" />

                <circle cx="265" cy="140" r="3" fill="#22c55e" />
                <circle cx="270" cy="145" r="2" fill="#22c55e" />
                <circle cx="260" cy="148" r="2" fill="#22c55e" />

                <circle cx="285" cy="160" r="3" fill="#f59e0b" />
                <circle cx="290" cy="165" r="2" fill="#f59e0b" />
                <circle cx="280" cy="168" r="2" fill="#f59e0b" />
            </g>

            <rect x="138" y="45" width="40" height="30" rx="4" fill="#1e40af" />
            <text
                x="158"
                y="62"
                textAnchor="middle"
                fill="#ffffff"
                fontFamily="Arial, sans-serif"
                fontSize="12"
                fontWeight="bold"
            >
                AC
            </text>
        </svg>
    );
}
