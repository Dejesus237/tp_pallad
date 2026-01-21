type IconWarningProps = {
    colorCss: string;
}

export default function IconWarning( colorCss: IconWarningProps ) {
    return (
        <svg
            className={`${colorCss} w-6 aspect-square`}
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g
                id="SVGRepo_bgCarrier"
                strokeWidth="0" />
            <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round" />
            <g
                id="SVGRepo_iconCarrier">
                <circle
                    cx="12"
                    cy="17"
                    r="1"
                    fill="currentColor" />
                <path
                    d="M12 10L12 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round" />
                <path
                    d="M3.44722 18.1056L10.2111 4.57771C10.9482 3.10361 13.0518 3.10362 13.7889 4.57771L20.5528 18.1056C21.2177 19.4354 20.2507 21 18.7639 21H5.23607C3.7493 21 2.78231 19.4354 3.44722 18.1056Z"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round" />
            </g>
        </svg>
    )
}
