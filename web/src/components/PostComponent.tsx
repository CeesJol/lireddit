import { Flex, Box, Link, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { PostSnippetFragment } from "../generated/graphql";
import EditDeletePostButtons from "./EditDeletePostButtons";
import UpdootSection from "./UpdootSection";
import NextLink from "next/link";

interface PostComponentProps {
  p: PostSnippetFragment;
}

export const PostComponent: React.FC<PostComponentProps> = ({ p }) => {
  return (
    <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
      <UpdootSection post={p} />
      <Box flex={1}>
        <NextLink href="/post/[id]" as={`/post/${p.id}`}>
          <Link>
            <Heading fontSize="xl">{p.title}</Heading>
          </Link>
        </NextLink>
        <Text>posted by {p.creator.username}</Text>
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
