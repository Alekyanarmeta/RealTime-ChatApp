import { Route, Routes } from "react-router-dom";
import Chat from "./component/chatpage";
import Homepage from "./component/homepage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />}></Route>
      <Route path="/chat" element={<Chat />}></Route>
    </Routes>
  );
}

export default App;
