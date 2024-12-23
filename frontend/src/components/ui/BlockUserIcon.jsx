import PropTypes from "prop-types";
import { Block, Unblock } from "lucide-react";
import { useBlockFriend } from "@/stores/useBlockFriend";

const BlockUserIcon = ({ userId, isBlocked }) => {
  const { blockUser, unblockUser } = useBlockFriend();

  const handleBlock = async () => {
    await blockUser(userId);
  };

  const handleUnblock = async () => {
    await unblockUser(userId);
  };

  return (
    <div onClick={isBlocked ? handleUnblock : handleBlock} className="w-fit">
      {isBlocked ? <Unblock size={16} /> : <Block size={16} />}
    </div>
  );
};

BlockUserIcon.propTypes = {
  userId: PropTypes.string.isRequired,
  isBlocked: PropTypes.bool.isRequired,
};

export default BlockUserIcon;