import { Flex, Box, Link, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { PostSnippetFragment } from "../generated/graphql";
import EditDeletePostButtons from "./EditDeletePostButtons";
import UpdootSection from "./UpdootSection";
import NextLink from "next/link";

interface PostComponentProps {
  p: PostSnippetFragment;
  subredditTitle?: string | undefined;
}

export const PostComponent: React.FC<PostComponentProps> = ({
  p,
  subredditTitle,
}) => {
  return (
    <Flex p={5} shadow="md" borderWidth="1px">
      <UpdootSection post={p} />
      <Box flex={1}>
        <NextLink href="/post/[id]" as={`/post/${p.id}`}>
          <Link>
            <Heading fontSize="xl">{p.title}</Heading>
          </Link>
        </NextLink>
        <Text>
          posted by{" "}
          <NextLink href="/user/[id]" as={`/user/${p.creator.id}`}>
            <Link>{p.creator.username}</Link>
          </NextLink>
          {!subredditTitle && (
            <>
              {" "}
              in{" "}
              <NextLink href="/r/[title]" as={`/r/${p.subredditTitle}`}>
                <Link>{`r/${p.subredditTitle}`}</Link>
              </NextLink>
            </>
          )}
        </Text>
        <Flex align="center">
          <Text flex={1} mt={4}>
            {p.textSnippet}
          </Text>
          <Box ml="auto">
            <EditDeletePostButtons id={p.id} creatorId={p.creator.id} />
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default PostComponent;
