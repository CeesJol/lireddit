import { Button, Flex, Select, Stack } from "@chakra-ui/react";
import React from "react";
import { Layout } from "../components/Layout";
import PostComponent from "../components/PostComponent";
import { usePostsQuery } from "../generated/graphql";
import { changeSort } from "../util/changeSort";

interface HomeProps {
  sort: "top" | "new";
  subredditTitle?: string;
}

interface SortSpecificVariablesOptions {
  offset?: number;
  cursor?: string;
}

interface VariablesOptions {
  subredditTitle?: string;
}

const Home: React.FC<HomeProps> = ({ sort, subredditTitle }) => {
  let variablesOptions: VariablesOptions = {};
  console.log("subredditTitle:", subredditTitle);
  if (subredditTitle) {
    variablesOptions["subredditTitle"] = subredditTitle;
  }
  let { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 15,
      sort: sort,
      cursor: null,
      ...variablesOptions,
    },
    notifyOnNetworkStatusChange: true,
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
      Sort by:
      <Select
        placeholder="Select option"
        w={100}
        onChange={(event) => changeSort(event)}
        value={sort}
        mb={4}
      >
        <option value="new">New</option>
        <option value="top">Top</option>
      </Select>
      {!data && loading ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((p) =>
            !p ? null : <PostComponent p={p} key={p.id} />
          )}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              let sortSpecificVariables: SortSpecificVariablesOptions = {};
              if (sort === "top") {
                sortSpecificVariables.offset = data!.posts.offset + 15;
              } else {
                sortSpecificVariables.cursor =
                  data!.posts.posts[data!.posts.posts.length - 1].createdAt;
              }
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  sort: sort,
                  ...sortSpecificVariables,
                },
              });
            }}
            isLoading={loading}
            m="auto"
            my={8}
          >
            load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default Home;
