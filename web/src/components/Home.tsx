import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Select,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import { Layout } from "../components/Layout";
import PostComponent from "../components/PostComponent";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import { changeSort } from "../util/changeSort";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { isServer } from "../util/isServer";
// import Image from "next/image";
import { Image } from "@chakra-ui/react";
import { Wrapper } from "./Wrapper";

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

  const { data: meData } = useMeQuery({ skip: isServer() });

  return (
    <Layout>
      {data && !loading && subredditTitle && (
        <Image
          src={`/subreddit_pic/${subredditTitle}.png`}
          alt={`r/${subredditTitle} header image`}
          width="100%"
          height="180px"
        />
      )}
      <Wrapper>
        <Box mb={4}>
          <Heading>
            <b>{subredditTitle ? `r/${subredditTitle}` : "Posts"}</b>
          </Heading>
        </Box>
        {data && (
          <Flex align="center" mb={4}>
            <Box mr={4}>Sort by:</Box>
            <Box>
              <Select
                placeholder="Select option"
                w={100}
                onChange={(event) => changeSort(event, subredditTitle)}
                value={sort}
                mr={4}
              >
                <option value="new">New</option>
                <option value="top">Top</option>
              </Select>
            </Box>
            {subredditTitle && meData?.me?.id && (
              <NextLink
                href="/r/[title]/create-post"
                as={`/r/${subredditTitle}/create-post`}
              >
                <Button as={Link}>create post</Button>
              </NextLink>
            )}
          </Flex>
        )}
        {!data && loading ? (
          <div>loading...</div>
        ) : !loading && !data ? (
          <div>
            <div>{error?.message}</div>
          </div>
        ) : (
          <Stack spacing={8}>
            {data!.posts.posts.map((p) =>
              !p ? null : (
                <PostComponent
                  p={p}
                  subredditTitle={subredditTitle}
                  key={p.id}
                />
              )
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
      </Wrapper>
    </Layout>
  );
};

export default Home;
