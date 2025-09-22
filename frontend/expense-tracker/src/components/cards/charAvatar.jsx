import { getInitials } from "../../utils/helper";

const CharAvatar = ({ fullName, width, height, style }) => {
  return (
    <div
      className={`${width || "w-12"} ${height || "h-12"} ${
        style || ""
      } flex items-center justify-center rounded-full text-stone-900 font-medium bg-stone-100`}
    >
      {getInitials(fullName || "")}
    </div>
  );
};

export default CharAvatar;
