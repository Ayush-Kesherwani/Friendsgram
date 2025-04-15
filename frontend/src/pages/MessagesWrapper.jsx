import { useParams } from "react-router-dom";
import Messages from "./Messages";

const MessagesWrapper = () => {
  const { id } = useParams();
  return <Messages receiverId={id} />;
};

export default MessagesWrapper;
