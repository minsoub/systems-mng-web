// material-ui
import { useTheme } from '@mui/material/styles';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
    const theme = useTheme();

    return (
        /**
         * if you want to use image instead of svg uncomment following, and comment out <svg> element.
         *
         * <img src={logo} alt="Mantis" width="100" />
         *
         */
        <>
            <svg width="220" height="28" viewBox="0 0 220 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.0019 13.9028L24.516 12.6065C25.0944 11.1805 24.259 9.88424 23.1022 8.71757C22.7167 8.32868 22.1383 8.32868 21.7527 8.71757L19.118 11.375L17.0616 13.4491C16.6761 13.8379 16.6761 14.4213 17.0616 14.8102L19.118 16.8842L24.773 22.5879C25.1586 22.9768 25.737 22.9768 26.1225 22.5879L27.472 21.2268C27.8576 20.8379 27.8576 20.2546 27.472 19.8657L24.1947 15.7176C23.8734 15.1342 23.8734 14.4213 24.0019 13.9028V13.9028Z" fill="#3D74BA"/>
                <path d="M13.5273 3.79167L12.242 3.27315C10.8283 2.68982 9.54306 3.53241 8.38635 4.69907C8.00078 5.08796 8.00078 5.6713 8.38635 6.06019L11.0211 8.71759L13.0775 10.7917C13.463 11.1806 14.0414 11.1806 14.4269 10.7917L16.4833 8.71759L22.1384 3.01389C22.5239 2.625 22.5239 2.04167 22.1384 1.65278L20.7889 0.291667C20.4033 -0.0972222 19.8249 -0.0972222 19.4394 0.291667L15.3266 3.59722C14.8125 3.9213 14.1056 3.9213 13.5273 3.79167V3.79167Z" fill="#51C4CB"/>
                <path d="M3.75931 14.0972L3.24522 15.3935C2.66686 16.8194 3.50226 18.1157 4.65897 19.2824C5.04455 19.6713 5.6229 19.6713 6.00847 19.2824L8.6432 16.625L10.6996 14.5509C11.0851 14.162 11.0851 13.5787 10.6996 13.1898L8.6432 11.1157L2.98817 5.41203C2.6026 5.02314 2.02424 5.02314 1.63867 5.41203L0.289178 6.77314C-0.0963926 7.16203 -0.0963926 7.74536 0.289178 8.13425L3.56653 12.2824C3.88783 12.8657 3.88783 13.5787 3.75931 14.0972Z" fill="#E2197B"/>
                <path d="M14.2337 24.2083L15.519 24.7268C16.9327 25.3101 18.218 24.4676 19.3747 23.3009C19.7603 22.912 19.7603 22.3287 19.3747 21.9398L16.74 19.2824L14.6836 17.2083C14.298 16.8194 13.7197 16.8194 13.3341 17.2083L11.2777 19.2824L5.62267 24.9861C5.2371 25.375 5.2371 25.9583 5.62267 26.3472L6.97217 27.7083C7.35774 28.0972 7.9361 28.0972 8.32167 27.7083L12.4344 24.4027C12.9485 24.0787 13.6554 24.0787 14.2337 24.2083V24.2083Z" fill="#F99F1C"/>
                <path d="M38.4607 13.1899C36.1473 12.3473 35.0548 10.9862 35.0548 9.04173C35.0548 7.93988 35.4404 7.09729 36.3401 6.38432C37.1755 5.67136 38.2679 5.28247 39.4889 5.28247C40.9669 5.28247 42.702 5.80099 44.5656 6.90284L43.3446 9.17136C42.4449 8.65284 41.7381 8.32877 41.224 8.06951C40.7099 7.87506 40.1958 7.74543 39.8102 7.74543C39.1676 7.74543 38.7178 7.87506 38.4607 8.19914C38.2037 8.52321 38.0751 8.84729 38.0751 9.23617C38.0751 9.88432 38.4607 10.338 39.1033 10.6621L41.8023 11.764C43.923 12.6065 45.0154 13.9028 45.0154 15.7177C45.0154 16.9491 44.5656 17.9214 43.6016 18.6991C42.6377 19.4769 41.481 19.801 40.0672 19.801C39.2961 19.801 38.3964 19.6065 37.304 19.2177C36.2115 18.8288 35.1834 18.3751 34.2837 17.7917L35.5047 15.5232C37.3683 16.6899 38.9105 17.338 40.1315 17.338C40.7741 17.338 41.224 17.2084 41.481 16.8843C41.8023 16.5602 41.9308 16.1714 41.9308 15.7177C41.9308 14.9399 41.481 14.3565 40.5813 14.0325L38.4607 13.1899Z" fill="#231815"/>
                <path d="M59.2817 19.6065V11.7639L54.9761 16.301L50.6706 11.7639V19.6065H47.7788V5.08801L55.0404 12.6713L62.302 5.08801V19.6065H59.2817V19.6065Z" fill="#231815"/>
                <path d="M68.4712 16.5602L67.1217 19.6714H64.0371L70.9774 5.15283L77.8534 19.6714H74.7688L73.4193 16.5602H68.4712V16.5602ZM70.9774 10.7269L69.4351 14.2917H72.5197L70.9774 10.7269V10.7269Z" fill="#231815"/>
                <path d="M85.243 5.47693C86.6568 5.47693 87.8135 5.86582 88.8417 6.57878C89.8056 7.35656 90.1912 8.32878 90.1912 9.62508C90.1912 10.4677 89.9341 11.2454 89.42 11.9584C88.9059 12.6714 88.2633 13.1899 87.4922 13.514L90.5767 19.5417H87.3637L84.4076 13.7732H82.287V19.5417H79.4595V5.47693H85.243ZM82.4155 11.4399H85.3073C86.6568 11.4399 87.3637 10.8566 87.3637 9.68989C87.3637 9.10656 87.2351 8.65285 86.8496 8.3936C86.464 8.06952 86.0142 7.93989 85.243 7.93989H82.4155V11.4399V11.4399Z" fill="#231815"/>
                <path d="M98.6739 7.9399V19.6714H95.7821V7.9399H91.7979V5.54175H102.658V7.9399H98.6739V7.9399Z" fill="#231815"/>
                <path d="M110.37 16.5602L109.02 19.6714H105.936L112.876 5.15283L119.752 19.6714H116.667L115.318 16.5602H110.37ZM112.94 10.7269L111.398 14.2917H114.482L112.94 10.7269Z" fill="#231815"/>
                <path d="M126.949 5.47693C128.941 5.47693 130.612 6.12508 132.026 7.551C133.44 8.91211 134.147 10.5973 134.147 12.5417C134.147 14.4862 133.504 16.1714 132.09 17.5325C130.676 18.8936 129.006 19.6714 127.014 19.6714H121.551V5.54174L126.949 5.47693V5.47693ZM124.443 17.2084H127.014C128.17 17.2084 129.134 16.7547 129.97 15.8473C130.805 15.0047 131.191 13.838 131.191 12.4769C131.191 11.1158 130.805 10.014 129.97 9.10656C129.134 8.26397 128.17 7.74545 126.949 7.74545H124.379L124.443 17.2084Z" fill="#231815"/>
                <path d="M148.156 19.6065V11.7639L143.85 16.301L139.545 11.7639V19.6065H136.653V5.08801L143.914 12.6713L151.176 5.08801V19.6065H148.156V19.6065Z" fill="#231815"/>
                <path d="M154.26 19.6066V5.54175H157.216V19.6066H154.26Z" fill="#231815"/>
                <path d="M169.812 5.4769H172.704V19.9954L163.257 11.3102V19.6065H160.43V5.08801L169.876 13.7732V5.4769H169.812Z" fill="#231815"/>
                <path d="M193.336 8.40223C193.198 8.30939 192.968 8.21655 192.737 8.21655H191.955V9.65559H192.737C193.014 9.65559 193.198 9.56275 193.336 9.42349C193.428 9.28423 193.566 9.14496 193.566 8.91286C193.566 8.68076 193.474 8.49508 193.336 8.40223V8.40223Z" fill="#231815"/>
                <path d="M183.026 10.027H184.223L183.625 8.49512L183.026 10.027Z" fill="#231815"/>
                <path d="M205.026 5.15283H181.185C179.436 5.15283 178.102 6.59187 178.102 8.26301V11.0018C178.102 12.7658 179.528 14.112 181.185 14.112H205.026C206.683 14.112 208.063 12.7658 208.109 11.0018V8.26301C208.109 6.49903 206.683 5.15283 205.026 5.15283ZM185.051 11.9767L184.591 10.909H182.612L182.152 11.9767H181.093L183.118 7.24176H184.085L186.11 11.9767H185.051ZM190.16 11.9767H186.8V7.28818H187.813V11.0482H190.16V11.9767ZM194.486 9.6092C194.394 9.84131 194.256 9.98057 194.072 10.1198C193.888 10.2591 193.704 10.3984 193.474 10.3984C193.244 10.4912 193.013 10.4912 192.737 10.4912H191.955V11.8838H190.942V7.28818H192.829C193.106 7.28818 193.382 7.3346 193.612 7.38102C193.842 7.42744 194.026 7.5667 194.164 7.70596C194.302 7.84522 194.44 8.03091 194.532 8.21659C194.624 8.40227 194.624 8.63437 194.624 8.86648C194.624 9.145 194.578 9.3771 194.486 9.6092ZM199.273 11.9767H198.26V10.0734H196.373V11.9302H195.361V7.28818H196.373V9.145H198.26V7.28818H199.273V11.9767ZM204.013 11.9767L203.553 10.909H201.574L201.114 11.9767H200.055L202.08 7.24176H203.047L205.072 11.9767H204.013Z" fill="#231815"/>
                <path d="M201.942 10.027H203.139L202.541 8.49512L201.942 10.027Z" fill="#231815"/>
                <defs>
                    <linearGradient
                        id="paint0_linear_556_1508"
                        x1="31.9887"
                        y1="20.6577"
                        x2="26.4967"
                        y2="13.6349"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#D1350F" stopOpacity="0.01" />
                        <stop offset="1" stopColor="#D1350F" />
                    </linearGradient>
                </defs>
            </svg>
        </>
    );
};

export default Logo;
