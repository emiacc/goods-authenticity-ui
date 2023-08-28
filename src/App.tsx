import Header from "./Header";
import OwnerWrapper from "./owner/OwnerWrapper";
import GoodViewWrapper from "./public/GoodViewWrapper";

function App() {
  let goodId: string | null = null;
  let chainId: string | null = null;
  const searchParams = new URLSearchParams(location.search);

  if (searchParams.size) {
    if (searchParams.has("goodId") && searchParams.has("chainId")) {
      goodId = searchParams.get("goodId");
      chainId = searchParams.get("chainId");
    }

    if (!goodId || !chainId) {
      history.replaceState({}, document.title, location.pathname);
    }
  }

  return (
    <>
      <Header />
      {goodId && chainId ? (
        <GoodViewWrapper {...{ goodId, chainId }} />
      ) : (
        <OwnerWrapper />
      )}
    </>
  );
}

export default App;
