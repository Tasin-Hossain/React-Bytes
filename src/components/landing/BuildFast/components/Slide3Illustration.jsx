import {
  FiBox,
  FiCode,
  FiGrid,
  FiHeart,
  FiImage,
  FiLayout,
  FiPackage,
  FiRefreshCw,
  FiSliders,
  FiStar,
  FiType,
  FiZap,
} from "react-icons/fi";

const ICON_WRAPPER =
  "absolute w-13 h-13 rounded-full bg-(--bg-button) border border-(--border-button) flex items-center justify-center text-(--text-muted)";

function OrbitIcon({
  Icon,
  className = "",
  style = {},
  iconClass = "",
}) {
  return (
    <div className={`${ICON_WRAPPER} ${className}`} style={style}>
      <Icon size={15} className={iconClass} />
    </div>
  );
}

export function Slide3Illustration({ animKey }) {
  return (
    <div
      key={animKey}
      className="illus-enter relative flex items-center justify-center h-50 md:h-full w-full overflow-hidden"
    >
      <div className="relative w-55 h-55">

        {/* Inner Ring */}
        <div className="absolute top-1/2 left-1/2 w-35 h-35 -mt-17.5 -ml-17.5 rounded-full border border-(--border-secondary) s3-spin-cw">

          <OrbitIcon
            Icon={FiCode}
            className="-top-5.25 left-[calc(50%-21px)] bg-(--bg-button) border-(--border-button)"
            iconClass="s3-icon-ccw-20"
          />

          <OrbitIcon
            Icon={FiStar}
            className="-right-5.25"
            style={{ top: "calc(50% - 21px)" }}
            iconClass="s3-icon-ccw-20"
          />

          <OrbitIcon
            Icon={FiZap}
            className="-bottom-5.25 left-[calc(50%-21px)]"
            iconClass="s3-icon-ccw-20"
          />

          <OrbitIcon
            Icon={FiSliders}
            className="-left-5.25"
            style={{ top: "calc(50% - 21px)" }}
            iconClass="s3-icon-ccw-20"
          />
        </div>

        {/* Outer Ring */}
        <div className="absolute top-1/2 left-1/2 w-65 h-65 -mt-32.5 -ml-32.5 rounded-full border border-(--border-secondary) s3-spin-ccw">

          <OrbitIcon
            Icon={FiBox}
            className="-top-5.25 left-[calc(50%-21px)]"
            iconClass="s3-icon-cw-30"
          />

          <OrbitIcon
            Icon={FiLayout}
            style={{
              top: "calc(14.65% - 21px)",
              left: "calc(85.35% - 21px)",
            }}
            iconClass="s3-icon-cw-30"
          />

          <OrbitIcon
            Icon={FiRefreshCw}
            className="-right-5.25"
            style={{ top: "calc(50% - 21px)" }}
            iconClass="s3-icon-cw-30"
          />

          <OrbitIcon
            Icon={FiGrid}
            style={{
              top: "calc(85.35% - 21px)",
              left: "calc(85.35% - 21px)",
            }}
            iconClass="s3-icon-cw-30"
          />

          <OrbitIcon
            Icon={FiImage}
            className="-left-5.25"
            style={{ top: "calc(50% - 21px)" }}
            iconClass="s3-icon-cw-30"
          />

          <OrbitIcon
            Icon={FiPackage}
            style={{
              top: "calc(14.65% - 21px)",
              left: "calc(14.65% - 21px)",
            }}
            iconClass="s3-icon-cw-30"
          />

          <OrbitIcon
            Icon={FiHeart}
            style={{
              top: "calc(85.35% - 21px)",
              left: "calc(14.65% - 21px)",
            }}
            iconClass="s3-icon-cw-30"
          />

          <OrbitIcon
            Icon={FiType}
            style={{
              top: "calc(100% - 21px)",
              left: "calc(50% - 21px)",
            }}
            iconClass="s3-icon-cw-30"
          />
        </div>

      </div>
    </div>
  );
}