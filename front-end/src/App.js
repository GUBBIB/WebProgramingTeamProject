import React, { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch("http://210.110.171.12:32323/api/hello");
        if (!response.ok) {
          throw new Error("서버 응답 오류");
        }
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error("API 호출 실패:", error);
        setMessage("API 호출 실패");
      }
    };

    fetchMessage();
  }, []);

  return (
    <div>
      백엔드 응답: {message}<br />
      test
    </div>
  );
}

export default App;
