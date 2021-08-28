import { useRouter } from "next/router";
import React from "react";
import Home from "../../components/Home";
import { withApollo } from "../../util/withApollo";

const Index = () => {
  const router = useRouter();
  const title: string | undefined = router.query.title as never;
  return <Home sort="new" subredditTitle={title} />;
};

export default withApollo({ ssr: true })(Index);
