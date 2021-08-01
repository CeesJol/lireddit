import { Box, Heading, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../components/Layout";
import PostComponent from "../../components/PostComponent";
import { useMeQuery, usePostsFromUserQuery } from "../../generated/graphql";
import { withApollo } from "../../util/withApollo";

export const User = ({}) => {
  const router = useRouter();
  const { id } = router.query;

  const { data: meData } = useMeQuery();
  const { data, error, loading } = usePostsFromUserQuery({
    variables: {
      userId: parseInt(id as string) as never,
    },
  });

  if (!loading && !data) {
    return (
      <div>
        <div>you got query failed for some reason</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  return (
    <Layout>
      <Box mb={4}>
        <Heading>
          Posts by<b> {meData?.me?.username}</b>
        </Heading>
      </Box>
      <Box>
        {!data && loading ? (
          <div>loading...</div>
        ) : (
          <Stack spacing={8}>
            {data!.postsFromUser.map((p) =>
              !p ? null : <PostComponent p={p} key={p.id} />
            )}
          </Stack>
        )}
      </Box>
    </Layout>
  );
};

export default withApollo({ ssr: true })(User);
