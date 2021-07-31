import { Box, Heading } from "@chakra-ui/react";
import { withApollo } from "../../util/withApollo";
import { withUrqlClient } from "next-urql";
import React from "react";
import EditDeletePostButtons from "../../components/EditDeletePostButtons";
import Layout from "../../components/Layout";
import { createUrqlClient } from "../../util/createUrqlClient";
import { useGetPostFromUrl } from "../../util/useGetPostFromUrl";
import { useGetCommentsQuery } from "../../generated/graphql";

export const Post = ({}) => {
  const { data, error, loading } = useGetPostFromUrl();
  const {
    data: data2,
    error: error2,
    loading: loading2,
  } = useGetCommentsQuery();

  if (loading) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Heading mb={4}>{data.post.title}</Heading>
      <Box mb={4}>{data.post.text}</Box>
      <EditDeletePostButtons
        id={data.post.id}
        creatorId={data.post.creator.id}
      />
      <br />
      <Heading size="md" mb={4}>
        Comments
      </Heading>
      {error2 && (
        <>
          <div>Could not load comments</div>
          <div>{error2.message}</div>
        </>
      )}
      {data2 && !loading2 && data2.comments.length === 0 && (
        <Box>There are no comments yet</Box>
      )}
      {data2 &&
        !loading2 &&
        data2.comments.map((c) => (
          <Box>
            <b>Anonymous:</b>
            <p>{c.text}</p>
          </Box>
        ))}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post);
