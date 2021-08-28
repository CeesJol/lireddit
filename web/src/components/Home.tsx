import { Box, Button, Flex, Link, Select, Stack } from "@chakra-ui/react";
import React from "react";
import { Layout } from "../components/Layout";
import PostComponent from "../components/PostComponent";
import { usePostsQuery } from "../generated/graphql";
import { changeSort } from "../util/changeSort";
import NextLink from "next/link";
import { useRouter } from "next/router";

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

const Home: React.FC<HomeProps> = ({ sort }) => {
  const router = useRouter();
  const subredditTitle: string | undefined = router.query.title as never;

  let variablesOptions: VariablesOptions = {};
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
      {/* <NextLink href={`${router.asPath}/create-post`}>
        <Button as={Link} mr={4}>
          create post
        </Button>
      </NextLink> */}
      {subredditTitle && (
        <NextLink
          href="/r/[title]/create-post"
          as={`/r/${subredditTitle}/create-post`}
        >
          <Button as={Link} mr={4}>
            create post
          </Button>
        </NextLink>
      )}
      <Box>
        Sort by:
        <Select
          placeholder="Select option"
          w={100}
          onChange={(event) => changeSort(event, subredditTitle)}
          value={sort}
          mb={4}
        >
          <option value="new">New</option>
          <option value="top">Top</option>
        </Select>
      </Box>
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
