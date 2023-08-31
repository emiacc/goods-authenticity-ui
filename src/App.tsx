import Header from "./Header";
import OwnerWrapper from "./owner/OwnerWrapper";
import GoodViewWrapper from "./public/GoodViewWrapper";

function App() {
  let goodId: string | null = null;
  let chainId: string | null = null;
  let nonce: string | null = null;
  const searchParams = new URLSearchParams(location.search);

  if (Array.from(searchParams.values()).length) {
    if (
      searchParams.has("goodId") &&
      searchParams.has("chainId") &&
      searchParams.has("nonce")
    ) {
      goodId = searchParams.get("goodId");
      chainId = searchParams.get("chainId");
      nonce = searchParams.get("nonce");
    }

    if (!goodId || !chainId || !nonce) {
      history.replaceState({}, document.title, location.pathname);
    }
  }

  return (
    <>
      <Header />
      {goodId && chainId && nonce ? (
        <GoodViewWrapper {...{ goodId, chainId, nonce }} />
      ) : (
        <OwnerWrapper />
      )}
    </>
  );
}

export default App;
